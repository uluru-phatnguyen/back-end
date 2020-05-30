import { DATE, INTEGER, QueryInterface, STRING, UUID } from "sequelize";

export = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable(
        "ApplicantCareers",
        {
          careerCode: {
            allowNull: false,
            type: STRING,
            references: { model: "Careers", key: "code" },
            onDelete: "CASCADE"
          },
          applicantUuid: {
            allowNull: false,
            type: UUID,
            references: { model: "Applicants", key: "uuid" },
            onDelete: "CASCADE"
          },
          creditsCount: {
            allowNull: false,
            defaultValue: 0,
            type: INTEGER
          },
          createdAt: {
            allowNull: false,
            type: DATE
          },
          updatedAt: {
            allowNull: false,
            type: DATE
          }
        },
        { transaction }
        );
      await queryInterface.addConstraint(
        "ApplicantCareers",
        ["careerCode", "applicantUuid"],
        {
          type: "primary key",
          name: "ApplicantCareers_careerCode_applicantUuid_key",
          transaction
        }
      );
    });
  },
  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("ApplicantCareers");
  }
};
