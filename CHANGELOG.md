# Changelog

## 2.0.0

### Major Changes

- 替换已弃用的 `unist-util-find-between-all` 为 `unist-util-find-between@^1.2.3`（#1）
- `sass` 从 `dependencies` 移至 `devDependencies`（纯构建工具，消费者无需安装）
- 明确要求 Node.js >= 18（nanoid@5 / unified@11 的实际版本门槛）

### 工具链升级（不影响运行时行为）

- TypeScript 7（原生编译器）
- 测试：jest + ts-jest → vitest 5
- Lint：eslint + @typescript-eslint → oxlint

插件行为与 1.x 完全一致（23 个快照用例全部通过验证）。
