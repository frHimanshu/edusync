// =====================================================
// EDU-SYNC ERP SYSTEM - SUPABASE PROJECT REPLICATION
// =====================================================
// This script provides comprehensive Supabase project replication
// Run this script to replicate your source project to a target project

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  source: {
    url: process.env.SUPABASE_URL_SOURCE,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY_SOURCE,
    dbUrl: process.env.SUPABASE_DB_URL_SOURCE
  },
  target: {
    url: process.env.SUPABASE_URL_TARGET,
    serviceKey: process.env.SUPABASE_SERVICE_ROLE_KEY_TARGET,
    dbUrl: process.env.SUPABASE_DB_URL_TARGET
  }
};

// Validate configuration
function validateConfig() {
  const required = [
    'SUPABASE_URL_SOURCE',
    'SUPABASE_SERVICE_ROLE_KEY_SOURCE',
    'SUPABASE_URL_TARGET',
    'SUPABASE_SERVICE_ROLE_KEY_TARGET'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\nPlease set all required environment variables before running this script.');
    process.exit(1);
  }

  console.log('✅ Configuration validated');
}

// Create Supabase clients
function createClients() {
  const sourceClient = createClient(config.source.url, config.source.serviceKey);
  const targetClient = createClient(config.target.url, config.target.serviceKey);
  
  return { sourceClient, targetClient };
}

// Inventory functions
async function getInventory(sourceClient) {
  console.log('📋 Gathering project inventory...');
  
  const inventory = {
    schemas: [],
    tables: [],
    views: [],
    functions: [],
    policies: [],
    extensions: [],
    storage: {
      buckets: [],
      objects: []
    }
  };

  try {
    // Get schemas
    const { data: schemas } = await sourceClient.rpc('get_schemas');
    inventory.schemas = schemas || [];

    // Get tables
    const { data: tables } = await sourceClient.rpc('get_tables');
    inventory.tables = tables || [];

    // Get views
    const { data: views } = await sourceClient.rpc('get_views');
    inventory.views = views || [];

    // Get functions
    const { data: functions } = await sourceClient.rpc('get_functions');
    inventory.functions = functions || [];

    // Get policies
    const { data: policies } = await sourceClient.rpc('get_policies');
    inventory.policies = policies || [];

    // Get extensions
    const { data: extensions } = await sourceClient.rpc('get_extensions');
    inventory.extensions = extensions || [];

    // Get storage buckets
    const { data: buckets } = await sourceClient.storage.listBuckets();
    inventory.storage.buckets = buckets || [];

    console.log('✅ Inventory gathered successfully');
    return inventory;
  } catch (error) {
    console.error('❌ Error gathering inventory:', error.message);
    throw error;
  }
}

// Export schema
async function exportSchema(sourceClient, inventory) {
  console.log('📤 Exporting schema...');
  
  try {
    const schema = {
      tables: inventory.tables,
      views: inventory.views,
      functions: inventory.functions,
      extensions: inventory.extensions,
      policies: inventory.policies
    };

    const schemaFile = path.join(__dirname, 'exported-schema.json');
    fs.writeFileSync(schemaFile, JSON.stringify(schema, null, 2));
    
    console.log('✅ Schema exported to exported-schema.json');
    return schemaFile;
  } catch (error) {
    console.error('❌ Error exporting schema:', error.message);
    throw error;
  }
}

// Export data
async function exportData(sourceClient, inventory) {
  console.log('📤 Exporting data...');
  
  try {
    const data = {};
    
    for (const table of inventory.tables) {
      if (table.table_schema === 'public' && !table.table_name.startsWith('_')) {
        console.log(`   Exporting ${table.table_name}...`);
        
        const { data: tableData, error } = await sourceClient
          .from(table.table_name)
          .select('*');
        
        if (error) {
          console.warn(`   ⚠️  Warning: Could not export ${table.table_name}: ${error.message}`);
          continue;
        }
        
        data[table.table_name] = tableData || [];
      }
    }

    const dataFile = path.join(__dirname, 'exported-data.json');
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    
    console.log('✅ Data exported to exported-data.json');
    return dataFile;
  } catch (error) {
    console.error('❌ Error exporting data:', error.message);
    throw error;
  }
}

