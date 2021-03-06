import { withMinimumData } from "./withMinimumData";
import { completeData } from "./completeData";
import { CompanyRepository } from "$models/Company";
import { Admin } from "$models";
import { ApprovalStatus } from "$models/ApprovalStatus";
import { ICompanyGeneratorAttributes } from "$generators/interfaces";

interface IUpdatedWithStatus {
  admin: Admin;
  status: ApprovalStatus;
}

export const CompanyGenerator = {
  index: 0,
  getIndex: () => {
    CompanyGenerator.index += 1;
    return CompanyGenerator.index;
  },
  instance: {
    withMinimumData: (variables?: ICompanyGeneratorAttributes) =>
      CompanyRepository.create(
        withMinimumData({
          index: CompanyGenerator.getIndex(),
          ...variables
        })
      ),
    withCompleteData: (variables?: ICompanyGeneratorAttributes) =>
      CompanyRepository.create(
        completeData({
          index: CompanyGenerator.getIndex(),
          ...variables
        })
      ),
    updatedWithStatus: async (variables?: IUpdatedWithStatus) => {
      const company = await CompanyRepository.create(
        withMinimumData({
          index: CompanyGenerator.getIndex()
        })
      );
      if (!variables) return company;
      const { admin, status } = variables;
      return CompanyRepository.updateApprovalStatus(admin.userUuid, company.uuid, status);
    }
  },
  data: {
    completeData: () => completeData({ index: CompanyGenerator.getIndex() })
  }
};
