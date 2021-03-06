import { GraphQLObjectType } from "graphql";
import { Int, nonNull, ID, Boolean } from "$graphql/fieldTypes";
import { ApplicantCareer } from "$models";
import { GraphQLCareer } from "$graphql/Career/Types/GraphQLCareer";

export const GraphQLApplicantCareer = new GraphQLObjectType<ApplicantCareer>({
  name: "ApplicantCareer",
  fields: () => ({
    careerCode: {
      type: nonNull(ID)
    },
    applicantUuid: {
      type: nonNull(ID)
    },
    career: {
      type: nonNull(GraphQLCareer),
      resolve: applicantCareer => applicantCareer.getCareer()
    },
    approvedSubjectCount: {
      type: Int
    },
    currentCareerYear: {
      type: Int
    },
    isGraduate: {
      type: nonNull(Boolean)
    }
  })
});
