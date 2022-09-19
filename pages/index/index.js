import {
  request
} from '../../request/index'

Page({
  data: {
    swiperList: [], // 轮播图数组
    cateList: [], // 分类导航数组
    floorList: [] // 楼层数组
  },

  onLoad() {
    this.getSwiperList() // 调用获取轮播图数据方法
    this.getCateList() // 调用获取分类导航数据方法
    this.getFloorList() // 调用获取楼层数据方法
  },

  // 获取轮播图数据
  getSwiperList() {
    request({
      url: '/home/swiperdata'
    }).then((result) => {
      // 因为是一个Promise对象，调用成功后会自动到这个then中来，把返回的数据传到这里；
      // 在 request 封装中，已经把外层的data帮去除掉，直接返回的就是所需数据
      this.setData({
        swiperList: result,
      })
    })
  },

  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    }).then(result => {
      this.setData({
        cateList: result
      })
    })
  },

  // 获取楼层数据
  getFloorList() {
    request({
      url: "/home/floordata",
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  }
})