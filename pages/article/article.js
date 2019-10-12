// pages/article/article.js
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
    if (options.id != undefined) {
      let id = options.id;

      this.getArticle(id)
    }
  },

  getArticle: function(id) {
    let that = this;
    // let id = that.data.id;
    let url = 'index/article/details';
    var params = {
      id: id
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        if (res.data.code == 200) {

          let contentArr = res.data.data;
          // console.log(contentArr[0].title);
          that.setData({
            // title:res.data.title,
            contentArr: contentArr
          })

        } else {
          // common.showTip(res.data.errMsg, 'loading');
        }
      })
      .catch((errMsg) => {
        wx.hideLoading();
        // console.log(errMsg); //错误提示信息
        wx.showToast({
          title: '网络错误',
          icon: 'loading',
          duration: 1500,
        })
      });
  }


})