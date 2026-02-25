# 五险一金计算器

基于 Next.js + Supabase + Tailwind CSS 构建的Web应用，用于根据员工工资数据和城市社保标准，计算公司应为每位员工缴纳的社保公积金费用。

## 功能特点

- ✅ 支持Excel文件上传（.xlsx, .xls格式）
- ✅ 自动解析城市社保标准和员工工资数据
- ✅ 智能计算五险一金缴费基数和公司应缴金额
- ✅ 支持分页显示计算结果
- ✅ 现代化的UI界面，响应式设计
- ✅ 实时上传和计算反馈

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI框架**：Tailwind CSS
- **数据库**：Supabase
- **Excel处理**：xlsx
- **语言**：TypeScript

## 数据库表结构

### cities (城市标准表)
```sql
create table cities (
  id serial primary key,
  city_name text,
  year text,
  base_min integer,
  base_max integer,
  rate float
);
```

### salaries (员工工资表)
```sql
create table salaries (
  id serial primary key,
  employee_id text,
  employee_name text,
  month text,
  salary_amount integer,
  city_name text,
  year text
);
```

### results (计算结果表)
```sql
create table results (
  id serial primary key,
  employee_id text,
  employee_name text,
  city_name text,
  year text,
  avg_salary float,
  contribution_base float,
  company_fee float,
  created_at timestamptz default now()
);
```

## 安装步骤

### 1. 克隆仓库
```bash
git clone <repository-url>
cd shebao
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量

创建 `.env.local` 文件并配置以下变量：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**如何获取Supabase配置信息：**
1. 注册[Supabase](https://supabase.com)账号
2. 创建新项目
3. 进入项目设置 -> API
4. 复制 Project URL 和 Service role key
5. 添加到环境变量中

### 4. 配置数据库表

在Supabase项目中执行上述SQL语句创建表。

### 5. 配置Row Level Security (RLS)策略

为安全起见，建议配置RLS策略：

```sql
-- 允许读取数据
alter table cities enable row level security;
alter table salaries enable row level security;
alter table results enable row level security;

-- 创建策略（根据实际需求配置）
create policy "Public read access" on cities for select using (true);
create policy "Public read access" on salaries for select using (true);
create policy "Public read access" on results for select using (true);
create policy "Public write access" on cities for insert using (true);
create policy "Public write access" on salaries for insert using (true);
create policy "Public write access" on results for insert using (true);
```

### 6. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

## Excel文件格式

### Sheet1: cities (城市标准)
| 城市名称 | 年份 | 基数下限 | 基数上限 | 缴纳比例 |
|----------|------|----------|----------|----------|
| 佛山     | 2024 | 4546    | 22941   | 0.152   |
| 广州     | 2024 | 5284    | 26421   | 0.155   |

### Sheet2: salaries (员工工资)
| 员工工号 | 员工姓名 | 年月   | 工资金额 | 城市 |
|----------|----------|--------|----------|------|
| 001      | 张三     | 202401 | 8000     | 佛山 |
| 001      | 张三     | 202402 | 8000     | 佛山 |

## 使用说明

### 1. 访问首页
打开浏览器访问 http://localhost:3000

### 2. 上传数据
- 点击"数据上传"卡片
- 准备符合格式的Excel文件
- 选择文件并上传
- 查看到上传成功的提示

### 3. 执行计算
- 在上传页面点击"执行计算并存储结果"
- 等待计算完成
- 查看计算统计信息

### 4. 查看结果
- 点击"结果查询"卡片
- 查看所有员工的计算结果
- 使用分页功能浏览更多数据

## 部署

### 部署到Vercel（推荐）

1. 推送代码到GitHub
2. 在[Vercel](https://vercel.com)导入项目
3. 配置环境变量：
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
4. 部署

### 部署到其他平台

支持任何支持Next.js的平台，如：
- Netlify
- Firebase
- AWS Amplify
- Heroku
- Railway.app

## 注意事项

1. Excel文件必须包含两个sheet: cities和salaries
2. 计算时使用自然年度数据（1-12月）
3. 重复数据会被覆盖，而不是追加
4. 结果页显示最新计算结果，按计算时间倒序
5. 需要处理异常情况：数据缺失、格式错误、计算异常等

## 技术细节

### 计算逻辑
- 计算每位员工的年度月平均工资
- 根据所在城市标准确定缴费基数（在最小值和最大值之间）
- 计算公司应缴纳金额 = 缴费基数 × 缴纳比例

### API端点
- `POST /api/upload` - 上传并解析Excel文件
- `POST /api/calculate` - 执行五险一金计算
- `GET /api/results` - 获取计算结果列表

### 性能优化
- 使用批量插入提升数据导入性能
- 分页显示结果，避免大量数据渲染

## 开发任务清单

按照项目要求，已完成以下任务：

### ✅ 阶段1: 项目初始化
- ✅ 创建Next.js项目（App Router模式）
- ✅ 配置Tailwind CSS
- ✅ 配置Supabase客户端
- ✅ 创建项目基础目录结构

### ✅ 阶段2: 数据库配置
- ✅ 准备测试数据Excel文件（cities.xlsx, salaries.xlsx）

### ✅ 阶段3: 后端API开发
- ✅ POST /api/upload - 接收Excel文件并解析存储
- ✅ POST /api/calculate - 执行计算并存储结果
- ✅ GET /api/results - 查询计算结果

### ✅ 阶段4: 前端页面开发
- ✅ 布局组件
- ✅ 主页（数据上传和结果查询卡片）
- ✅ 上传页（文件上传和计算）
- ✅ 结果页（表格展示）

## 示例Excel文件

项目中已包含示例Excel文件：
- `cities.xlsx` - 城市社保标准数据
- `salaries.xlsx` - 员工工资数据

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

MIT License
