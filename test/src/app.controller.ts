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
import { DbQuery } from './db.attacher';

@Controller()
export class AppController {
  constructor(
    @InjectMysql()
    private readonly mysql: any,
    private readonly appService: AppService
  ) { }

  @Get()
  async getHello(
    @DbQuery() dbQuery
  ): Promise<any> {
    const result = await dbQuery.run("SELECT 1+1;")
    return { result };
  }

  @Post()
  postHello(
    @Body() body: MyBody
  ): string {

    return helloFvn();
  }
}
