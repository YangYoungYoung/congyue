// pages/address/address.js
var common = require("../../utils/common.js");
var network = require("../../utils/network.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    chooseAddress: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("chooseAddress", options.chooseAddress);
    if (options.chooseAddress != undefined) {
      this.setData({
        chooseAddress: true
      })

    }
  },
  onShow: function () {
    // this.setData({
    //   addressList: addressList
    // })
    this.getAddressList();
  },
  //获取地址列表
  getAddressList: function () {
    let that = this;
    let userId = wx.getStorageSync('userId');
    // if (userId == '' || userId == undefined) {
    //   common.showTip("请先登录", "loading");
    //   return;
    // }
    // let url = "address/list?userId=" + userId;
    let url = 'addresses/'
    var params = {
      userId: userId
    }
    let method = "GET";
    wx.showLoading({
      title: '加载中...',
    }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        let addressList = res.data.data;
        that.setData({
          addressList: addressList
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
  //修改地址
  editAddress: function (event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    let address = that.data.addressList[index];
    wx.navigateTo({
      url: '../newAddress/newAddress?address=' + JSON.stringify(address),
    })

  },
  //新建地址
  newAddress: function () {
    wx.navigateTo({
      url: '../newAddress/newAddress',
    })
  },

  //选择地址
  chooseAddress: function (event) {
    let that = this;
    // console.log('选择这个地址');
    let index = event.currentTarget.dataset.index;
    let addressList = that.data.addressList;
    let address = addressList[index];
    wx.setStorageSync('address', address);
    wx.navigateBack();

  }
})