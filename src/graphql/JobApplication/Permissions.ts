import { isApplicant, isCompanyUser } from "../rules";

export const jobApplicationPermissions = {
  Mutation: {
    saveJobApplication: isApplicant
  },
  Query: {
    getMyLatestJobApplications: isCompanyUser
  }
};