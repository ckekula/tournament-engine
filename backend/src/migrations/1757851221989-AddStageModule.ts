import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStageModule1757851221989 implements MigrationInterface {
    name = 'AddStageModule1757851221989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stage" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "format" character varying(50) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "eventId" integer, CONSTRAINT "PK_c54d11b3c24a188262844af1612" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stage" ADD CONSTRAINT "FK_644e369490c95b9a1af6adb54bf" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stage" DROP CONSTRAINT "FK_644e369490c95b9a1af6adb54bf"`);
        await queryRunner.query(`DROP TABLE "stage"`);
    }

}
