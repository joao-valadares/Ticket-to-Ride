import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'tickettoride',
  password: process.env.DB_PASSWORD || 'postgres',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function testConnection() {
  try {
    console.log('🔍 Tentando conectar ao PostgreSQL...');
    console.log('📋 Configurações:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   Port: ${process.env.DB_PORT}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   User: ${process.env.DB_USER}`);
    console.log('');

    // Tenta conectar
    const client = await pool.connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Testa uma query simples
    const result = await client.query('SELECT NOW()');
    console.log('⏰ Timestamp do servidor:', result.rows[0].now);
    
    // Verifica a versão do PostgreSQL
    const version = await client.query('SELECT version()');
    console.log('🗄️  Versão do PostgreSQL:', version.rows[0].version.split(',')[0]);
    
    // Verifica se as tabelas existem
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tabelas encontradas:');
    if (tables.rows.length === 0) {
      console.log('   ⚠️  Nenhuma tabela encontrada. Execute o script init.sql!');
      console.log('   psql -U postgres -d tickettoride -f database/init.sql');
    } else {
      tables.rows.forEach(row => {
        console.log(`   ✓ ${row.table_name}`);
      });
    }
    
    client.release();
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:');
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔴 PostgreSQL não está rodando ou não está acessível.');
      console.error('   Verifique se o serviço PostgreSQL está ativo.');
      console.error('   No Windows: Get-Service postgresql*');
      console.error('   Iniciar: Start-Service postgresql-x64-XX');
    } else if (error.code === '3D000') {
      console.error('🔴 Database "tickettoride" não existe.');
      console.error('   Execute: psql -U postgres -c "CREATE DATABASE tickettoride;"');
    } else if (error.code === '28P01') {
      console.error('🔴 Senha incorreta para o usuário postgres.');
      console.error('   Verifique a senha no arquivo .env');
    } else {
      console.error('Detalhes do erro:', error.message);
      console.error('Código:', error.code);
    }
    
    console.error('');
    process.exit(1);
  }
}

testConnection();
