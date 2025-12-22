import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1766400846687 implements MigrationInterface {
    name = 'Migrations1766400846687'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tournament_registered_organizations_organization" ("tournamentId" integer NOT NULL, "organizationId" integer NOT NULL, CONSTRAINT "PK_5a8e70767b92c9fecc2197df320" PRIMARY KEY ("tournamentId", "organizationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_746e6583298ecf9102fe0cd2b5" ON "tournament_registered_organizations_organization" ("tournamentId") `);
        await queryRunner.query(`CREATE INDEX "IDX_3cff146aed38180ec21da3c4c7" ON "tournament_registered_organizations_organization" ("organizationId") `);
        await queryRunner.query(`ALTER TABLE "tournament_registered_organizations_organization" ADD CONSTRAINT "FK_746e6583298ecf9102fe0cd2b58" FOREIGN KEY ("tournamentId") REFERENCES "tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "tournament_registered_organizations_organization" ADD CONSTRAINT "FK_3cff146aed38180ec21da3c4c7e" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tournament_registered_organizations_organization" DROP CONSTRAINT "FK_3cff146aed38180ec21da3c4c7e"`);
        await queryRunner.query(`ALTER TABLE "tournament_registered_organizations_organization" DROP CONSTRAINT "FK_746e6583298ecf9102fe0cd2b58"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3cff146aed38180ec21da3c4c7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_746e6583298ecf9102fe0cd2b5"`);
        await queryRunner.query(`DROP TABLE "tournament_registered_organizations_organization"`);
    }

}
