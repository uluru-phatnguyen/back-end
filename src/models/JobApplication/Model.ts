import { BelongsTo, Column, ForeignKey, Model, Table, HasMany } from "sequelize-typescript";
import {
  ENUM,
  HasOneGetAssociationMixin,
  HasManyGetAssociationsMixin,
  UUID,
  UUIDV4
} from "sequelize";
import { Applicant, Offer, JobApplicationApprovalEvent } from "$models";
import { ApprovalStatus, approvalStatuses } from "$models/ApprovalStatus";
import { isApprovalStatus, isUuid } from "$models/SequelizeModelValidators";

@Table({ tableName: "JobApplications" })
export class JobApplication extends Model<JobApplication> {
  @Column({
    allowNull: false,
    primaryKey: true,
    type: UUID,
    defaultValue: UUIDV4,
    ...isUuid
  })
  public uuid: string;

  @ForeignKey(() => Offer)
  @Column({
    allowNull: false,
    primaryKey: true,
    type: UUID,
    ...isUuid
  })
  public offerUuid: string;

  @BelongsTo(() => Offer, "offerUuid")
  public offer: Offer;

  @ForeignKey(() => Applicant)
  @Column({
    allowNull: false,
    primaryKey: true,
    type: UUID,
    ...isUuid
  })
  public applicantUuid: string;

  @Column({
    allowNull: false,
    type: ENUM<string>({ values: approvalStatuses }),
    defaultValue: ApprovalStatus.pending,
    ...isApprovalStatus
  })
  public approvalStatus: ApprovalStatus;

  @BelongsTo(() => Applicant, "applicantUuid")
  public applicant: Applicant;

  @HasMany(() => JobApplicationApprovalEvent)
  public approvalEvents: JobApplicationApprovalEvent;

  public getOffer: HasOneGetAssociationMixin<Offer>;
  public getApplicant: HasOneGetAssociationMixin<Applicant>;
  public getApprovalEvents: HasManyGetAssociationsMixin<JobApplicationApprovalEvent>;
}
