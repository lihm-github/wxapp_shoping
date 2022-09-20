import {
  getUserProfile
} from "../../utils/asyncWx.js"

Page({
  // 点击授权登录，触发事件
  async handleGetUserProfile() {
    // 调用写好的请求，获取个人信息，使用res接收返回的结果，它是一个promise
    const res = await getUserProfile({
      desc: "获取用户个人信息",
    })
    // 获取用户头像、昵称
    const userInfo = {
      avatarUrl: res.userInfo.avatarUrl,
      nickName: res.userInfo.nickName
    }
    // 把用户信息进行本地保存
    wx.setStorageSync("userInfo", userInfo);
    wx.navigateBack({
      delta: 1
    })
  }
})