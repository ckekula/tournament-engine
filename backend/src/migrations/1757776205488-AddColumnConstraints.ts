import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnConstraints1757776205488 implements MigrationInterface {
    name = 'AddColumnConstraints1757776205488'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "slug" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "slug" character varying(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "name" character varying(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstname"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstname" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastname" character varying(50) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "lastname"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "lastname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "firstname"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "firstname" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "organization" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tournament" ALTER COLUMN "slug" DROP NOT NULL`);
    }

}
