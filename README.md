# dsh-model-gear

DSH 输入框里的模型挡位面板：模型选择、推理强度滑条、显示名，外加闪电编排三档。
它只往提示词里写一条东西——闪电契约；除此之外不注入任何人设、身份或核查段落。

## 安装

从 GitHub 安装（当前正式方式）：

```sh
dsh plugin --profile desktop add github:chenyuxuan-official/dsh-model-gear
```

发布到 npm 之后：

```sh
dsh plugin --profile desktop add dsh-model-gear
```

本地开发时，可以直接打包安装（装的是副本，不是指向源码的链接）：

```sh
npm pack
dsh plugin --profile desktop add file:<绝对路径>/dsh-model-gear-0.4.0.tgz
```

装完重启一次应用。插件会出现在 profile 的 `package.json` 依赖里；卸载用 `dsh plugin --profile desktop remove dsh-model-gear`。

> `dsh` 是桌面版自带的 CLI（`<安装目录>/resources/runtime/cli/bin/dsh.cmd`），`dsh plugin --profile <名字> <参数>` 的参数原样交给 pnpm。GitHub 安装锁定的是提交号，仓库有新提交后重新执行一次 `add` 才会更新。

## 实现

### 面板（`src/model-ui.js`）

面板注册在 `conversation.input.model` 槽位上（priority `-10`），槽位的 `inject(sessionId)` 返回四样东西：

| prop | 用途 |
|---|---|
| `directory` / `load` / `select` | 宿主模型目录的 store、加载和选中写入（`select()` 直接落到宿主的模型选择上） |
| `gear.read` / `gear.select` | 编排档位的读与写，走下面那条宿主路由 |
| `available` | 子会话里为 `false`，面板不提供选择 |

- **模型列表**：按 provider 分组，支持搜索；「默认」组是当前模型加上最近用过的五个（`dsh-model-gear/recent-models`，只在本机 localStorage）。
- **强度滑条**：档位全部来自宿主目录里该模型的 `reasoning.efforts`，不额外造虚拟档；拖动时只改本地预览，松手/键盘操作才写回；「重置」写回模型自己的 `defaultEffort`。
- **显示名**：以 `provider/model` 为键存在本机 localStorage（键名沿用旧版的 `dsh-codex-ui/model-aliases`），只影响列表里的显示。
- **档位未知**：读不到宿主状态时不猜「标准」，滑条不画填充、闪电显示为灰、三档菜单禁用并提示「未同步」。

**档位状态**由宿主持有，客户端只做三件事：打开面板时读一次、切换时乐观更新（失败回滚）、打开面板时再对齐一次。重读不会先清空当前值，早到的旧响应按序号丢弃，所以状态不会被来回覆盖。

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

**去重**不看进程内记忆，只看载体：本次 step 的消息、`session.deriveMessages()` 的日志、两个 inbox 队列。这样被丢弃的 step 不会让契约永久消失，日志被压缩后也会自动补回；节点切换档位时，以「日志里最新的那份契约」为准，换档必然重新声明。

整个注入和路由都用 try/catch 兜底：写盘、日志、路由、注入任何一处失败，都不会影响宿主的一步或一个请求。

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
src/style.css                面板规则、模式配色、光带
src/alias-sync.js            显示名的 localStorage 读写
src/providers.js             提供商参考清单（静态数据）
lib/client.js                客户端构建产物（提交进仓库）
lib/index.js                 宿主入口，re-export src/host.js
scripts/build.mjs            把客户端模块拼成 lib/client.js（确定性输出）
scripts/extract-css.mjs      从上游样式表筛出面板规则（开发工具）
tests/                       四个 Node 测试，见下
```

## 开发

```sh
node scripts/build.mjs     # src/* → lib/client.js
npm test                   # 下面四个测试
```

| 测试 | 覆盖 |
|---|---|
| `tests/smoke.mjs` | 产物能被加载、槽位只注册一次、样式表装上、`inject` 为空 |
| `tests/render.mjs` | 渲染树：模型、默认组、光带与 `--cg-fill-width`、闪电按钮、三档菜单、未同步分支 |
| `tests/host.mjs` | 假宿主：路由读写、持久化、契约与提醒注入、去重、关闭提示、子会话分层 |
| `tests/style-owner.mjs` | 两个实例装进同一页面时，旧实例不能再改写样式表 |

边改边看时可以把 profile 指回本地目录：

```sh
dsh plugin --profile desktop add link:<本目录绝对路径>
```

改完重新 `node scripts/build.mjs` 并刷新页面即可；**宿主半段（`src/host.js`、`src/orchestration-policy.js`）改动要重启应用**，面板显示「未同步」就说明还在跑旧宿主。发布前换回版本/GitHub 安装。

`lib/` 虽然是构建产物但提交进了仓库，这样从 GitHub 或 tarball 安装都不需要额外的构建步骤；改完 `src/` 记得重新构建并一起提交，CI 会检查 `lib/` 与源码是否一致。

## 许可

MIT，见 [LICENSE](LICENSE)。衍生于 dsh-codex-ui（作者 MeteorNOX / jiangshen275-beep，上游 Loliyer520，同为 MIT）。随包不含 OpenAI 字体与图标资源。
