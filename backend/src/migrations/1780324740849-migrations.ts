import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780324740849 implements MigrationInterface {
    name = 'Migrations1780324740849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stage" DROP COLUMN "isGroupStage"`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" ADD "stageId" integer`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" ADD CONSTRAINT "FK_6b9fa05871bf79521d6a1e3d9b4" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_stage_participant" DROP CONSTRAINT "FK_6b9fa05871bf79521d6a1e3d9b4"`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" DROP COLUMN "stageId"`);
        await queryRunner.query(`ALTER TABLE "stage" ADD "isGroupStage" boolean NOT NULL DEFAULT false`);
    }

}
