import {
  login,
  getUserProfile
} from "../../utils/asyncWx.js"
import {
  request
} from "../../request/index.js"

Page({
  // 授权支付
  async handleGetUserProfile() {
    try {
      // 请求微信获取用户个人信息，用于支付
      const res = await getUserProfile({
        desc: "用于完成商品支付功能"
      })
      // 1. 获取用户信息
      const {
        encryptedData,
        iv,
        signature,
        rawData
      } = res
      // 2. 获取 code，调用了微信提供的login方法api
      const {
        code
      } = await login()
      // 3. 发送请求获取用户 token；把前面获得的信息用户获取用户token
      let {
        token
      } = request({
        url: "/users/wxlogin",
        method: "POST",
        data: {
          encryptedData,
          rawData,
          iv,
          signature,
          code,
        },
      })
      // 由于不是企业账号，不能获取 token，所以这里伪造一个 token
      token =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      // 4. 将 token 存入缓存中并跳转回上一个页面
      wx.setStorageSync("token", token)
      wx.navigateBack({
        delta: 1,
      })
    } catch (error) {
      console.error(error)
    }
  },
})