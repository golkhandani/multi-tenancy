import { ArgumentMetadata, createParamDecorator, ExecutionContext, Injectable, NestMiddleware, PipeTransform } from "@nestjs/common";
import { Request, Response } from 'express';
import { InjectMysql, Mysql } from "mysql2-nestjs";


export const DbQuery = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.DbQuery;
    },
);

@Injectable()
export class MultiTenancyMiddleware implements NestMiddleware {
    constructor(
        @InjectMysql()
        private readonly mysql: any,
    ) {

    }
    use(req: Request, res: Response, next: Function) {
        console.log('Request...');
        req['DbQuery'] = {
            run: this.mysql("Fabizi")
        }
        next();
    }
}
