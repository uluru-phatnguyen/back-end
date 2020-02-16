import { gql } from "apollo-server";
import { executeQuery } from "../../ApolloTestClient";
import { Company, CompanyProfileRepository } from "../../../../src/models/Company";
import Database from "../../../../src/config/Database";

const query = gql`
  query {
    getCompanyProfiles {
      cuit
      companyName
    }
  }
`;

beforeAll(async () => {
  await Database.setConnection();
});

beforeEach(async () => {
  await CompanyProfileRepository.truncate();
});

afterAll(async () => {
  await Database.close();
});

test("returns all companyProfiles", async () => {
  const companyParams = { cuit: "30711819017", companyName: "devartis" };
  await CompanyProfileRepository.save(new Company(companyParams));
  const response = await executeQuery(query);

  expect(response.errors).toBeUndefined();
  expect(response.data).not.toBeUndefined();
  expect(response.data).toEqual({
    getCompanyProfiles: [ companyParams ]
  });
});
