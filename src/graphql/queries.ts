import { merge } from "lodash";
import { translationQueries } from "./Translation";
import { companyQueries } from "./Company";
import { offerQueries } from "./Offer";
import { jobApplicationQueries } from "./JobApplication";
import { applicantQueries } from "./Applicant";
import { careerQueries } from "./Career";
import { userQueries } from "./User";
import { capabilityQueries } from "./Capability";
import { adminTaskQueries } from "./AdminTask/Queries";

const queries = () =>
  merge(
    translationQueries,
    companyQueries,
    offerQueries,
    jobApplicationQueries,
    applicantQueries,
    careerQueries,
    userQueries,
    capabilityQueries,
    adminTaskQueries
  );

export default queries;
