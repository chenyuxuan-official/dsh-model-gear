# dsh-model-gear

DSH 输入框里的**模型挡位**面板：选模型、调推理强度、改显示名，外加**闪电编排**三档。
它只往提示词里写一条东西——闪电契约；除此之外不注入任何人设、身份或核查段落。

最早的版本是从 [`jiangshen275-beep/DSH-Codex-ui-2-`](https://github.com/jiangshen275-beep/DSH-Codex-ui-2-)（上游 `Loliyer520/dsh-codex-ui`，MIT）里抽出来的，那个包是一整套 Codex 皮肤加一整套提示词注入（模式契约、每轮提醒、模型身份段、人设段、人设切换通知）。0.3.0 把提示词那一半全部删掉，面板只做界面；0.4.0 按需要只恢复了其中的**闪电编排**，其余仍然没有。

## 保留的部分

| 能力 | 来源 |
|---|---|
| 模型选择器（宿主模型目录、按 provider 分组、搜索、「默认」组） | `src/model-ui.js` |
| 推理强度滑条（档位来自宿主目录，写回走 `directory.select`） | `src/model-ui.js` |
| 滑条上的流动光带（**只在已填充到当前档位的那一段里流**；`off` / 未知档位不画；条的颜色仍按档位，不随光带改变） | `src/style.css` |
| 显示名重命名（`provider/model` 为键，只存在本机 localStorage） | `src/model-ui.js` + `src/alias-sync.js` |
| **闪电编排**：面板左上角闪电 → 标准（默认速度）/ 快速（至少 1.5× 消耗）/ 超快（至少 2.5× token）；开启后整条滑条随模式变紫 / 变金 | `src/model-ui.js` + `src/host.js` + `src/orchestration-policy.js` + `src/style.css` |
| 面板样式、深色主题变量 | `src/style.css` + `src/client.js` |

## 闪电编排是什么

一个**真实的**提示词开关：开档后宿主在 `agent/pre-step` 里把上游的 Lightning（或 Lightning + Superfast）契约注入父会话，并按轮追加提醒；子会话只按提示词首行的 `Tier: N of 2` 收到分层说明，不拿父契约。切回「标准」会补一条一次性的关闭说明，避免模型继续照旧契约执行。

三档的代价不一样：快速每轮起 2 个子代理，超快是树（2 个 tier-1，各自再开 2 个）。状态按会话记在 `$DSH_HOME/storages/dsh-model-gear-orchestration.json`（没有 `DSH_HOME` 时落在 `~/.dsh/storages/`，最多 40 条，标准即删行）。

配色跟着模式走：快速整条滑条（填充、圆点、滑块、光带、描边）紫色，超快金色，标准档保持原来的档位色阶；折叠触发器上的小闪电同色。

## 不再有的部分

- **其它提示词注入**：`## 你是谁` 身份段、人设段、人设切换通知、中文强制、事实核查段、模型身份段、别名上送——0.3.0 删掉后没有再回来。
- **Ultra 虚拟档、token 预算标签**：没有。光带保留，但它不再属于某一个档位。
- 人设管理、采样参数覆盖、余额探针、会话清理、整套皮肤、hero、侧栏、会话树。

旧版本留下的文件不会再被读写，可以直接删：`~/.dsh/storages/codex-ui-effort.json`、`codex-ui-persona.json`、`~/.dsh/dsh-model-gear-model-names.json`、`dsh-model-gear-identity-status.json`。

## 结构

```
src/model-ui.js      面板本体（模型选择 / 强度滑条 / 改名 / 默认组 / 闪电与三档菜单）
src/client.js        客户端 apply：装样式表 + 注册面板（inject 为空）
src/alias-sync.js    显示名的 localStorage 读写（键名沿用旧版，升级后名字还在）
src/providers.js     提供商参考清单（静态数据）
src/host.js          宿主 apply：编排路由 + agent/pre-step 注入（唯一的提示词入口）
src/orchestration-policy.js  闪电 / 树契约原文、每轮提醒、子会话分层说明、关闭提示
src/style.css        面板用到的规则
scripts/build.mjs    把客户端几个模块拼成 lib/client.js
scripts/extract-css.mjs 从上游样式表筛出面板规则（保留主题变量块）
```

## 安装

发布到 npm 之后：

```sh
dsh plugin --profile desktop add dsh-model-gear
```

直接从 GitHub 安装（仓库公开之后）：

```sh
dsh plugin --profile desktop add github:<user>/dsh-model-gear
```

还没发布时，用本地打包的 tarball（装的是**副本**，不是指向源码的链接）：

```sh
npm pack
dsh plugin --profile desktop add file:<绝对路径>/dsh-model-gear-0.4.0.tgz
```

装完重启一次应用。之后它会像其他插件一样出现在 profile 的 `package.json` 里、按版本管理；卸载用 `dsh plugin --profile desktop remove dsh-model-gear`。

> `dsh` 是桌面版自带的 CLI（`<安装目录>/resources/runtime/cli/bin/dsh.cmd`），`dsh plugin --profile <名字> <参数>` 的参数原样交给 pnpm。

## 开发

```sh
node scripts/build.mjs     # src/* → lib/client.js（确定性输出，lib/ 已提交）
node tests/smoke.mjs       # 槽位只注册一次、样式表装上、inject 为空
node tests/render.mjs      # 渲染树：模型、默认组、光带、闪电按钮、三档菜单、未同步分支
node tests/host.mjs        # 假宿主：路由、持久化、注入、去重、关闭提示、子会话分层
node tests/style-owner.mjs # 热重载后旧实例不能再改写样式表（紫/金闪烁的回归测试）
```

边改边看时，把 profile 指回本地目录（`link:`），改完重新构建并刷新页面即可；**宿主半段（`src/host.js`、`src/orchestration-policy.js`）改动要重启应用**——热重载有时会自己加载，但不保证；面板显示「未同步」就说明还在跑旧宿主。改 `package.json` 里的 `dsh` 字段同样需要重启（客户端注入表只在宿主启动时收集一次）。

```sh
dsh plugin --profile desktop add link:<本目录绝对路径>
```

样式表由 `scripts/extract-css.mjs` 从上游筛选而来，但提交的 `src/style.css` 是手工整理过的，重新生成时先写临时文件再比对，不要直接覆盖：

```sh
node scripts/extract-css.mjs <上游>/src/style.css src/model-ui.js lib/style.regenerated.css
git --no-pager diff --no-index --numstat src/style.css lib/style.regenerated.css
```

生成器只保留「选择器里含面板用到的 `.cg-*` 类」或「选择器恰好是 `:root` / `html[data-chatgpt-ui]` / `body[data-ds-dark-theme]`」的规则；缺少 `--cg-page:` 声明时直接报错退出。

## 发布

```sh
npm run build      # 重新生成 lib/client.js
npm test           # 四个测试都过
npm publish        # prepack 会再构建一次
git tag v0.4.0 && git push --tags
```

`lib/` 虽然是构建产物，但**提交进了仓库**：这样从 GitHub 或 tarball 安装都不需要额外的构建步骤。改完 `src/` 记得 `npm run build` 并把 `lib/` 一起提交；CI 会检查它是否和源码一致。

## 许可

MIT，见 [LICENSE](LICENSE)。衍生于 dsh-codex-ui（作者 MeteorNOX / jiangshen275-beep，上游 Loliyer520，同为 MIT）。随包不含 OpenAI 字体与图标资源。
