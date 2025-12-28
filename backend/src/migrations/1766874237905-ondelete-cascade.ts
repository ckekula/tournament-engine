import { MigrationInterface, QueryRunner } from "typeorm";

export class OndeleteCascade1766874237905 implements MigrationInterface {
    name = 'OndeleteCascade1766874237905'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_participants_participant" DROP CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c"`);
        await queryRunner.query(`ALTER TABLE "event_participants_participant" ADD CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_participants_participant" DROP CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c"`);
        await queryRunner.query(`ALTER TABLE "event_participants_participant" ADD CONSTRAINT "FK_fad0fb0c528a0e4ca450543b35c" FOREIGN KEY ("participantId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
