import { UUID, DATE, TEXT, QueryInterface } from "sequelize";
import uuid from "uuid/v4";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("CompanyPhotos", {
      uuid: {
        allowNull: false,
        primaryKey: true,
        type: UUID,
        defaultValue: uuid()
      },
      photo: {
        type: TEXT
      },
      companyUuid: {
        type: UUID,
        references: { model: "Companies", key: "uuid" },
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      }
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("CompanyPhotos");
  }
};