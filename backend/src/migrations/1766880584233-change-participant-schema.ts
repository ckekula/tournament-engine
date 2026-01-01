import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeParticipantSchema1766880584233 implements MigrationInterface {
    name = 'ChangeParticipantSchema1766880584233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_de50d18cd1e7a9c50438149510b"`);
        await queryRunner.query(`ALTER TABLE "participant" RENAME COLUMN "teamId" TO "personId"`);
        await queryRunner.query(`CREATE TABLE "person" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "organizationId" integer, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "team_member" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "personId" integer, "teamId" integer, CONSTRAINT "PK_649680684d72a20d279641469c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_43c5caad2335ce85537fd1b6a69" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "person" ADD CONSTRAINT "FK_a868033263d1c7e1e586e5b4d25" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_da6e300ef08afbd93fa4b42701a" FOREIGN KEY ("personId") REFERENCES "person"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "team_member" ADD CONSTRAINT "FK_74da8f612921485e1005dc8e225" FOREIGN KEY ("teamId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_74da8f612921485e1005dc8e225"`);
        await queryRunner.query(`ALTER TABLE "team_member" DROP CONSTRAINT "FK_da6e300ef08afbd93fa4b42701a"`);
        await queryRunner.query(`ALTER TABLE "person" DROP CONSTRAINT "FK_a868033263d1c7e1e586e5b4d25"`);
        await queryRunner.query(`ALTER TABLE "participant" DROP CONSTRAINT "FK_43c5caad2335ce85537fd1b6a69"`);
        await queryRunner.query(`DROP TABLE "team_member"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`ALTER TABLE "participant" RENAME COLUMN "personId" TO "teamId"`);
        await queryRunner.query(`ALTER TABLE "participant" ADD CONSTRAINT "FK_de50d18cd1e7a9c50438149510b" FOREIGN KEY ("teamId") REFERENCES "participant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
