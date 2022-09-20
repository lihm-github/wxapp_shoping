import {
  request
} from "../../request/index"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 传给组件Tabs的数据
    tabs: [{
        id: 0,
        name: "综合",
        isActive: true,
      },
      {
        id: 1,
        name: "销量",
        isActive: false,
      },
      {
        id: 2,
        name: "价格",
        isActive: false,
      },
    ],
    goodsList: [], // 商品列表数组
    defaultImage: '../../images/1.jpg', // 商品没有对应图片时显示的默认图片
  },

  // 写出来防止某些周期函数执行检测到未定义
  QueryParams: { // 向接口发送请求需要的参数
    query: "",
    cid: "",
    pagenum: 1, // 页码
    pagesize: 10 // 一页有10条数据
  },
  TotalPages: 0, // 总页数

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options：获取打开当前页面路径中的参数；当前页面路径中由别的页面跳转时传过来的参数
    this.QueryParams.cid = options.cid || ''
    this.QueryParams.query = options.query || ''
    this.getGoodsList() // 获取商品数据
  },

  // 传给组件Tabs的点击事件处理函数
  handleTap(e) {
    // 拿到子传父，传过来的index
    const {
      index
    } = e.detail
    let tabs = JSON.parse(JSON.stringify(this.data.tabs)) // 转换格式
    // 对满足条件的、不满足条件的，对应的isActive值进行修改；既然显示对应数据
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },

  // 发送异步请求获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    })
    // 获取总页数
    this.TotalPages = Math.ceil(res.total / this.QueryParams.pagesize)
    this.setData({
      // 数组拼接
      goodsList: [...this.data.goodsList, ...res.goods],
    })
    wx.stopPullDownRefresh() // 停止下拉刷新
  },


  /**
   * 页面相关事件处理函数--监听用户下拉动作
   * 下拉刷新
   */
  onPullDownRefresh() {
    // 重置商品列表数组和页码
    this.setData({
      goodsList: [],
      ['QueryParams.pagenum']: 1
    })
    // 重新发起请求获取数据
    this.getGoodsList()
  },

  /**
   * 页面上拉触底事件的处理函数
   * 触底事件
   */
  onReachBottom() {
    // 如果当前页码数，大于等于总页码数，就是没有数据了
    if (this.QueryParams.pagenum >= this.TotalPages) {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000
      })
    } else {
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },

})