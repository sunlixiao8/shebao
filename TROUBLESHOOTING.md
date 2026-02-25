# 上传错误排查指南

## 问题："城市标准数据上传失败"

根据我们的诊断，Excel文件格式是正确的。问题可能出在其他环节。请按以下步骤排查：

---

## 步骤1：检查Next.js开发服务器是否运行

在终端中确认：
```bash
npm run dev
```

应该看到输出：
```
ready - started server on localhost:3000
```

---

## 步骤2：查看浏览器控制台详细错误

1. 打开浏览器访问 http://localhost:3000/upload
2. 打开开发者工具（F12或右键点击"检查"）
3. 切换到 "控制台 (Console)" 标签
4. 切换到 "网络 (Network)" 标签
5. 在页面上尝试上传Excel文件
6. 查看网络请求：
   - 查找POST请求到 `/api/upload`
   - 点击该请求查看详细信息
   - 查看"响应 (Response)"标签页，里面会有完整错误信息

---

## 步骤3：常见错误类型和解决

### 错误类型A：Row Level Security (RLS) 限制

**错误信息示例：**
```json
{
  "error": "城市数据插入失败",
  "details": "new row violates row-level security policy",
  "code": "42501"
}
```

**解决方案：**

1. 登录 [Supabase Console](https://supabase.com/dashboard)
2. 进入您的项目
3. 点击左侧菜单 "Table Editor"
4. 选择 "cities" 表
5. 点击顶部的 "Policies" 标签
6. **禁用RLS**（开发环境）或**添加允许策略**：

对于开发环境，建议先禁用RLS：
- 点击 "Enable RLS" 按钮将其关闭

或添加允许所有操作的策略：
```sql
-- 为cities表
CREATE POLICY "允许所有操作" ON "public"."cities" FOR ALL USING (true) WITH CHECK (true);

-- 为salaries表
CREATE POLICY "允许所有操作" ON "public"."salaries" FOR ALL USING (true) WITH CHECK (true);

-- 为results表
CREATE POLICY "允许所有操作" ON "public"."results" FOR ALL USING (true) WITH CHECK (true);
```

---

### 错误类型B：数据库表不存在

**错误信息示例：**
```json
{
  "error": "城市数据插入失败",
  "details": "relation \"cities\" does not exist",
  "code": "42P01"
}
```

**解决方案：**

**方法1：使用Supabase SQL编辑器创建表**

1. 登录 Supabase Console
2. 进入您的项目
3. 点击左侧 "SQL Editor"
4. 执行以下SQL：

```sql
-- 创建cities表
CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    city_name TEXT NOT NULL,
    year TEXT NOT NULL,
    base_min INTEGER NOT NULL,
    base_max INTEGER NOT NULL,
    rate REAL NOT NULL,
    UNIQUE(city_name, year)
);

-- 创建salaries表
CREATE TABLE IF NOT EXISTS salaries (
    id SERIAL PRIMARY KEY,
    employee_id TEXT NOT NULL,
    employee_name TEXT NOT NULL,
    month TEXT NOT NULL,
    salary_amount INTEGER NOT NULL,
    city_name TEXT NOT NULL,
    year TEXT,
    UNIQUE(employee_id, month)
);

-- 创建results表
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    employee_name TEXT NOT NULL,
    employee_id TEXT NOT NULL,
    city_name TEXT NOT NULL,
    year TEXT NOT NULL,
    avg_salary REAL NOT NULL,
    contribution_base REAL NOT NULL,
    company_fee REAL NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, year)
);

-- 禁用RLS（开发环境）
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

**方法2：使用Supabase仪表板创建表**

1. 点击左侧 "Table Editor"
2. 点击 "New table" 按钮
3. 按照以下结构创建三个表：

**cities表结构：**
- id: int8, primary key, default: nextval(...)
- city_name: text
- year: text
- base_min: int4
- base_max: int4
- rate: float4

设置唯一约束：city_name 和 year 的组合

**salaries表结构：**
- id: int8, primary key
- employee_id: text
- employee_name: text
- month: text
- salary_amount: int4
- city_name: text
- year: text

设置唯一约束：employee_id 和 month 的组合

**results表结构：**
- id: int8, primary key
- employee_name: text
- employee_id: text
- city_name: text
- year: text
- avg_salary: float4
- contribution_base: float4
- company_fee: float4
- created_at: timestamptz, default: now()

设置唯一约束：employee_id 和 year 的组合

---

### 错误类型C：Supabase密钥错误

**错误信息示例：**
```json
{
  "error": "城市数据插入失败",
  "details": "Invalid JWT",
  "code": "PGRST301"
}
```
**或**
```
TypeError: fetch failed
```

**解决方案：**

1. 登录 Supabase Console
2. 进入您的项目
3. 点击左侧齿轮图标 "Settings"
4. 点击 "API" 标签
5. 找到以下信息：
   - Project URL
   - ANON KEY (public)
   - SERVICE ROLE KEY (secret)

6. 更新 `.env.local` 文件：

```bash
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

注意：
- ANON KEY 以 `eyJ` 开头
- SERVICE ROLE KEY 也以 `eyJ` 开头，比ANON KEY更长
- 从Supabase复制的密钥不要包含引号

---

### 错误类型D：网络连接问题

**错误信息示例：**
```
TypeError: fetch failed
Failed to fetch
NetworkError
```

**解决方案：**

1. 检查网络连接
2. 确保没有防火墙阻止访问supabase.co域名
3. 如果在中国，可能需要使用VPN
4. 检查是否正确配置了代理（如果使用了）

---

### 错误类型E：数据类型不匹配

**错误信息示例：**
```json
{
  "error": "城市数据插入失败",
  "details": "invalid input syntax for type numeric: \"abc\"",
  "city": { "city_name": "佛山", "year": "2024", "base_min": 4546, ... }
}
```

**解决方案：**
这是Excel格式问题，请参考 `EXCEL_FORMAT_GUIDE.md` 文件调整Excel格式。

---

## 快速验证步骤

在完成上述修复后，请按顺序验证：

1. **验证数据库表**：
   ```sql
   SELECT * FROM cities LIMIT 1;
   SELECT * FROM salaries LIMIT 1;
   SELECT * FROM results LIMIT 1;
   ```

2. **重启Next.js服务**：
   ```bash
   npm run dev
   ```

3. **清除浏览器缓存**，重新访问 http://localhost:3000/upload

4. **上传Excel文件**，观察：
   - 浏览器控制台是否有错误
   - 网络请求的响应内容
   - 页面是否显示成功消息

5. **验证数据**：
   ```sql
   SELECT COUNT(*) FROM cities;
   SELECT COUNT(*) FROM salaries;
   ```

---

## 如果问题仍然存在

请提供以下信息：

1. 浏览器控制台的完整错误信息（截图或文本）
2. 网络标签页中 `/api/upload` 请求的响应内容
3. 终端中Next.js的完整错误日志
4. Supabase项目设置截图（URL和表结构）

---

## 相关资料

- [Excel格式指南](EXCEL_FORMAT_GUIDE.md)
- [数据库Schema初始化SQL](supabase/schema.sql)
