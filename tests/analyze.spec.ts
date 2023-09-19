import { mockNodeChild } from './test-case.mock'
import { BAD_CONTAINER_REG, CONTAINER_START, CONTAINER_END, PARAM_REG, type Params, type NodeData } from '../src'


interface NodeChild {
  type: string
  value?: string
}

const TAGS_ALIAS = ['info', 'tip', 'warning', 'danger', 'code-group']

function mockCheckIsCompleteContainerStr(node: NodeChild) {
  const firstChildren = node
  const clolonCount = (firstChildren.value ?? '').match(/:/g)?.length ?? 0
  return CONTAINER_END.test(firstChildren.value ?? '') && clolonCount >= 6
}

const mockCheckIsContainer = (node: NodeChild) => {
  const firstChildren = node
  if (firstChildren.type !== 'text') return false

  const value = firstChildren.value!
  if (BAD_CONTAINER_REG.test(value)) return false

  const hasClosing = mockCheckIsCompleteContainerStr(node)
  if (hasClosing && CONTAINER_START.test(value)) {
    return value.includes('\n');
  }
  else {
    return hasClosing || CONTAINER_START.test(value);
  }
}

function mockAnalyzeParamsString(paramsStr: string): Params {
  let title: string | undefined = undefined
  let type = 'div'
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
  const match = typeAndProp.match(PARAM_REG)
  if (match && match[1]) {
    const lowerCaseType = match[1].toLowerCase()

    if (TAGS_ALIAS.includes(lowerCaseType)) {
      alias = lowerCaseType
      props.className?.push(lowerCaseType)
    } else {
      type = lowerCaseType
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
function mockAnalyzeChild(node: NodeChild): Params {
  // 因为在正式代码中有前置判断，肯定是 text 元素
  const mainContent = node.value!
    .replace(/^(:{3})/, '')
    .replace(/(:{3})$/, '') // 移除前后 :::
  if (mainContent.includes('\n')) {
    // 表示换行符前是参数，如 ::: xxx\nxxx\n:::
    const firstLinefeedIndex = mainContent.indexOf('\n')
    const paramsStr = mainContent.slice(0, firstLinefeedIndex).trim()
    return mockAnalyzeParamsString(paramsStr)
  } else {
    // 表示剩下的文本都为参数，如 ::: xxx
    const paramsStr = mainContent.trim()
    return mockAnalyzeParamsString(paramsStr)
  }
}

describe('checkIsContainer test', () => {
  mockNodeChild.forEach(item => {
    const node = item.input
    test(`checkIsContainer type: ${node.type} value: ${node.value}`, () => {
      expect(mockCheckIsContainer(node)).toBe(item.output)
    })
  })
})

describe('analyzeParamsString test', () => {
  mockNodeChild.forEach(item => {
    if (!item.output) return
    const node = item.input
    test(`analyzeParamsString type: ${node.type} value: ${node.value}`, () => {
      expect(mockAnalyzeChild(node)).toEqual(item.paramsOutput)
    })
  })
})