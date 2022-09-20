import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchedGoodsList: [], // 搜索到的商品数组
    isFocus: false, // 取消按钮是否显示
    iptValue: '' // 输入框的值
  },

  timer: null, // 定时器，唯一标识，防抖

  // 输入框的值发生改变就会触发的事件；监听到输入框的值发生改变
  handleInput(e) {
    const query = e.detail.value // 获取输入框的值
    if (!query.trim()) {
      // 如果输入框没有值，或者输入了空格，一判断就是没有值，返回假，取反就是真
      this.setData({
        searchedGoodsList: [],
        isFocus: false,
      })
      return
    }
    this.setData({
      isFocus: true,
    })
    // 清除定时器
    if (this.timer) {
      clearTimeout(this.timer)
    }
    // 发送请求获取商品数据
    this.timer = setTimeout(() => {
      this.qsearch(query)
    }, 1000)
  },

  // 根据参数字符串发送请求获取搜索到的商品数据
  async qsearch(query) {
    const res = await request({
      url: "/goods/qsearch",
      data: {
        query,
      },
    })
    this.setData({
      searchedGoodsList: this.data.isFocus ? res : [],
    })
  },

  // 点击取消按钮触发的事件
  handleCancel() {
    this.setData({
      searchedGoodsList: [],
      isFocus: false,
      iptValue: ''
    })
  }
})