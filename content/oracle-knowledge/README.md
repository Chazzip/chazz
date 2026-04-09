# 命理知识层

这里保存服务端命理会话使用的可维护参考材料。

## 文件

- `references/wuxing-tables.md`：五行、天干地支、十神、藏干、十二长生
- `references/shichen-table.md`：十二时辰、早晚子时、日上起时法
- `references/dayun-rules.md`：大运顺逆、起运年龄、流年与换运
- `references/classical-texts.md`：穷通宝典、三命通会、滴天髓、渊海子平等典籍摘要

## 调用方式

`lib/oracle/knowledge.ts` 会在服务端读取这些 Markdown，并根据档案缺失项、最近一条用户消息和会话意图选择 1 到 4 个文件片段。

维护规则：

- 可以直接编辑 Markdown，重新部署后生效。
- 不要在 Markdown 中放 API key、数据库 key、用户档案或真实聊天记录。
- 如果新增参考文件，要同步更新 `lib/oracle/knowledge.ts` 的 `sources` 清单。
- 这些材料是参考，不是确定性排盘引擎。涉及年柱、月柱、日柱、大运起运的计算，后续应补一个独立 chart engine。
