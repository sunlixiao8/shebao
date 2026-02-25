const { createClient } = require('@supabase/supabase-js');

// 读取环境变量
const fs = require('fs');
const envContent = fs.readFileSync('./.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  if (line.includes('=')) {
    const [key, ...valueParts] = line.split('=');
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 错误：缺少Supabase配置');
  console.log('请检查.env.local文件是否包含：');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  console.log('- NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('═══════════════ Supabase连接测试 ═══════════════\n');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // 测试连接
    console.log('1. 测试连接...');
    const { data, error } = await supabase.from('cities').select('*').limit(1);

    if (error) {
      console.error('   ❌ 连接失败:', error.message);
      console.error('   错误码:', error.code);

      if (error.code === 'PGRST116') {
        console.log('\n   错误说明:');
        console.log('   - 表"cities"不存在');
        console.log('   - 请先在Supabase控制台创建表');
      } else if (error.code === 'PGRST301') {
        console.log('\n   错误说明:');
        console.log('   - Row Level Security(RLS)限制');
        console.log('   - 请检查数据库表权限设置');
      }

      return false;
    }

    console.log('   ✅ 连接成功！');
    console.log('   返回数据:', data);

    // 检查表结构
    console.log('\n2. 检查表结构...');

    // 对于空的表，使用 count 来检查表是否存在
    const { count: citiesCount, error: citiesCountError } = await supabase
      .from('cities')
      .select('*', { count: 'exact', head: true });

    if (citiesCountError) {
      console.error('   ❌ cities表检查失败:', citiesCountError.message);
      console.error('   错误码:', citiesCountError.code);
    } else {
      console.log('   ✅ cities表可访问');
      console.log('   记录数:', citiesCount ?? 0);
    }

    const { count: salariesCount, error: salariesCountError } = await supabase
      .from('salaries')
      .select('*', { count: 'exact', head: true });

    if (salariesCountError) {
      console.error('   ❌ salaries表检查失败:', salariesCountError.message);
      console.error('   错误码:', salariesCountError.code);
    } else {
      console.log('   ✅ salaries表可访问');
      console.log('   记录数:', salariesCount ?? 0);
    }

    const { count: resultsCount, error: resultsCountError } = await supabase
      .from('results')
      .select('*', { count: 'exact', head: true });

    if (resultsCountError) {
      console.error('   ❌ results表检查失败:', resultsCountError.message);
      console.error('   错误码:', resultsCountError.code);
    } else {
      console.log('   ✅ results表可访问');
      console.log('   记录数:', resultsCount ?? 0);
    }

    console.log('\n═══════════════ 测试完成 ═══════════════');

    return true;

  } catch (error) {
    console.error('\n❌ 未知错误:', error.message);
    console.error('错误详情:', error);
    return false;
  }
}

testConnection().then(success => {
  if (!success) {
    console.log('\n💡 建议:');
    console.log('1. 确保Supabase项目已创建');
    console.log('2. 确保数据库表已创建');
    console.log('3. 检查环境变量配置');
    console.log('4. 检查Row Level Security(RLS)设置');
  }
  process.exit(success ? 0 : 1);
});
