import { Int, List, nonNull, String } from "../../fieldTypes";
import { GraphQLApplicant } from "../Types/Applicant";
import { GraphQLCareerCredits } from "../Types/CareerCredits";

import { IApplicant, ApplicantRepository } from "../../../models/Applicant";
import { GraphQLUserInput } from "../../User/Types/GraphQLUserInput";

const saveApplicant = {
  type: GraphQLApplicant,
  args: {
    name: {
      type: nonNull(String)
    },
    surname: {
      type: nonNull(String)
    },
    padron: {
      type: nonNull(Int)
    },
    description: {
      type: String
    },
    careers: {
      type: nonNull(List(GraphQLCareerCredits))
    },
    capabilities: {
      type: List(String)
    },
    user: {
      type: nonNull(GraphQLUserInput)
    }
  },
  resolve: (_: undefined, props: IApplicant) => ApplicantRepository.create(props)
};

export { saveApplicant };