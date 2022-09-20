Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 此处接收调用该组件时传过来的数据，既调用时写的属性+值，既是传过来的数据
    tabs: {
      type: Array,
      value: []
    },
    tabBgColor: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 组件里面的处理事件函数，接收到了传过来的data-index
    handleItemTap(e) {
      // 拿到当前项索引
      const {
        index
      } = e.currentTarget.dataset
      // 子传父；相当提醒父组件去调用Tap绑定事件(bindtap/bind:tap)，并把index值传过去；相当vue中的$emit()
      this.triggerEvent('tap', {
        index
      })
    }
  }
})