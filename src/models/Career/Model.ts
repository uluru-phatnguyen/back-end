import { BelongsToMany, Column, HasMany, Is, Model, Table } from "sequelize-typescript";
import { Applicant } from "../Applicant/Model";
import { ApplicantCareer } from "../ApplicantCareer/Model";
import { validateIntegerInRange } from "validations-fiuba-laboral-v2";
import { INTEGER, STRING } from "sequelize";

@Table({ tableName: "Careers" })
export class Career extends Model<Career> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: STRING
  })
  public code: string;

  @Column({
    allowNull: false,
    type: STRING
  })
  public description: string;

  @Is("credits", validateIntegerInRange({ min: { value: 0, include: false } }))
  @Column({
    allowNull: false,
    type: INTEGER
  })
  public credits: number;

  @BelongsToMany(() => Applicant, () => ApplicantCareer)
  public applicants: Applicant[];

  @HasMany(() => ApplicantCareer)
  public applicantCareers: ApplicantCareer[];
}
