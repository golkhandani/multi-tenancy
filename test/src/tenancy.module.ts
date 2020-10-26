import {
    createParamDecorator, DynamicModule,
    ExecutionContext, Global,
    Inject, Injectable, Logger, Module,
    NestMiddleware, Provider, Scope
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Mysql } from "mysql2-nestjs";
import { Request, Response } from "express";
const NEST_MYSQL2_TENANCY = 'NEST_MYSQL2_TENANCY';
const NEST_MYSQL2_TENANCY_OPTION = 'NEST_MYSQL2_TENANCY_OPTION';

const NEST_MYSQL2_CONNECTION = 'NEST_MYSQL2_CONNECTION';
const QUERY_RUNNER = 'queryRunner';


export interface MysqlTenancyOption {
    debug: boolean;
}
export interface MysqlRunner {
    /**
     * RUN Mysql2 query function
     * with the given query string
     * @param queryString 
     */
    run<T>(queryString: string): Promise<T>;
}
export interface MysqlExecuter {
    /**
     * SET Database name to be user
     * for rest of the queries in its scope
     * @param dbName 
     */
    db(dbName: string): MysqlRunner;
}
const tLogger = new Logger('TenancyService');
tLogger.setContext('Tenancy');
const tenancyFactory: Provider = {
    provide: NEST_MYSQL2_TENANCY,
    useFactory: async (mysql: Mysql, options: MysqlTenancyOption, req: Request): Promise<any> => {
        // x-db-t
        console.log("TENANCY FACTORY");

        const executer = function (mysqlPool: Mysql): MysqlExecuter {
            return {
                db: function (dbName: string): MysqlRunner {
                    return {
                        run: async function (sqlString: string) {
                            const q = `\nUSE ${dbName};\n` +
                                sqlString.replace("; ", ";\n");
                            if (options.debug) {
                                tLogger.verbose(q);
                            }
                            const [[_, ...queryResult], __] = await mysqlPool.query(q)
                            return queryResult as any;
                        }
                    }
                }
            }
        }
        return executer(mysql);
    },
    inject: [NEST_MYSQL2_CONNECTION, NEST_MYSQL2_TENANCY_OPTION],
};

@Global()
@Module({
    providers: [tenancyFactory],
    exports: [tenancyFactory],
})
export class MultiTenancyModule {
    constructor(

    ) { }
    public static register(options: MysqlTenancyOption): DynamicModule {
        return {
            module: MultiTenancyModule,
            providers: [{
                provide: NEST_MYSQL2_TENANCY_OPTION,
                useValue: options
            }]
        };
    }
}

export const InjectMysqlExecuter = () => {
    return Inject(NEST_MYSQL2_TENANCY);
};


export const QueryRunner = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const req = ctx.switchToHttp().getRequest();
        return req[QUERY_RUNNER] as MysqlRunner;
    },
);

@Injectable()
export class TenancyMiddleware implements NestMiddleware {
    constructor(
        @InjectMysqlExecuter()
        private readonly mysql: MysqlExecuter,
    ) { }
    async use(req: Request, res: Response, next: Function) {
        // console.log("Middleware...");

        req[QUERY_RUNNER] = this.mysql
            .db(
                req.headers["x-db-t"] as string
            ) as MysqlRunner;
        next();
    }
}
