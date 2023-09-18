# remark-block-containers

这是一个 remark 插件，用于创建自定义容器，允许添加标题、id或样式类。

## 什么时候应该使用？

如果您想要在 markdown 中添加自定义容器，例如生成警告、详情、危险、提示框等。

- 允许自定义标签类型
- 允许添加id或者样式类
- 允许自定义标签标题
- 已内置 `info`、`tip`、`warning`、`danger`、`details`、`code-group` 便捷写法

## 安装

该软件包仅适用于 ESM。建议 Nodejs 版本 14.14+

```bash
npm install remark-block-containers
```
或者
```bash
yarn add remark-block-containers
```
或者
```bash
pnpm add remark-block-containers
```

## 用法

`::: [type][{id|class}] [title]`

假设有如下 markdown 文件，`example.md` 它包含一个灵活的容器，类型为 tip。
注意：每个容器必须已三个冒号开始和结束。

```markdown
::: tip 提示
这是一条提示。
:::
```

运行后会得到

```html
<div class="block-default tip">
  <div class="block-title">提示</div>
  <p>这是一条提示。</p>
</div>
```

> `info`、`tip`、`warning`、`danger`、`details`、`code-group` 等 type 都是内置便捷写法，等价于 `::: div{.tip}`。
>
> 若想要添加**自定义id**，则 `::: div{#id}` 即可。
>
> 因此你想要自定义任何容器也是允许的，**前提 `type` 是合法标签类型**，如 `div`、`main`、`span` 等。

**使用 `code-group` 时**，单一引用该插件的是不行的，无法实现切换逻辑，因此需要在恰当的位置，**引入 `useCodeGroups.js` 并执行 `useCodeGroups` 方法**，监听代码组 `tab` 点击实现切换逻辑。

```javascript
import { useCodeGroups } from 'remarkBlockContainers/useCodeGroups'
useCodeGroups()
```

## 选项

所有选项都是可选的。

```javascript
use(remarkBlockContainers, {
  containerClass: 'block-default', // 容器默认样式类
  containerType: 'div', // 容器标签类型，只影响便捷写法。
  titleType: 'div', // title 标签类型
  titleClass: 'block-title', // title 默认样式类
})
```

也可直接使用默认选项

```javascript
use(remarkBlockContainers)
```

## License

[MIT](https://github.com/leezhian/remark-block-containers) © [leezhian](https://github.com/leezhian)