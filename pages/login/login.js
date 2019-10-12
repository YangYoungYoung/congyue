// pages/login/login.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  phoneInput: function(e) {
    // console.log('手机号：', e.detail.value);
    this.setData({
      phone: e.detail.value
    })
  },
  pwdInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  login: function() {
    let that = this;
    let phone = that.data.phone;
    let password = that.data.password;
    if (phone.length == 0) {
      common.showTip('手机号不能为空', 'loading');
    } else if (phone.length != 11) {
      common.showTip('请输入正确手机号', 'loading');
    }
    if (password.length == 0) {
      common.showTip('密码不能为空', 'loading');
    }

    let url = 'login';
    var params = {
      phonenumber: phone,
      password: password
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          // console.log('登录成功，跳转');
          //  common.showTip('登录成功','success');
          let userId = res.data.data.userId;
          // console.log('userId:',userId);
          wx.setStorageSync('userId', userId);
          wx.switchTab({
            url: '../index/index',
          })

        } else {
          common.showTip(res.data.errMsg, 'loading');
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  },
  forgetPwd: function() {
    wx.navigateTo({
      url: '../forgetPwd/forgetPwd',
    })
  },

  toRegister: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  }

})