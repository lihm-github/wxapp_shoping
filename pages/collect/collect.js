Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [], // 商品收藏数组
    defaultImage: "../../images/1.jpg", // 商品没有对应图片时显示的默认图片
    // 需要传递给标签导航Tabs组件的数据
    tabs: [{
        id: 0,
        name: "商品收藏",
        isActive: true,
      },
      {
        id: 1,
        name: "品牌收藏",
        isActive: false,
      },
      {
        id: 2,
        name: "店铺收藏",
        isActive: false,
      },
      {
        id: 3,
        name: "浏览足迹",
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // 获取页面跳转携带过来的参数，根据微信提供的api，获取到所有页面的数据项，最后一个元素是当前页面
    const pages = getCurrentPages()
    const options = pages[pages.length - 1].options // 获取当前页面
    // 激活选中对应的 tab 栏
    this.changeActivedTab(parseInt(options.type) - 1)
    // 获取缓存中的收藏数据
    const collect = wx.getStorageSync("collect") || []
    this.setData({
      collect,
    })
  },

  // 根据页面跳转携带的 type 值激活选中对应的 tab 栏
  changeActivedTab(type) {
    let tabs = JSON.parse(JSON.stringify(this.data.tabs)) // 格式化数据
    // 只有当选选中的tab栏会设为true,选中
    tabs.forEach((v, i) =>
      i === type ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },

  // 标题点击事件的处理函数
  handleTap(e) {
    // 获取子组件传递过来的数据
    const {
      index
    } = e.detail
    // 激活选中对应的 tab 栏
    this.changeActivedTab(index)
  },

})