// pages/register/register.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let primaryUserId = wx.getStorageSync('primaryUserId');
    console.log('primaryUserId 是：', primaryUserId);
    if (primaryUserId != undefined || primaryUserId != '') {
      let primaryUserId = primaryUserId;
      this.setData({
        primaryUserId: primaryUserId
      })
    }
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
  /**
   * 注册
   */
  register: function() {
    let that = this;
    let phone = that.data.phone;
    let password = that.data.password;
    let openId = wx.getStorageSync('openId');
    let user = wx.getStorageSync('user');

    let name = user.nickName;
    console.log('user.name:', name);
    if (phone.length == 0) {
      common.showTip('手机号不能为空', 'loading');
    } else if (phone.length != 11) {
      common.showTip('请输入正确手机号', 'loading');
    }
    if (password.length == 0) {
      common.showTip('密码不能为空', 'loading');
    }

    let url = 'register';
    var params = {
      // code:code
      name: name,
      phonenumber: phone,
      password: password,
      openId: openId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          common.showTip('注册成功', 'success');
          let userId = res.data.data.userId;
          console.log('userId:', userId);
          wx.setStorageSync('userId', userId);
          let primaryUserId = wx.getStorageSync('primaryUserId');
          console.log('primaryUserId is:', primaryUserId);
          if (primaryUserId != undefined || primaryUserId != null) {
            console.log('给上级积分增加成功');
            that.integralAdd();
          }
          wx.switchTab({
            url: '../index/index',
          })
        } else {
          common.showTip(res.data.errMsg, 'loading');
          // common.showTip('网络错误', 'loading');
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

  //增加积分
  integralAdd: function() {
    let that = this;
    let userId = wx.getStorageSync('primaryUserId');
    let user = wx.getStorageSync('user');
    
    let subName = user.nickName;
    console.log('subName is', subName);
    wx.showLoading({
      title: '加载中...',
    })
    let url = "integation/update/add"
    var params = {
      // code:code
      subName: subName,
      userId: userId,
      value: 5
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        common.showTip('积分增加成功', 'success');
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

})