import {
  chooseAddress,
  showModal,
  showToast
} from '../../utils/asyncWx.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {}, // 收货地址
    cart: [], // 购物车数据，从本地存储拿取
    allChecked: false, // 全选的状态
    ttotalPrice: 0, // 商品总价格
    totalNum: 0, // 商品总数量
  },

  /**
   * 生命周期函数--监听页面显示
   * 页面显示
   */
  onShow() {
    // 页面一显示，先从本地获取对应数据
    const address = wx.getStorageSync("address") || {} // 收货地址数据
    const cart = wx.getStorageSync("cart") || [] // 购物车数据
    this.setCart(cart) // 调用设置购物车方法，把拿到的数据传给该方法
    this.setData({
      address
    })
  },

  // 点击添加收货地址触发的事件
  async handleChooseAddress() {
    try {
      // 调用导入进来的api，由微信提供，原生地址输入框，返回的是填写内容的信息对象
      let address = await chooseAddress()
      // 把地址信息对象，每个项进行拼接，然后把address数据同步存储到本地
      address.all =
        address.provinceName +
        address.cityName +
        address.countyName +
        address.detailInfo
      wx.setStorageSync("address", address)
    } catch (error) {
      console.error(error)
    }
  },

  // 点击每一种商品复选框的事件处理函数；既勾选商品复选框事件
  handleItemChange(e) {
    // 获取到data-id传入进来的商品id
    const {
      id
    } = e.currentTarget.dataset
    let cart = JSON.parse(JSON.stringify(this.data.cart)) // 把购物车数据格式化
    // 获取当前点击的商品在购物车数组中的索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 对点击的商品的选中状态取反
    cart[index].checked = !cart[index].checked
    // 重新设置回缓存中，既把新数据存储或本地中
    wx.setStorageSync('cart', cart)
    this.setCart(cart) // 同时调用设置购物车方法
  },

  // 点击底部，全选/全不选的事件处理函数
  handleCheckAll() {
    let cart = JSON.parse(JSON.stringify(this.data.cart)) // 格式化购物车数据
    cart.forEach((v) => v.checked = !this.data.allChecked) // 循环购物车中所有商品的checked取反值
    wx.setStorageSync("cart", cart) // 又从新把修改后的新数据替换旧数据
    this.setCart(cart) // 同时调用设置购物车方法
  },

  // 点击商品数量加/减的事件处理函数
  async handleChangeNumber(e) {
    // 拿到当前商品的id，和加减的标识operation（1/-1）
    const {
      operation,
      id
    } = e.currentTarget.dataset
    let cart = JSON.parse(JSON.stringify(this.data.cart)) // 格式化购物车数据
    // 获取当前点击的商品在购物车数组中的索引
    const index = cart.findIndex((v) => v.goods_id === id)
    // 如果当前商品数量是1，和点击了减少一个商品的事件
    if (cart[index].num <= 1 && operation === -1) {
      // 调用微信提供的api，弹出一个模态框提示；返回一个信息对象confirm
      const res = await showModal({
        content: "确定删除该商品？"
      })
      // 返回的是确定的信息对象
      if (res.confirm) {
        cart.splice(index, 1) // 删除购物车对应索引对应的商品
        wx.setStorageSync("cart", cart) // 把新数据替换旧数据存回本地
        this.setCart(cart) // 同时调用设置购物车方法
      }
    } else {
      // 不是减，就是加一个商品的事件
      cart[index].num += operation // 在原数量基础上加1，因为operation标识就是1
      wx.setStorageSync("cart", cart) // 把新数据替换旧数据存回本地
      this.setCart(cart) // 同时调用设置购物车方法
    }
  },

  // 点击结算的事件处理函数
  async handlePay() {
    // 如果地址中没有用户名，就是没有填收货地址，返回假，取反就是真
    if (!this.data.address.userName) {
      await showToast({
        title: '您还没有选择收货地址！'
      })
      return;
    }
    // 如果商品总数量不存在，就是没有选商品，返回假，取反就是真
    if (!this.data.totalNum) {
      await showToast({
        title: "您还没有选购商品！"
      })
      return
    }
    // 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },

  // 计算商品的全选状态、总价格和总数量；把购物车数据信息对象传入进来
  setCart(cart) {
    // 计算全选状态，购物车是否有数据
    const allChecked = cart.length ? cart.every((v) => v.checked) : false
    // 计算商品的总价格和总数量
    // reduce 为数组中的每一个元素依次执行回调函数，不包括数组中被删除或从未被赋值的元素
    // 接受四个参数：初始值（或者上一次回调函数的返回值），当前元素值，当前索引，调用 reduce 的数组
    // 后面设置的0，既为初始值
    const totalPrice = cart.reduce((previous, current) => {
      return (
        // 根据判断该商品是否被选中而计算价格
        previous + (current.checked ? current.goods_price * current.num : 0)
      )
    }, 0)
    const totalNum = cart.reduce((previous, current) => {
      // 同上
      return previous + (current.checked ? current.num : 0)
    }, 0)
    // 更新data中的数据
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum,
    })
  }
})