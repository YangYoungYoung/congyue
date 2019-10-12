// pages/shopApply/shopApply.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    email: '',
    images: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // url = network.API_URL;
    // console.log('url:', url);
  },

  //获取姓名
  nameInput: function(event) {
    this.setData({
      name: event.detail.value
    })
  },

  //获取手机号
  phoneInput: function(event) {
    this.setData({
      phone: event.detail.value
    })
  },
  //获取邮箱
  emailInput: function(event) {
    this.setData({
      email: event.detail.value
    })
  },
  //上传正面身份证照片
  chooseImageFront: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let imageFrontPath = res.tempFilePaths[0];
        let images = that.data.images;
        // console.log(imageFrontPath);
        images.push(imageFrontPath);
        that.setData({
          images: images,
          imageFrontPath: imageFrontPath
        })

      }
    })
  },
  //上传营业执照
  chooseCertificate: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let certificate = res.tempFilePaths[0];
        let images = that.data.images;
        images.push(certificate);
        that.setData({
          certificate: certificate,
          images: images
        })
        // console.log(certificate);
      }
    })
  },
  //上传
  uploadFile: function() {
    let that = this;
    let phone = that.data.phone;
    let name = that.data.name;
    let email = that.data.email;
    let images = that.data.images
    // console.log('phone', phone);
    // console.log('name', name);
    let userId = wx.getStorageSync('userId');
    // console.log('userId', userId);
    if (phone.length == 0) {
      common.showTip('请输入正确手机号', 'loading');
      return
    }
    if (name.length == 0) {
      common.showTip('请输入姓名', 'loading');
      return
    }
    if (email.length == 0) {
      email = '';
    }
    for (let i = 0; i < images.length; i++) {
      wx.uploadFile({
        url: 'https:/www.congyue88.com/upload', //仅为示例，非真实的接口地址
        filePath: images[i],
        name: 'file',
        formData: {
          phone: phone,
          name: name,
          email: email,
          userId: userId

        },
        success(res) {

          if (res.statusCode == 200) {
            common.showTip('提交成功', 'success');
          }
        }
      })
    }

    // let url = 'upload';
    // var params = {
    //   phone: phone,
    //   name: name,
    //   email: email,
    //   images: images
    // }
    // let method = "POST";
    // wx.showLoading({
    //     title: '加载中...',
    //   }),
    //   network.POST(url, params, method).then((res) => {
    //     wx.hideLoading();
    //     if (res.data) {
    //       // console.log('轮播图', res.data[0].fileUrl)

    //     } else {
    //       common.showTip(res.data.errMsg, 'loading');
    //     }
    //   }).catch((errMsg) => {
    //     wx.hideLoading();
    //     console.log(errMsg); //错误提示信息
    //     wx.showToast({
    //       title: '网络错误',
    //       icon: 'loading',
    //       duration: 1500,
    //     })
    //   });
  }
})