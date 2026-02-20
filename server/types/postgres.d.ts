declare module 'postgres' {
  interface ConnectionParameters {
    host?: string;
    port?: number;
    database?: string;
    username?: string;
    password?: string;
    ssl?: boolean | object;
    max?: number;
    idleTimeout?: number;
    max_lifetime?: number;
  }

  interface ClientOptions {
    prepare?: boolean;
    [key: string]: any;
  }

  interface QueryResult<T = any> extends Array<T> {
    count: number;
    command: string;
  }

  interface Sql {
    <T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<QueryResult<T>>;
    unsafe<T = any>(query: string, values?: any[]): Promise<QueryResult<T>>;
    end(): Promise<void>;
  }

  export default function postgres(connectionString: string | ConnectionParameters, options?: ClientOptions): Sql;
}
