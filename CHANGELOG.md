# Changelog

## 0.4.1

- **面板自己渲染平台的模型名槽位**：模型名不再直接写 `model.name`，而是渲染 `conversation.input.model.label`（`trigger` / `menu` / `option` 三种 placement）。官方插件加在模型名旁的装饰现在会照常出现——例如 DeepSeek Flash 的「1017」发布徽标（`@deepseek-ai/dsh-client-ui-deepseek-model-label-1017`）。
- 用户自定义显示名仍然优先；槽位不存在、没有贡献者或渲染抛错时回退到目录里的原名。
- `tests/render.mjs` 覆盖这条路径：传入 `renderSlot` 时触发器使用槽位内容，不传时回退原名。

## 0.4.0

**把「闪电编排」加回来**——0.3.0 删掉的那一堆提示词注入里，只恢复这一条。人设、Ultra 虚拟档、
中文强制、事实核查段、身份段、别名同步、token 倍率 UI 一概没有。

### 新增

- **面板左上角的闪电按钮**：原版形状（粗闪电 + 三颗小星），开启时有星、紫色，超快档金色；未同步（读不到宿主状态）时是灰的、菜单禁用。点开是「编排档位」三档菜单，文案照抄上游：标准＝默认速度 / 快速＝至少 1.5× 消耗 甚至更多 / 超快＝至少 2.5× token 消耗 甚至更多。
- **整条滑条跟着档位换色**：快速（`data-lightning`）时填充、圆点、滑块、光带、描边全部走紫色（上游 Ultra 的 `#5055f5 → #bb74ff`，深色提亮一版）；超快（`data-superfast`）时全部走金色（沿用上游 superfast 的色阶，未命名的档位 id 也落金色，不会掉回蓝色）；标准档完全不动，档位自身的色阶保持原样。
- **收起时的档位标记**：开启后，强度档位文字右侧显示小闪电（快速紫、超快金，深色随主题提亮）。
- `src/orchestration-policy.js`：上游 Lightning 与 Superfast 契约原文、每轮提醒、子代理分层说明、关闭提示，逐字照抄，不重新编号。
- `src/host.js`：`agent/pre-step` 注入 + `POST /api/dsh-model-gear/orchestration`（`read` / `update`）+ 按会话记录档位（`$DSH_HOME/storages/dsh-model-gear-orchestration.json`，没有 `DSH_HOME` 时落到 `~/.dsh/storages/`；最多 40 条，`off` 即删行）。

### 注入规则

- **父会话**：只注入当前档位的契约；换档会重新声明（树档＝Lightning + Superfast 两段）。每轮第 1–3 步各追加一条提醒，文本含轮次与步数，所以不会被「同文本去重」吞掉。切回标准时补一条一次性的「已关闭」，避免模型继续照旧契约执行。
- **子会话**：不拿父契约，只按自己提示词首行的 `Tier: N of 2` 收到分层说明（tier 1 继续开两路，tier 2 到此为止）。没有 Tier 行就什么都不注入。
- 去重比对四处载体：本次 step 的消息、会话日志、两个 inbox 队列；同一文本不会注入第二次。判断「已经发过」只看会话日志，不看进程内记忆——被丢弃的 step 不会让契约永久消失，日志被压缩后也会自动补回。
- 全部注入与路由都有 try/catch 兜底：写盘、日志、路由、注入任何一处失败都不会影响宿主的一步或一个请求。
- 失败信封带 `details: {}`：客户端的响应解析器要求这个字段，缺了会把所有校验错误变成 `connection: invalid server-response failure`。

### 修复：超快/快速下闪电与滑条每秒紫↔金闪烁

起因不是配色规则写错，而是**两套样式在同一个 `<style>` 上每秒互相覆盖**：每次重新构建后，旧 bundle 里那个「每秒检查样式表」的计时器还在跑（它故意不随插件销毁），新旧两套 CSS 只要有一处不同，就会以 1 秒为周期轮流写进同一个元素——凡是两版之间改了颜色的东西都在闪，最显眼的就是按模式上色的闪电。

