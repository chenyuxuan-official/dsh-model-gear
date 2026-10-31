# dsh-model-gear

DSH 输入框里的模型挡位面板：模型选择、推理强度滑条、显示名，外加闪电编排三档。
它只注入编排相关的契约、每轮提醒、子会话分层说明和关闭提示；除此之外不注入人设、身份或核查段落。

## 前置条件

- 使用带有 `dsh plugin` CLI 的 DSH 桌面版，并选择一个启用 Web 客户端的 profile。
- 该 profile 需要提供插件使用的 Connection RPC、模型目录、槽位注册和 `agent/pre-step` 宿主服务；正常通过 DSH profile 安装时由宿主提供。
- 只有从源码构建或运行本地测试时才需要 Node.js `>=20`；GitHub 安装直接使用仓库内已提交的 `lib/` 构建产物。
- 若要让「超快」的第二层实际创建孙代理，宿主的 `@deepseek-ai/dsh-subagent` 有效配置需要 `maxDepth: 2`；本插件的 [cordis.patch.yml](cordis.patch.yml) 只插入本插件，不修改这个宿主参数。

## 安装

从 GitHub 安装：

```sh
dsh plugin --profile desktop add github:chenyuxuan-official/dsh-model-gear
```

将 `desktop` 替换成实际 profile 名称。安装后重启 DSH；插件会出现在该 profile 的 `package.json` 依赖中。卸载：

```sh
dsh plugin --profile desktop remove dsh-model-gear
```

> `dsh plugin --profile <名字> <参数>` 使用 DSH 桌面版自带 CLI。GitHub 安装会锁定仓库提交；仓库有新提交后重新执行一次 `add` 才会更新。

## 实现

### 面板（`src/model-ui.js`）

面板注册在 `conversation.input.model` 槽位上（priority `-10`），槽位的 `inject(sessionId)` 返回四样东西：

| prop | 用途 |
|---|---|
| `directory` / `load` / `select` | 宿主模型目录的 store、加载和选中写入（`select()` 直接落到宿主的模型选择上） |
| `gear.read` / `gear.select` | 编排档位的读与写，走下面那条宿主路由 |
| `available` | 子会话里为 `false`，面板不提供选择 |

- **模型列表**：按 provider 分组，支持搜索；「默认」组只显示最常用的那一个模型（按使用频次统计，`dsh-model-gear/model-usage`，只在本机 localStorage）。
- **强度滑条**：档位全部来自宿主目录里该模型的 `reasoning.efforts`，不额外造虚拟档；拖动时只改本地预览，松手/键盘操作才写回；「重置」写回模型自己的 `defaultEffort`。
- **显示名**：以 `provider/model` 为键存在本机 localStorage（键名沿用旧版的 `dsh-codex-ui/model-aliases`），只影响列表里的显示。
- **模型名装饰**：平台把「1017」这类发布徽标挂在 `conversation.input.model.label` 子槽位上，而该子槽位只能由声明它的官方模型选择组件渲染——本插件替换了整个 composer 控件，框架不允许第二个注册项复用该子槽位，所以这类装饰不会出现在本面板里。
- **档位未知**：读不到宿主状态时不猜「标准」，滑条不画填充、闪电显示为灰、三档菜单禁用并提示「未同步」。

**档位状态**由宿主持有，客户端只做三件事：挂载时读一次、切换时乐观更新（失败回滚）、每次打开面板再对齐一次。重读不会先清空当前值，早到的旧响应按序号丢弃，所以状态不会被来回覆盖。

### 编排（`src/host.js`）

**路由**：`POST /api/dsh-model-gear/orchestration`，走 DSH 的 Connection 载体，信封是 `client-request` / `server-response`，用 `rpcId` 对齐。

```jsonc
{ "action": "read",   "sessionId": "…" }                  // → { mode: "off" | "fast" | "tree" }
{ "action": "update", "sessionId": "…", "mode": "tree" }  // 同上
```

校验失败返回 `{ ok: false, error: { code, message, details: {} } }`——`details` 不能省，客户端的响应解析器要求它是对象，缺了会把所有校验错误变成解析失败。

**状态**：`$DSH_HOME/storages/dsh-model-gear-orchestration.json`（没有 `DSH_HOME` 时落在 `~/.dsh/storages/`）。

```jsonc
{ "sessions": { "<sessionId>": { "mode": "fast", "at": 1730000000000 } } }
```

