import { DEPARTMENT, GENDER } from 'src/core/constants';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedUsers1691759976638 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "user"("email", "dateOfBirth", "avatar", "fullname", "startDate", "endDate", "departmentId", "gender","address", "isActive", "citizenId", "socialInsurance", "positionId")
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13),
                           ($14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26),
                           ($27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39),
                           ($40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52);`,
      [
        'nampt@gmail.com',
        '08/30/1998',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'Pham Trung Nam',
        '08/02/2023',
        '08/30/2030',
        1,
        GENDER.MALE,
        'abc,xyz',
        true,
        '123456789102',
        '123456789101112',
        1,
        'thanhvn@gmail.com',
        '11/04/2000',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'Vo Ngoc Thanh',
        '08/02/2023',
        '08/30/2030',
        1,
        GENDER.MALE,
        'abc,xyz',
        true,
        '123456789102',
        '123456789101112',
        2,
        'lamnh@gmail.com',
        '11/04/2001',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'Nguyen Hoang Lam',
        '08/02/2023',
        '08/30/2030',
        1,
        GENDER.MALE,
        'abc,xyz',
        true,
        '123456789102',
        '123456789101112',
        2,
        'nguyetbtm@gmail.com',
        '10/04/2001',
        'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60',
        'Bui Thi Minh Nguyet',
        '08/02/2023',
        '08/30/2030',
        1,
        GENDER.MALE,
        'abc,xyz',
        true,
        '123456789102',
        '123456789101112',
        2,
      ],
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE * FROM "user"');
  }
}