- **构建戳**：`scripts/build.mjs` 给每个构建打一个递增时间戳，客户端把它写进 `style.dataset.build`；只有戳更新（或相等）的构建能写样式表，旧计时器发现元素属于更新的构建就直接退出（两构建对照测试：旧计时器写入 0 次）。
- **闪电颜色内联**：按当前模式写成 `style.color`（`--cg-fast-ink` / `--cg-tree-ink`，深浅主题各一套），不再只靠 `[data-lightning]` / `[data-superfast]` 选择器链——任何一帧属性没落地也不会掉回紫色。
- **档位状态更稳**：重读不再先把 `gear` 清空（仅换会话时清），迟到的读取结果按序号丢弃；打开面板时与宿主重新对齐一次。

### 已知边界

- 超快的第二层取决于宿主是否允许子代理再委派：`@deepseek-ai/dsh-subagent` 的 `maxDepth` 默认 1（只允许直接子代理），所以默认安装下超快实际就是 2 个子代理。要让孙代理跑起来，把 `maxDepth` 调到 2，改法/验证/回滚见 `docs/subagent-depth.md`。

### 仍然没有

- 人设 / 回复风格、Ultra 虚拟档与流星专属态、中文强制、事实核查段、模型身份段、别名上送、token 倍率文案。
- 滑条的填充色、光带方向与「off 不流动」行为未改。

### 测试

- 新增 `tests/host.mjs`：假宿主 + 临时 `DSH_HOME`，覆盖路由读写、持久化、契约注入与去重、每轮提醒、关闭提示、子会话分层说明、无 `connection` 时的不抛错。
- `tests/render.mjs` 增补：闪电按钮存在、三档菜单与三条数量文案、未同步分支（三行禁用、`data-mode="unknown"`）。

## 0.3.1

滑条上的流动光带改成「只在当前档位的那一段里流」：

- **边界**：光带层从整条轨道收窄为 `--cg-fill-width`（填充区的宽度，右端正好在 24px 滑块的右缘），`overflow: hidden` 裁掉超出的部分——所以流动止于当前档位，切口压在滑块下面看不见。
- **off / none / 未知档位不再有光带**：组件在 `effortTone` 为 `off`/`none` 或位置未知时不渲染该层；样式表另加 `display: none !important` 硬停，连扫光一起关掉。
- **补回上游的流光扫光**：原版 `[data-ultra="true"]::after` 的斜向扫光现在对所有真实档位生效，裁剪到同一段填充区，颜色取自档位的 `--cg-glow`，浅色主题透明度减半。
- **密度跟随宽度**：容器查询按填充区宽度保留 1/4/6/8/11 条（约每 20–25px 一条），低档位不再糊成一团；不支持容器查询的浏览器退回 11 条。
- **组件契约**：shell 上新增 `--cg-fill-width` 与 `--cg-meteor-travel`（后者由填充宽度推出，档位变化即时重算）。
- `tests/render.mjs` 增补断言：中档渲染恰好 11 条光带、shell 与 fill 的宽度字符串一致、`off` 档渲染树里没有光带层。

已知边界：若某模型把「最低真实档」放在滑条起点（ratio 0），填充区宽度就等于滑块本身，光带没有可流动的空间，因此看不见；本机的模型列表里有 `off` 档，`low` 位于约 1/3 处，不受影响。

## 0.3.0

**删掉全部提示词注入，只留面板。** 触发原因：这些注入原本是上游作者写的文案（模式契约、每轮提醒、`## 你是谁` 身份段、人设段、人设切换通知），它们会在用户没有要求的情况下改写每个会话的行为。

### 删除

