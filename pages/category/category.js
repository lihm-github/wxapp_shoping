import {
  request
} from '../../request/index'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftMenuList: [], // 左侧的菜单数据
    currentIndex: 0, // 当前被点击的菜单索引
    rightContent: [], // 右侧的商品数据
    scrollTo: 0, // 右侧内容滚动条距离顶部的距离；每个选项都有独立的scroll-view区域
    Cates: [], // 接口的返回数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const Cates = wx.getStorageSync('cates') // 先从本地存储中拿取之前存的数据
    const empire = 1000 * 60 * 60 * 24 * 7 // 定义过期时间为一周
    if (!Cates || Date.now() - Cates.time > empire) {
      // 本地存储中没有旧数据、本地存储中的旧数据已经过期；重新发起请求获取新的数据
      this.getCates()
    } else {
      // 本地存储中有旧数据且没有过期；可以直接使用旧数据
      this.Cates = Cates.data
      let leftMenuList = this.Cates.map((v) => v.cat_name)
      let rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent,
      })
    }
  },

  // 左侧菜单点击事件
  handleItemTap(e) {
    const {
      index
    } = e.currentTarget.dataset // 获取从标签中传过来的数据
    let rightContent = this.Cates[index].children // 根据index，获取接口返回数据中对应的右侧数据
    this.setData({
      currentIndex: index, // 把当前点击项的index，赋值给选中index，就有选项效果
      rightContent,
      scrollTo: 0
    })
  },

  // 发送请求获取数据，使用 es6 的 async、await 发送异步请求
  async getCates() {
    // 直接结果返回来的结果
    const result = await request({
      url: "/categories"
    })
    this.Cates = result // 把结果赋值给Cates
    // 调用微信自己的同步方法，存储数据到本地存储中
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })
    let leftMenuList = this.Cates.map(title => title.cat_name) // 造左侧的菜单数据
    let rightContent = this.Cates[0].children // 构造右侧的商品数据
    this.setData({
      leftMenuList,
      rightContent,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})