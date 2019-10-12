// pages/integral/integral.js
var network = require("../../utils/network.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasRecord: false,
    hasList: false,
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getRecord();
    this.getIntegral();
  },
  //获取现金券记录
  getRecord: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    // let userId = user.id;
    let url = 'integation/record';
    var params = {
      userId: userId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          // console.log('record is:', res.data.data);
          if (res.data.data.length > 0) {
            that.setData({
              hasRecord: true
            })
          }
          that.setData({
            recordArr: res.data.data
          })
          // that.setData({
          //   swiperList: res.data.data
          // })
        } else {
          common.showTip(res.data.errMsg, 'loading');
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        // wx.showToast({
        //   title: '网络错误',
        //   icon: 'loading',
        //   duration: 1500,
        // })
      });
  },
  //获取代金券列表
  getIntegral: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    // let userId = user.id;
    let url = 'integation/check';
    var params = {
      userId: userId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          // console.log('record is:', res.data.data);
          if (res.data.data.length > 0) {
            that.setData({
              hasList: true
            })
          }
          that.setData({
            listArr: res.data.data
          })
          // that.setData({
          //   swiperList: res.data.data
          // })
        } else {
          common.showTip(res.data.errMsg, 'loading');
        }
      }).catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        // wx.showToast({
        //   title: '网络错误',
        //   icon: 'loading',
        //   duration: 1500,
        // })
      });
  }


})