// pages/payOrder/payOrder.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddr: false,
    showAddAddr: true,
    showModal: false,
    showPwdModal: false,
    address: '',
    name: '',
    tel: '',
    integralTotal: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.orderId != undefined) {
      // console.log('orderId');
      let orderId = options.orderId;
      this.setData({
        orderId: orderId
      })
    }
    this.getAdvanceOrder();
  },

  //获取用户地址
  getAddress() {

    wx.navigateTo({
      url: '../address/address?chooseAddress=1',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;
    let address = wx.getStorageSync('address');
    // console.log('address is :', address);
    if (address != undefined && address != '') {
      that.setData({
        showAddAddr: false,
        showAddr: true,
        name: address.name,
        address: address.address,
        tel: address.phone
      })
    }
  },
  //获取预订单列表
  getAdvanceOrder: function() {
    let that = this;
    let orderId = that.data.orderId;
    let userId = wx.getStorageSync('userId');
    let url = 'orders/select';
    let params = {
      orderId: orderId
    };
    wx.showLoading({
        title: '加载中...',
      }),

      network.POST(url, params, 'GET', 'application/json').then((res) => {
        wx.hideLoading();
        // console.log("提交订单的结果是：" + res.data.code); //正确返回结果
        //返回的是订单Id
        if (res.data.code == 200) {
          console.log('预订单 is ', res.data.data);
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
  },
  //支付提交订单
  liveSubmitOrder: function() {
    var that = this;
    var totalFee = that.data.totalPrice * 100;
    let sn = that.data.sn;
    let orderId = that.data.orderId;
    let wxUserInfo = wx.getStorageSync('wxUserInfo');
    console.log('wxUserInfo is:', wxUserInfo);
    // var openId = wx.getStorageSync("openId");
    var openId = wxUserInfo.openId;

    // var order_id = "25767795778125825";

    // console.log("当前的订单总价是：" + money);
    wx.request({
      url: 'https://api-test.ugo365.xyz/api/common/getRepayId?outTradeNo=' + sn + "&money=" + totalFee + "&openId=" + openId + "&orderId=" + orderId,
      // url: 'https://api.ugo365.xyz/api/common/getRepayId?outTradeNo=' + sn + "&money=" + totalFee + "&openId=" + openId + "&orderId=" + orderId,
      data: {},
      header: { //请求头
        "Content-Type": "applciation/json"
      },
      method: "GET", //get为默认方法/POST

      success: function(res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.requestPayment({
            'timeStamp': res.data.timeStamp,
            'nonceStr': res.data.nonceStr,
            'package': res.data.package,
            'signType': 'MD5',
            'paySign': res.data.paySign,
            'success': function(res) {
              // console.log("调起支付成功")
              wx.hideLoading();
              wx.showToast({
                title: "支付成功",
                icon: 'succes',
                duration: 1500
              })
              that.payRequest();
            },
            'fail': function(res) {
              // console.log("调起支付失败" + res.err_desc)
              wx.showToast({
                title: "支付失败",
                duration: 1500
              })
            },
            'complete': function(res) {}
          })
        }

      },
      fail: function(err) {
        common.showTip("网络错误", "loading");
      }, //请求失败
      complete: function() {} //请求完成后执行的函数
    })
  },
  //支付成功回调
  payRequest: function() {
    let that = this;
    // let scroe = index+1;
    let userId = wx.getStorageSync('userId');
    let orderId = that.data.orderId;
    let integral = that.data.integral;
    let integralPayPasswordInpt = that.data.pwd;

    let url = "order/modify?orderId=" + orderId + "&type=10" + "&isIntegralShop=0";
    var params = {

    }
    let method = "PUT";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("校验密码的返回值是：" + res.data);
        if (res.data.code == 200) {
          that.submitOrder();
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
})