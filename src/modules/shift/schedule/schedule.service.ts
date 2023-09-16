import { TYPEORM } from '@BE/core/constants';
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
    shiftId: number,
    accountId: number,
  ): Promise<RegisterScheduleResDto> {
    const pickedStartDate: Date[] = data?.schdules?.map(
      (schedule) => schedule.startDate,
    );
    const inputDate = new Date(data.schdules[0].startDate);
    try {
      // if (now > inputDate) {
      //   return AppResponse.setUserErrorResponse<RegisterScheduleResDto>(
      //     ErrorHandler.invalid('The start date'),
      //   );
      // }
      const queryRunner = this._dataSource.createQueryRunner();
      data.schdules[0].accountId = accountId;
      data.schdules[0].shiftId = shiftId;
      data.schdules[0].updatedBy = accountId;
      const response: InsertResult = await this._dataSource
        .getRepository(Schedule)
        .createQueryBuilder('shift')
        .insert()
        .into(Schedule)
        .values(data.schdules)
        .returning(['id', 'startDate', 'accountId', 'isAccept'])
        .execute();
      return AppResponse.setSuccessResponse<RegisterScheduleResDto>({});
    } catch (error) {
      return AppResponse.setAppErrorResponse<RegisterScheduleResDto>(
        error.message,
      );
    }
  }
}
