// pages/myPlan/components/records/Record.js
import moment from 'moment'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    info:{
      type:Object
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    itemData:{}
  },
  lifetimes:{
    ready() {
      this.adapteData(this.properties.info)
    }
  },
  watch:{
    'itemData.**':function(nval) {
      this.adapteData(nval)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    adapteData(nobj) {
      let currObj = Object.assign({},nobj)
      currObj.createTime = moment(currObj.createTime).format('MM-DD')
      this.setData({
        itemData:currObj
      })
    },
    showPreView(event) {
      let src = event.target.dataset;
      wx.previewImage({
        current:src,
        urls: this.data.itemData.files,
      })
    }
  }
})
