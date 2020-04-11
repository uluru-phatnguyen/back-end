import { gql } from "apollo-server";
import { executeQuery } from "../../ApolloTestClient";
import Database from "../../../../src/config/Database";

import { Career, CareerRepository } from "../../../../src/models/Career";
import { Company, CompanyRepository } from "../../../../src/models/Company";
import { Offer, OfferRepository } from "../../../../src/models/Offer";
import { OfferSection } from "../../../../src/models/Offer/OfferSection";

import { careerMocks } from "../../../models/Career/mocks";
import { companyMockData } from "../../../models/Company/mocks";
import { OfferMocks } from "../../../models/Offer/mocks";
import { GraphQLResponse } from "../../ResponseSerializers";

const GET_OFFERS = gql`
  query {
    getOffers {
      uuid
      title
      description
      hoursPerDay
      minimumSalary
      maximumSalary
      createdAt
      sections {
        uuid
        title
        text
        displayOrder
      }
      careers {
        code
        description
        credits
      }
      company {
        cuit
        companyName
        slogan
        description
        logo
        website
        email
        phoneNumbers
        photos
      }
    }
  }
`;

describe("getOffers", () => {
  beforeAll(() => Database.setConnection());

  beforeEach(async () => {
    await CompanyRepository.truncate();
    await CareerRepository.truncate();
  });

  afterAll(() => Database.close());

  describe("when offers exists", () => {
    const createOffers = async ()  => {
      const { id } = await CompanyRepository.create(companyMockData);
      const career1 = await CareerRepository.create(careerMocks.careerData());
      const career2 = await CareerRepository.create(careerMocks.careerData());
      const offerAttributes1 = OfferMocks.withOneCareer(id, career1.code);
      const offerAttributes2 = OfferMocks.withOneCareer(id, career2.code);
      const offer1 = await OfferRepository.create(offerAttributes1);
      const offer2 = await OfferRepository.create(offerAttributes2);
      return { offer1, offer2 };
    };

    it("should return two offers if two offers were created", async () => {
      await createOffers();
      const { data: { getOffers }, errors } = await executeQuery(GET_OFFERS);
      expect(errors).toBeUndefined();
      expect(getOffers).toHaveLength(2);
    });

    it("should return two offers when two offers exists", async () => {
      const { offer1, offer2 } = await createOffers();
      const { data: { getOffers }, errors } = await executeQuery(GET_OFFERS);
      expect(errors).toBeUndefined();
      expect(getOffers).toMatchObject(
        await GraphQLResponse.offer.getOffers([ offer1, offer2 ])
      );
    });
  });

  describe("when no offers exists", () => {
    it("should return no offers when no offers were created", async () => {
      const { data: { getOffers }, errors } = await executeQuery(GET_OFFERS);
      expect(errors).toBeUndefined();
      expect(getOffers).toHaveLength(0);
    });
  });
});
