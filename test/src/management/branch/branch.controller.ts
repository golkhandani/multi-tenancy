import { Controller, Get } from '@nestjs/common';
import { MysqlRunner, QueryRunner } from 'src/tenancy.module';

@Controller('branch')
export class BranchController {
    constructor() { }

    @Get()
    async get(
        @QueryRunner() queryRunner: MysqlRunner
    ) {
        const [resultA, resultB] = await queryRunner
            .run("SELECT 1+2 as A; SELECT 1+2 as B;")
        const t = resultA.map(item => item.A + 2)
        return { result: t, resultB };
    }
}