import { Database } from "$config";
import { Applicant, JobApplication, Offer } from "$models";
import { IUpdateApprovalStatus } from "./Interfaces";
import { JobApplicationApprovalEventRepository } from "./JobApplicationsApprovalEvent";
import { JobApplicationNotFoundError } from "./Errors";
import { IPaginatedInput } from "$graphql/Pagination/Types/GraphQLPaginatedInput";
import { Op } from "sequelize";
import { PaginationConfig } from "$config/PaginationConfig";

export const JobApplicationRepository = {
  apply: async ({ uuid: applicantUuid }: Applicant, { uuid: offerUuid }: Offer) =>
    JobApplication.create({ offerUuid, applicantUuid }),
  hasApplied: async (applicant: Applicant, offer: Offer) => {
    const jobApplication = await JobApplication.findOne({
      where: {
        offerUuid: offer.uuid,
        applicantUuid: applicant.uuid
      }
    });
    return jobApplication != null;
  },
  findByUuid: async (uuid: string) => {
    const jobApplication = await JobApplication.findByPk(uuid);
    if (!jobApplication) throw new JobApplicationNotFoundError(uuid);
    return jobApplication;
  },
  findLatestByCompanyUuid: async ({
    companyUuid,
    updatedBeforeThan
  }: {
    companyUuid: string;
    updatedBeforeThan?: IPaginatedInput;
  }) => {
    const limit = PaginationConfig.itemsPerPage() + 1;
    const result = await JobApplication.findAll({
      include: [
        {
          model: Offer,
          where: { companyUuid },
          attributes: []
        }
      ],
      ...(updatedBeforeThan && {
        where: {
          [Op.or]: [
            {
              updatedAt: {
                [Op.lt]: updatedBeforeThan.dateTime.toISOString()
              }
            },
            {
              updatedAt: updatedBeforeThan.dateTime.toISOString(),
              uuid: {
                [Op.lt]: updatedBeforeThan.uuid
              }
            }
          ]
        }
      }),
      order: [
        ["updatedAt", "DESC"],
        ["offerUuid", "DESC"],
        ["applicantUuid", "DESC"]
      ],
      limit
    });
    return {
      shouldFetchMore: result.length === limit,
      results: result.slice(0, limit - 1)
    };
  },
  updateApprovalStatus: async ({
    admin: { userUuid: adminUserUuid },
    uuid,
    status
  }: IUpdateApprovalStatus) =>
    Database.transaction(async transaction => {
      const [, [updatedJobApplication]] = await JobApplication.update(
        { approvalStatus: status },
        { where: { uuid }, returning: true, transaction }
      );
      if (!updatedJobApplication) throw new JobApplicationNotFoundError(uuid);

      await JobApplicationApprovalEventRepository.create({
        adminUserUuid,
        jobApplicationUuid: uuid,
        status,
        transaction
      });
      return updatedJobApplication;
    }),
  truncate: () => JobApplication.truncate({ cascade: true })
};
