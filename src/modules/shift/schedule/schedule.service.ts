import { TYPEORM, WEEKDAYS } from '@BE/core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult } from 'typeorm';
import { RegisterScheduleReqDto } from '../dto/request';
import { AppResponse } from '@BE/core/shared/app.response';
import { ErrorHandler } from '@BE/core/shared/common/error';
import { RegisterScheduleResDto } from '../dto/response/schedule.dto';
import { Schedule } from '../entities/schedule.entity';

@Injectable()
export class ScheduleService {
  private _dataSource: DataSource;
  constructor(
    @Inject(TYPEORM)
    dataSource: DataSource,
  ) {
    this._dataSource = dataSource;
  }

  async registerSchedule(
    data: RegisterScheduleReqDto,
    accountId: number,
  ): Promise<RegisterScheduleResDto> {
    const now = new Date();
    if (now.getDay() !== WEEKDAYS.Saturday) {
      return AppResponse.setUserErrorResponse<RegisterScheduleResDto>(
        ErrorHandler.notAvailable('register schedule feature'),
      );
    }
    const weekRange = this.calculateNextWeekRange(now);
    const pickedStartDate: Date[] = data?.schedules?.map(
      (schedule) => schedule.startDate,
    );
    let isOutOfNextWeekRange: boolean[] = pickedStartDate?.map((item) => {
      const timeStampDate: Date = new Date(item);
      return (
        timeStampDate.getDate < weekRange.startDate.getDate ||
        timeStampDate.getDate > weekRange.endDate.getDate
      );
    });

    if (isOutOfNextWeekRange?.includes(true)) {
      return AppResponse.setUserErrorResponse<RegisterScheduleResDto>(
        ErrorHandler.invalid('start date'),
      );
    }
    const queryRunner = this._dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction('SERIALIZABLE');
      data.schedules.forEach((schedule) => {
        schedule = Object.assign(schedule, {
          accountId: accountId,
          updatedBy: accountId,
        });
      });
      const response: InsertResult = await this._dataSource
        .getRepository(Schedule)
        .createQueryBuilder('shift')
        .insert()
        .into(Schedule)
        .values(data.schedules)
        .returning(['id', 'startDate', 'accountId', 'isAccept'])
        .execute();
      await queryRunner.commitTransaction();
      return AppResponse.setSuccessResponse<RegisterScheduleResDto>(
        response.generatedMaps,
      );
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return AppResponse.setAppErrorResponse<RegisterScheduleResDto>(
        error.message,
      );
    }
  }

  private calculateNextWeekRange(now: Date): {
    startDate: Date;
    endDate: Date;
  } {
    return {
      startDate: new Date(now.setDate(now.getDate() + 2)),
      endDate: new Date(now.setDate(now.getDate() + 8)),
    };
  }
}
