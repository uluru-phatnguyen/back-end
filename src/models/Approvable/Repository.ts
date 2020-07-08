import { Database } from "../../config/Database";
import { find } from "lodash";
import { findApprovablesQuery } from "./findApprovablesQuery";
import { APPROVABLE_MODELS, TABLE_NAME_COLUMN } from "./Model";
import { IApprovableFilterOptions } from "./Interfaces";

const getModelByTableName = (tableName: string) =>
  find(APPROVABLE_MODELS, ["tableName", tableName]);

export const ApprovableRepository = {
  findApprovables: async (options: IApprovableFilterOptions) => {
    if (options.approvableEntityTypes.length === 0) return [];
    const rows = await Database.query(findApprovablesQuery(options), { type: "SELECT" });
    return rows.map((row: object) => {
      const tableName = row[TABLE_NAME_COLUMN];
      const modelClass = getModelByTableName(tableName);
      if (!modelClass) throw new Error(`Invalid table name: ${tableName}`);
      return new modelClass(row);
    });
  }
};
