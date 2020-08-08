import { AdminRepository, Secretary } from "$models/Admin";
import { withCompleteData, AdminInputData } from "./withCompleteData";

export const ExtensionAdminGenerator = {
  index: Number.MAX_SAFE_INTEGER,
  getIndex: () => {
    ExtensionAdminGenerator.index -= 1;
    return ExtensionAdminGenerator.index;
  },
  instance: (variables?: AdminInputData) =>
    AdminRepository.create(
      withCompleteData({
        index: ExtensionAdminGenerator.getIndex(),
        secretary: Secretary.extension,
        ...variables
      })
    ),
  data: () => withCompleteData({
    index: ExtensionAdminGenerator.getIndex(),
    secretary: Secretary.extension
  })
};
