import {
  request
} from "../../request/index.js"
import {
  requestPayment,
  showToast
} from "../../utils/asyncWx.js"

Page({
  data: {
    // 收货地址
    address: {},
    // 过滤后的购物车数据
    checkedCart: [],
    // 商品总价格
    totalPrice: 0,
    // 商品总数量
    totalNum: 0,
  },

  onShow() {
    // 获取收货地址和购物车数据；从本地获取
    const address = wx.getStorageSync("address") || {}
    const cart = wx.getStorageSync("cart") || []
    // 对购物车数组进行过滤（只取出其中 checked 属性为 true 的项）
    const checkedCart = cart.filter((v) => v.checked)
    // 计算商品的总价格和总数量
    const totalPrice = checkedCart.reduce((previous, current) => {
      return previous + current.goods_price * current.num
    }, 0)
    const totalNum = checkedCart.reduce((previous, current) => {
      return previous + current.num
    }, 0)
    this.setData({
      address,
      checkedCart,
      totalPrice,
      totalNum,
    })
  },

  // 点击支付的事件处理函数
  async handleOrderPay() {
    try {
      const token = wx.getStorageSync("token") //获取用户token
      if (!token) {
        // 如果不存在token，返回假，取反就是真，跳到授权支付页面
        wx.navigateTo({
          url: "/pages/auth/auth",
        })
        return
      }
      // 1. 发送请求 创建订单 获取订单编号 （注意：这里使用的是伪造的 token）
      // 准备请求体参数
      const data = {
        order_price: this.data.totalPrice,
        consignee_addr: this.data.address.all,
        goods: this.data.checkedCart.map((v) => {
          return {
            goods_id: v.goods_id,
            goods_number: v.num,
            goods_price: v.goods_price,
          }
        }),
      }
      // 发请求获得并创建一个订单，返回数据
      let {
        order_number
      } = await request({
        url: "/my/orders/create",
        method: "POST",
        data,
      })
      // console.log(order_number)
      // 2. 发送请求 获取支付参数
      const {
        pay
      } = await request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        data: {
          order_number,
        },
      })
      // 3. 发起微信支付
      // const res = await requestPayment(pay)
      // console.log(res)
      // 4. 发送请求 查看订单支付状态
      const payStatus = await request({
        url: "/my/orders/chkOrder",
        method: "POST",
        data: {
          order_number,
        },
      })
      // console.log(payStatus)
      // 5. 删除缓存中已经支付了的商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart)
      // 6. 支付成功 弹窗提示并跳转到订单页面
      await showToast({
        title: "支付成功",
      })
      setTimeout(() => {
        // 跳回订单页
        wx.navigateTo({
          url: "/pages/order/order",
        })
      }, 2000);
    } catch (error) {
      await showToast({
        title: '支付失败'
      })
    }
  }
})