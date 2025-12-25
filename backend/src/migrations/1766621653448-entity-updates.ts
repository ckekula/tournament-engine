import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityUpdates1766621653448 implements MigrationInterface {
    name = 'EntityUpdates1766621653448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event" ADD "maxTeamsPerOrg" integer`);
        await queryRunner.query(`ALTER TABLE "tournament" ADD "maxOrgs" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament" DROP COLUMN "maxOrgs"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "maxTeamsPerOrg"`);
    }

}
