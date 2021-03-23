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
      files:[],
      desc:'',
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
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function(e){
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    uplaodFile(files) {
        console.log('upload files', files)
        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject('some error')
            }, 1000)
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e.detail)
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
