export interface ISchedule {
  readonly id?: number;
  readonly startDate?: Date;
  readonly accountId?: number;
  readonly updatedBy?: number;
  readonly isAccept?: boolean;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}
