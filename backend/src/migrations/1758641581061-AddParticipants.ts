import { MigrationInterface, QueryRunner } from "typeorm";

export class AddParticipants1758641581061 implements MigrationInterface {
    name = 'AddParticipants1758641581061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "participant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying(100), "type" character varying NOT NULL, "organizationId" integer, "teamId" integer, CONSTRAINT "PK_64da4237f502041781ca15d4c41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_984c1b3f8ab33629d2aaad255f" ON "participant" ("type") `);
        await queryRunner.query(`CREATE TABLE "stage_participant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stageId" integer, "participantId" integer, CONSTRAINT "PK_90224ba86fcf5422666bcb0a4f2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group_stage_participant" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "stageId" integer, "participantId" integer, "groupId" integer, CONSTRAINT "PK_088ac81655a11a495dd69141851" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_participants_participant" ("eventId" integer NOT NULL, "participantId" integer NOT NULL, CONSTRAINT "PK_2d459311712c1cf23e1efb2e3f3" PRIMARY KEY ("eventId", "participantId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cdee448dc229cac45a840e59ba" ON "event_participants_participant" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_fad0fb0c528a0e4ca450543b35" ON "event_participants_participant" ("participantId") `);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_6dbcce07e6375124753249fcea7" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_de50d18cd1e7a9c50438149510b" FOREIGN KEY ("teamId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stage_participant" ADD CONSTRAINT "FK_00fd6020cc4204fc2a224039b01" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stage_participant" ADD CONSTRAINT "FK_3030c0bee21a1be625c025a24ed" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" ADD CONSTRAINT "FK_6b9fa05871bf79521d6a1e3d9b4" FOREIGN KEY ("stageId") REFERENCES "stage"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" ADD CONSTRAINT "FK_f50f3b2288cf06ad5deb61cb5ad" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" ADD CONSTRAINT "FK_162f4f4dc45e42ac8b12473665f" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_participants_participant" ADD CONSTRAINT "FK_cdee448dc229cac45a840e59baf" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "event_participants_participant" ADD CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_participants_participant" DROP CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c"`);
        await queryRunner.query(`ALTER TABLE "event_participants_participant" DROP CONSTRAINT "FK_cdee448dc229cac45a840e59baf"`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" DROP CONSTRAINT "FK_162f4f4dc45e42ac8b12473665f"`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" DROP CONSTRAINT "FK_f50f3b2288cf06ad5deb61cb5ad"`);
        await queryRunner.query(`ALTER TABLE "group_stage_participant" DROP CONSTRAINT "FK_6b9fa05871bf79521d6a1e3d9b4"`);
        await queryRunner.query(`ALTER TABLE "stage_participant" DROP CONSTRAINT "FK_3030c0bee21a1be625c025a24ed"`);
        await queryRunner.query(`ALTER TABLE "stage_participant" DROP CONSTRAINT "FK_00fd6020cc4204fc2a224039b01"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_de50d18cd1e7a9c50438149510b"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_6dbcce07e6375124753249fcea7"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fad0fb0c528a0e4ca450543b35"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cdee448dc229cac45a840e59ba"`);
        await queryRunner.query(`DROP TABLE "event_participants_participant"`);
        await queryRunner.query(`DROP TABLE "group_stage_participant"`);
        await queryRunner.query(`DROP TABLE "stage_participant"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_984c1b3f8ab33629d2aaad255f"`);
        await queryRunner.query(`DROP TABLE "participant"`);
    }

}
