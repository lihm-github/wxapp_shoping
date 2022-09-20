// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, // 用户信息
    collectedNum: 0 // 收藏的商品数量
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    const userInfo = wx.getStorageSync("userInfo") // 直接在本地进行获取用户信息
    const collect = wx.getStorageSync('collect') || [] // 拿取本地的收藏信息
    this.setData({
      userInfo,
      collectedNum: collect.length
    })
  },
})