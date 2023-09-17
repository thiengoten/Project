import { Module } from '@nestjs/common';
import { ShiftController } from './shift.controller';
import { ShiftService } from './shift.service';
import { DatabaseModule } from '../../db/database.module';
import { ScheduleService } from './schedule/schedule.service';

@Module({
  controllers: [ShiftController],
  providers: [ShiftService, ScheduleService],
  exports: [ShiftService]
})
export class ShiftModule {}
