import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import remarkBlockContainers from '../src'
import { mockMd, mockMdByOptions } from './test-case.mock'

const defaultCompiler = unified()
  .use(remarkParse)
  .use(remarkBlockContainers)
  .use(remarkRehype)
  .use(rehypeStringify)

const optionCompiler = unified()
  .use(remarkParse)
  .use(remarkBlockContainers, {
    titleClass: 'custom-title',
    titleType: 'div',
    containerClass: 'custom-container',
    containerType: 'section'
  })
  .use(remarkRehype)
  .use(rehypeStringify)

const process = async (compiler: any, contents: string): Promise<string> => {
  const file = await compiler.process(contents)
  return String(file.value).replace('\n', '')
};

describe('analyze', () => {
  mockMd.forEach(item => {
    test(`test input ${item.input}`, async () => {
      expect(await process(defaultCompiler, item.input)).toMatchInlineSnapshot(item.output,);
    })
  })
})

describe('test options', () => {
  mockMdByOptions.forEach(item => {
      test(`test options input ${item.input}`, async () => {
      expect(await process(optionCompiler, item.input)).toMatchInlineSnapshot(item.output,);
    })
  })
})
