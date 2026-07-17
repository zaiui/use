# @zaiui/use 是什么？

`@zaiui/use` 是一套面向 JavaScript / TypeScript 项目的工具函数库，涵盖类型判断、数组/对象处理、校验、格式化、本地存储、文件与系统相关能力，以及部分 Vue 场景下的交互辅助方法。

支持 **ESM** 与 **CommonJS** 两种引入方式，开箱即用；仅在与存储前缀、dayjs 语言等**全局行为**相关时，才需要在入口调用 `configureUse`。

## 环境要求

- Node.js **>= 16**

## 安装

任选一种包管理器安装到项目依赖即可：

```bash
npm install @zaiui/use
```

```bash
yarn add @zaiui/use
```

```bash
pnpm add @zaiui/use
```

## 使用方式

### 不带全局配置（大多数 API）

绝大多数函数**不需要**任何初始化：按需从主入口命名导入，传入业务参数即可。

```ts
import { isEmpty, useClick, setStrTrim } from '@zaiui/use';

if (!isEmpty(value)) {
  console.log(setStrTrim(value));
}

// 防连点：不传参时使用默认冷却 1000ms
const ok = await useClick();
if (!ok) return;

// 传参：自定义冷却时间与区分多按钮的 key
if (!(await useClick(800, 'submit'))) return;
```

适用示例：`isEmpty`、`deepClone`、`toDate`、各类 `validate` / `array` / `object` 工具，以及 `useClick` 等 Hook 类方法——它们只依赖你**每次调用时传入的参数**，与 `configureUse` 无关。

### 带全局配置（`configureUse`）

当项目需要统一 **Storage 键名前缀** 或 **dayjs 语言** 时，在应用入口（如 `main.ts`）**调用一次或多次** `configureUse`；多次调用会**浅合并**，后写入的配置覆盖同名字段。

```ts
import { configureUse, setStore, getStore } from '@zaiui/use';

configureUse({
  storeKey: 'my-app',   // 逻辑键 user → 实际 localStorage 键 my-app-user
  dayjsLocale: 'zh-cn', // 影响库内 dayjs 实例的语言（如相对时间等）
});
```

| 配置项 | 说明 |
| --- | --- |
| `storeKey` | `setStore` / `getStore` / `delStore` / `allStore` / `clearStore` 等使用的键前缀；**未配置**时逻辑键即实际键，`clearStore` 会清空整个 Storage |
| `dayjsLocale` | dayjs 语言包名称，如 `'zh-cn'`、`'en'` |

配置后的存储示例：

```ts
setStore('token', 'xxx');
getStore<string>('token'); // 读写 my-app-token
```

**不调用 `configureUse` 时**：存储相关 API 仍可直接使用，键名不会加前缀；dayjs 默认使用库内置的 `zh-cn`  locale（见 `packages/to/dayjs.ts`）。若要与多应用隔离存储或切换语言，再配置即可。

### TypeScript

包自带类型声明，从 `@zaiui/use` 导入即可获得类型提示；全局配置类型为 `UseGlobalConfig`：

```ts
import { configureUse, type UseGlobalConfig } from '@zaiui/use';

const options: UseGlobalConfig = { storeKey: 'demo' };
configureUse(options);
```

## API 文档

在线文档便于查阅各模块方法与示例：

- **[http://use.231004.cn](http://use.231004.cn)**（部署在自用服务器，可用性以实际为准）

## 在 AI 中使用

若业务项目里也使用 Cursor 等编码 Agent，建议让 Agent **优先读本库的约定**，减少误用 Vue composable、误清 Storage、或臆造不存在的 API。

### 1. 包内 Agent 说明（随 npm 发布）

安装依赖后，Agent 可直接阅读：

```text
node_modules/@zaiui/use/AGENTS.md
```

内容包含：导入方式、`configureUse` 规则、模块索引、`useClick` 等易错点、推荐代码片段。

### 2. 在项目根 `AGENTS.md` 中引用（推荐）

在**你的业务项目**根目录创建或编辑 `AGENTS.md`，增加例如：

```markdown
## 工具库

本项目使用 `@zaiui/use`。编写校验、数组/对象工具、本地存储、格式化或防连点逻辑时，
须遵循：node_modules/@zaiui/use/AGENTS.md
```

### 3. Cursor 规则模板

将本仓库中的规则文件复制到业务项目的 `.cursor/rules/` 即可（可按需改 `globs`）：

```bash
mkdir -p .cursor/rules
cp node_modules/@zaiui/use/templates/cursor-rules/zaiui-use.mdc .cursor/rules/
```

若尚未安装依赖，也可从 [GitHub 仓库](https://github.com/zaiui/use) 复制 `templates/cursor-rules/zaiui-use.mdc`。

规则会在编辑匹配 glob 的文件时提示 Agent：命名导入、`configureUse` 与 Storage 风险、`useClick` 语义、以及查 `.d.ts` / 在线文档的顺序。

## 开源

`@zaiui/use` 采用 **MIT** 协议，可用于个人或商业项目，也可二次开发。

- **[GitHub 仓库](https://github.com/zaiui/use)**（主仓库），欢迎 Star 与 Fork
