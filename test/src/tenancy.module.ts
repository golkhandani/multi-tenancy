import { createParamDecorator, DynamicModule, ExecutionContext, Global, Inject, Injectable, Logger, Module, NestMiddleware } from "@nestjs/common";
import { Mysql } from "mysql2-nestjs";

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
const tenancyFactory = {
    provide: NEST_MYSQL2_TENANCY,
    useFactory: async (mysql: Mysql, options: MysqlTenancyOption): Promise<any> => {
        const logger = new Logger('TenancyService');
        logger.setContext('Tenancy');
        const executer = function (mysqlPool: Mysql): MysqlExecuter {
            return {
                db: function (dbName: string): MysqlRunner {
                    return {
                        run: async function (sqlString: string) {
                            const q = `\nUSE ${dbName};\n` + sqlString;
                            if (options.debug) {
                                logger.verbose(q);
                            }
                            const [[_, queryResult], __] = await mysqlPool.query(q)
                            return queryResult;
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
        req[QUERY_RUNNER] = this.mysql.db("Fabizi") as MysqlRunner;
        next();
    }
}
