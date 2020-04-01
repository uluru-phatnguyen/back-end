import { GraphQLObjectType } from "graphql";
import { ID, Int, nonNull, String, List } from "../../fieldTypes";
import { GraphQLCapability } from "./Capability";
import { GraphQLApplicantCareer } from "./ApplicantCareers";
import { GraphQLSection } from "./Section";

const GraphQLApplicant = new GraphQLObjectType({
  name: "Applicant",
  fields: () => ({
    uuid: {
      type: nonNull(ID)
    },
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
      type: nonNull(List(GraphQLApplicantCareer))
    },
    capabilities: {
      type: nonNull(List(GraphQLCapability))
    },
    sections: {
      type: nonNull(List(GraphQLSection))
    }
  })
});

export { GraphQLApplicant };
