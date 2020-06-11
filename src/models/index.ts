import { Admin } from "./Admin";
import { Applicant } from "./Applicant";
import { Section } from "./Applicant/Section";
import { ApplicantLink } from "./Applicant/Link";
import { JobApplication } from "./JobApplication";
import { Career } from "./Career";
import { ApplicantCareer } from "./ApplicantCareer";
import { Capability } from "./Capability";
import { ApplicantCapability } from "./ApplicantCapability";
import { Company } from "./Company";
import { CompanyApprovalEvent } from "./Company/CompanyApprovalEvent";
import { CompanyPhoneNumber } from "./CompanyPhoneNumber";
import { CompanyPhoto } from "./CompanyPhoto";
import { Offer } from "./Offer";
import { OfferSection } from "./Offer/OfferSection";
import { OfferCareer } from "./Offer/OfferCareer";
import { User } from "./User";
import { CompanyUser } from "./CompanyUser";

const models = [
  Admin,
  Applicant,
  Section,
  ApplicantLink,
  JobApplication,
  Career,
  ApplicantCareer,
  Capability,
  ApplicantCapability,
  Company,
  CompanyApprovalEvent,
  CompanyPhoneNumber,
  CompanyPhoto,
  CompanyUser,
  Offer,
  OfferSection,
  OfferCareer,
  User
];

export { models };
