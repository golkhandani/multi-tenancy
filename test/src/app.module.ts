import { DynamicModule, Global, MiddlewareConsumer, Module, NestModule, OnApplicationShutdown } from '@nestjs/common';
import { Mysql, NestMysql2Module } from 'mysql2-nestjs';
import { inflate } from 'zlib';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BranchController } from './management/branch/branch.controller';
import { BranchModule } from './management/branch/branch.module';
import { StaffController } from './management/staff/staff.controller';
import { StaffModule } from './management/staff/staff.modulle';
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
    MultiTenancyModule.register({ debug: true }),
    BranchModule,
    StaffModule
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenancyMiddleware)
      .forRoutes(AppController, BranchController, StaffController)
  }
}
