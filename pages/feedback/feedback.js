Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 传给子组件的数据
    tabs: [{
        id: 0,
        name: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        name: "商品、商家投诉",
        isActive: false,
      },
    ],
    tabBgColor: "#fff", // tab 栏背景颜色
    imgPathArr: [], // 用户选择的图片路径数组
    txtValue: "", // 文本域中的值
  },

  UploadImgs: [], // 外网的图片路径数组

  // 标题点击事件的处理函数；既点击顶部 tab栏触发事件
  handleTap(e) {
    // 拿到点击的tab栏对应的index，这里只是修改了对应的选中效果isActive
    const {
      index
    } = e.detail
    let tabs = JSON.parse(JSON.stringify(this.data.tabs))
    tabs.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    )
    this.setData({
      tabs,
    })
  },

  // 点击 “+” 号选择图片触发的事件监听函数
  handleChooseImgs() {
    // 调用微信提供的aip：拍摄或从手机相册中选择图片或视频
    wx.chooseMedia({
      count: 9, // 最多可以选择的文件个数
      mediaType: ["image", "video"], // 文件类型
      source: ["album", "camera"], // 图片和视频选择的来源；从相册选择、使用相机拍摄
      maxDuration: 30, // 拍摄视频最长拍摄时间，单位秒
      camera: "back", // 仅在 sourceType 为 camera 时生效，使用前置front或后置back摄像头
      success: (res) => { // 接口调用成功的回调函数
        // 	tempFiles：本地临时文件列表
        // 	tempFilePath：本地临时文件路径 (本地路径)
        const imgPathArr = res.tempFiles.map((v) => v.tempFilePath)
        this.setData({
          imgPathArr: [...this.data.imgPathArr, ...imgPathArr],
        })
      },
    })
  },

  // 点击 icon 删除图片
  handleDeleteImg(e) {
    // 获取被点击图片的索引
    const {
      index
    } = e.currentTarget.dataset
    let imgPathArr = JSON.parse(JSON.stringify(this.data.imgPathArr))
    imgPathArr.splice(index, 1) // 删除对应的索引的图片
    this.setData({
      imgPathArr,
    })
  },

  // 文本域中的值发生改变就会触发的事件
  handleTxtInput(e) {
    this.setData({
      txtValue: e.detail.value,
    })
  },

  // 点击提交按钮触发的事件
  handleFormSubmit() {
    // 获取文本域的内容和图片数组
    const {
      imgPathArr,
      txtValue
    } = this.data
    // 合法性验证，有没有输入内容值
    if (!txtValue.trim()) {
      wx.showToast({
        title: "输入不合法",
        icon: "none",
        mask: true,
      })
      return
    }
    // 调用微信提供的api，提示消息
    wx.showLoading({
      title: "提交中",
      mask: true,
    })
    // 判断是否有图片，有就上传到服务器
    if (imgPathArr.length) {
      // 遍历图片数组，挨个上传至服务器，从而获取外网链接
      imgPathArr.forEach((v, i) => {
        // 调用微信提供的api：将本地资源上传到服务器
        // 客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
        wx.uploadFile({
          url: "https://img.coolcr.cn/api/upload",
          filePath: v,
          name: "image",
          success: (res) => {
            // 上传成功后, 返回的数据是图片的地址
            this.UploadImgs.push(JSON.parse(res.data).data.url)
            // 判断所有文件是否都上传成功
            if (this.data.imgPathArr.length === this.UploadImgs.length) {
              wx.hideLoading({
                success: () => {
                  wx.showToast({
                    title: "提交成功",
                    icon: "success",
                    mask: true,
                  })
                },
              })
              // 将外网图片路径数组和文本域内容提交到后台 这里用 log 来模拟
              console.log({
                status: "成功",
                msg: "提交了外网图片路径数组和文本域内容",
              })
              // 重置页面状态
              this.setData({
                imgPathArr: [],
                txtValue: "",
              })
              // 返回上一级页面
              wx.navigateBack({
                delta: 1,
              })
            }
          },
        })
      })
    } else {
      // 关闭提示消息效果
      wx.hideLoading({
        success: () => {
          wx.showToast({
            title: "提交成功",
            icon: "success",
            mask: true,
          })
        },
      })
      console.log({
        status: "成功",
        msg: "仅提交了文本域内容",
      })
      this.setData({
        txtValue: "",
      })
      wx.navigateBack({
        delta: 1,
      })
    }
  },
})