const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// 读取环境变量
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

async function addConstraint() {
  console.log('正在检查并修复 salaries 表约束...\n');

  try {
    // 方法1：直接执行SQL添加约束
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        DO $$
        BEGIN
          -- 检查约束是否已经存在
          IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'unique_employee_month' 
            AND conrelid = 'salaries'::regclass
          ) THEN
            -- 添加唯一约束
            ALTER TABLE salaries
            ADD CONSTRAINT unique_employee_month UNIQUE (employee_id, month);
            
            RAISE NOTICE '成功添加唯一约束: unique_employee_month';
          ELSE
            RAISE NOTICE '约束已存在: unique_employee_month';
          END IF;
        END $$;
      `
    });

    if (error) {
      console.error('❌ SQL执行失败:', error.message);
      console.log('\n请手动在Supabase控制台执行以下SQL:');
      console.log('---');
      console.log('ALTER TABLE salaries');
      console.log('ADD CONSTRAINT unique_employee_month UNIQUE (employee_id, month);');
      console.log('---');
    } else {
      console.log('✅ 约束添加成功或已存在！');
    }

    // 验证约束
    console.log('\n验证约束状态:');
    const { data, error: verifyError } = await supabase
      .from('information_schema.table_constraints')
      .select('constraint_name, constraint_type')
      .eq('table_name', 'salaries')
      .eq('constraint_type', 'UNIQUE');

    if (verifyError) {
      console.error('验证失败:', verifyError.message);
    } else if (data && data.length > 0) {
      console.log('✅ 当前唯一约束:', data.map(d => d.constraint_name).join(', '));
    }

    console.log('\n═══════════════ 完成 ════════════════\n');

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    console.log('\n如果上述方法失败，请使用备选方案：');
    console.log('1. 登录 Supabase Console');
    console.log('2. 进入 SQL Editor');
    console.log('3. 执行以下SQL:');
    console.log('---');
    console.log('ALTER TABLE salaries');
    console.log('ADD CONSTRAINT unique_employee_month UNIQUE (employee_id, month);');
    console.log('---');
  }
}

addConstraint();
