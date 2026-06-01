import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1780337855931 implements MigrationInterface {
    name = 'Migrations1780337855931'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "group_participant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "participantId" integer, "groupId" integer, CONSTRAINT "PK_a56e6d31c63e36ee181b415672c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "group_participant" ADD CONSTRAINT "FK_46f508069cf6851e34822d8b807" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_participant" ADD CONSTRAINT "FK_c5a3ed90cf12da8ed0914b4524d" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group_participant" DROP CONSTRAINT "FK_c5a3ed90cf12da8ed0914b4524d"`);
        await queryRunner.query(`ALTER TABLE "group_participant" DROP CONSTRAINT "FK_46f508069cf6851e34822d8b807"`);
        await queryRunner.query(`DROP TABLE "group_participant"`);
    }

}
