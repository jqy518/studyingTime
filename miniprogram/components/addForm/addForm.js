// pages/myPlan/components/addForm/addForm.js
import moment from 'moment'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show:{
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rules:[
      {
        name:'title',
        rules:{required: true, message: '请输入标题'}
      }
    ],
    issubmit:false,
    formData:{
      title:'',
      desc:'',
      days:0,
      startTime: moment(new Date()).format('YYYY-MM-DD'),
      endTime:moment(new Date()).format('YYYY-MM-DD'),
      createTime:''
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async submitData(sData) {
      let db = wx.cloud.database()
      let res = await db.collection('planlist').add({
        data:sData
      })
      this.setData({
        issubmit:false
      })
      if(res._id) {
        this.triggerEvent('submited')
      }
    },
    submitFun() {
      this.selectComponent('#form').validate((valid,errors)=>{
        if(!valid) {
          let keys = Object.keys(errors)
          wx.showToast({
            icon:'error',
            title: errors[keys[0]].message
          })
        }else {
          let sData = Object.assign({},this.data.formData)
          let start = moment(sData.startTime)
          let end = moment(sData.endTime)
          sData.days = end.diff(start,'days')
          sData.over = 0;
          sData.createTime = new Date().getTime()
          if(sData.days <= 0) {
            wx.showToast({
              icon:'error',
              title: '计划时间必须大于一天'
            })
          }else {
            this.setData({
              issubmit:true
            })
            this.submitData(sData)
          }
        }
      })
    },
    bindStartDateChange(event){
      this.setData({
        "formData.startTime":moment(event.detail.value).format('YYYY-MM-DD')
      })
    },
    bindEndDateChange(event){
      this.setData({
        "formData.endTime":moment(event.detail.value).format('YYYY-MM-DD')
      })
    },
    formInputChange(e){
      let field = e.target.dataset.field;
      let value = e.detail.value;
      if(field) {
        field = `formData.${field}`
        this.setData({
          [field]:value
        })
      }
    },
    closeFun() {
      this.triggerEvent('closeevent')
    }
  }
})
