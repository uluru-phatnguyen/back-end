import { GraphQLOffer } from "../Types/GraphQLOffer";
import { OfferRepository } from "$models/Offer";
import { ApplicantRepository } from "$models/Applicant";
import {
  GraphQLPaginatedInput,
  IPaginatedInput
} from "$graphql/Pagination/Types/GraphQLPaginatedInput";
import { CurrentUser } from "$models/CurrentUser";
import { GraphQLPaginatedResults } from "$graphql/Pagination/Types/GraphQLPaginatedResults";
import { ID, List, nonNull } from "$graphql/fieldTypes";

export const getApprovedOffers = {
  type: GraphQLPaginatedResults(GraphQLOffer),
  args: {
    updatedBeforeThan: {
      type: GraphQLPaginatedInput
    },
    careerCodes: {
      type: List(nonNull(ID))
    }
  },
  resolve: async (
    _: undefined,
    { updatedBeforeThan, careerCodes }: IGetApprovedOffersArguments,
    { currentUser }: { currentUser: CurrentUser }
  ) => {
    const applicant = await ApplicantRepository.findByUuid(
      currentUser.getApplicant().applicantUuid
    );
    const applicantType = await applicant.getType();
    return OfferRepository.findAll({
      updatedBeforeThan,
      careerCodes,
      applicantType
    });
  }
};

interface IGetApprovedOffersArguments {
  updatedBeforeThan?: IPaginatedInput;
  careerCodes?: string[];
}
