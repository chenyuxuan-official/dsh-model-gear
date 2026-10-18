# 子代理深度：让「超快」真正长出第二层

一句话：**插件只负责在提示词里要求一棵两层树，能不能真的长出来由宿主决定。** DSH 默认只允许直接子代理（`maxDepth: 1`），所以默认安装下「超快」实际就是 2 个 tier-1；要让孙代理跑起来，把宿主参数调到 2。

本文在 DSH 桌面版 **0.2.1-rc.2** 上验证；字段名以你那一版的 `@deepseek-ai/dsh-subagent` 配置为准。

## 两种角色，各管一段

| 角色 | 负责什么 |
|---|---|
| 插件（`src/orchestration-policy.js` + `src/host.js`） | 往父会话注入 Lightning + Superfast 契约；要求父会话给每个子代理盖 `Tier: N of 2`，tier-1 再各开两个孙代理；按子会话提示词首行的 Tier 行注入对应分层说明 |
| 宿主（`@deepseek-ai/dsh-subagent`） | 真正决定一次委派能不能发生、能发生几层 |

插件这一侧不需要任何代码改动；它已经在做该做的事。

## 没有放开深度时会发生什么

契约照常注入，模型也可能照常派 2 个 tier-1；但 tier-1 尝试再调 `subagent` 时，宿主会拒绝（深度上限 1）。表现出来的现象就是：

- 侧栏只有 2 个子会话，没有孙会话
- 子代理会报告类似「do not call subagent at this depth」的拒绝
- 父会话仍然照契约回答，只是树只有一层

## 两个宿主参数

| 参数 | 默认 | 含义 |
|---|---|---|
| `maxDepth` | `1` | 委派深度。`0` 关闭委派；`1` 只允许直接子代理；`2` 允许孙代理，以此类推 |
| `maxActiveSubagents` | `8` | 每棵 activation 树里同时存活/创建的子代理上限。满树是 6 个，默认值够用 |

委派工具（`subagent` / `subagent_fork`）如果没有显式写自己的深度，就继承 `maxDepth`；工具显式配置（含 `provider-managed`）优先。

## 改法 A：设置界面（推荐）

应用内 **设置 → 插件 → Subagent** 页面，把「委派深度」改成 `2`。这一页改的就是同一个用户覆盖层，改完会在 profile 的 `cordis.patch.yml` 里留下一条记录。

## 改法 B：直接改 profile 的用户 patch

编辑 `$DSH_HOME/profiles/<你的 profile>/cordis.patch.yml`，在数组末尾追加：

```yaml
- id: subagent
  name: "@deepseek-ai/dsh-subagent"
  config:
    maxDepth: 2
```

`maxActiveSubagents` 不用写，默认 8 已经覆盖满树的 6 个子代理。改完 **重启一次应用**——宿主配置在启动时组装，`dsh` CLI 不允许直接 dump 桌面 profile，所以没有热加载的捷径。

## 重启后怎么确认

1. 设置 → 插件 → Subagent：委派深度显示 `2`，并标为「已覆盖（overridden）」
2. 开一次**超快**，侧栏应出现 2 个 tier-1，每个下面再挂 2 个孙会话（共 6 个子会话、7 个上下文）
3. 也可以让主模型调一次 `list_agents`，直接数子代理数量

契约本身仍可能被模型打折执行：少派、串行派、或者没盖 Tier 行——这是提示词层功能的固有边界，不是深度配置的问题。

## 代价

- 满树大约是单会话的 **2.5× token**（契约里写明的数字），因为每个子代理都各自付一次首轮开销
- 深度越大，模型越容易在没有必要时也往下开；`2` 通常就是够用的值
- 不需要这套东西时，档位留在「标准」即可，插件不会注入任何契约

## 回滚

把 `cordis.patch.yml` 里那条 `- id: subagent` 整段删掉（或把 `maxDepth` 改回 `1`），重启应用，就恢复默认的「只允许直接子代理」。
