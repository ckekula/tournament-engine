import { MigrationInterface, QueryRunner } from "typeorm";

export class DisplayNameNullable1766752714402 implements MigrationInterface {
    name = 'DisplayNameNullable1766752714402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "displayName" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "displayName" SET NOT NULL`);
    }

}
