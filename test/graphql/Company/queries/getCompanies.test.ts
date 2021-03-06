import { gql } from "apollo-server";
import { client } from "../../ApolloTestClient";
import { CompanyRepository } from "$models/Company";
import { UserRepository } from "$models/User";
import { TestClientGenerator } from "$generators/TestClient";
import { CompanyGenerator } from "$generators/Company";

import { AuthenticationError, UnauthorizedError } from "$graphql/Errors";
import { ApprovalStatus } from "$models/ApprovalStatus";
import { AdminGenerator } from "$generators/Admin";
import { Secretary } from "$models/Admin";

const GET_COMPANIES = gql`
  query {
    getCompanies {
      cuit
      companyName
    }
  }
`;

describe("getCompanies", () => {
  let companies;
  beforeAll(async () => {
    Promise.all([CompanyRepository.truncate(), UserRepository.truncate()]);
    companies = [
      await CompanyGenerator.instance.withCompleteData(),
      await CompanyGenerator.instance.withCompleteData()
    ];
  });

  it("returns all companies if an Applicant makes the request", async () => {
    const { apolloClient } = await TestClientGenerator.applicant({
      status: {
        approvalStatus: ApprovalStatus.approved,
        admin: await AdminGenerator.instance({ secretary: Secretary.extension })
      }
    });
    const response = await apolloClient.query({ query: GET_COMPANIES });

    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeUndefined();
    expect(response.data!.getCompanies).toEqual(
      expect.arrayContaining(companies.map(({ companyName, cuit }) => ({ companyName, cuit })))
    );
  });

  it("returns all companies if an Admin from graduados makes the request", async () => {
    const { apolloClient } = await TestClientGenerator.admin({ secretary: Secretary.graduados });
    const response = await apolloClient.query({ query: GET_COMPANIES });

    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeUndefined();
    expect(response.data!.getCompanies).toEqual(
      companies.map(({ companyName, cuit }) => ({ companyName, cuit }))
    );
  });

  it("returns all companies if an Admin from extension makes the request", async () => {
    const { apolloClient } = await TestClientGenerator.admin({ secretary: Secretary.extension });
    const response = await apolloClient.query({ query: GET_COMPANIES });

    expect(response.errors).toBeUndefined();
    expect(response.data).not.toBeUndefined();
    expect(response.data!.getCompanies).toEqual(
      companies.map(({ companyName, cuit }) => ({ companyName, cuit }))
    );
  });

  describe("Errors", () => {
    it("returns an error if there is no current user", async () => {
      const apolloClient = client.loggedOut();

      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({
        errorType: AuthenticationError.name
      });
    });

    it("returns an error if the user is from a company", async () => {
      const { apolloClient } = await TestClientGenerator.company();
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({
        errorType: UnauthorizedError.name
      });
    });

    it("returns an error if the user is a pending applicant", async () => {
      const { apolloClient } = await TestClientGenerator.applicant();
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({
        errorType: UnauthorizedError.name
      });
    });

    it("returns an error if the user is a rejected applicant", async () => {
      const { apolloClient } = await TestClientGenerator.applicant({
        status: {
          approvalStatus: ApprovalStatus.rejected,
          admin: await AdminGenerator.instance({ secretary: Secretary.extension })
        }
      });
      const { errors } = await apolloClient.query({ query: GET_COMPANIES });
      expect(errors![0].extensions!.data).toEqual({
        errorType: UnauthorizedError.name
      });
    });
  });
});
