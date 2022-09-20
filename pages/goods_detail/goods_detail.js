import {
  request
} from "../../request/index.js"

Page({

  data: {
    goodsObj: {}, // 商品详情数据
    isCollected: false // 当前商品是否被收藏
  },

  /**
   * 生命周期函数--监听页面显示
   * 页面显示的时候
   */
  onShow() {
    // 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面。
    const pages = getCurrentPages()
    // 获取页面跳转时，传递过来的参数 goods_id；并转为整型
    let {
      goods_id
    } = pages[pages.length - 1].options
    goods_id = parseInt(goods_id)
    this.getGoodsDetail(goods_id) // 根据 goods_id 发送异步请求获取商品详情数据

    // 判断当前商品是否已经被收藏；从本地存储拿到收藏对应的值
    // 使用数组的some()方法，检测数组中的元素是否满足指定条件；依次执行数组的每个元素
    // 如果有一个元素满足条件，则表达式返回true , 剩余的元素不会再执行检测；
    // 如果没有满足条件的元素，则返回false
    const collect = wx.getStorageSync("collect") || []
    const isCollected = collect.some((v) => v.goods_id === goods_id)
    this.setData({
      isCollected
    })
  },

  // 发送异步请求获取商品详情数据；根据商品id
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: "/goods/detail",
      data: {
        goods_id,
      },
    })
    this.setData({
      goodsObj: {
        goods_id: goodsObj.goods_id,
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_number: goodsObj.goods_number,
        goods_introduce: goodsObj.goods_introduce,
        goods_small_logo: goodsObj.goods_small_logo,
        pics: goodsObj.pics,
      },
    })
  },

  // 点击轮播图放大预览
  handlePreviewImage(e) {
    // 获取到从页面data-index传过来的当前图片的index
    const {
      index
    } = e.currentTarget.dataset
    // 使用微信提供的图片api，在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作
    wx.previewImage({
      current: this.data.goodsObj.pics[index].pics_mid, // 当前显示图片的链接
      urls: this.data.goodsObj.pics.map((v) => v.pics_mid), // 需要预览的图片链接列表-整个轮播图图片
    })
  },

  // 点击商品收藏
  handleCollect() {
    const collect = wx.getStorageSync('collect') || [] // 从本地获取收藏信息
    if (this.data.isCollected) {
      // 如果收藏有该商品，根据collect中收藏商品id 与当前商品id对比，满足返回true，既0，否侧返回-1
      const index = collect.findIndex(v => v.goods_id === this.data.goodsObj.goods_id)
      // 用于添加或删除数组中的元素；会改变原始数组；这里是删除过滤得到的目标index
      collect.splice(index, 1)
      wx.showToast({
        title: '取消收藏成功',
        icon: 'success',
        mask: true
      })
    } else {
      // 如果没有商品收藏信息，说明没有收藏该商品，这里就是收藏商品
      collect.push(this.data.goodsObj)
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      })
    }
    // 然后进行存储/更新本地商品收藏存储
    wx.setStorageSync('collect', collect)
    this.setData({
      isCollected: !this.data.isCollected
    })
  },

  // 点击加入购物车
  handleAddCart() {
    let cart = wx.getStorageSync("cart") || [] // 从本地获取购物车里面的信息
    // 判断当前商品是否已经存在于购物车中，存在就是true，既index为0，否侧为-1
    let index = cart.findIndex(
      (v) => v.goods_id === this.data.goodsObj.goods_id
    )
    if (index === -1) {
      // 不存在于购物车中
      // 构造一个新的商品对象，将其添加到购物车中
      let newGoodObj = {
        goods_id: this.data.goodsObj.goods_id, // 商品 ID
        goods_name: this.data.goodsObj.goods_name, // 商品名称
        goods_price: this.data.goodsObj.goods_price, // 商品价格
        goods_number: this.data.goodsObj.goods_number, // 商品数量
        goods_small_logo: this.data.goodsObj.goods_small_logo, // 商品小图标
        num: 1, // 初始数量为 1
        checked: true, // 选中状态 默认为 true
      }
      cart.push(newGoodObj) // 往购物车中添加该商品
    } else {
      // 存在于购物车中；商品数量 +1；这里索引index为0，既第一个元素既为该商品goodsObj
      cart[index].num++
    }
    wx.setStorageSync("cart", cart) // 把购物车信息进行存储到本地
    wx.showToast({
      title: "添加成功",
      icon: "success",
      mask: true,
    })
  },
})