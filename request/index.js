let ajaxTimes = 0 // 同时发送异步请求的次数
export const request = (params) => {
  // 判断 url 中是否带有 "/my/"，有则加上请求头 Authorization: token
  // 拿到请求头
  let header = {
    ...params.header
  }
  if (params.url.includes('/my/')) {
    // 给请求头添加token
    header['Authorization'] = wx.getStorageSync('token') // 调用微信提供的api，是同步接口
  }

  ajaxTimes++
  // 定义公共的 url，每次发api请求，都会拼接：公共url + 请求传过来的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"

  return new Promise((resolve, reject) => {
    // 加载效果
    wx.showLoading({
      title: "加载中...",
      mask: true
    })
    // 请求
    wx.request({
      ...params, // 把所有参数解构出来
      header,
      url: baseUrl + params.url,
      success: (result) => {
        // 接口调用成功回调函数，message就是我们需要的数据，与它同级的meta是状态码，具体看开发文档
        resolve(result.data.message)
      },
      fail: (err) => {
        // 错误时，抛出错误
        reject(err)
      },
      complete: () => {
        // 无论成功还是失败，都会执行这个箭头函数
        ajaxTimes--
        if (ajaxTimes === 0) {
          wx.hideLoading() // 所有请求都结束时
        }
      }
    })
  })
}