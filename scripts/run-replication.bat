@echo off
REM =====================================================
REM EDU-SYNC ERP SYSTEM - SUPABASE REPLICATION RUNNER
REM =====================================================
REM This script runs the Supabase project replication process

echo 🚀 Edu-Sync ERP System - Supabase Project Replication
echo ======================================================

REM Check if required environment variables are set
if "%SUPABASE_URL_SOURCE%"=="" (
    echo ❌ Error: SUPABASE_URL_SOURCE is not set
    echo Please set the required environment variable:
    echo set SUPABASE_URL_SOURCE=your_value_here
    exit /b 1
)

if "%SUPABASE_SERVICE_ROLE_KEY_SOURCE%"=="" (
    echo ❌ Error: SUPABASE_SERVICE_ROLE_KEY_SOURCE is not set
    echo Please set the required environment variable:
    echo set SUPABASE_SERVICE_ROLE_KEY_SOURCE=your_value_here
    exit /b 1
)

if "%SUPABASE_URL_TARGET%"=="" (
    echo ❌ Error: SUPABASE_URL_TARGET is not set
    echo Please set the required environment variable:
    echo set SUPABASE_URL_TARGET=your_value_here
    exit /b 1
)

if "%SUPABASE_SERVICE_ROLE_KEY_TARGET%"=="" (
    echo ❌ Error: SUPABASE_SERVICE_ROLE_KEY_TARGET is not set
    echo Please set the required environment variable:
    echo set SUPABASE_SERVICE_ROLE_KEY_TARGET=your_value_here
    exit /b 1
)

echo ✅ All required environment variables are set

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Node.js is not installed
    echo Please install Node.js 18+ and try again
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: npm is not installed
    echo Please install npm and try again
    exit /b 1
)

echo ✅ Node.js and npm are available

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Check if required packages are installed
npm list @supabase/supabase-js >nul 2>&1
if errorlevel 1 (
    echo 📦 Installing @supabase/supabase-js...
    npm install @supabase/supabase-js
)

echo ✅ Dependencies are ready

REM Create inventory functions in source project
echo 🔧 Setting up inventory functions in source project...
echo Please run the following SQL in your SOURCE Supabase project SQL Editor:
echo.
echo --- Copy and paste this into your SOURCE project SQL Editor ---
type scripts\inventory-functions.sql
echo.
echo --- End of SQL to copy ---
echo.
pause

REM Create inventory functions in target project
echo 🔧 Setting up inventory functions in target project...
echo Please run the following SQL in your TARGET Supabase project SQL Editor:
echo.
echo --- Copy and paste this into your TARGET project SQL Editor ---
type scripts\inventory-functions.sql
echo.
echo --- End of SQL to copy ---
echo.
pause

REM Run the replication script
echo 🚀 Starting replication process...
node scripts/supabase-replication.js

REM Check if replication was successful
if errorlevel 1 (
    echo ❌ Replication failed. Please check the error messages above.
    exit /b 1
)

echo.
echo 🎉 Replication completed successfully!
echo.
echo 📋 Next steps:
echo 1. Run the SQL scripts in your TARGET project:
echo    - scripts/001_comprehensive_schema.sql
echo    - scripts/002_comprehensive_rls.sql
echo    - scripts/003_comprehensive_seeding.sql
echo.
echo 2. Create test users:
echo    node scripts/create_test_users.js
echo.
echo 3. Update your application environment variables to point to the target project
echo.
echo 4. Test your application with the new project
echo.
echo ✅ Replication process completed!
