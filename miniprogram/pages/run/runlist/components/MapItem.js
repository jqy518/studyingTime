// pages/run/runlist/components/MapItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    polyline:{
      type:Object,
      observer:function(nval,oval) {
        if(nval) {
          this.initMap(nval)
        }
      }
    },
    subkey:String,

  },

  /**
   * 组件的初始数据
   */
  data: {
    subkey:getApp().globalData.subkey,
    style:1,
    includePoints:[],
    longitude:56,
    latitude:82,
    polyline:[]
  },
  lifetimes:{
    attached:function(){
      console.log('attached',this.properties.polyline)
    },
    detached:function() {
      console.log('detached')
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    initMap:function(obj) {
      let pointArr = obj.points
      if(pointArr){

        let centerPoint = pointArr[Math.floor(pointArr.length/2)];
        this.setData({
          polyline:[{...this.properties.polyline}],
          longitude:centerPoint.longitude,
          latitude:centerPoint.latitude,
          includePoints:[...pointArr]
        })
      }
    }
  }
})
