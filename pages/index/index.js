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
    swiperList: [],
    // url: "https://v.qq.com/txp/iframe/player.html?vid=i3001ksn5x9"
  },
  onLoad: function (options) {
    if (options.userId!=undefined){
      let primaryUserId = options.userId;
      console.log('primaryUserId:', primaryUserId);
      wx.setStorageSync('primaryUserId', primaryUserId);
    }
    let that = this;
    that.getSwiper();
    that.getArticle();

  },
  //获取轮播图
  getSwiper: function() {
    let that = this;
    let url = 'index/slideshow';
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data) {
          // console.log('轮播图', res.data[0].fileUrl)
          that.setData({
            swiperList: res.data.data
          })
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
  //获取文章
  getArticle: function() {
    let that = this;
    let url = '/index/article';
    var params = {

    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {
          console.log(res.data);

          that.setData({
            articleArr: res.data.data
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
  toArticle: function(e) {
    let id = e.currentTarget.dataset.id;
    console.log('id:', id);
    wx.navigateTo({
      url: '../article/article?id=' + id,
    })
  }

})