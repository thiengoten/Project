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
    if (now.getDay() !== WEEKDAYS.Monday) {
      return AppResponse.setUserErrorResponse<RegisterScheduleResDto>(
        ErrorHandler.notAvailable('register schedule feature'),
      );
    }
    const weekRange = this.calculateNextWeekRange(
      new Date(now.setDate(now.getDate() - 1)),
    );
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
    try {
      data.schedules.forEach((schedule) => {
        schedule = Object.assign(schedule, {
          accountId: accountId,
          updatedBy: accountId,
        });
      });
      const response: InsertResult = await this._dataSource.getRepository(Schedule)
        .createQueryBuilder()
        .insert()
        .into(Schedule)
        .values(data.schedules)
        .returning(['id', 'startDate', 'accountId', 'isAccept'])
        .execute();
      return AppResponse.setSuccessResponse<RegisterScheduleResDto>(
        response.generatedMaps,
      );
    } catch (error) {
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
      startDate: new Date(
        now.setDate(
          now.getDay() !== WEEKDAYS.Sunday
            ? now.getDate() + (7 - now.getDay() + 1)
            : now.getDate() + (now.getDay() + 1),
        ),
      ),
      endDate: new Date(
        now.getDay() !== WEEKDAYS.Sunday
          ? now.setDate(now.getDate() + (7 - now.getDay() + 7))
          : now.setDate(now.getDate() + (now.getDay() + 7)),
      ),
    };
  }
}
