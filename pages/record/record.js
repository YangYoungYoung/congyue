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
  onLoad: function (options) {

  },

  buyAgain:function(){
    wx.redirectTo({
      url: '../detail/detail',
    })
  }
})