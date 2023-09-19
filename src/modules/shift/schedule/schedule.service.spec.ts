import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@BE/db/database.module';

describe('ScheduleService', () => {
  let service: ScheduleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports:[
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        DatabaseModule,
      ],
      providers: [ScheduleService],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
