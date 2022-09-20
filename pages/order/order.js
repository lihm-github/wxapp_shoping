import {
  request
} from "../../request/index.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [], // 订单信息
    // 床给Tab栏的数据
    tabs: [{
        id: 0,
        name: "全部",
        isActive: true,
      },
      {
        id: 1,
        name: "待付款",
        isActive: false,
      },
      {
        id: 2,
        name: "待发货",
        isActive: false,
      },
      {
        id: 3,
        name: "退款/退货",
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const token = wx.getStorageSync("token") // 订单，要有用户才有订单，获取用户 token
    // 如果本地没有token，返回假，取反就是真，需要跳到auth页面；如果有token就不执行if，执行往下代码
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/auth",
      })
      return
    }
    // 获取小程序的页面栈数组 其中最后一个元素就是为当前页面
    // 根据页面栈数组获取页面跳转所携带过来的参数
    const pages = getCurrentPages()
    const options = pages[pages.length - 1].options
    // 发送请求获取订单列表；1:全部订单 2:待付款 3:待发货
    this.getOrders(parseInt(options.type))
    // 激活选中对应的 tab 栏
    this.changeActivedTab(parseInt(options.type) - 1)
  },

  // 发送请求获取订单列表
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {
        type
      }
    })
    // 获取订单列表数据，更新data中的数据
    this.setData({
      orders: res.orders.map(v => {
        return {
          ...v,
          create_time_format: new Date(v.create_time * 1000).toLocaleString(),
        }
      })
    })
  },

  // 根据页面跳转携带的 type 值激活选中对应的 tab 栏
  changeActivedTab(type) {
    let tabs = JSON.parse(JSON.stringify(this.data.tabs))
    tabs.forEach((v, i) =>
      i === type ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },

  // 标题点击事件的处理函数
  handleTap(e) {
    const {
      index
    } = e.detail
    // 激活选中对应的 tab 栏
    this.changeActivedTab(index)
    // 重新发送请求获取对应的订单列表
    this.getOrders(index + 1)
  },
})