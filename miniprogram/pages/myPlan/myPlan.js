// pages/myPlan/myPlan.js
let scrollEvent = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show:false,
    rshow:false,
    loading:true,
    freshering:false,
    openid:'',
    pageSize:20,
    pageNo:1,
    scrollTop:0,
    currYear:'----',
    planList:[]
  },
  testQuery:async function() {
    let query = this.createSelectorQuery()
    query.selectAll('.year-box').boundingClientRect((res)=>{
      console.log(res)
    }).exec()
    // query.selectViewport().scrollOffset()
    // query.exec(function(res){
    //   console.log(res)
    // })
  },
  setYear(e) {
    this.setData({
      currYear:e.detail
    })
  },
  addPlan: function () {
      this.setData({
          show: true
      })
  },
  async queryList(refresh) {
    let pageSize = this.data.pageSize
    let pageNo = this.data.pageNo
    this.setData({
      show: false
    })
    let db = wx.cloud.database()
    const $ = db.command.aggregate
    let listRes = await db.collection('planlist').aggregate()
    .match({
      _openid:this.data.openid
    })
    .skip(pageSize *(pageNo-1))
    .limit(pageSize)
    .addFields({
      year:$.year($.dateFromString({
        dateString:'$startTime'
      }))
    }).sort({
      year:-1
    }).end()



    let appendData = listRes.list || []
    if(refresh) {
      if(appendData.length > 0) {
        this.setData({
          currYear:appendData[0].year,
          planList:[...appendData],
          loading:false
        })
      }else {
        this.setData({
          currYear:'----',
          planList:[],
          loading:false
        })
      }
    }else {
      if(appendData.length) {

        this.setData({
            planList:[...this.data.planList,...appendData],
            loading:false
        })
      }
    }
    wx.stopPullDownRefresh()
  },
  async initData(){
    //获取openId
    let loginInfo = await wx.cloud.callFunction({name:'login'})
    this.setData({
        openid:loginInfo.result.openid
    },function(){
        wx.startPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.initData()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh:function () {
    this.setData({
      pageNo:1
    },()=>{

      this.queryList(true)
    })
  },
  onPageScroll(obj){
    if(scrollEvent){
      clearTimeout(scrollEvent)
    }
    scrollEvent = setTimeout(()=>{
      this.setData({
        scrollTop:obj.scrollTop
      })
    },500)
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.setData({
      pageNo:this.data.pageNo+1
    },()=>{
      this.queryList()
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})