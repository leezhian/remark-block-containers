import dedent from 'dedent'

export const mockMd = [
  {
    input: dedent
    `
    :::
    :::
    `,
    output: `"<p>::::::</p>"`
  },
  {
    input: dedent
    `
    :::

    :::
    `,
    output: `"<div class="block-default"></div>"`
  },
  {
    input: dedent
    `
    :::
    content
    :::
    `,
    output: `"<div class="block-default"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    :::info
    content
    :::
    `,
    output: `"<div class="block-default info"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    :::tip
    content
    :::
    `,
    output: `"<div class="block-default tip"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    :::warning
    content
    :::
    `,
    output: `"<div class="block-default warning"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    :::danger
    content
    :::
    `,
    output: `"<div class="block-default danger"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    :::details
    content
    :::
    `,
    output: `"<details class="block-default details"><p>content</p></details>"`
  },
  {
    input: dedent
    `
    :::details 详情
    content
    :::
    `,
    output: `"<details class="block-default details"><summary class="block-title">详情</summary><p>content</p></details>"`
  },
  {
    input: dedent
    `
    ::: tip
    content
    :::
    `,
    output: `"<div class="block-default tip"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip{.wrap}
    content
    :::
    `,
    output: `"<div class="block-default tip wrap"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip{#box}
    content
    :::
    `,
    output: `"<div class="block-default tip" id="box"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip 提示
    content
    :::
    `,
    output: `"<div class="block-default tip"><p class="block-title">提示</p><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip{.wrap} 提示
    content
    :::
    `,
    output: `"<div class="block-default tip wrap"><p class="block-title">提示</p><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: main
    content
    :::
    `,
    output: `"<main class="block-default"><p>content</p></main>"`
  },
  {
    input: dedent
    `
    ::: main{.wrap}
    content
    :::
    `,
    output: `"<main class="block-default wrap"><p>content</p></main>"`
  },
  {
    input: dedent
    `
    ::: main{.wrap} 标题
    content
    :::
    `,
    output: `"<main class="block-default wrap"><p class="block-title">标题</p><p>content</p></main>"`
  },
  {
    input: dedent
    `
    ::: tip

    content

    :::
    `,
    output: `"<div class="block-default tip"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip
    content

    :::
    `,
    output: `"<div class="block-default tip"><p>content</p></div>"`
  },
  {
    input: dedent
    `
    ::: tip
    content \`npm\`
    :::
    `,
    output: `"<div class="block-default tip"><p>content <code>npm</code></p></div>"`
  }
]

export const mockMdByOptions = [
  {
    input: dedent
    `
    :::tip
    content
    :::
    `,
    output: `"<section class="custom-container tip"><p>content</p></section>"`
  },
  {
    input: dedent
    `
    :::tip 提示
    content
    :::
    `,
    output: `"<section class="custom-container tip"><div class="custom-title">提示</div><p>content</p></section>"`
  },
  {
    input: dedent
    `
    :::tip{.wrap} 提示
    content
    :::
    `,
    output: `"<section class="custom-container tip wrap"><div class="custom-title">提示</div><p>content</p></section>"`
  },
]