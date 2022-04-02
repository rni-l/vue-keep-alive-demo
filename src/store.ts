import { defineStore } from 'pinia'
import { TabType } from './types'


export const commonStore = defineStore('common', {
  state: (): ({
    activeTabValue: string
    cacheRouteView: TabType[]
  }) => ({
    activeTabValue: '',
    cacheRouteView: []
  }),

  actions: {
    updateVal(val: string) {
      this.activeTabValue = val
    },
    addRouteView(val: TabType) {
      if (!this.cacheRouteView.find(v => v.value === val.value)) {
        this.cacheRouteView = [
          ...this.cacheRouteView,
          val
        ]
      }
    },
    removeRouteView(val: TabType) {
      this.cacheRouteView = this.cacheRouteView.filter(v => v.value !== val.value)
    },
    checkAndRemoveByComName(comName: string) {
      const matchNum = this.cacheRouteView.reduce((acc, v) => {
        if (v.comName === comName) {
          acc += 1
        }
        return acc
      }, 0)
      if (matchNum === 1) {
        this.cacheRouteView = this.cacheRouteView.filter(v => v.comName !== comName)
      }
    }
  },

  getters: {
    getKeepAliveIncludes: state => [...(new Set(state.cacheRouteView.map(v => v.comName)))]
  }
})