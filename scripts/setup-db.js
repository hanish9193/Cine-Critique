#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🎬 CineReview Database Setup');
console.log('============================\n');

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set.');
  console.log('\n📝 Please set your PostgreSQL connection string:');
  console.log('   export DATABASE_URL="postgresql://username:password@localhost:5432/cinereview"');
  console.log('\n💡 Or create a .env file with DATABASE_URL');
  process.exit(1);
}

console.log('✅ DATABASE_URL found');

// Check if init.sql exists
const sqlPath = path.join(__dirname, '../database/init.sql');
if (!fs.existsSync(sqlPath)) {
  console.error('❌ Database initialization file not found:', sqlPath);
  process.exit(1);
}

console.log('✅ Database schema file found');

try {
  console.log('\n🚀 Initializing database...');
  
  // Run the SQL initialization script
  const command = `psql "${process.env.DATABASE_URL}" < "${sqlPath}"`;
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n🎉 Database setup completed successfully!');
  console.log('\n📋 What was created:');
  console.log('   • User authentication tables');
  console.log('   • Movie catalog with 12 Indian films');
  console.log('   • Review and sentiment analysis tables');
  console.log('   • User preferences tracking');
  console.log('   • Optimized database indexes');
  
  console.log('\n🚀 You can now start the application:');
  console.log('   npm run dev');
  
} catch (error) {
  console.error('\n❌ Database setup failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('   • Verify PostgreSQL is running');
  console.log('   • Check DATABASE_URL connection string');
  console.log('   • Ensure database exists and you have permissions');
  console.log('   • Try: createdb cinereview');
  process.exit(1);
}