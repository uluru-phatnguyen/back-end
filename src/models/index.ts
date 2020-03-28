import { Applicant } from "./Applicant";
import { Section } from "./Applicant/Section";
import { Career } from "./Career";
import { CareerApplicant } from "./CareerApplicant";
import { Capability } from "./Capability";
import { ApplicantCapability } from "./ApplicantCapability";
import { Company } from "./Company";
import { CompanyPhoneNumber } from "./CompanyPhoneNumber";
import { CompanyPhoto } from "./CompanyPhoto";
import { User } from "./User";

const models = [
  Applicant,
  Section,
  Career,
  CareerApplicant,
  Capability,
  ApplicantCapability,
  Company,
  CompanyPhoneNumber,
  CompanyPhoto,
  User
];

export { models };
