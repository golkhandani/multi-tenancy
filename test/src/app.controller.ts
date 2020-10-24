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
import { MysqlRunner, QueryRunner } from './tenancy.module';

class AResult {
  A: number;
}

@Controller()
export class AppController {
  constructor(
  ) { }

  @Get()
  async getHello(
    @QueryRunner() queryRunner: MysqlRunner
  ): Promise<any> {
    const result = await queryRunner.run<AResult[]>("SELECT 1+1 as A;")
    const t = result.map(item => item.A + 2)
    return { result: t };
  }

  @Post()
  postHello(
    @Body() body: MyBody
  ): string {

    return helloFvn();
  }
}
