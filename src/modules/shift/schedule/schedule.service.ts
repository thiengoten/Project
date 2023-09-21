import { TYPEORM, WEEKDAYS } from '@BE/core/constants';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, InsertResult, ObjectId } from 'typeorm';
import { RegisterScheduleReqDto } from '../dto/request';
import { AppResponse } from '@BE/core/shared/app.response';
import { ErrorHandler } from '@BE/core/shared/common/error';
import { RegisterScheduleResDto } from '../dto/response/schedule.dto';
import { Schedule } from '../entities/schedule.entity';
import { DateTool } from '@BE/core/utils';
import { ISchedule } from '../interfaces';

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
    const weekRange = DateTool.calculateWeekRange(1);
    const pickedStartDate: Date[] = data?.schedulesPayload?.map(
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
      let insertedScheduleList: ISchedule[] = [];
      data.schedulesPayload.forEach((schedule) => {
        schedule = Object.assign(schedule, {
          accountId: accountId,
          updatedBy: accountId,
        });
      });
      insertedScheduleList = data.schedulesPayload.flatMap((schedule) => {
        if (schedule.shiftIds.length > 1) {
          const mappingScheduleList: ISchedule[] = schedule.shiftIds.map(
            (shiftId) => {
              const mappingSchedule: ISchedule = Object.assign(
                {},
                {
                  startDate: schedule.startDate,
                  shiftId: shiftId,
                  accountId: schedule.accountId,
                  updatedBy: schedule.updatedBy,
                  isAccept: schedule.isAccept,
                },
              );
              return mappingSchedule;
            },
          );
          return mappingScheduleList;
        }
        const mappingSchedule: ISchedule = Object.assign(
          {},
          {
            startDate: schedule.startDate,
            shiftId: schedule.shiftIds[0],
            accountId: schedule.accountId,
            updatedBy: schedule.updatedBy,
            isAccept: schedule.isAccept,
          },
        );
        return mappingSchedule;
      });

      const response: InsertResult = await this._dataSource
        .getRepository(Schedule)
        .createQueryBuilder()
        .insert()
        .into(Schedule)
        .values(insertedScheduleList)
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
}
