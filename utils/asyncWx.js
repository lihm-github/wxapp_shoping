// 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 显示模态对话框
export const showModal = ({
  content
}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: "提示",
      content: content,
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}

// 显示消息提示
export const showToast = ({
  title
}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: "none",
      success: (res) => {
        resolve(res)
      },
      fail: (err) => {
        reject(err)
      },
    })
  })
}