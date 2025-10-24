import { column, defineTable, type RuntimeConfig } from "astro:db";

// Warning: Do not use immer or other immutable data libraries with defineTable
// as the returned table object needs to be mutable. Using immutable data will
// result in "Cannot add property getName, object is not extensible" errors.

/**
 * Extended defineTable that automatically adds createdAt and updatedAt fields
 * @param config - Table configuration object
 * @returns Table definition with timestamp fields
 */
export const defineTableWithTimestamps: RuntimeConfig["defineTable"] = (
  config
) => {
  return defineTable({
    ...config,
    columns: {
      ...config.columns,
      createdAt: column.date({ default: new Date() }),
      updatedAt: column.date({ default: new Date() }),
    },
  });
};
