import dbConfig from "../configs/DBConfig";
import { DBResultType, DBResultErrorModel, DBResultSuccessModel } from "../models/DBResultModels";
import { DatabaseError, Pool, QueryResult, PoolClient } from "pg";
import ERROR_CODES from "../constants/DBErrorCodes";

class DBHandler {
    private pool: Pool;

    constructor() {
        this.pool = new Pool({
            user: dbConfig.user,
            password: dbConfig.password,
            host: dbConfig.host,
            port: +dbConfig.port,
            database: dbConfig.database
        });
    }

    async runQuery(query: string, values: any[] = [], client?: PoolClient): Promise<DBResultType> {
        try {
            const result: QueryResult = client ? await client.query(query, values) : await this.pool.query(query, values);
            return new DBResultSuccessModel(result.rows, result.rowCount || 0);
        } catch (e) {
            if(client) await this.rollbackTransaction(client);
            return this.handleDatabaseError(e);
        }
    }

    async createClient(): Promise<PoolClient> {
        const client = await this.pool.connect();
        return client
    }
    
    async startTransaction(client: PoolClient) {
        await client.query("BEGIN");
    }

    async commitTransaction(client: PoolClient) {
        await client.query("COMMIT");
        client.release();
    }

    private async rollbackTransaction(client: PoolClient) {
        try{
            await client.query("ROLLBACK");
            client.release();
        }catch(e) {
            return this.handleDatabaseError(e);
        }
    }

    handleDatabaseError(e: any): DBResultErrorModel {
        console.log(e);
        if (e instanceof DatabaseError) {
            const obj = ERROR_CODES.find(obj => obj.errorCode === e.code);
            if(obj) return new DBResultErrorModel(e.code, obj.fieldKey, obj.errorMessage || e.message)
            else return new DBResultErrorModel(e.code, undefined, e.message, true);
        }
        return new DBResultErrorModel(undefined, undefined, e.message, true);
    }
}

const dbHandler = new DBHandler();

export default dbHandler;