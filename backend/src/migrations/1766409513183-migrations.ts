import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766409513183 implements MigrationInterface {
    name = 'Migrations1766409513183'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "displayName" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" ALTER COLUMN "displayName" DROP NOT NULL`);
    }

}
