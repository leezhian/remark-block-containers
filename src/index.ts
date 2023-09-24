import { visit, type Visitor, type VisitorResult } from 'unist-util-visit'
import { findAfter } from 'unist-util-find-after'
import { findAllBetween } from 'unist-util-find-between-all'
import { nanoid } from 'nanoid'
import type { Transformer, Plugin } from 'unified'
import type { Paragraph, Root, Text, Parent, Data, RootContent } from 'mdast'

export interface BlockContainersOptions {
  containerClass?: string
  containerType?: string
  titleType?: string
  titleClass?: string
}

export interface Params {
  title?: string
  type?: string
  alias: string
  props: Data
}

export interface NodeData extends Data {
  className?: string[]
  id?: string
  [key: string]: any
}

// 默认配置
const settings: BlockContainersOptions = {
  containerClass: 'block-default',
  containerType: 'div',
  titleType: 'div',
  titleClass: 'block-title',
}

const TAGS_ALIAS = ['info', 'tip', 'warning', 'danger', 'details', 'code-group'] // 标签别名

export const PARAM_REG = /([A-Za-z0-9_-]+)(\{([\.|#])(\w+)\})?/iu
export const CONTAINER_START = /^:{3}\s*([A-Za-z0-9_-]+)?(\{([\.|#])(\w+)\})?(\s.+)?/i
export const CONTAINER_END = /\s*\n*?:{3}$/
export const BAD_CONTAINER_REG = /^(:{3})\s*\n+\s*(:{3})\s*.*/

/**
 * @description: 创建标题元素
 * @param {string} title 标题
 * @param {string} type 标签类型
 * @return {Paragraph}
 */
function createTitle(title: string, type = settings.titleType): Paragraph {
  // remark 关于一些 hast 知识 https://unifiedjs.com/explore/package/mdast-util-to-hast/
  return {
    type: 'paragraph',
    children: [{ type: 'text', value: title.replace(/\s+/g, ' ') }],
    data: {
      hName: type,
      hProperties: {
        className: [settings.titleClass],
      },
    },
  }
}

/**
 * @description: 创建容器
 * @param {string} type 标签类型
 * @param {object} props 标签属性
 * @param {Array<RootContent>} children 子节点
 * @return {Paragraph}
 */
function createContainer(type: string, props: NodeData, children: Array<RootContent>): any {
  return {
    type: 'container',
    children,
    data: {
      hName: type,
      hProperties: {
        ...props,
        className: [settings.containerClass, ...props.className as Array<string>],
      },
    },
  }
}

/**
 * @description: 创建tabs（仅code-group）
 * @param {RootContent[]} nodes
 * @return {Parent}
 */
function createTabs(nodes: RootContent[]): any {
  const groupName = `group-${nanoid(5)}`
  let checked = 'checked'

  const tabs = nodes.reduce<Array<RootContent>>((ns, node) => {
    if (node.type !== 'code') return ns
    const id = nanoid(7)
    const lang = node.lang ?? ''
    ns.push({
      type: 'paragraph',
      children: [],
      data: {
        hName: 'input',
        hProperties: {
          type: 'radio',
          id: `tab-${id}`,
          name: groupName,
          checked,
        },
      },
    })
    ns.push({
      type: 'paragraph',
      children: [{ type: 'text', value: lang }],
      data: {
        hName: 'label',
        hProperties: {
          for: `tab-${id}`,
        },
      },
    })

    checked = ''
    return ns
  }, [])

  return {
    type: 'container',
    children: tabs,
    data: {
      hName: 'div',
      hProperties: {
        className: ['tabs'],
      },
    },
  }
}

/**
 * @description: 转换 code node
 * @param {RootContent[]} nodes
 * @return {RootContent[]}
 */
function transformCodes(nodes: RootContent[]): any[] {
  let checked = 'checked'
  const blockChildren = nodes.map(node => {
    if (node.type !== 'code') return node

    const lang = node.lang ?? ''
    const classNames = checked ? [`language-${lang}`, 'active'] : [`language-${lang}`]
    checked = ''

    return {
      type: 'container',
      children: [node],
      data: {
        hName: 'div',
        hProperties: {
          className: classNames,
        },
      },
    }
  })

  return [
    {
      type: 'container',
      children: blockChildren,
      data: {
        hName: 'div',
        hProperties: {
          className: ['blocks'],
        },
      },
    },
  ]
}

/**
 * @description: 检查是否是容器
 * @param {Paragraph} node
 * @return {boolean}
 */
function checkIsContainer(node: Paragraph): boolean {
  const firstChildren = node.children[0]
  if (firstChildren.type !== 'text') return false

  const value = firstChildren.value
  if (BAD_CONTAINER_REG.test(value)) return false

  const hasClosing = checkIsCompleteContainerStr(node)

  if( hasClosing && CONTAINER_START.test(value)) {
    return value.includes('\n')
  } else {
    return hasClosing || CONTAINER_START.test(value)
  }
}

/**
 * @description: 判断是否是完整的容器字符串
 * @param {Paragraph} node
 * @return {boolean}
 */
function checkIsCompleteContainerStr(node: Paragraph) {
  const firstChildren = node.children[0] as Text
  const clolonCount = firstChildren.value.match(/:/g)?.length ?? 0
  return CONTAINER_END.test(firstChildren.value) && clolonCount >= 6
}

/**
 * @description: 查找结束节点
 * @param {parent} parent
 * @param {Paragraph} node
 * @return {Paragraph}
 */
function findClosingNode(parent: Parent, node: Paragraph): Paragraph | undefined {
  return findAfter(parent, node, (n: any) => {
    const nodeChildren = n.children

    return (
      n.type === 'paragraph' &&
      CONTAINER_END.test(nodeChildren[nodeChildren.length - 1]?.value)
    )
  }) as Paragraph | undefined
}

/**
 * @description: 解析参数字符串，返回 { title, type, props }
 * @param {string} paramsStr
 * @return {object}
 */
function analyzeParamsString(paramsStr: string): Params {
  let title: string | undefined = undefined
  let type = settings.containerType
  let alias = '' // 别名
  const props: NodeData = {
    className: [],
  }
  if (!paramsStr) {
    return {
      title,
      alias,
      type,
      props,
    }
  }

  // 表示有参数
  const params = paramsStr.split(' ')
  const typeAndProp = params.shift() ?? ''
  // const [typeAndProp, ...titleArr] = paramsStr.split(' ')
  const match = typeAndProp.match(PARAM_REG)
  if (match && match[1]) {
    const lowerCaseType = match[1].toLowerCase()

    if(!TAGS_ALIAS.includes(lowerCaseType) || lowerCaseType === 'details') {
      type = lowerCaseType
    }

    if (TAGS_ALIAS.includes(lowerCaseType)) {
      alias = lowerCaseType
      props.className?.push(lowerCaseType)
    }
  }

  if (match && match[2] && (match[3] === '.' || match[3] === '#')) {
    if (match[3] === '.') {
      props.className?.push(match[4])
    } else if (match[3] === '#') {
      props.id = match[4]
    }
  }

  if(params.length) {
    title = params.join(' ')
  }

  return {
    title,
    type,
    alias,
    props,
  }
}

/**
 * @description: 解析子节点
 * @param {Paragraph} node
 * @return {Params}
 */
function analyzeChild(node: Paragraph): Params {
  const textElement = node.children[0] as Text

  const mainContent = textElement.value
    .replace(/^(:{3})/, '')
    .replace(/(:{3})$/, '') // 移除前后 :::
  if (mainContent.includes('\n')) {
    // 表示换行符前是参数，如 ::: xxx\nxxx\n:::
    const firstLinefeedIndex = mainContent.indexOf('\n')
    textElement.value = mainContent.slice(firstLinefeedIndex)
    const paramsStr = mainContent.slice(0, firstLinefeedIndex).trim()
    return analyzeParamsString(paramsStr)
  } else {
    // 表示剩下的文本都为参数，如 ::: xxx
    const paramsStr = mainContent.trim()
    return analyzeParamsString(paramsStr)
  }
}

/**
 * @description: 解析结束node
 * @param {Paragraph} node
 * @return {boolean}
 */
function analyzeClosingNode(node: Paragraph): boolean {
  const { children } = node

  const lastChild = children[children.length - 1]
  if (lastChild.type === 'text') {
    if (children.length === 1 && lastChild.value === ':::') {
      return true
    }

    lastChild.value = lastChild.value.replace(CONTAINER_END, '')

    if (!lastChild.value) {
      node.children.pop()
    }
  }

  return !children.length
}

const visitor: Visitor<Paragraph, Parent> = (node, index = 0, parent): VisitorResult => {
  if (!parent) return
  if (!checkIsContainer(node)) return
  const completeFlag = checkIsCompleteContainerStr(node)
  const { type, title, props, alias } = analyzeChild(node)

  const containerChildren: RootContent[] = [node]

  if (alias !== 'code-group' && title) {
    const titleNode = createTitle(title, type === 'details' ? 'summary' : settings.titleType)
    containerChildren.unshift(titleNode)
  }

  let deleteCount = 1

  if (!completeFlag) {
    const closingNode = findClosingNode(parent, node)
    if (!closingNode) return

    // completeFlag 为false 并且 含有 \n 进入
    if (!(node.children[0] as Text).value.includes('\n')) {
      containerChildren.pop()
    }

    const closeFlag = analyzeClosingNode(closingNode)
    let originContainerChildren: RootContent[] = findAllBetween(parent as any, node as any, closingNode as any) as RootContent[]

    if (alias === 'code-group') {
      // 代码组需要生成 tabs
      const tabsNode = createTabs(originContainerChildren)
      containerChildren.unshift(tabsNode as Paragraph)
      originContainerChildren = transformCodes(originContainerChildren)
    }
    containerChildren.push(...originContainerChildren)

    if (!closeFlag) {
      containerChildren.push(closingNode)
    }

    // if (!containerChildren.length) return

    const closingIndex = parent.children.indexOf(closingNode)
    deleteCount = closingIndex - index + 1
  }

  const container = createContainer(type ?? '', props, containerChildren)
  parent.children.splice(index, deleteCount, container)
}


const transformer: Transformer<Root> = (tree) => {
  return visit(tree, 'paragraph', visitor)
}

const plugin: Plugin<[BlockContainersOptions?], Root> = (options) => {
  Object.assign(settings, options)

  return transformer
}

export default plugin