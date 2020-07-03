import { gql } from "apollo-server";
import { client } from "../../ApolloTestClient";
import { Database } from "../../../../src/config/Database";

import { AuthenticationError, UnauthorizedError } from "../../../../src/graphql/Errors";

import { CareerRepository } from "../../../../src/models/Career";
import { UserRepository } from "../../../../src/models/User";

import { CareerGenerator, TCareerGenerator } from "../../../generators/Career";
import { testClientFactory } from "../../../mocks/testClientFactory";
import { userFactory } from "../../../mocks/user";
import { ApprovalStatus } from "../../../../src/models/ApprovalStatus";
import { AdminGenerator, TAdminGenerator } from "../../../generators/Admin";

const GET_APPLICANTS = gql`
    query getApplicants {
        getApplicants {
            uuid
            user {
              email
              name
              surname
            }
            padron
            description
            capabilities {
                uuid
                description
            }
            careers {
                code
                description
                credits
                creditsCount
            }
            sections {
              title
              text
            }
            links {
              name
              url
            }
        }
    }
`;

describe("getApplicants", () => {
  let careers: TCareerGenerator;
  let admins: TAdminGenerator;

  beforeAll(async () => {
    Database.setConnection();
    await CareerRepository.truncate();
    await UserRepository.truncate();
    careers = CareerGenerator.instance();
    admins = AdminGenerator.instance();
  });

  afterAll(() => Database.close());

  describe("when no applicant exists", () => {
    it("fetches an empty array of applicants", async () => {
      const { apolloClient } = await testClientFactory.admin();
      const { data, errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors).toBeUndefined();
      expect(data!.getApplicants).toEqual([]);
    });
  });

  describe("when applicants exists", () => {
    it("fetches the existing applicant", async () => {
      const newCareer = await careers.next().value;
      const applicantCareer = [{ code: newCareer.code, creditsCount: 150 }];
      const {
        user,
        applicant,
        apolloClient
      } = await testClientFactory.applicant({
        careers: applicantCareer,
        status: {
          approvalStatus: ApprovalStatus.approved,
          admin: await admins.next().value
        }
      });

      const { data, errors } = await apolloClient.query({ query: GET_APPLICANTS });

      expect(errors).toBeUndefined();
      const [career] = await applicant.getCareers();
      const capabilities = await applicant.getCapabilities();
      expect(data!.getApplicants[0]).toMatchObject({
        user: {
          email: user.email,
          name: user.name,
          surname: user.surname
        },
        padron: applicant.padron,
        description: applicant.description,
        capabilities: capabilities.map(({ uuid, description }) => ({ uuid, description })),
        careers: [{
          code: career.code,
          description: career.description,
          credits: career.credits,
          creditsCount: applicantCareer[0].creditsCount
        }],
        sections: [],
        links: []
      });
    });

    it("fetches all the applicants", async () => {
      const newCareer = await careers.next().value;
      const applicantCareersData = [{ code: newCareer.code, creditsCount: 150 }];
      const {
        applicant: firstApplicant,
        apolloClient
      } = await testClientFactory.applicant({
        careers: applicantCareersData,
        capabilities: ["Go"],
        status: {
          approvalStatus: ApprovalStatus.approved,
          admin: await admins.next().value
        }
      });
      const secondApplicant = await userFactory.applicant({
        careers: applicantCareersData,
        capabilities: ["Go"]
      });
      const applicants = [firstApplicant, secondApplicant];

      const { data, errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors).toBeUndefined();

      const expectedApplicants = await Promise.all(
        applicants.map(async applicant => {
          const user = await applicant.getUser();
          const capabilities = await applicant.getCapabilities();
          const applicantCareers = await applicant.getApplicantCareers();
          return {
            uuid: applicant.uuid,
            user: {
              email: user.email,
              name: user.name,
              surname: user.surname
            },
            padron: applicant.padron,
            description: applicant.description,
            careers: await Promise.all(
              applicantCareers.map(async applicantCareer => {
                const { code, description, credits } = await applicantCareer.getCareer();
                return {
                  code,
                  description,
                  creditsCount: applicantCareer.creditsCount,
                  credits
                };
              })
            ),
            capabilities: capabilities.map(({ uuid, description }) => ({ uuid, description })),
            links: [],
            sections: []
          };
        })
      );
      expect(data!.getApplicants).toEqual(expect.arrayContaining(expectedApplicants));
    });
  });

  describe("Errors", () => {
    it("returns an error if there is no current user", async () => {
      const apolloClient = client.loggedOut();

      const { errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors![0].extensions!.data).toEqual({ errorType: AuthenticationError.name });
    });

    it("returns an error if current user is pending applicant", async () => {
      const { apolloClient } = await testClientFactory.applicant();
      const { errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });

    it("returns an error if current user is rejected applicant", async () => {
      const { apolloClient } = await testClientFactory.applicant({
        status: {
          approvalStatus: ApprovalStatus.rejected,
          admin: await admins.next().value
        }
      });
      const { errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });

    it("returns an error if current user is from company", async () => {
      const { apolloClient } = await testClientFactory.company();
      const { errors } = await apolloClient.query({ query: GET_APPLICANTS });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });
  });
});
