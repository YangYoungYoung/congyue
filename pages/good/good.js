// pages/good/good.js
var network = require("../../utils/network.js")
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
    let that = this;
    that.getList();
  },
  getList: function() {
    let that = this;
    let url = 'goods/list';
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          that.setData({
            goodList: res.data.data
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
  toDetail: function (event) {
    let goodsId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../detail/detail?goodsId=' + goodsId,
    })

  }

})