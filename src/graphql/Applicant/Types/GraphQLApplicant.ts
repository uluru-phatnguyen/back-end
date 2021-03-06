import { GraphQLObjectType } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";
import { ID, Int, List, nonNull, String } from "$graphql/fieldTypes";
import { GraphQLUser } from "$graphql/User/Types/GraphQLUser";
import { GraphQLCapability } from "$graphql/Capability/Types/Capability";
import { GraphQLApplicantCareer } from "./GraphQLApplicantCareer";
import { GraphQLSection } from "./Section";
import { GraphQLLink } from "./Link";
import { Applicant } from "$models";
import { GraphQLApprovalStatus } from "$graphql/ApprovalStatus/Types/GraphQLApprovalStatus";

export const GraphQLApplicant = new GraphQLObjectType<Applicant>({
  name: "Applicant",
  fields: () => ({
    uuid: {
      type: nonNull(ID)
    },
    user: {
      type: nonNull(GraphQLUser),
      resolve: applicant => applicant.getUser()
    },
    padron: {
      type: nonNull(Int)
    },
    description: {
      type: String
    },
    createdAt: {
      type: nonNull(GraphQLDateTime)
    },
    updatedAt: {
      type: nonNull(GraphQLDateTime)
    },
    approvalStatus: {
      type: nonNull(GraphQLApprovalStatus)
    },
    careers: {
      type: nonNull(List(GraphQLApplicantCareer)),
      resolve: applicant => applicant.getApplicantCareers()
    },
    capabilities: {
      type: nonNull(List(GraphQLCapability)),
      resolve: applicant => applicant.getCapabilities()
    },
    sections: {
      type: nonNull(List(GraphQLSection)),
      resolve: applicant => applicant.getSections()
    },
    links: {
      type: nonNull(List(GraphQLLink)),
      resolve: applicant => applicant.getLinks()
    }
  })
});
