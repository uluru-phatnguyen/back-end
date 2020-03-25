import { INTEGER, QueryInterface } from "sequelize";

export = {
    up: (queryInterface: QueryInterface) => {
        return queryInterface.changeColumn(
          "CompanyPhoneNumbers",
          "companyId",
          {
              type: INTEGER,
              references: { model: "Companies", key: "id" }
          }
        );
    },
    down: (queryInterface: QueryInterface) => {
        return queryInterface.changeColumn(
          "CompanyPhoneNumbers",
          "companyId",
          {
              type: INTEGER,
              references: {}
          }
        );
    }
};