- 宿主侧整块：`turbo.js`（路由 + 契约注入 + 每轮提醒 + 人设）、`turbo-policy.js`（全部文案）、`model-identity.js`（身份段 + 别名路由）、`injection-state.js`（注入开关）、`identity-status.js`（注册诊断）、`home.js`（状态路径）。
- 客户端：Ultra 虚拟档、闪电 / 超快开关、编排模式面板、流星与闪电图标、token 预算标签、「未同步」重试、空白会话继承开关、向宿主推送显示名的通道。
- 测试：`tests/host-smoke.mjs`、`tests/policy.mjs`（它们测的是已删除的代码）。

### 保留

- 模型选择器、搜索、「默认」组、推理强度滑条（档位全部来自宿主目录，不再有虚拟档）。
- **滑条上的流动光带**：原来是 Ultra 档的专属效果（CSS 用 `[data-ultra="true"]` 把它藏起来），现在每个档位都画；档位颜色仍由 `[data-effort]` 决定，没有改动。档位未知（读不到当前强度）时不画，因为它会变成唯一一个「声称某个档位」的东西。
- 显示名重命名：只写本机 localStorage，键名 `dsh-codex-ui/model-aliases` 保持不变，升级后旧名字还在。
- 面板样式与深色主题变量。

### 结构变化

- `src/host.js` 的 `apply` 变成空操作：没有路由、没有提示词段、没有会话监听。
- `export const inject` 由 `['connection']` 收窄为 `[]`：客户端半段只装样式表并注册一个槽位，槽位自己声明依赖。
- `lib/client.js` 229,750 → 151,141 字节。
- 旧版本写下的 `codex-ui-effort.json` / `codex-ui-persona.json` / `dsh-model-gear-model-names.json` / `dsh-model-gear-identity-status.json` 不再读写，可直接删除。

## 0.2.1

- **模型身份可能张冠李戴**（症状：选的是 V4-Pro，自我介绍说 V4.1-Flash）。三段证据：请求头 `request/header` 里是 `deepseek-v4-pro`（路由没问题），系统提示里插件注入的「你是谁」段却写着 V4.1-Flash，而那个名字来自客户端推送的显示名表。表只在宿主内存里、解析还带一个跨 provider 的后缀回退，宿主重启后表为空；块一旦写进会话的系统提示，就不会随表修正。现在：
  - 启动时从 `dsh-model-gear-model-names.json` 读回名字表（KV 里没有记录，之前每次启动都是空表）；
  - 后缀回退只在这张表**完全没见过**当前 provider 时才用；已知 provider 缺这个模型就是缺，不再借别的账号的同名条目；
  - 每次组装把 `lastKey` / `lastName` / `lastNameSource` 写进身份状态文件，下次再错可直接指认是哪个键、哪个来源。
- `identityText` 与新的 `identityResolution` 共享同一套解析，宿主测试覆盖「已知 provider 不借用」与「未知 provider 仍可按模型 id 匹配」。

## 0.2.0

一轮以「先查清、再修」为目标的修复。每条都能在 `tests/` 里找到对应的断言。

### 修复

