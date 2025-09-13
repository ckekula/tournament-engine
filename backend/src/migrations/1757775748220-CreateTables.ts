import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1757775748220 implements MigrationInterface {
    name = 'CreateTables1757775748220'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "slug" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "name" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "slug" character varying NOT NULL`);
    }

}
