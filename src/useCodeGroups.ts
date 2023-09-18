/*
 * @Author: kim
 * @Date: 2023-09-18 18:38:17
 * @Description: 代码组逻辑(这段代码参考至vitepress)
 */
export function useCodeGroups() {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLInputElement

    if (target.matches('.code-group input')) {
      const group = target.parentElement?.parentElement
      if (!group) return

      const targetIndex = Array.from(group.querySelectorAll('input')).indexOf(target) // 找出对应 target 的 index
      if (targetIndex < 0) return

      const blocks = group.querySelector('.blocks')
      if (!blocks) return

      const currentCodeWrap = Array.from(blocks.children).find((child) => {
        return child.classList.contains('active')
      })

      if (!currentCodeWrap) return

      const nextCodeWrap = blocks.children[targetIndex]
      if (!nextCodeWrap || currentCodeWrap === nextCodeWrap) return

      currentCodeWrap.classList.remove('active')
      nextCodeWrap.classList.add('active')

      const label = group?.querySelector(`label[for="${target.id}"]`)
      label?.scrollIntoView({ block: 'nearest' })
    }
  })
}