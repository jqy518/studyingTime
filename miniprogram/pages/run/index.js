// pages/run/index.js
Page({
  data: {
    subkey:'TACBZ-RY5KP-TWVDN-LC6GA-D735Z-3SFEW',
    openid:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    style:1,
    showPosition:true,
    isrun:1,
    count:0,
    setting:{
      rotate:0,
      skew:0
    },
    location:{
      latitude:39.918056,
      longitude:116.397027
    },
    scale:15,
    isOverLooking: false,
    localInfo:[],
    showActionsheet:false,
    groups:[
      { text: '跑步记录', value: 1 },
      { text: '运动统计', value: 2 },
    ],

  },
  showMenu(){
    this.setData({
      showActionsheet:true
    })
  },
  actionBtnClick(event){
    let value = event.detail.value
    switch(value) {
      case 1:
        console.log(this.data.openid)
        wx.navigateTo({
          url: `/pages/run/runlist/index?openid=${this.data.openid}`
        })
        break
    }
  },
  runFun() {
    this.bindEvent()
  },
  stopFun(){
    this.unBindEvent()
  },
  overFun(){
    const db = wx.cloud.database()
    const runRecord = db.collection('runRecord')
    runRecord.add({
      data:{
        date:new Date().getTime(),
        localInfo:this.data.localInfo
      },
      success:function(){
        wx.showToast({
          title: '保存成功',
        })
      }
    })
    this.setData({isrun:1})
  },

  async initPoint() {


    //定位
    let locationData = await getApp().wxp.getLocation()
    
    //获取openId
    let loginInfo = await wx.cloud.callFunction({name:'login'})
    this.setData({
      location:{
        latitude:locationData.latitude,
        longitude:locationData.longitude
      },
      openid:loginInfo.result.openid
    })
  },
  locationChangeFn(res){
    let points = []
    if(this.data.localInfo[0]) {
      points = this.data.localInfo[0].points
    }
    let currPos = {
      latitude:res.latitude,
      longitude:res.longitude
    }
    let teminfo ={
      points:[...points,currPos],
      color: '#3875FF',
      width: 8,
      dottedLine: false,
      arrowLine: true,
      borderWidth: 2
    }
    console.log(teminfo.points)
    this.setData({localInfo:[{...teminfo}]})

  },
  unBindEvent() {
    wx.stopLocationUpdate({
      success: (res) => {
        wx.offLocationChange(this.locationChangeFn)
        this.setData({isrun:3})
      },
    })
  },
  bindEvent(){
    let _this = this;
    this.locationChangeFn = this.locationChangeFn.bind(this)
    wx.startLocationUpdateBackground()
    wx.startLocationUpdate({
      success: (res) => {
        wx.onLocationChange(_this.locationChangeFn)
        this.setData({isrun:2})
      },
    })
  },
  onLoad:function() {
    let _this = this;
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userLocationBackground']){
          wx.authorize({
            scope: "scope.userLocationBackground",
            success:function(res){
              console.log(res,'-------------')
            },
            fail:function() {
              console.log(res,'授权失败')
            }
          })
        }
        if(res.authSetting['scope.userLocation']){
          _this.initPoint()
          
        }else {
          wx.authorize({
            scope:'scope.userLocation',
            success(){
              _this.initPoint()
            }
          })
        }
      }
    })
  }

})