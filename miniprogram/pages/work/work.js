const db = wx.cloud.database()
var util = require('../util/util.js');
const date = new Date()
const years = ["新安","敬亭"]
const months = []
const days = ["01","02","03","04","05","06","07","08","09"]

for (let i = 1; i <= 5; i++) {
  months.push(i)
}
for (let i = 10; i <= 38; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 2,
    days: days,
    day: 2,
    value: [9999, 1, 1],
    multiArray: [years, months, days],
    multiIndex: [0, 0, 0],
    to:"新安101"
  },
  bindMultiPickerChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    this.setData({
      to: data.multiArray[0][data.multiIndex[0]]+data.multiArray[1][data.multiIndex[1]]+data.multiArray[2][data.multiIndex[2]]
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = months;
            data.multiArray[2] = days;
            break;
          case 1:
            data.multiArray[1] = months;
            data.multiArray[2] = days;
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        data.multiIndex[3] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            break;
          case 1:
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      },
    })
    db.collection('huiyi')
      .orderBy('createTime', 'desc') //按发布时间排序
      .get({
        success(res) {
          console.log("请求成功", res.data[0].info)
          that.setData({
            dataList: res.data
          })
          console.log(that.data.dataList[0])
        },
        fail(res) {
          console.log("请求失败", res)
        }
      })
  },
  //获取输入内容
  getInput1(event) {
    console.log("输入的对象", event.detail.value)
    this.setData({
      to: multiArray[0][multiIndex[0]]+multiArray[1][multiIndex[1]]+multiArray[2][multiIndex[2]]+multiArray[3][multiIndex[3]]
    })
  },
  getInput2(event) {
    console.log("输入的称呼", event.detail.value)
    this.setData({
      writer: event.detail.value
    })
  },
  getInput3(event) {
    console.log("输入的内容", event.detail.value)
    this.setData({
      info: event.detail.value
    })
  },
  //打开弹窗
  send: function () {
    var that = this
    wx.getStorage({
      key: 'login',
      success: function (res) {
        if (res.data) {
          that.setData({
            isSend: true
          })
        } else {
          wx.showToast({
            icon: "none",
            title: '你还未登录'
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          icon: "none",
          title: '你还未登录'
        })
      }
    })
  },
  // 关闭弹窗
  close: function () {
    this.setData({
      isSend: false
    })
  },
  //上传数据
  publish: function () {
    let writer = this.data.writer
    let to = this.data.to
    let info = this.data.info
    var likeNumber = 1
    console.log(likeNumber)
    if (!to) {
      wx.showToast({
        icon: "none",
        title: '对象不能为空'
      })
      return
    }
    if (!writer) {
      wx.showToast({
        icon: "none",
        title: '称呼不能为空'
      })
      return
    }
    if (!info || info.length < 6) {
      wx.showToast({
        icon: "none",
        title: '内容要多于六个字'
      })
      return
    }
    wx.showLoading({
      title: '发布中...',
    })
    db.collection('huiyi').add({
      data: {
        createTime: new Date(),
        info: this.data.info,
        to: this.data.to,
        writer: this.data.writer,
        sendTime: util.formatTime(new Date())
      },
      success: res => {
        wx.hideLoading()
        wx.showToast({
          title: '发布成功',
        })
        console.log('发布成功', res)
        this.setData({
          isSend: false
        })
        this.onLoad()
      },
      fail: err => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '网络不给力....'
        })
        console.error('发布失败', err)
      }
    })

  },
  delete: function (e) {
    var info = e.currentTarget.dataset.t
    console.log(info)
    db.collection('huiyi').doc(info._id).remove({
      success: function (res) {
        console.log(res.data)
        wx.showToast({
          icon: 'success',
          title: '删除成功',
        })
      }
    })
    this.onLoad()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})