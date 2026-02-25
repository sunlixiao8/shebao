// 测试文件上传
const fs = require('fs');

async function testUpload() {
  console.log('═══════════════ 测试上传API ═══════════════\n');

  // 读取现有的Excel文件
  const filePath = 'shebao_data_example.xlsx';

  if (!fs.existsSync(filePath)) {
    console.error('文件不存在:', filePath);
    return;
  }

  console.log('1. 读取Excel文件:', filePath);
  const fileBuffer = fs.readFileSync(filePath);
  console.log('   文件大小:', fileBuffer.length, 'bytes\n');

  // 创建一个FormData模拟
  const FormData = require('form-data');
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename: filePath,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  // 读取.env配置
  const envContent = fs.readFileSync('./.env.local', 'utf8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    if (line.includes('=')) {
      const [key, ...valueParts] = line.split('=');
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  try {
    console.log('2. 调用上传API...');

    // 发送请求
    const response = await fetch('http://localhost:3000/api/upload', {
      method: 'POST',
      body: form,
      headers: {
        ...form.getHeaders()
      }
    });

    const responseText = await response.text();
    console.log('3. 响应状态:', response.status, response.statusText);
    console.log('4. 响应内容:', responseText);

    if (response.ok) {
      console.log('\n✅ 上传API调用成功！');
      const data = JSON.parse(responseText);
      console.log('城市数据更新:', data.stats?.citiesUpdated);
      console.log('工资数据更新:', data.stats?.salariesUpdated);
    } else {
      console.log('\n❌ 上传API调用失败');
      try {
        const errorData = JSON.parse(responseText);
        console.log('错误详情:', errorData);
      } catch (e) {
        console.log('原始响应:', responseText);
      }
    }

  } catch (error) {
    console.error('\n❌ 请求错误:', error.message);
    console.error('请确保:');
    console.error('1. Next.js服务正在运行 (npm run dev)');
    console.error('2. 端口3000可访问');
    console.error('3. 网络连接正常');
  }
}

testUpload().catch(console.error);
