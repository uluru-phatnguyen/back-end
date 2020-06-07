import { GraphQLObjectType } from "graphql";
import { ID, nonNull, String, List } from "../../fieldTypes";
import { Company } from "../../../models/Company";

const GraphQLCompany = new GraphQLObjectType<Company>({
  name: "Company",
  fields: () => ({
    uuid: {
      type: ID
    },
    cuit: {
      type: nonNull(String)
    },
    companyName: {
      type: nonNull(String)
    },
    slogan: {
      type: String
    },
    description: {
      type: String
    },
    logo: {
      type: String
    },
    website: {
      type: String
    },
    email: {
      type: String
    },
    approvalStatus: {
      type: nonNull(String)
    },
    phoneNumbers: {
      type: List(String),
      resolve: async company =>
        (await company.getPhoneNumbers()).map(({ phoneNumber }) => phoneNumber)
    },
    photos: {
      type: List(String),
      resolve: async company =>
        (await company.getPhotos()).map(({ photo }) => photo)
    }
  })
});

export { GraphQLCompany };
