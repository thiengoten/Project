import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProfileModule } from './profile.module';
import { DatabaseModule } from '../../../src/db/database.module';
import { ProfileService } from './profile.service';
import { Test } from '@nestjs/testing';
import { AddProfileReqDto } from './dto/req';
import { AccountService } from '../auth/services';
import { AuthModule } from '../auth/auth.module';
import { AddProfileResDto, GetProfileResDto } from './dto/res';
import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

describe('InventoryService', () => {
  let profileService: ProfileService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: ['.env'] }),
        ProfileModule,
        AuthModule,
        DatabaseModule,
        MailerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>('EMAIL_HOST'),
              port: configService.get<number>('EMAIL_PORT'),
              secure: false,
              auth: {
                user: configService.get<string>('EMAIL_USER'),
                pass: configService.get<string>('EMAIL_PASS'),
              },
            },
            defaults: {
              from: '"nest-modules" <modules@nestjs.com>',
            },
            template: {
              dir: process.cwd() + '/templates',
              adapter: new EjsAdapter(),
              options: {
                strict: false,
              },
            },
          }),
        }),
      ],
      providers: [ProfileService, AccountService],
    }).compile();

    profileService = module.get<ProfileService>(ProfileService);
  });
  it('Create new profile', async () => {
    const data: AddProfileReqDto = {
      fullname: 'Nguyen Van D',
      email: 'example632@gmail.com',
      startDate: new Date(),
      phonenumber: '12345676',
      password: '12345678',
      roleId: 3,
      positionId: 1,
      departmentId: 1,
      citizenId: '123456789',
    };
    const test: AddProfileResDto = new AddProfileResDto();
    test.data = data;
    test.message = 'Success';
    test.version = 'v1';
    test.status = 201;

    jest
      .spyOn(profileService, 'createProfile')
      .mockImplementation(async () => test);

    expect(await profileService.createProfile(data)).toEqual({
      message: 'Success',
      status: 201,
      data: data,
      version: 'v1',
    });
  });

  it('Get profile by id', async () => {
    const mockInventory: any = {
      fullname: 'Nguyen Van A',
      email: 'hah13@gmail.com',
      dateOfBirth: '2021-01-01',
      avatar: 'https://i.pravatar.cc/300',
      startDate: '2021-01-01',
      endDate: '2021-01-02',
      department: 'Coffeeshop',
      gender: 'female',
      accountId: 2,
      userId: 87,
      role: 'admin',
    };

    const result: GetProfileResDto = new GetProfileResDto();
    const data: any = mockInventory;
    result.data = data;
    result.message = 'Success';
    result.version = 'v1';
    result.status = 200;

    jest
      .spyOn(profileService, 'getAccountProfile')
      .mockImplementation(async () => result);

    expect(await profileService.getAccountProfile(1)).toEqual({
      message: 'Success',
      status: 200,
      data: data,
      version: 'v1',
    });
  });
});
