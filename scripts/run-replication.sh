#!/bin/bash

# =====================================================
# EDU-SYNC ERP SYSTEM - SUPABASE REPLICATION RUNNER
# =====================================================
# This script runs the Supabase project replication process

set -e  # Exit on any error

echo "🚀 Edu-Sync ERP System - Supabase Project Replication"
echo "======================================================"

# Check if required environment variables are set
check_env_var() {
    if [ -z "${!1}" ]; then
        echo "❌ Error: $1 is not set"
        echo "Please set the required environment variable:"
        echo "export $1=your_value_here"
        exit 1
    fi
}

echo "🔍 Checking environment variables..."

# Check source project variables
check_env_var "SUPABASE_URL_SOURCE"
check_env_var "SUPABASE_SERVICE_ROLE_KEY_SOURCE"

# Check target project variables
check_env_var "SUPABASE_URL_TARGET"
check_env_var "SUPABASE_SERVICE_ROLE_KEY_TARGET"

# Optional variables
if [ -z "$SUPABASE_DB_URL_SOURCE" ]; then
    echo "⚠️  SUPABASE_DB_URL_SOURCE not set (optional)"
fi

if [ -z "$SUPABASE_DB_URL_TARGET" ]; then
    echo "⚠️  SUPABASE_DB_URL_TARGET not set (optional)"
fi

echo "✅ All required environment variables are set"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    echo "Please install npm and try again"
    exit 1
fi

echo "✅ Node.js and npm are available"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if required packages are installed
if ! npm list @supabase/supabase-js &> /dev/null; then
    echo "📦 Installing @supabase/supabase-js..."
    npm install @supabase/supabase-js
fi

echo "✅ Dependencies are ready"

# Create inventory functions in source project
echo "🔧 Setting up inventory functions in source project..."
echo "Please run the following SQL in your SOURCE Supabase project SQL Editor:"
echo ""
echo "--- Copy and paste this into your SOURCE project SQL Editor ---"
cat scripts/inventory-functions.sql
echo ""
echo "--- End of SQL to copy ---"
echo ""
read -p "Press Enter after you've run the SQL in your SOURCE project..."

# Create inventory functions in target project
echo "🔧 Setting up inventory functions in target project..."
echo "Please run the following SQL in your TARGET Supabase project SQL Editor:"
echo ""
echo "--- Copy and paste this into your TARGET project SQL Editor ---"
cat scripts/inventory-functions.sql
echo ""
echo "--- End of SQL to copy ---"
echo ""
read -p "Press Enter after you've run the SQL in your TARGET project..."

# Run the replication script
echo "🚀 Starting replication process..."
node scripts/supabase-replication.js

# Check if replication was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 Replication completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Run the SQL scripts in your TARGET project:"
    echo "   - scripts/001_comprehensive_schema.sql"
    echo "   - scripts/002_comprehensive_rls.sql"
    echo "   - scripts/003_comprehensive_seeding.sql"
    echo ""
    echo "2. Create test users:"
    echo "   node scripts/create_test_users.js"
    echo ""
    echo "3. Update your application environment variables to point to the target project"
    echo ""
    echo "4. Test your application with the new project"
    echo ""
    echo "✅ Replication process completed!"
else
    echo "❌ Replication failed. Please check the error messages above."
    exit 1
fi
