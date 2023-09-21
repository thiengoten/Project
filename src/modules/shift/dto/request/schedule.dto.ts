import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class RegisterSchedulePayload {
  @IsNotEmpty()
  @IsDateString({}, { message: 'The start date must be date type' })
  @ApiProperty({ example: '2023-10-01' })
  startDate: Date;

  @IsNotEmpty()
  @ApiProperty({ example: [1,2,3,4] })
  @IsArray({ message: 'The work shift type is an array' })
  @ArrayMinSize(1)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { each: true, message: 'An element of repeat days array must be a number' },
  )
  shiftIds?: Array<number>;

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
  @ApiProperty({ required: false, type: RegisterSchedulePayload })
  @ValidateNested()
  @Type(() => RegisterSchedulePayload)
  schedulesPayload?: RegisterSchedulePayload[];
}
