# Oracle Archive

把 `cyber-suanming` skill 做成公网产品的第一版骨架。这个版本已经不是一次性对话页，而是完整的账号体系 + 命盘档案 + 会话归档结构。

## 技术栈

- Next.js App Router
- Supabase Auth + Postgres + RLS
- DashScope OpenAI 兼容 Chat Completions
- 原生 CSS Modules，视觉方向走极简高级 + 玄幻冷感

## 核心结构

- `/`：公开营销首页
- `/signup`、`/login`：注册与登录
- `/archive`：用户档案页，编辑出生信息、查看档案完成度、发起新会话
- `/archive/sessions/[sessionId]`：单个命理会话页，所有消息挂在主档案下

## 命理知识层

仓库内现在有可维护的 Markdown 知识包：[content/oracle-knowledge](/Users/chazz/Downloads/AI/AIGC/chazz/content/oracle-knowledge)。

- `lib/oracle/knowledge.ts` 负责服务端读取、选择和裁剪知识片段。
- `lib/oracle/ai.ts` 会在每次调用模型前，把本轮相关知识装配进 system prompt。
- 目前是轻量规则检索；后续如果要做稳定排盘，建议再加独立的 chart engine，不要只让模型“心算”四柱。

## 数据模型

SQL 在 [supabase/schema.sql](/Users/chazz/Downloads/AI/AIGC/chazz/supabase/schema.sql)。

- `account_profiles`：账户级资料
- `oracle_profiles`：命盘档案
- `oracle_sessions`：会话归档
- `oracle_messages`：消息明细
- `oracle_readings`：后续可落结构化排盘与分析快照

## 启动

1. 在 Supabase 新建项目。
2. 在 SQL Editor 执行 [supabase/schema.sql](/Users/chazz/Downloads/AI/AIGC/chazz/supabase/schema.sql)。
3. 复制 [.env.example](/Users/chazz/Downloads/AI/AIGC/chazz/.env.example) 为 `.env.local` 并填写：
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` 或 `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `DASHSCOPE_API_KEY`
   - 可选 `DASHSCOPE_BASE_URL`
   - 可选 `DASHSCOPE_MODEL`
   - 可选 `DASHSCOPE_ENABLE_THINKING`
4. 安装依赖并运行：

```bash
npm install
npm run dev
```

## 部署建议

- 前端直接部署到 Vercel。
- 所有业务数据留在 Supabase。
- 认证回调地址配置为 `https://你的域名/auth/callback`。
- 生产环境建议在 Supabase 配置自定义 SMTP，否则注册确认邮件额度很低。
- AI 层当前默认走 `https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`，模型默认 `qwen3.6-plus`。