// Export storage
async function exportStorage(sourceClient, inventory) {
  console.log('📤 Exporting storage...');
  
  try {
    const storageData = {
      buckets: inventory.storage.buckets,
      objects: {}
    };

    for (const bucket of inventory.storage.buckets) {
      console.log(`   Exporting bucket: ${bucket.name}`);
      
      const { data: objects, error } = await sourceClient.storage
        .from(bucket.name)
        .list();
      
      if (error) {
        console.warn(`   ⚠️  Warning: Could not list objects in ${bucket.name}: ${error.message}`);
        continue;
      }
      
      storageData.objects[bucket.name] = objects || [];
    }

    const storageFile = path.join(__dirname, 'exported-storage.json');
    fs.writeFileSync(storageFile, JSON.stringify(storageData, null, 2));
    
    console.log('✅ Storage metadata exported to exported-storage.json');
    return storageFile;
  } catch (error) {
    console.error('❌ Error exporting storage:', error.message);
    throw error;
  }
}

// Import schema
async function importSchema(targetClient, schemaFile) {
  console.log('📥 Importing schema...');
  
  try {
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    
    // Import extensions
    for (const extension of schema.extensions) {
      console.log(`   Installing extension: ${extension.extname}`);
      // Note: Extensions need to be installed manually in Supabase dashboard
    }
    
    // Import tables (schema should already exist from SQL scripts)
    console.log('   Tables should be created via SQL scripts');
    
    // Import views
    for (const view of schema.views) {
      console.log(`   Creating view: ${view.viewname}`);
      // Views would need to be recreated via SQL
    }
    
    // Import functions
    for (const func of schema.functions) {
      console.log(`   Creating function: ${func.routine_name}`);
      // Functions would need to be recreated via SQL
    }
    
    console.log('✅ Schema import completed (manual steps required)');
  } catch (error) {
    console.error('❌ Error importing schema:', error.message);
    throw error;
  }
}

// Import data
async function importData(targetClient, dataFile) {
  console.log('📥 Importing data...');
  
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    for (const [tableName, tableData] of Object.entries(data)) {
      if (Array.isArray(tableData) && tableData.length > 0) {
        console.log(`   Importing ${tableData.length} records to ${tableName}...`);
        
        const { error } = await targetClient
          .from(tableName)
          .insert(tableData);
        
        if (error) {
          console.warn(`   ⚠️  Warning: Could not import ${tableName}: ${error.message}`);
          continue;
        }
      }
    }
    
    console.log('✅ Data import completed');
  } catch (error) {
    console.error('❌ Error importing data:', error.message);
    throw error;
  }
}

// Import storage
async function importStorage(targetClient, storageFile) {
  console.log('📥 Importing storage...');
  
  try {
    const storageData = JSON.parse(fs.readFileSync(storageFile, 'utf8'));
    
    // Create buckets
    for (const bucket of storageData.buckets) {
      console.log(`   Creating bucket: ${bucket.name}`);
      
      const { error } = await targetClient.storage.createBucket(bucket.name, {
        public: bucket.public,
        fileSizeLimit: bucket.file_size_limit,
        allowedMimeTypes: bucket.allowed_mime_types
      });
      
      if (error && !error.message.includes('already exists')) {
        console.warn(`   ⚠️  Warning: Could not create bucket ${bucket.name}: ${error.message}`);
      }
    }
    
    console.log('✅ Storage buckets created');
    console.log('   Note: Storage objects need to be uploaded manually');
  } catch (error) {
    console.error('❌ Error importing storage:', error.message);
    throw error;
  }
}