最多保留 40 个会话，`off` 即删行；写盘是「临时文件 + rename」的原子写，失败只记一条 warn，内存里的值继续生效。

**注入**：`agent/pre-step` 是一个 waterfall，处理器先调用 `next()` 拿到框架的决定，再按会话往里追加消息（`source.kind = "plugin:dsh-model-gear"`，`form: "instructions"`）。

| 会话 | 追加内容 |
|---|---|
| 父会话 · `fast` | `LIGHTNING_POLICY`（首次或换档时） |
| 父会话 · `tree` | `LIGHTNING_POLICY` + `SUPERFAST_POLICY` |
| 父会话 · 每轮 step 1–3 | 一条提醒，文本里带 `turn` 和 `step`，所以每轮每条都不同 |
| 父会话 · 切回 `off` | 一次性关闭说明，条件是「本插件在日志里留下的最新一条不是这条说明」 |
| 子会话 | 只按自己提示词首行的 `Tier: N of 2` 拿到对应分层说明；没有这一行就什么都不注入 |

**去重**不看进程内记忆，只看载体：本次 step 的消息、`session.deriveMessages()` 的日志、两个 inbox 队列。这样被丢弃的 step 不会让契约永久消失，日志被压缩后也会自动补回；切换档位时以「日志里最新的那份契约」为准，换档必然重新声明。

整个注入和路由都用 try/catch 兜底：写盘、日志、路由、注入任何一处失败，都不会影响宿主的一步或一个请求。

**超快的第二层**：`SUPERFAST_POLICY` 要求 tier-1 子代理各自再开两个孙代理，但宿主默认只允许直接子代理（`@deepseek-ai/dsh-subagent` 的 `maxDepth` 默认 `1`），所以默认安装下超快实际就是 2 个子代理。要把第二层跑起来，把 `maxDepth` 调到 `2`——改法、验证和回滚见 [docs/subagent-depth.md](docs/subagent-depth.md)。

### 官方子代理模型选择兼容（`src/subagent-routing.js`）

宿主存在 `subagentModelSelection` 服务且其同步 `current()` 返回 `enabled: true` 时，父会话每步会收到一条独立的 advisory：列出官方 `allowedModels` 精确 provider/model 路由，并明确真正约束由 `@deepseek-ai/dsh-tool-subagent`/宿主持有；本插件只提醒，不伪造强制。服务缺失、关闭、异常、异步 getter 或形状不匹配时不追加任何新消息，原有 fast/tree 行为保持不变。官方允许列表按 provider+model 去重；既有子会话策略仍由宿主冻结，本插件不写 projection、不创建子代理。

#### 配置项目路由

仓库可以在工作区的 `agents.md` 或 `AGENTS.md` 中声明“任务类型/关键词 → 推荐模型”。本仓库自带一份示例配置，见 [`AGENTS.md`](AGENTS.md)。最小结构如下：

````md
<!-- dsh-model-gear:routes-v1 -->
```json
{
  "version": 1,
  "routes": [
    {
      "id": "implementation",
      "match": { "taskType": "implementation", "keywords": ["新功能"] },
      "target": { "provider": "cpa", "model": "gpt-6.1-terra" },
      "effort": "high",
      "priority": 50
    }
  ]
}
```
````

只有 marker 后紧邻的 `json` 代码块会被读取；普通工作区指令、自然语言、YAML front matter 和无标记内容全部忽略。程序从当前工作目录向上查找最近的配置，同一目录下 `agents.md` 优先于 `AGENTS.md`。`match` 可以使用 `taskType`、`keywords` 或两者；`priority` 越大越优先展示。路由只渲染为 advisory：若目标不在官方 allowlist 中会标为 `unavailable`，不会绕过宿主约束。

要看到这条提示，需要同时满足：官方模型选择服务已启用、当前是父会话、工作目录能定位到配置文件，并且 DSH 已重启加载最新宿主代码。关闭或缺少官方服务时，原有 fast/tree 行为保持不变。

### 提示词（`src/orchestration-policy.js`）

Lightning / Superfast 契约原文逐字取自上游（含原编号），另外提供 `fastNudge` / `treeNudge`（每轮提醒）、`CHILD_NOTE_ONE` / `CHILD_NOTE_TWO`（子会话分层）、`OFF_NOTICE`（关闭说明）。这一层只导出文本，不发任何请求。

### 样式（`src/style.css` + `src/client.js`）

