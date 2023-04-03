import { defineStore } from 'pinia'

// 定义一个Store，名称要保证全局唯一
export const useCounterStore = defineStore('counterStore', {

  // 全局的状态
  state: () => {
    return {
      counter: 0
    }
  },

  // Actions 相当于组件中的 methods。 它们可以使用 defineStore() 中的 actions 属性定义，并且它们非常适合定义业务逻辑：
  actions: {

    /**counter值增加1 */
    increment() {
      console.log("actions方法改变state的值");
      this.counter++
    },

    /**模拟异步等待2秒后加100 */
    async add100(): Promise<number> {
      const result = <number>await new Promise((resove) => {
        setTimeout(() => {
          resove(100)
        }, 2000)
      })

      this.counter += result
      return this.counter
    }
  },

  // Getter 完全等同于 Store 状态的 计算值
  getters: {

    /**计算counter*2并返回 */
    doubleCounter(): number {
      return this.counter * 2
    }
  }

})
