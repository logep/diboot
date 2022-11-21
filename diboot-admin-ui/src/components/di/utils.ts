import type { Control, FormItem } from '@/components/di/type'
import type { LinkageControl, RelatedData, RelatedDataOption } from '@/hooks/use-option'

/**
 * 构建选项获取参数
 *
 * @param formItemList 表单元素列表
 * @return RelatedDataOption
 */
export const buildOptionProps = (formItemList?: FormItem[]) => {
  if (!formItemList || !formItemList.length) return {}
  const optionProps = formItemList
    .filter(e => e.type !== 'list-selector')
    .filter(e => e['loader' as keyof typeof e])
    .reduce((option: RelatedDataOption, e) => {
      const loader = e['loader' as keyof typeof e] as string | RelatedData
      if (typeof loader === 'string') {
        const dicts = option.dict ? (option.dict as string[]) : (option.dict = [])
        dicts.push(loader)
      } else if (e['remote' as keyof typeof e] || e['lazy' as keyof typeof e]) {
        const asyncLoad = option.asyncLoad ? option.asyncLoad : (option.asyncLoad = {})
        loader.lazyChild = !!e['lazy' as keyof typeof e]
        asyncLoad[e.prop] = loader as RelatedData
      } else {
        const load = option.load ? option.load : (option.load = {})
        load[e.prop] = loader as RelatedData
      }
      return option
    }, {})
  formItemList
    .filter(e => e.type !== 'list-selector')
    .filter(e => e['control' as keyof typeof e])
    .reduce((option: RelatedDataOption, e) => {
      const control: Control = e['control' as keyof typeof e] as any
      if (!(control.prop && control.condition)) {
        // 未完全配置，则不生效
        return option
      }
      let isAsyncLoad = true
      const asyncLoad = option.asyncLoad ? option.asyncLoad : (option.asyncLoad = {})
      if ((option.load ?? {})[e.prop]) {
        isAsyncLoad = false
        asyncLoad[e.prop] = (option.load ?? {})[e.prop]
        delete (option.load ?? {})[e.prop]
      }
      const linkageControl = option.linkageControl ? option.linkageControl : (option.linkageControl = {})
      const controls = linkageControl[e.prop]
        ? (linkageControl[e.prop] as LinkageControl[])
        : (linkageControl[e.prop] = [])
      controls.push({
        prop: control.prop,
        loader: control.prop,
        condition: control.condition,
        autoLoad: !isAsyncLoad
      })

      return option
    }, optionProps)
  return optionProps
}

// snake_case 转 CamelCase
const line2Hump = (value: string) => value.toLowerCase().replace(/_\w/g, str => str.charAt(1).toUpperCase())

/**
 * 构建获取选项函数
 *
 * @param relatedData
 * @return (prop: FormItem) => LabelValue[]
 */
export const buildGetRelatedData = (relatedData: Record<string, LabelValue[]>) => (prop: FormItem) => {
  const loader = prop['loader' as keyof typeof prop]
  if (!loader) return
  return typeof loader === 'string' ? relatedData[`${line2Hump(loader)}Options`] : relatedData[prop.prop]
}
