//index.js
//获取应用实例
const app = getApp();
var network = require("../../utils/network.js")
// var common = require("../../utils/common.js")

Page({
  data: {
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true,
    swiperList: [{
        picUrl: "../images/lunbo1.jpg"
      },
      {
        picUrl: "../images/lunbo2.jpg"
      },
      {
        picUrl: "../images/lunbo1.jpg"
      }
    ],
    // url: "https://v.qq.com/txp/iframe/player.html?vid=i3001ksn5x9"
  },
  onLoad: function() {
    let that = this;
    
  },
  onReady: function() {
    this.videoContext = wx.createVideoContext('myVideo')
  },
 
})