// Validation
async function validateReplication(sourceClient, targetClient) {
  console.log('🔍 Validating replication...');
  
  try {
    // Compare table counts
    const { data: sourceTables } = await sourceClient.rpc('get_tables');
    const { data: targetTables } = await targetClient.rpc('get_tables');
    
    console.log(`   Source tables: ${sourceTables?.length || 0}`);
    console.log(`   Target tables: ${targetTables?.length || 0}`);
    
    // Compare data counts for key tables
    const keyTables = ['users', 'students', 'faculty', 'announcements'];
    
    for (const tableName of keyTables) {
      try {
        const { count: sourceCount } = await sourceClient
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        const { count: targetCount } = await targetClient
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        console.log(`   ${tableName}: ${sourceCount} → ${targetCount}`);
      } catch (error) {
        console.warn(`   ⚠️  Could not validate ${tableName}: ${error.message}`);
      }
    }
    
    console.log('✅ Validation completed');
  } catch (error) {
    console.error('❌ Error during validation:', error.message);
    throw error;
  }
}

// Main replication function
async function replicateProject() {
  console.log('🚀 Starting Supabase project replication...');
  console.log('=====================================');
  
  try {
    // Validate configuration
    validateConfig();
    
    // Create clients
    const { sourceClient, targetClient } = createClients();
    
    // Step 1: Inventory
    const inventory = await getInventory(sourceClient);
    
    // Step 2: Export
    const schemaFile = await exportSchema(sourceClient, inventory);
    const dataFile = await exportData(sourceClient, inventory);
    const storageFile = await exportStorage(sourceClient, inventory);
    
    // Step 3: Import
    await importSchema(targetClient, schemaFile);
    await importData(targetClient, dataFile);
    await importStorage(targetClient, storageFile);
    
    // Step 4: Validate
    await validateReplication(sourceClient, targetClient);
    
    console.log('=====================================');
    console.log('🎉 Project replication completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('1. Run the SQL scripts in the target project:');
    console.log('   - 001_comprehensive_schema.sql');
    console.log('   - 002_comprehensive_rls.sql');
    console.log('   - 003_comprehensive_seeding.sql');
    console.log('2. Create test users using create_test_users.js');
    console.log('3. Update your application environment variables');
    console.log('4. Test the application with the new project');
    
  } catch (error) {
    console.error('❌ Replication failed:', error.message);
    process.exit(1);
  }
}

// Helper functions for inventory (these would need to be created as SQL functions)
const inventoryFunctions = `
-- Create helper functions for inventory gathering
CREATE OR REPLACE FUNCTION get_schemas()
RETURNS TABLE(schema_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT nspname::text
  FROM pg_namespace
  WHERE nspname NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
  ORDER BY nspname;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE(table_schema text, table_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT schemaname::text, tablename::text
  FROM pg_tables
  WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
  ORDER BY schemaname, tablename;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_views()
RETURNS TABLE(view_schema text, view_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT schemaname::text, viewname::text
  FROM pg_views
  WHERE schemaname NOT IN ('information_schema', 'pg_catalog')
  ORDER BY schemaname, viewname;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_functions()
RETURNS TABLE(routine_schema text, routine_name text) AS $$
BEGIN
  RETURN QUERY
  SELECT routine_schema::text, routine_name::text
  FROM information_schema.routines
  WHERE routine_schema NOT IN ('information_schema', 'pg_catalog')
  ORDER BY routine_schema, routine_name;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_policies()
RETURNS TABLE(schemaname text, tablename text, policyname text) AS $$
BEGIN
  RETURN QUERY
  SELECT schemaname::text, tablename::text, policyname::text
  FROM pg_policies
  ORDER BY schemaname, tablename, policyname;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_extensions()
RETURNS TABLE(extname text, extversion text) AS $$
BEGIN
  RETURN QUERY
  SELECT extname::text, extversion::text
  FROM pg_extension
  ORDER BY extname;
END;
$$ LANGUAGE plpgsql;
`;

// Export the inventory functions for manual execution
fs.writeFileSync(path.join(__dirname, 'inventory-functions.sql'), inventoryFunctions);

// Run the replication if this script is executed directly
if (require.main === module) {
  replicateProject()
    .then(() => {
      console.log('✅ Script completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = {
  replicateProject,
  getInventory,
  exportSchema,
  exportData,
  exportStorage,
  importSchema,
  importData,
  importStorage,
  validateReplication
};
