const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function checkData() {
  console.log('══════════════════ 数据状态检查 ══════════════════\n');
  
  try {
    // 检查 cities 表
    const { count: citiesCount, error: citiesError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });
    console.log('1. cities 表记录数:', citiesCount || 0, citiesError ? '❌ 错误' : '✅');
    
    // 检查 salaries 表
    const { count: salariesCount, error: salariesError } = await supabase
      .from('salaries')
      .select('*', { count: 'exact', head: true });
    console.log('2. salaries 表记录数:', salariesCount || 0, salariesError ? '❌ 错误' : '✅');
    
    // 检查 results 表
    const { count: resultsCount, error: resultsError } = await supabase
      .from('results')
      .select('*', { count: 'exact', head: true });
    console.log('3. results 表记录数:', resultsCount || 0, resultsError ? '❌ 错误' : '✅');
    
    // 检查 results 表的约束
    if (!resultsError) {
      const { data: constraints, error: constraintError } = await supabase
        .from('information_schema.table_constraints')
        .select('constraint_name, constraint_type')
        .eq('table_name', 'results');
      
      if (!constraintError && constraints) {
        const uniqueConstraints = constraints.filter(c => c.constraint_type === 'UNIQUE');
        console.log('4. results 表唯一约束:', uniqueConstraints.length > 0 
          ? uniqueConstraints.map(c => c.constraint_name).join(', ') 
          : '❌ 未找到（需要添加）');
      }
    }
    
    console.log('\n═══════════════════════════════════════════════\n');
    
    if (resultsCount === 0) {
      console.log('💡 results 表为空，需要执行计算');
      console.log('请访问 http://localhost:3000/upload 并点击"执行计算并存储结果"按钮');
    }
    
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkData();
