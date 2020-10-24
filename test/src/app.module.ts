import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { Mysql, NestMysql2Module } from 'mysql2-nestjs';
import { inflate } from 'zlib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultiTenancyModule, TenancyMiddleware } from './tenancy.module';



@Module({
  imports: [
    NestMysql2Module.register({
      host: "localhost",
      port: 30006,
      user: "root",
      password: "example",
      multipleStatements: true
    }),
    MultiTenancyModule.register({ debug: true })
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer
    //   .apply(TenancyMiddleware)
    //   .forRoutes(AppController)
  }
}
