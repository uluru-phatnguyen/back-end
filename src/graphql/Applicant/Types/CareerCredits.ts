import { GraphQLInputObjectType } from "graphql";
import { Int, nonNull, String } from "../../fieldTypes";

const GraphQLCareerCredits = new GraphQLInputObjectType({
  name: "CareerCredits",
  fields: () => ({
    code: {
      type: nonNull(String)
    },
    creditsCount: {
      type: nonNull(Int)
    }
  })
});

export { GraphQLCareerCredits };