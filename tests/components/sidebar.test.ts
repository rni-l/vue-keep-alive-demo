import { ItemType } from './../../src/types';
import { getMenu } from './../../src/config';
import { mount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
import SideBar from '../../src/components/Sidebar.vue'

const list = getMenu()

describe('components/Sidebar.vue', () => {
  test('渲染列表', async () => {
    const dom = mount(SideBar)
    expect(dom.findAll('li').length).toBeGreaterThan(0)
  })

  test('点击 item，触发 go 事件，并获取对应的对象', async () => {
    const dom = mount(SideBar)
    await dom.find('li').trigger('click')
    expect(dom.emitted().go).toHaveLength(1)
    const item =( dom.emitted().go[0][0]) as ItemType
    expect(item.label).toBeTypeOf('string')
    expect(item.value).toBeTypeOf('string')
    expect(item.route).toBeTypeOf('object')
  })
})
