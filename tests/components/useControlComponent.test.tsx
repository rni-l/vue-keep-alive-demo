import { afterEach, beforeEach, describe, expect, test, vi, } from "vitest";
import { defineComponent, KeepAlive, nextTick, onActivated, onDeactivated, onMounted, onUnmounted, PropType, reactive, ref, watch } from "vue";
import { mount } from '@vue/test-utils'
import useControlComponent from '../../src/useControlComponent'
import eventbus from "../../src/eventbus";
const componentName = 'com'
const getCom = () => {
  return defineComponent({
    name: componentName,
    props: {
      comKey: String
    },
    emits: ['mount', 'unmount', 'active', 'unactive'],
    setup(props, {emit}) {
      const { key, isRefresh} = useControlComponent(props.comKey)
      onMounted(() => {
        emit('mount')
      })
      onActivated(() => {
        // console.log('1 onActivated');
        emit('active')
      })
      onDeactivated(() => {
        // console.log('onDeactivated');
        emit('unactive')
      })
      onUnmounted(() => {
        emit('unmount')
      })
      return () => (
        <div class="com" com-key={props.comKey}>
          <span class="key">{ key.value }</span>
          <span class="refresh">{ isRefresh.value ? 'true' : 'false' }</span>
        </div>
      )
    }
  })
}
const getKeepAlive = (tetsConfig?: Record<string, any>) => {
  const CustomCom = getCom()
  return defineComponent({
    components: { CustomCom },
    props: {
      isShowCom: { type: Boolean, default: true },
      include: {
        type: Array as PropType<string[]>,
        default: () => [componentName]
      },
      multiple: {
        type: Array as PropType<{ show: boolean, key: string }[]>,
        default: () => [],
      }
    },
    emits: ['mount', 'unmount', 'active', 'unactive'],
    setup(props, { emit }) {
      const getEvent = (e: string) => {
        // @ts-ignore
        emit(e)
      }

      watch(() => props.multiple, () => {
      }, { deep: true })
      return () => (
        <KeepAlive>
          {/* 测试多个 */}
          { props.multiple.length ? (
            props.multiple[0].show ? <custom-com
                key={props.multiple[0].key}
                com-key={props.multiple[0].key}
                ref={`ref_${props.multiple[0].key}`}
                onMount={() => getEvent('mount')}
                onUnmount={() => getEvent('unmount')}
                onActive={() => getEvent('active')}
                onUnactive={() => getEvent('unactive')}
              ></custom-com>
              : <custom-com
                key={props.multiple[1].key}
                com-key={props.multiple[1].key}
                ref={`ref_${props.multiple[1].key}`}
                onMount={() => getEvent('mount')}
                onUnmount={() => getEvent('unmount')}
                onActive={() => getEvent('active')}
                onUnactive={() => getEvent('unactive')}
              ></custom-com>
          ):
            // 测试单个
            (
              props.isShowCom ? <custom-com
                com-key={tetsConfig.comKey}
                onMount={() => getEvent('mount')}
                onUnmount={() => getEvent('unmount')}
                onActive={() => getEvent('active')}
                onUnactive={() => getEvent('unactive')}
              ></custom-com> : undefined
            )
          }
        </KeepAlive>
      )
    }
  })
}

