const XLSX = require('xlsx');
const fs = require('fs');

// 检查命令行参数
if (process.argv.length < 3) {
  console.error('请提供Excel文件路径，例如：node diagnose_excel.js shebao_data_example.xlsx');
  process.exit(1);
}

const filePath = process.argv[2];

if (!fs.existsSync(filePath)) {
  console.error(`文件不存在：${filePath}`);
  process.exit(1);
}

console.log(`\n═══════════════ 诊断文件：${filePath} ═══════════════\n`);

try {
  const workbook = XLSX.readFile(filePath);

  console.log('1. 检查Sheet名称：');
  console.log('   Sheet列表：', workbook.SheetNames);
  console.log('   是否包含"cities" sheet：', workbook.SheetNames.includes('cities'));
  console.log('   是否包含"salaries" sheet：', workbook.SheetNames.includes('salaries'));

  // 检查cities sheet
  if (workbook.SheetNames.includes('cities')) {
    console.log('\n2. 检查cities sheet内容：');
    const citiesSheet = workbook.Sheets['cities'];
    const citiesData = XLSX.utils.sheet_to_json(citiesSheet, { header: 1 });

    console.log('   总行数（包含标题）：', citiesData.length);
    if (citiesData.length > 0) {
      console.log('   标题行（第一行）：', citiesData[0]);
    }
    if (citiesData.length > 1) {
      console.log('   第一行数据：', citiesData[1]);

      // 验证数据格式
      const row = citiesData[1];
      console.log('\n   数据验证：');
      if (row.length >= 5) {
        console.log('   ✓ city_name:', row[0], '(类型：', typeof row[0], ')');
        console.log('   ✓ year:', row[1], '(类型：', typeof row[1], ')');
        console.log('   ✓ base_min:', row[2], '(类型：', typeof row[2], ')');
        console.log('   ✓ base_max:', row[3], '(类型：', typeof row[3], ')');
        console.log('   ✓ rate:', row[4], '(类型：', typeof row[4], ')');

        // 测试转换
        console.log('\n   数据转换测试：');
        try {
          console.log('   - parseInt(base_min):', parseInt(String(row[2])));
          console.log('   - parseFloat(rate):', parseFloat(String(row[4])));
        } catch (e) {
          console.error('   - 转换错误：', e.message);
        }
      } else {
        console.log('   ✗ 错误：行数据列数不足（需要5列）');
      }
    } else {
      console.log('   ✗ 警告：没有找到数据行（只有标题行或空sheet）');
    }
  } else {
    console.log('\n2. ✗ 错误：未找到cities sheet');
  }

  // 检查salaries sheet
  if (workbook.SheetNames.includes('salaries')) {
    console.log('\n3. 检查salaries sheet内容：');
    const salariesSheet = workbook.Sheets['salaries'];
    const salariesData = XLSX.utils.sheet_to_json(salariesSheet, { header: 1 });

    console.log('   总行数（包含标题）：', salariesData.length);
    if (salariesData.length > 0) {
      console.log('   标题行（第一行）：', salariesData[0]);
    }
    if (salariesData.length > 1) {
      console.log('   第一行数据：', salariesData[1]);

      // 验证数据格式
      const row = salariesData[1];
      console.log('\n   数据验证：');
      if (row.length >= 5) {
        console.log('   ✓ employee_id:', row[0], '(类型：', typeof row[0], ')');
        console.log('   ✓ employee_name:', row[1], '(类型：', typeof row[1], ')');
        console.log('   ✓ month:', row[2], '(类型：', typeof row[2], ')');
        console.log('   ✓ salary_amount:', row[3], '(类型：', typeof row[3], ')');
        console.log('   ✓ city_name:', row[4], '(类型：', typeof row[4], ')');

        // 测试转换
        console.log('\n   数据转换测试：');
        try {
          console.log('   - String(month).substring(0,4):', String(row[2]).substring(0, 4));
        } catch (e) {
          console.error('   - 转换错误：', e.message);
        }
      } else {
        console.log('   ✗ 错误：行数据列数不足（需要至少5列）');
      }
    } else {
      console.log('   ✗ 警告：没有找到数据行（只有标题行或空sheet）');
    }
  } else {
    console.log('\n3. ✗ 错误：未找到salaries sheet');
  }

  console.log('\n═══════════════ 诊断完成 ═══════════════\n');

} catch (error) {
  console.error('\n✗ 文件解析错误：', error.message);
  console.error('请确保文件是有效的Excel文件且无密码保护。');
  process.exit(1);
}
