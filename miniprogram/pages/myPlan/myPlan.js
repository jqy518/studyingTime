// pages/myPlan/myPlan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    rshow:false,
    openid:'',
    planList:[]
  },

  addPlan: function () {
      this.setData({
          show: true
      })
  },
  async queryList() {
    this.setData({show: false})
    let db = wx.cloud.database()
    let listRes = await db.collection('planlist').where({
        _openid:this.data.openid
    }).get()
    this.setData({
        planList:listRes.data || []
    })
  },
  async initData(){
    //获取openId
    let loginInfo = await wx.cloud.callFunction({name:'login'})
    this.setData({
        openid:loginInfo.result.openid
    },function(){
        this.queryList()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.initData()
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