describe('useControlComponent.ts', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    eventbus.events = {}
  })
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()

  })
  test('返回一个 key', () => {
    const com = mount(getCom(), { props: { comKey: 'ok' } })
    expect(com.find('.key').text().length).toBeGreaterThan(0)
  })

  test('使用 eventbus 发送 remove 事件后，当 comKey 一致时，会修改组件的 isRefresh 为 true', async () => {
    const com = mount(getCom(), { props: { comKey: 'ok' } })
    eventbus.emit('remove', 'ok1')
    await nextTick()
    expect(com.find('.refresh').text()).toBe('false')
    eventbus.emit('remove', 'ok')
    await nextTick()
    expect(com.find('.refresh').text()).toBe('true')
  })

  test('使用 eventbus 发送 remove 事件后，当 comKey 一致 && 触发 onActivated 事件时，会刷新 key，并设置 isRefresh 为 false', async () => {
    const com = mount(getKeepAlive({ comKey: 'ok' }))
    expect(com.find('.com').exists()).toBeTruthy()
    let oldKey = com.find('.key').text()
    expect(com.find('.refresh').text()).toBe('false')
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,1))
    expect(com.find('.com').exists()).not.toBeTruthy()
    await com.setProps({ isShowCom: true })
    expect(com.find('.refresh').text()).toBe('false')
    expect(com.find('.key').text()).not.toEqual(oldKey)
    // 第二次
    oldKey = com.find('.key').text()
    expect(com.find('.refresh').text()).toBe('false')
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,2))
    expect(com.find('.com').exists()).not.toBeTruthy()
    await com.setProps({ isShowCom: true })
    expect(com.find('.refresh').text()).toBe('false')
    expect(com.find('.key').text()).not.toEqual(oldKey)
    const emitted = com.emitted()
    expect(emitted.mount.length).toBe(1)
    expect(emitted.unmount).toBeUndefined()
    expect(emitted.active.length).toBe(3)
    expect(emitted.unactive.length).toBe(2)
  })

  test('触发更新流程，当卸载组件时，触发 unmount 事件', async () => {
    const com = mount(getKeepAlive({ comKey: 'ok' }))
    let oldKey = com.find('.key').text()
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,1))
    await com.setProps({ isShowCom: true })
    expect(com.find('.key').text()).not.toEqual(oldKey)
    // 第二次
    oldKey = com.find('.key').text()
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,2))
    await com.setProps({ isShowCom: true })
    await nextTick()
    expect(com.find('.key').text()).not.toEqual(oldKey)
    // 移除缓存，触发 unmount 事件
    await com.setProps({
      include: [],
      isShowCom: false
    })
    expect(com.find('.com').exists()).not.toBeTruthy()
    const emitted = com.emitted()
    expect(emitted.mount.length).toBe(1)
    expect(emitted.active.length).toBe(3)
    expect(emitted.unactive.length).toBe(3)
    expect(emitted.unmount.length).toBe(1)
  })

  test('卸载组件时，会移除 eventbus 订阅的事件', async () => {
    const com = mount(getKeepAlive({ comKey: 'ok' }))
    expect(eventbus.events.remove.length).toBe(1)
    let oldKey = com.find('.key').text()
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,1))
    await com.setProps({ isShowCom: true })
    expect(com.find('.key').text()).not.toEqual(oldKey)
    // 第二次
    oldKey = com.find('.key').text()
    eventbus.emit('remove', 'ok')
    await com.setProps({ isShowCom: false })
    vi.setSystemTime(new Date(2000,1,1,2))
    await com.setProps({ isShowCom: true })
    expect(com.find('.key').text()).not.toEqual(oldKey)
    // 移除缓存，触发 unmount 事件
    await com.setProps({
      include: [],
      isShowCom: false
    })
    const emitted = com.emitted()
    expect(emitted.unmount.length).toBe(1)
    expect(eventbus.events.remove.length).toBe(0)
  })

  describe('测试缓存多个同组件', () => {
    const state = reactive<{
      list: { show: boolean, key: string }[]
    }>({
      list: []
    })

    beforeEach(() => {
      state.list = [
        { show: true, key: 'a1' },
        { show: true, key: 'a2' }
      ]
    })

    test('渲染多个组件', () => {
      const com = mount(getKeepAlive(), {
        props: {
          multiple: state.list
        }
      })
      expect(com.findComponent({ ref: `ref_${state.list[0].key}` }).props().comKey).toBe(state.list[0].key)
      expect(com.findComponent({ ref: `ref_${state.list[1].key}` }).props().comKey).toBe(state.list[1].key)
    })

    test.only('渲染 a1 和 a2 组件；各切换一次 show 状态，分别触发 mount, activated, unactivated 事件', async () => {
      const com = mount(getKeepAlive(), {
        props: {
          multiple: state.list,
          include: [componentName]
        }
      })
      // 处理 a1
      const a1Key = state.list[0].key
      let a1 = com.findComponent({ ref: `ref_${a1Key}` })
      let oldKey1 = a1.find('.key').text()
      eventbus.emit('remove', a1Key)
      // 隐藏
      state.list[0].show = false
      await com.setProps({ multiple: state.list })
      a1 = com.findComponent({ ref: `ref_${a1Key}` })
      expect(a1.exists()).not.toBeTruthy()
      vi.setSystemTime(new Date(2000,1,1,1))
      // 显示
      state.list[0].show = true
      await com.setProps({ multiple: state.list })
      a1 = com.findComponent({ ref: `ref_${a1Key}` })
      expect(a1.find('.key').text()).not.toEqual(oldKey1)
      const emitted1 = a1.emitted()
      expect(emitted1.mount.length).toBe(1)
      expect(emitted1.active.length).toBe(2)
      expect(emitted1.unactive.length).toBe(1)
      expect(emitted1.unmount).toBeUndefined()
      // 处理 a2
      const a2Key = state.list[1].key
      // 显示
      state.list[0].show = false
      await com.setProps({ multiple: state.list })
      let oldKey2 = com.findComponent({ ref: `ref_${a2Key}` }).find('.key').text()
      eventbus.emit('remove', a2Key)
      // 隐藏
      state.list[0].show = true
      await com.setProps({ multiple: state.list })
      expect(com.findComponent({ ref: `ref_${a2Key}` }).exists()).not.toBeTruthy()
      // 显示
      state.list[0].show = false
      await com.setProps({ multiple: state.list })
      expect(com.findComponent({ ref: `ref_${a2Key}` }).find('.key').text()).not.toEqual(oldKey2)
      const emitted2 = com.findComponent({ ref: `ref_${a2Key}` }).emitted()
      expect(emitted2.mount.length).toBe(1)
      expect(emitted2.active.length).toBe(3)
      expect(emitted2.unactive.length).toBe(2)
      expect(emitted2.unmount).toBeUndefined()
    })
  })
})
