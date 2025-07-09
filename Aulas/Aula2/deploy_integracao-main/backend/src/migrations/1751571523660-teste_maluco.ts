import { MigrationInterface, QueryRunner } from "typeorm";

export class TesteMaluco1751571523660 implements MigrationInterface {
    name = 'TesteMaluco1751571523660'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`description\` \`description\` text NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tasks\` CHANGE \`description\` \`description\` text NULL DEFAULT 'NULL'`);
    }

}
