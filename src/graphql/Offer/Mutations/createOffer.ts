import { GraphQLOffer } from "../Types/GraphQLOffer";
import { GraphQLOfferCareerInput } from "../Types/GraphQLOfferCareer";
import { GraphQLOfferSectionInput } from "../Types/GraphQLOfferSection";
import { GraphQLApplicantType } from "../../Applicant/Types/GraphQLApplicantType";
import { OfferRepository } from "$models/Offer";
import { CurrentUser } from "$models/CurrentUser";
import { Int, List, nonNull, String } from "$graphql/fieldTypes";
import { ICreateOffer } from "$models/Offer/Interface";

export const createOffer = {
  type: GraphQLOffer,
  args: {
    title: {
      type: nonNull(String)
    },
    description: {
      type: nonNull(String)
    },
    targetApplicantType: {
      type: nonNull(GraphQLApplicantType)
    },
    hoursPerDay: {
      type: nonNull(Int)
    },
    minimumSalary: {
      type: nonNull(Int)
    },
    maximumSalary: {
      type: nonNull(Int)
    },
    sections: {
      type: List(GraphQLOfferSectionInput)
    },
    careers: {
      type: List(GraphQLOfferCareerInput)
    }
  },
  resolve: (
    _: undefined,
    attributes: ICreateOffer,
    { currentUser }: { currentUser: CurrentUser }
  ) =>
    OfferRepository.create({
      ...attributes,
      companyUuid: currentUser.getCompany().companyUuid
    })
};
