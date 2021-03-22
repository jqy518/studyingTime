// pages/myPlan/components/records/Record.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showPreView(event) {
      let src = event.target.dataset;
      wx.previewImage({
        current:src,
        urls: [
          '/images/code-db-onAdd.png',
          '/images/code-func-sum.png'
        ],
      })
    }
  }
})
