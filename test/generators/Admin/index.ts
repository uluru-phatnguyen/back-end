import { withCompleteData } from "./withCompleteData";
import { AdminRepository, ISaveAdmin } from "../../../src/models/Admin";
import { Admin } from "../../../src/models";
import { CustomGenerator } from "../types";

export type TAdminDataGenerator = CustomGenerator<ISaveAdmin>;
export type TAdminGenerator = CustomGenerator<Promise<Admin>>;

export const AdminGenerator = {
  instance: function*(): TAdminGenerator {
    let index = 0;
    while (true) {
      yield AdminRepository.create(withCompleteData(index));
      index++;
    }
  },
  data: function*(): TAdminDataGenerator {
    let index = 0;
    while (true) {
      yield withCompleteData(index);
      index++;
    }
  }
};
