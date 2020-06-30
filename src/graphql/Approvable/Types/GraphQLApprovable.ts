import { GraphQLUnionType } from "graphql";
import { GraphQLCompany } from "../../Company/Types/GraphQLCompany";
import { GraphQLApplicant } from "../../Applicant/Types/Applicant";
import { Applicant } from "../../../models/Applicant";
import { Company } from "../../../models/Company";

export const GraphQLApprovable = new GraphQLUnionType({
  name: "Approvable",
  types: [GraphQLCompany, GraphQLApplicant],
  resolveType(value) {
    if (value instanceof Company) return GraphQLCompany;
    if (value instanceof Applicant) return GraphQLApplicant;
    throw new Error("Value is not of an Approvable type");
  }
});
