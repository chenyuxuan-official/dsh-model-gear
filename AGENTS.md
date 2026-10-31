# dsh-model-gear 项目协作与子代理路由

本文件只约束 `dsh-model-gear` 仓库。父目录的通用协作规则仍然适用；本项目的代码、README、测试和 CI 约定优先。

<!-- dsh-model-gear:routes-v1 -->
```json
{
  "version": 1,
  "routes": [
    {
      "id": "repository-inspection",
      "match": {
        "taskType": "inspection",
        "keywords": ["阅读仓库", "调用链", "日志归纳", "接口盘点"]
      },
      "target": {
        "provider": "cpa",
        "model": "gemini-3.8-flash-high"
      },
      "effort": "high",
      "priority": 40
    },
    {
      "id": "feature-implementation",
      "match": {
        "taskType": "implementation",
        "keywords": ["新功能", "局部重构", "代码实现", "测试补充"]
      },
      "target": {
        "provider": "cpa",
        "model": "gpt-6.1-terra"
      },
      "effort": "high",
      "priority": 50
    },
    {
      "id": "cross-module-debugging",
      "match": {
        "taskType": "debugging",
        "keywords": ["难复现", "跨模块", "根因", "并发", "状态一致性"]
      },
      "target": {
        "provider": "cpa",
        "model": "claude-sonnet-4-6"
      },
      "effort": "high",
      "priority": 60
    },
    {
      "id": "implementation-escalation",
      "match": {
        "taskType": "escalation",
        "keywords": ["实现卡点", "反复失败", "攻坚", "接续实现"]
      },
      "target": {
        "provider": "cpa",
        "model": "gpt-6.1-sol"
      },
      "effort": "high",
      "priority": 45
    },
    {
      "id": "diff-review",
      "match": {
        "taskType": "review",
        "keywords": ["审查 diff", "代码审查", "回归风险", "测试缺口"]
      },
      "target": {
        "provider": "cpa",
        "model": "codex-auto-review"
      },
      "effort": "high",
      "priority": 55
    },
    {
      "id": "independent-review",
      "match": {
        "taskType": "independent-review",
        "keywords": ["独立复核", "第二意见", "反例", "方案对照"]
      },
      "target": {
        "provider": "cpa",
        "model": "gpt-6-luna"
      },
      "effort": "high",
      "priority": 35
    }
  ]
}
```

## 项目约定

- 先阅读 README、`package.json`、相关源码和测试，再修改文件。
- 保持改动聚焦，不覆盖与当前任务无关的用户改动；默认不创建提交，除非用户明确要求交付到远程仓库。
- 修改 `src/` 后运行 `npm run build`，并把生成的 `lib/client.js` 一起更新。
- 提交前至少运行 `npm test`、`git diff --check`；CI 还会检查构建产物与源码一致。
- 宿主侧修改（例如 `src/host.js`、`src/subagent-routing.js`）需要重启 DSH 才能在已运行的 profile 中生效；客户端构建产物更新后需要刷新页面。
- 路由配置只是 model-gear 的 advisory。真正的子代理创建、模型 allowlist 和模型选择由宿主工具负责；如果官方 allowlist 没有某个目标，提示中的 `unavailable` 以官方状态为准。

## 路由配置说明

- 只有上面的 `dsh-model-gear:routes-v1` marker 后紧邻的 JSON 代码块会被解析。
- `agents.md` 比 `AGENTS.md` 优先；程序从当前工作目录向上寻找最近的显式路由文件。
- 普通自然语言、YAML front matter 或无 marker 的 JSON 不会变成模型路由。
- 每条路由用于描述“任务类型/关键词 → 推荐模型”；它不会替宿主强行切换模型。
