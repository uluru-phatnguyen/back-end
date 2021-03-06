import { ApprovalStatus } from "$models/ApprovalStatus";
import { Secretary } from "$models/Admin";
import { IPaginatedInput } from "$graphql/Pagination/Types/GraphQLPaginatedInput";
import { ApplicantType } from "$models/Applicant";
import { Offer } from "$models";
import {
  AdminTaskType,
  SeparateApprovalAdminTaskTypes,
  SharedApprovalAdminTaskTypes
} from "$models/AdminTask/Model";
import intersection from "lodash/intersection";

export const WhereClauseBuilder = {
  build: ({ statuses, secretary, adminTaskTypes, updatedBeforeThan }: IWhereClauseBuilder) =>
    [
      WhereClauseBuilder.getStatusWhereClause(statuses, secretary, adminTaskTypes),
      WhereClauseBuilder.getTargetWhereClause(secretary, adminTaskTypes),
      WhereClauseBuilder.getUpdatedAtWhereClause(updatedBeforeThan)
    ]
      .filter(clause => clause)
      .map(clause => `(${clause})`)
      .join(" AND "),
  getUpdatedAtWhereClause: (updatedBeforeThan?: IPaginatedInput) => {
    if (!updatedBeforeThan) return;
    const updatedAtString = updatedBeforeThan.dateTime.toISOString();
    return `
      (
        "AdminTask"."updatedAt" < '${updatedAtString}'
      ) OR (
        "AdminTask"."updatedAt" = '${updatedAtString}'
        AND "AdminTask"."uuid" < '${updatedBeforeThan.uuid}'
      )
    `;
  },
  getTargetWhereClause: (secretary: Secretary, adminTaskTypes: AdminTaskType[]) => {
    if (!adminTaskTypes.includes(AdminTaskType.Offer)) return;

    let targetApplicantType: ApplicantType;
    if (secretary === Secretary.graduados) {
      targetApplicantType = ApplicantType.graduate;
    } else {
      targetApplicantType = ApplicantType.student;
    }

    return `
      "AdminTask"."targetApplicantType" = '${ApplicantType.both}' 
      OR "AdminTask"."targetApplicantType" = '${targetApplicantType}'
      OR "AdminTask"."tableNameColumn" != '${Offer.tableName}'
    `;
  },
  getStatusWhereClause: (
    statuses: ApprovalStatus[],
    secretary: Secretary,
    adminTaskTypes: AdminTaskType[]
  ) => {
    const conditions: string[] = [];
    const columns: string[] = [];
    if (intersection(adminTaskTypes, SharedApprovalAdminTaskTypes).length > 0) {
      columns.push("approvalStatus");
    }
    if (intersection(adminTaskTypes, SeparateApprovalAdminTaskTypes).length > 0) {
      columns.push(
        secretary === Secretary.graduados ? "graduadosApprovalStatus" : "extensionApprovalStatus"
      );
    }

    for (const column of columns) {
      for (const status of statuses) {
        conditions.push(`"AdminTask"."${column}" = '${status}'`);
      }
    }
    return conditions.join(" OR ");
  }
};

interface IWhereClauseBuilder {
  statuses: ApprovalStatus[];
  secretary: Secretary;
  adminTaskTypes: AdminTaskType[];
  updatedBeforeThan?: IPaginatedInput;
}
