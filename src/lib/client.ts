/**
 * PostgreSQL Database Client Wrapper
 * Client-side API wrapper for accessing PostgreSQL through Next.js API routes
 */

type QueryOptions = {
  single?: boolean;
  count?: 'exact' | 'planned' | 'estimated';
  ascending?: boolean;
};

type ApiResponse<T = any> = {
  data: T | null;
  error: { message: string } | null;
};

async function apiCall<T = any>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: { message: 'Unknown error' } }));
      return {
        data: null,
        error: errorData.error || { message: `HTTP ${response.status}` }
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error: any) {
    return {
      data: null,
      error: { message: error.message || 'Network error' }
    };
  }
}

export const db = {
  /**
   * Query builder for table operations
   */
  from: (table: string) => {
    let queryParams = {
      columns: '*',
      single: false,
      orderBy: null as string | null,
      ascending: true,
      count: null as string | null
    };

    const builder = {
      /**
       * Select columns from table
       * @param columns - Columns to select (e.g., "*, penduduk:penduduk_id(nama, nik)")
       * @param options - Query options (single, count)
       */
      select: (columns?: string, options?: QueryOptions) => {
        queryParams.columns = columns || '*';
        queryParams.single = options?.single || false;
        queryParams.count = options?.count || null;
        return builder;
      },

      /**
       * Order results by column
       * @param column - Column name to order by
       * @param options - Order options (ascending)
       */
      order: (column: string, options?: { ascending?: boolean }) => {
        queryParams.orderBy = column;
        queryParams.ascending = options?.ascending ?? true;
        return builder;
      },

      /**
       * Filter by equality
       * @param column - Column name
       * @param value - Value to match
       */
      eq: (column: string, value: any) => {
        // For now, we'll handle eq in the Promise then
        // This is a placeholder for future implementation
        return builder;
      },

      /**
       * Insert data into table
       * @param data - Data to insert (object or array of objects)
       */
      insert: async (data: any) => {
        return apiCall(`/api/${table}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      },

      /**
       * Update data in table
       * @param data - Data to update
       */
      update: (data: any) => {
        return {
          eq: async (column: string, value: any) => {
            return apiCall(`/api/${table}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ data, filter: { column, value } })
            });
          }
        };
      },

      /**
       * Delete data from table
       */
      delete: () => {
        return {
          eq: async (column: string, value: any) => {
            return apiCall(`/api/${table}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ column, value })
            });
          }
        };
      },

      /**
       * Execute the query (Promise implementation)
       * This allows the builder to be awaited
       */
      then: (resolve: (value: any) => void, reject: (reason?: any) => void) => {
        const params = new URLSearchParams({
          columns: queryParams.columns,
          single: String(queryParams.single),
          ...(queryParams.orderBy && { orderBy: queryParams.orderBy }),
          ...(queryParams.orderBy && { ascending: String(queryParams.ascending) }),
          ...(queryParams.count && { count: queryParams.count })
        });

        return apiCall(`/api/${table}?${params}`)
          .then(resolve)
          .catch(reject);
      }
    };

    return builder;
  },

  /**
   * Call PostgreSQL stored functions
   * @param fnName - Function name
   * @param params - Function parameters
   */
  rpc: async (fnName: string, params?: Record<string, any>) => {
    return apiCall('/api/rpc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fn: fnName, params })
    });
  },

  /**
   * Get current session (mock for now)
   */
  auth: {
    getSession: async () => {
      return apiCall('/api/auth/session');
    }
  }
};
