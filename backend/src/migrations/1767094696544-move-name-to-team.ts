import { MigrationInterface, QueryRunner } from "typeorm";

export class MoveNameToTeam1767094696544 implements MigrationInterface {
    name = 'MoveNameToTeam1767094696544'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" ALTER COLUMN "name" SET NOT NULL`);
    }

}
