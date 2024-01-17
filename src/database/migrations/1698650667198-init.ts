import {MigrationInterface, QueryRunner} from "typeorm";

export class init1698650667198 implements MigrationInterface {
    name = 'init1698650667198'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleted" boolean NOT NULL DEFAULT false, "deletedBy" character varying, "deletedAt" TIMESTAMP, "receiverAccountNumber" character varying NOT NULL, "amount" integer NOT NULL, "status" character varying NOT NULL, "currency" character varying NOT NULL, "reference" character varying, "narration" character varying NOT NULL, "senderBalance" integer NOT NULL, "receiverBalance" integer NOT NULL, "senderWalletId" uuid NOT NULL, "receiverWalletId" uuid NOT NULL, "createdById" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "wallet" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleted" boolean NOT NULL DEFAULT false, "deletedBy" character varying, "deletedAt" TIMESTAMP, "balance" integer NOT NULL, "currency" character varying NOT NULL, "isDefault" boolean, "accountNumber" character varying NOT NULL, "isLocked" boolean, "userId" uuid NOT NULL, CONSTRAINT "UQ_eade8556fd57a767e7905e68dac" UNIQUE ("accountNumber"), CONSTRAINT "PK_bec464dd8d54c39c54fd32e2334" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "updatedBy" character varying, "deleted" boolean NOT NULL DEFAULT false, "deletedBy" character varying, "deletedAt" TIMESTAMP, "password" character varying NOT NULL, "firstName" character varying, "lastName" character varying, "email" character varying NOT NULL, "phoneNumber" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'USER', "dateOfBirth" character varying, "age" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_f2578043e491921209f5dadd080" UNIQUE ("phoneNumber"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_3f062ad5434ca2ce2a1fc4e9494" FOREIGN KEY ("senderWalletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_4d3780cb30b7e2f7949689e3b56" FOREIGN KEY ("receiverWalletId") REFERENCES "wallet"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction" ADD CONSTRAINT "FK_d2c2c2e40cf2e32e72bb111f6a0" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "wallet" ADD CONSTRAINT "FK_35472b1fe48b6330cd349709564" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "wallet" DROP CONSTRAINT "FK_35472b1fe48b6330cd349709564"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_d2c2c2e40cf2e32e72bb111f6a0"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_4d3780cb30b7e2f7949689e3b56"`);
        await queryRunner.query(`ALTER TABLE "transaction" DROP CONSTRAINT "FK_3f062ad5434ca2ce2a1fc4e9494"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "wallet"`);
        await queryRunner.query(`DROP TABLE "transaction"`);
    }

}
