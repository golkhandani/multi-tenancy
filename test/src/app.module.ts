import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NestMysql2Module } from 'mysql2-nestjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MultiTenancyMiddleware } from './db.attacher';

@Module({
  imports: [
    NestMysql2Module.register({
      host: "localhost",
      port: 30006,
      user: "root",
      password: "example",
      multipleStatements: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MultiTenancyMiddleware)
      .forRoutes(AppController)
  }
}
