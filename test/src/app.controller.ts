import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  helloFvn
} from "fastest-validator-nestjs";
import {
  InjectMysql,
  Mysql
} from "mysql2-nestjs";
import { MyBody } from './NestedEntity';
import { InjectMysqlExecuter, MysqlExecuter, MysqlRunner, QueryRunner } from './tenancy.module';

class AResult {
  A: number;
}

@Controller()
export class AppController {
  constructor(
    @InjectMysqlExecuter()
    private readonly mysql: MysqlRunner,
  ) { }

  @Get()
  async getHello(
    @QueryRunner() queryRunner: MysqlRunner
  ): Promise<any> {
    const [resultA, resultB] = await this.mysql
      .run<[AResult[], AResult[]]>("SELECT 1+1 as A; SELECT 1+1 as B;")
    const t = resultA.map(item => item.A + 2)
    return { result: t, resultB };
  }

  @Post()
  postHello(
    @Body() body: MyBody
  ): string {

    return helloFvn();
  }
}
