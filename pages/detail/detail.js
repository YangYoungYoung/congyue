// pages/detail/detail.js
var network = require("../../utils/network.js")
var common = require("../../utils/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number: 1,
    indicatorDots: true, //是否出现焦点  
    autoplay: true, //是否自动播放轮播图  
    interval: 4000, //时间间隔
    duration: 1000, //延时时间
    circular: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.goodsId != undefined) {
      let goodsId = options.goodsId;
      this.setData({
        goodsId: goodsId
      })
      this.getGoodInfo();
    }
  },
  //获取商品详情
  getGoodInfo: function() {
    let that = this;
    let goodsId = that.data.goodsId;
    let url = "goods/details";
    var params = {
      goodsId: goodsId
    }
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();

        var goods = res.data.data;
        that.setData({
          goods: goods
        })
        console.log('goods:', goods)
        // var imagList = res.data.data.goods.listPicUrl.split(",");
        let specificationValues = goods.specification;
        var guiGe = [];

        if (specificationValues != null) {
          var strArr = [];
          var allList = [];
          let temp = specificationValues.split(";");
          // console.log("temp is :", temp);
          for (var i = 0; i < temp.length; i++) {
            let str = temp[i];
            strArr = str.split(",");
            allList.push(strArr);
          }
          console.log("allList is :", allList);

          for (var i = 0; i < allList.length; i++) {
            var list = allList[i];
            var body = [];
            var obj = {};
            for (var j = 0; j < list.length; j++) {
              if (j == 0) {
                obj.name = list[j];
              } else {
                let item = {};
                item.content = list[j];

                item.select = false;
                body.push(item);
              }
              obj.size = body;
            }
            obj.id = i;
            // console.log('obj:', obj);
            guiGe.push(obj);
            console.log('guiGe is: ', guiGe);
          }
        }
        this.setData({
          guiGe: guiGe,
          // imagList: imagList
        })

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
  //获取数量
  onChange: function(event) {
    console.log('number:', event.detail);
    this.setData({
      number: event.detail
    })
  },

  //获取选择的规格
  getGuiGe: function() {
    let that = this;
    let guiGe = that.data.guiGe;
    console.log('guiGe is:', guiGe);
    let goodsSpecifitionValue = "";
    for (var i = 0; i < guiGe.length; i++) {
      var list = guiGe[i].size;

      for (var j = 0; j < list.length; j++) {
        // console.log('list[j] is:', list[j]);
        if (list[j].select) {
          goodsSpecifitionValue += guiGe[i].name + "," + list[j].content + ";"
        }
      }
    }

    // that.setData({
    //   goodsSpecifitionValue: goodsSpecifitionValue
    // });
    return goodsSpecifitionValue;
  },

  //加入购物车
  addToCart: function() {
    let that = this;
    let userId = wx.getStorageSync('userId');
    if (userId == '' || userId == undefined) {
      wx.showModal({
        title: '您还没有登录',
        content: '是否现在就去登录',
        cancelText: '否',
        confirmText: '是',
        success(res) {
          if (res.cancel) {
            // 用户点击了取消属性的按钮

          } else if (res.confirm) {
            // 用户点击了确定属性的按钮，跳转到个人中心登录
            wx.navigateTo({
              url: '../mine/mine',
            })
          }
        }
      })
      return;
    }
    let goodsId = that.data.goodsId;
    let goodsSpecifitionValue = that.getGuiGe();
    // console.log('goodsSpecifitionValue is:', goodsSpecifitionValue);
    if (goodsSpecifitionValue == '' || goodsSpecifitionValue == undefined) {
      common.showTip('请选择规格', 'loading');
      return;
    }


    let number = that.data.number;
    let goodsName = that.data.goods.title;
    let index = that.data.index;
    let price = that.data.goods.price;

    // let url = "goods/goods?goodsId=" + goodsId;
    let url = "carts/add_to_cart";
    let cart = {

      goodsId: goodsId,
      number: number,
      userId: userId,
      // price: price,
      // goodsName: goodsName,
      // goodsSpecifitionValue: goodsSpecifitionValue
    }
    var params = cart;
    let method = "POST";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {
          common.showTip("添加成功", "success");
          wx.switchTab({
            url: '../cart/cart',
          })
          // that.hideModal();
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
  //选择规格
  guiGeSelect: function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    // console.log('index is:', index);
    // console.log('id is:', id);


    let guiGe = that.data.guiGe;
    for (var i = 0; i < guiGe[id].size.length; i++) {
      if (i == index) {
        guiGe[id].size[i].select = true;

      } else {
        guiGe[id].size[i].select = false;
      }
    }

    that.setData({
      guiGe: guiGe
    })
    that.chooseEveryGuiGe();
  },
  //判断是否选中了每个规格
  chooseEveryGuiGe: function() {
    let that = this;
    var guiGe = that.data.guiGe;
    var selectNum = 0;
    var typeInfo = '';
    console.log('guiGe:::::::::', guiGe);
    for (var i = 0; i < guiGe.length; i++) {
      var type = guiGe[i].size;

      console.log('type is :', type);
      for (var j = 0; j < type.length; j++) {
        // console.log('单个类型：', guiGe[i].type[j]);
        if (type[j].select) {
          console.log('type is====', type[j]);
          typeInfo += type[j].content + ';';
          selectNum += 1;
        }
      }

    }


    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (typeInfo.length > 0) {
      typeInfo = typeInfo.substr(0, typeInfo.length - 1);
      console.log('typeInfo is:', typeInfo);
      that.setData({
        typeInfo: typeInfo
      })
    }
    //判断每个规格至少有一个选中即请求新的价格接口
    if (selectNum == guiGe.length) {
      that.getNewPrice();
    }
  },
  //根据不同规格获取不同价格
  getNewPrice: function() {
    let that = this;
    let url = "goods/details/choose";
    let goodsId = that.data.goodsId;
    let typeInfo = that.data.typeInfo;
    console.log('typeInfo :', typeInfo);

    var params = {
      typeInfo: typeInfo,
      goodsId: goodsId
    };
    let method = "GET";
    wx.showLoading({
        title: '加载中...',
      }),
      network.POST(url, params, method).then((res) => {
        wx.hideLoading();
        // console.log("返回值是：" + res.data);
        if (res.data.code == 200) {

          // that.hideModal();
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
  }

})