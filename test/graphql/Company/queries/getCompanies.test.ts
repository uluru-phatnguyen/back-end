import { gql } from "apollo-server";
import { client } from "../../ApolloTestClient";
import { CompanyRepository } from "../../../../src/models/Company";
import { UserRepository } from "../../../../src/models/User";
import { testClientFactory } from "../../../mocks/testClientFactory";

import { AuthenticationError, UnauthorizedError } from "../../../../src/graphql/Errors";
import { ApprovalStatus } from "../../../../src/models/ApprovalStatus";
import { userFactory } from "../../../mocks/user";
import { AdminGenerator, TAdminGenerator } from "../../../generators/Admin";

const GET_COMPANIES = gql`
  query {
    getCompanies {
      cuit
      companyName
    }
  }
`;

describe("getCompanies", () => {
  let admins: TAdminGenerator;

  beforeAll(() => {
    admins = AdminGenerator.instance();
    return Promise.all([
      CompanyRepository.truncate(),
      UserRepository.truncate()
    ]);
  });

  it("returns all companies", async () => {
    const company = await userFactory.company();
    const { apolloClient } = await testClientFactory.applicant({
      status: {
        approvalStatus: ApprovalStatus.approved,
        admin: await admins.next().value
      }
    });
    const response = await apolloClient.query({ query: GET_COMPANIES });

    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeUndefined();
    expect(response.data!.getCompanies).toEqual([{
      cuit: company.cuit,
      companyName: company.companyName
    }]);
  });

  describe("Errors", () => {
    it("returns an error if there is no current user", async () => {
      const apolloClient = client.loggedOut();

      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({ errorType: AuthenticationError.name });
    });

    it("returns an error if the user is from a company", async () => {
      const { apolloClient } = await testClientFactory.company();
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });

    it("returns an error if the user is an admin", async () => {
      const { apolloClient } = await testClientFactory.admin();
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });

    it("returns an error if the user is a pending applicant", async () => {
      const { apolloClient } = await testClientFactory.applicant();
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });

    it("returns an error if the user is a rejected applicant", async () => {
      const { apolloClient } = await testClientFactory.applicant({
        status: {
          approvalStatus: ApprovalStatus.rejected,
          admin: await admins.next().value
        }
      });
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({ errorType: UnauthorizedError.name });
    });
  });
});
