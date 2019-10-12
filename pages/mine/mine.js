// pages/mine/mine.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPermission: false, //是否弹出授权

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let user = wx.getStorageSync('user');
    // console.log('user:', user);
    if (user != undefined) {
      that.setData({
        user: user
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  //弹出授权弹窗
  showPermissionDialog: function() {
    // console.log('弹出授权询问弹窗');
    let that = this;
    that.showPermissionDialogBtn();
  },

  /**
   * 隐藏授权对话框
   */
  hidePermissionModal: function() {
    this.setData({
      showPermission: false
    });
  },

  /**
   * 弹出授权弹窗
   */
  showPermissionDialogBtn: function() {
    this.setData({
      showPermission: true
    })
  },
  //授权权限
  bindGetUserInfo(res) {
    let that = this;
    let info = res;
    // console.log(info);
    if (info.detail.userInfo) {

      // console.log("userInfo:", info.detail.userInfo);
      wx.setStorageSync('user', info.detail.userInfo);
      that.setData({
        user: info.detail.userInfo
      })
      // console.log("点击了同意授权");
      that.hidePermissionModal();
      wx.login({
        success: function(res) {
          if (res.code) {
            that.setData({
              code: res.code
            })
            that.getOP();
          } else {
            // console.log("授权失败");
            common.showTip('授权失败', loading);
          }
        },
      })

    } else {
      // console.log("点击了拒绝授权");
    }
  },

  //获取用户openId接口
  getOP: function(res) { //提交用户信息 获取用户id
    let that = this;
    let code = that.data.code;

    wx.showLoading({
      title: '加载中...',
    })
    let url = "authorize/getOpenId?code=" + code

    var params = {
      // code:code
    }
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        let openId = res.data.openid;
        // console.log("获取openId：", openId);
        wx.setStorageSync('openId', openId);

        wx.reLaunch({
          url: '../login/login',
        })
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
  //联系我们
  contactUs: function() {
    wx.makePhoneCall({
      phoneNumber: '0311-88818808',
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this;
    var userId = wx.getStorageSync("userId");
    //分享即得一积分
    that.integralAdd();
    return {
      title: '庄商汇',
      // path: '/pages/index/index?userId=' + userId,
      path: '/pages/index/index?userId=' + userId,
      success(e) {


        // console.log("用户提交了分享");
      },
      fail(e) {

        // console.log("用户取消了分享");
      },
      complete() {
        // console.log("用户取消了分享");
      }
    }
  },
  //增加积分
  integralAdd: function(res) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    let url = "integation/add"
    var params = {
      // code:code
      userId: 12,
      value: 1
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