- **光带**只落在「已填充到当前档位」的那一段：shell 上写入 `--cg-fill-width`（与填充同宽）和 `--cg-meteor-travel`，CSS 把光带层裁到该宽度；`off` / 档位未知时组件不渲染该层，样式表另有一条 `display: none !important` 硬停。
- **模式配色**由根节点上的 `data-lightning="true"` / `data-superfast="true"` 驱动：快速整条滑条（填充、圆点、滑块、光带、描边）走紫色，超快走金色，标准档保留各档位自己的色阶；未命名的档位 id 也落模式色，不会掉回蓝色。
- **闪电颜色**按模式内联写进 `style.color`（`--cg-fast-ink` / `--cg-tree-ink`，深浅主题各一套），不依赖属性选择器链——任意一帧属性没落地也不会闪回紫色。
- **样式表只能有一个写者**：最后一个加载的实例通过页面全局令牌认领 `<style>`，旧实例的「每秒修复」计时器看到令牌不是自己的就直接退出。热重载时新旧两套 CSS 不会每秒轮流覆盖（那会让所有改过颜色的控件以 1 Hz 闪烁）。

## 目录结构

```
src/model-ui.js              面板本体（模型目录 / 强度滑条 / 改名 / 默认组 / 闪电与三档菜单）
src/client.js                客户端 apply：装样式表 + 注册面板（inject 为空）
src/host.js                  宿主 apply：编排路由 + agent/pre-step 注入
src/orchestration-policy.js  闪电 / 树契约原文、每轮提醒、子会话分层说明、关闭提示
src/subagent-routing.js      官方模型选择兼容与 agents 路由 advisory
src/style.css                面板规则、模式配色、光带
AGENTS.md                    本仓库的显式任务路由与协作约定
src/alias-sync.js            显示名的 localStorage 读写
src/providers.js             提供商参考清单（静态数据）
lib/client.js                客户端构建产物（提交进仓库）
lib/index.js                 宿主入口，re-export src/host.js
scripts/build.mjs            把客户端模块拼成 lib/client.js（确定性输出）
scripts/extract-css.mjs      从上游样式表筛出面板规则（开发工具）
tests/                       五个 Node 测试，见下
docs/subagent-depth.md       子代理深度：让「超快」长出第二层（宿主侧配置）
```

## 开发

```sh
node scripts/build.mjs     # src/* → lib/client.js
npm test                   # 运行全部五个测试
npm run check              # 构建并确认提交的 lib/ 与源码一致
```

> `npm run check` 只检查客户端 `lib/` 构建产物；宿主端 `src/host.js`、`src/subagent-routing.js` 通过 Node 语法检查和测试覆盖。

发布或提交前建议执行：

```sh
node --check src/host.js
node --check src/subagent-routing.js
git diff --check
npm test
```

`npm run check` 会检查构建后的 `lib/` 是否产生未提交差异；如果源码刚改过但还没重新构建，它会明确失败，重新运行 `npm run build` 即可。

| 测试 | 覆盖 |
|---|---|
| `tests/smoke.mjs` | 产物能被加载、槽位只注册一次、样式表装上、`inject` 为空 |
| `tests/render.mjs` | 渲染树：模型、默认组、光带与 `--cg-fill-width`、闪电按钮、三档菜单、未同步分支 |
| `tests/host.mjs` | 假宿主：路由读写、持久化、契约与提醒注入、去重、关闭提示、子会话分层、官方模型选择 advisory |
| `tests/routing.mjs` | 显式 agents 路由标记/schema、官方 allowlist 归一化与 advisory 回退 |
| `tests/style-owner.mjs` | 两个实例装进同一页面时，旧实例不能再改写样式表 |

边改边看时可以把 profile 指回本地目录：

```sh
dsh plugin --profile desktop add link:<本目录绝对路径>
```

改完重新 `node scripts/build.mjs` 并刷新页面即可；**宿主半段（`src/host.js`、`src/orchestration-policy.js`、`src/subagent-routing.js`）改动要重启应用**，面板显示「未同步」就说明还在跑旧宿主。

`lib/` 是提交进仓库的构建产物，因此 GitHub 安装不需要再构建；改完 `src/` 后要重新构建并同步更新 `lib/`。

## 许可

MIT，见 [LICENSE](LICENSE)。衍生于 dsh-codex-ui（作者 MeteorNOX / jiangshen275-beep，上游 Loliyer520，同为 MIT）。随包不含 OpenAI 字体与图标资源。
