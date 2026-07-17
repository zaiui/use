# @zaiui/use — Agent 使用说明

本文档面向**编码 Agent**（Cursor、Copilot、Claude Code 等）。在业务项目中编写或修改与工具函数、本地存储、格式化、校验相关的代码时，请优先使用本库，并遵守下列约定。

## 入口与导入

- **唯一包名**：`@zaiui/use`（不要使用 `zaiui/use`、相对路径引用本库源码）。
- **推荐写法**：命名导入，Tree-shaking 友好。

```ts
import { isEmpty, configureUse, setStore, getStore, useClick } from '@zaiui/use';
```

- **可选写法**：各模块提供 `useXxx()` 工厂，返回该模块全部方法的集合（与命名导入等价，二选一即可，同一文件内勿混用两种风格）。

```ts
import { useValidate, useArray } from '@zaiui/use';

const { isEmpty, isPhone } = useValidate();
const { arrDel, arrIndex } = useArray();
```

- **默认导出**：主入口 `default` 是**类型判断模块**的预绑定实例（等同 `useType()` 的返回值），**不是**整个工具库。Agent 应使用命名导入，避免 `import use from '@zaiui/use'` 误当全库命名空间。

## 全局配置（必须先读）

| 场景 | 是否调用 `configureUse` |
| --- | --- |
| 校验、数组/对象、格式化、随机数、文件、OS、依赖注入、大部分 hook | **不需要** |
| 需要 Storage 键前缀（多应用隔离）或切换 dayjs 语言 | **需要**，在应用入口调用 |

```ts
import { configureUse } from '@zaiui/use';

configureUse({
  storeKey: 'my-app',   // 逻辑键 token → 实际键 my-app-token
  dayjsLocale: 'zh-cn',
});
```

- 可多次调用，**浅合并**；后写入的同名字段覆盖前者。
- **未配置 `storeKey`**：`setStore('a')` 的键就是 `'a'`；`clearStore()` 会清空**整个** localStorage/sessionStorage（危险）。
- **已配置 `storeKey`**：`clearStore()` 仅删除带前缀的键。
- 类型：`UseGlobalConfig`（`storeKey?`、`dayjsLocale?`）。

## 命名易错点（必读）

| 名称 | 实际含义 | 常见误用 |
| --- | --- | --- |
| `useClick` | 防连点，返回 `Promise<boolean>` | 不是 Vue 3 Composition API 的 composable |
| `useGuard` | 包装函数，锁定期内只执行第一次 | 不是 VueUse 的 `useThrottleFn` |
| `useMitt` / `emitter` | 轻量事件总线 | 不是 Vue 的 `provide/inject` |
| `useDefer` | 基于 rAF 的延迟渲染控制器 | 不是 `defer` 宏或 Vue 异步组件 |
| `useStore()` | 返回 `setStore`/`getStore` 等方法的对象 | 不是 Pinia/Vuex |
| `formValidate` | 适配带 `validate(callback)` 的表单 ref | 不是 VeeValidate |

## 模块索引（按需求选型）

编写代码前先在本库中查找是否已有 API，**不要**无必要引入 lodash、ramda 或手写等价逻辑。

| 模块 | 典型 API | 用途 |
| --- | --- | --- |
| `validate` | `isEmpty`, `isPhone`, `isEmail`, `isIdCard`, `formValidate` | 空值与格式校验 |
| `type` | `getType`, `isPlainObject`, `isArray`, `isPromise` | JS 类型判断 |
| `array` | `arrIndex`, `arrDel`, `arrDelKey`, `recursionChildren`, `arrToKey` | 一维/二维数组、树形 |
| `object` | 深拷贝、合并、键路径等（见 `dist/object` 类型） | 对象操作 |
| `to` | `formatDateTime`, `priceFormat`, `toParse`, `maskPhone`, `toFormData` | 字符串/数字/日期/颜色转换 |
| `store` | `setStore`, `getStore`, `delStore`, `storeTime`, `clearStore` | localStorage / sessionStorage |
| `random` | 随机字符串、数字等 | 见类型声明 |
| `file` | 文件相关工具 | 见类型声明 |
| `os` | 环境、颜色等 | 见类型声明 |
| `dependency` | `provide`, `inject`, `DependencyError` | 简单键值 DI |
| `hook` | `useClick`, `useGuard`, `sleep`, `useMitt`, `useDefer` | 交互与事件 |
| `config` | `configureUse`, `getUseConfig` | 全局配置 |

完整 API 与参数说明见在线文档：<http://use.231004.cn>。不确定签名时，以 **`node_modules/@zaiui/use/dist/**/*.d.ts`** 中的 JSDoc 为准。

## 推荐代码模式

### 防重复提交（按钮）

```ts
import { useClick } from '@zaiui/use';

async function onSubmit() {
  if (!(await useClick(1000, 'submit'))) return;
  await api.submit();
}
```

### 本地缓存（已 configureUse storeKey）

```ts
import { getStore, setStore, storeTime } from '@zaiui/use';

setStore('user', { id: 1 });
if (storeTime('user', 86_400_000)) {
  // 超过 24h，视为过期
}
const user = getStore<{ id: number }>('user');
```

### 空值与校验

```ts
import { isEmpty, isPhone } from '@zaiui/use';

if (!isEmpty(mobile) && isPhone(mobile)) {
  // ...
}
```

## Agent 禁止事项

1. 不要臆造本库不存在的函数名；先查 `.d.ts` 或文档。
2. 不要用 lodash 的 `isEmpty` 等替代本库 `isEmpty`（语义可能不同，以本库实现为准）。
3. 不要在未确认项目是否已 `configureUse` 的情况下调用 `clearStore()`。
4. 不要将 `useClick` 写成 `const x = useClick()` 并当作 ref/composable 在 `setup` 顶层常驻；应在事件处理函数内 `await useClick(...)`。
5. 不要从 `@zaiui/use/subpath` 导入（当前仅导出主入口 `"."`）。

## 业务项目如何引用本文档

在项目根 `AGENTS.md` 中加入：

```markdown
本项目使用 `@zaiui/use` 作为工具函数库。相关代码须遵循：
`node_modules/@zaiui/use/AGENTS.md`
```

Cursor 用户可将 `node_modules/@zaiui/use/templates/cursor-rules/zaiui-use.mdc` 复制到项目 `.cursor/rules/`（见 README「在 AI 中使用」）。
