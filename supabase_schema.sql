-- 创建 cities 表
create table cities (
  id serial primary key,
  city_name text,
  year text,
  base_min integer,
  base_max integer,
  rate float
);

-- 创建 salaries 表
create table salaries (
  id serial primary key,
  employee_id text,
  employee_name text,
  month text,
  salary_amount integer,
  city_name text,
  year text
);

-- 创建 results 表
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

-- 可选：创建索引以提高查询性能
create index idx_cities_city_year on cities(city_name, year);
create index idx_salaries_employee_month on salaries(employee_id, month);
create index idx_results_employee_year on results(employee_id, year);
create index idx_results_created_at on results(created_at);