- **开关重启即丢。** 记录路径只读 `process.env.DSH_HOME`，而桌面宿主不设这个变量，`writeRecordFile(null)` 静默返回 `false`，路由却回 `ok: true`。新增 `src/home.js`：`$DSH_HOME` 非空则用它，否则 `~/.dsh`；`turbo.js` / `model-identity.js` / `identity-status.js` 全部改走它，空路径会打一条警告而不是沉默。
- **同一条编排契约一轮注入两遍。** 每轮提醒和契约共用 `source.kind`，而 `newestPolicyText` 只看「最新一条本插件消息」——提醒一落地就把契约顶掉，下一步判定「没注入过」，整块 7064 字符再来一遍（实测 turn 9 的 seq 1402 与 seq 1426）。提醒改用独立 kind `plugin:dsh-codex-ui:nudge`，契约 kind 保持上游字符串以便识别旧会话。
- **新会话被静默塞入人格段。** `pendingPersona()` 默认 `'work'`，但设置它的 hero 页签已随皮肤删除，于是每个新会话都带一段「precision work」+ 强制约束。改为默认空，只有显式写入 `persona: 'chat' | 'work'` 才生效。
- **模型身份路由注册在非法路径。** `ALIAS_ROUTE` 是 `/api`，而 carrier 的 exact Fetch 路由必须是 `/api/<endpoint>`（`endpointFromPath` 校验），且 `rpc.call('/api', …)` 永远打不到 `/api`。改成 `/api/dsh-model-gear/model-aliases`；`routeState` / 状态文件改为在注册回调**内**、注册成功之后才写——原来在 `ctx.inject` 返回后立刻写 `routeOk: true`，注册失败也报成功。
- **代码块着色修复没有生效。** 精简版 `apply` 没调用 `startStyleWatch()`，`restoreTokenColors` 成了死代码，宿主 `pre { color: inherit !important }` 把 shiki 代码块压成灰色。改为调用 `startStyleWatch()`；它同时恢复每秒一次的样式表自愈与 `data-chatgpt-ui` 属性观察。
- **扇出统计串会话。** `turnTools` 用每会话从 1 递增的 `turn` 当键，多会话同号互相覆盖；`agent/turn-stopping` 又取「最后插入的一行」。改为 `sessionId:turn` 键，按本会话本轮取行并在上报后删除。
- **`tokenMultiplier()` 回退值写成 `15`**（应为 `1.5`），措辞一变界面就会写「约 15× token」。
- **Lightning 条款编号 1,2,4…13,12**：缺第 3 条，而自检又引用「clause 3」。重排为 1–12，引用改为指向真实存在的条款。
- **测试形同虚设。** `tests/host-smoke.mjs` 只 `console.log` 调用名，不 assert；已重写为对路由路径、落盘与重启读回、契约/提醒去重、人格 opt-in、身份路由与状态文件的断言。新增 `tests/policy.mjs`（条款编号、对外倍数、全关会话不注入、提醒长度）。
- **CSS 生成器会删掉主题变量块。** `scripts/extract-css.mjs` 只保留选择器含 `.cg-*` 的规则，`html[data-chatgpt-ui] { --cg-page: … }` 这类纯属性选择器会被丢掉，面板又变透明。改为精确匹配 `:root` / `html[data-chatgpt-ui]` / `body[data-ds-dark-theme]` 三个选择器，并在写出后检查 `--cg-page:` 声明，缺失即退出 1。
- **删除 `scripts/make-client.mjs`**：一次性生成脚本，会按旧 7 服务 `inject` 与旧 `apply` 覆盖 `src/client.js`，等于撤销本轮修复。

### 清理

- `src/client.js` 592 → 218 行：删除 hero 图标选择器、Codex 标记、侧栏图标、hover card、轮次状态、运行指示等一整套已不挂载的皮肤代码。
- `src/model-ui.js` 删除峰谷徽标的全部逻辑（含 2026 假期表），渲染树早已不引用。
- `inject` 从 7 个服务收窄为 `['connection']`：`apply` 只直接读它，面板各服务由 `registerModelUI` 自己的 `ctx.inject` 声明。
- `lib/client.js` 229,750 → 198,025 字节。
- `tests/react-shim.mjs` 从上游仓库复制进本包，测试不再依赖 `../dsh-codex-ui-2` 是否存在。
- README 重写：状态文件位置、环境变量、构建与重载的区别、样式表重新生成时的注意事项。

### 行为变化

- 新会话默认不再带人格段（`docs/README` 的「去掉的部分」已注明）。
- 中文思考需 `DSH_MODEL_GEAR_FORCE_CHINESE=1` 才强制（上一版已改，此次只是文档化）。
- 记录文件名改为 `dsh-model-gear-model-names.json`、`dsh-model-gear-identity-status.json`。
