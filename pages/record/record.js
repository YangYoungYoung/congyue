// pages/record/record.js
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

  },

  buyAgain: function() {
    wx.redirectTo({
      url: '../detail/detail',
    })
  },
  //获取已购买列表
  getBuyList: function() {
    let that = this;
    // let orderId = that.data.orderId;
    let userId = wx.getStorageSync('userId');
    let url = 'orders/select';
    let params = {
      userId: userId
    };
    wx.showLoading({
        title: '加载中...',
      }),

      network.POST(url, params, 'GET', 'application/json').then((res) => {
        wx.hideLoading();
        // console.log("提交订单的结果是：" + res.data.code); //正确返回结果
        //返回的是订单Id
        if (res.data.code == 200) {
          // console.log('预订单 is ', res.data.data);
          let cartItems = res.data.data.jsonArray;
          let orderPrice = res.data.data.totalPrice;
          that.setData({
            cartItems: cartItems,
            //   freightPrice: freightPrice,
            //   integralTotal: integralTotal,
            totalPrice: orderPrice
          })
        }

      }).catch((errMsg) => {
        // wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }
})