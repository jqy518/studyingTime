import moment from 'moment'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    let opendId = options.openid || ''
    if(opendId) {
      let db = wx.cloud.database()
      db.collection('runRecord').where({"_openid":opendId}).get({
        success:function(res){
          let dataArr = res.data || []

          _this.setData({
            listData:dataArr.map((item)=>{
              let ritem =  Object.assign({},item)
              ritem.date = moment(ritem.date).format('YYYY-MM-DD')
              return ritem;
            })
          })
        }
      })
    }
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