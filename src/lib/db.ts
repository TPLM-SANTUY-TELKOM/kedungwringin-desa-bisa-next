import { Pool } from 'pg';

// PostgreSQL connection pool - SERVER SIDE ONLY
const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  database: process.env.POSTGRES_DB || 'kedungwringin',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Helper function to execute queries
export const query = async (text: string, params?: any[]) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error executing query', { text, error });
    throw error;
  }
};

// Database helper functions
export const db = {
  from: (table: string) => ({
    select: async (columns = '*', options?: { single?: boolean }) => {
      try {
        const result = await query(`SELECT ${columns} FROM ${table}`);
        if (options?.single) {
          return { data: result.rows[0] || null, error: null };
        }
        return { data: result.rows, error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },
    
    insert: async (values: any) => {
      try {
        const keys = Object.keys(values);
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const cols = keys.join(', ');
        const vals = keys.map(k => values[k]);
        
        const result = await query(
          `INSERT INTO ${table} (${cols}) VALUES (${placeholders}) RETURNING *`,
          vals
        );
        return { data: result.rows[0], error: null };
      } catch (error: any) {
        return { data: null, error: { message: error.message } };
      }
    },
    
    update: (values: any) => ({
      eq: async (column: string, value: any) => {
        try {
          const keys = Object.keys(values);
          const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
          const vals = [...keys.map(k => values[k]), value];
          
          const result = await query(
            `UPDATE ${table} SET ${setClause} WHERE ${column} = $${keys.length + 1} RETURNING *`,
            vals
          );
          return { data: result.rows[0], error: null };
        } catch (error: any) {
          return { data: null, error: { message: error.message } };
        }
      }
    }),
    
    delete: () => ({
      eq: async (column: string, value: any) => {
        try {
          const result = await query(
            `DELETE FROM ${table} WHERE ${column} = $1 RETURNING *`,
            [value]
          );
          return { data: result.rows[0], error: null };
        } catch (error: any) {
          return { data: null, error: { message: error.message } };
        }
      }
    })
  }),
  
  rpc: async (fnName: string, params?: any) => {
    try {
      let paramValues: any[] = [];
      let sql = '';
      
      if (params) {
        // PostgreSQL supports named parameters syntax: function_name(param_name := value)
        const paramNames = Object.keys(params);
        paramValues = paramNames.map(k => params[k]);
        
        // Build named parameter syntax
        const namedParams = paramNames.map((name, i) => `${name} := $${i + 1}`).join(', ');
        sql = `SELECT * FROM ${fnName}(${namedParams})`;
      } else {
        sql = `SELECT * FROM ${fnName}()`;
      }
      
      console.log('Executing RPC:', sql, 'with values:', paramValues);
      const result = await query(sql, paramValues);
      console.log('RPC raw result:', result.rows);
      
      // Check if result is a single JSON object (for functions that return JSON)
      if (result.rows.length === 1 && result.rows[0][fnName]) {
        // Function returns a single value/JSON
        return { data: result.rows[0][fnName], error: null };
      }
      
      // Function returns rows
      return { data: result.rows, error: null };
    } catch (error: any) {
      console.error('RPC error in db.ts:', error);
      return { data: null, error: { message: error.message } };
    }
  }
};

export { pool };
