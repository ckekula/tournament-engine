import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateEntities1766802314580 implements MigrationInterface {
    name = 'UpdateEntities1766802314580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."event_type_enum" AS ENUM('INDIVIDUAL', 'TEAM')`);
        await queryRunner.query(`ALTER TABLE "event" ADD "type" "public"."event_type_enum"`);
        await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "name" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "name" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."event_type_enum"`);
    }

}
