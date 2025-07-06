import dbConfig from "../configs/DBConfig";
import { DBResultType, DBResultErrorModel, DBResultSuccessModel } from "../models/DBResultModels";
import { DatabaseError, Pool, QueryResult, PoolClient } from "pg";
import ERROR_CODES from "../constants/DBErrorCodes";

class DBHandler {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: dbConfig.DB_USER,
            password: dbConfig.DB_PASSWORD,
            host: dbConfig.DB_HOST,
            port: +dbConfig.DB_PORT,
            database: dbConfig.DB_DATABASE
        });
    }

    public async runQuery(query: string, values: any[] = [], client?: PoolClient): Promise<DBResultType> {
        try {
            const result: QueryResult = client ? await client.query(query, values) : await this.pool.query(query, values);
            return new DBResultSuccessModel({ data: result.rows, rowCount: result.rowCount || 0 });
        } catch (e) {
            if(client) await this.rollbackTransaction(client);
            return this.handleDatabaseError(e);
        }
    }

    public async createClient(): Promise<PoolClient> {
        const client = await this.pool.connect();
        return client
    }
    
    public async startTransaction(client: PoolClient) {
        await client.query("BEGIN");
    }

    public async commitTransaction(client: PoolClient) {
        await client.query("COMMIT");
        client.release();
    }

    public async rollbackTransaction(client: PoolClient) {
        try{
            await client.query("ROLLBACK");
            client.release();
        }catch(e) {
            return this.handleDatabaseError(e);
        }
    }

    public handleDatabaseError(e: any): DBResultErrorModel {
        console.log(e);
        if (e instanceof DatabaseError) {
            const obj = ERROR_CODES.find(obj => obj.errorCode === e.code);
            if(obj) return new DBResultErrorModel({ errorCode: e.code, fieldKey: obj?.fieldKey, message: obj?.errorMessage || e.message })
            else return new DBResultErrorModel({ errorCode: e.code, message: e.message, critical: true });
        }
        return new DBResultErrorModel({ message: e instanceof Error ? e.message : "Unknown error", critical: true });
    }
}

const dbHandler = new DBHandler();

export default dbHandler;