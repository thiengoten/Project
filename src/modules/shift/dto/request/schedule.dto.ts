import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class RegistSchedule {
  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date must be date type' })
  @ApiProperty({ example: '2023-10-01' })
  startDate: Date;

  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty({ example: 1 })
  shiftId?: number;

  @IsEmpty({
    message: 'The account id cannot be passed into the request body',
  })
  @Transform(({ value }) => parseInt(value))
  accountId?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      if (value.toLowerCase() === 'true') {
        return true;
      }
      if (value.toLowerCase() === 'false') {
        return false;
      }
    }
    return value;
  })
  @IsBoolean({ message: 'The isAccept status must be in boolean type' })
  isAccept?: boolean = false;

  @IsEmpty({
    message: 'The update id cannot be passed into the request body',
  })
  @Transform(({ value }) => parseInt(value))
  updatedBy?: number;
}

export class RegisterScheduleReqDto {
  @ApiProperty({ required: false, type: RegistSchedule })
  @ValidateNested()
  @Type(() => RegistSchedule)
  schedules?: RegistSchedule[];
}
