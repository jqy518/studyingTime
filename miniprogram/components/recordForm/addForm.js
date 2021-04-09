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
    },
    pid:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    rules:[
      {
        name:'desc',
        rules:{required: true, message: '学习描述不能为空'}
      }
    ],
    issubmit:false,
    formData:{
      pid:'',
      files:[],
      desc:'',
      createTime:''
    }
  },
  lifetimes:{
    created(){
      this.setData({
        selectFile: this.selectFile.bind(this),
        uplaodFile: this.uplaodFile.bind(this)
    })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    async submitData(sData) {
      let db = wx.cloud.database()
      let res = await db.collection('recordlist').add({
        data:sData
      })
      await this.updatePlanOverDay()
      this.setData({
        issubmit:false
      })
      if(res._id) {
        this.triggerEvent('submited')
      }
    },
    async updatePlanOverDay() {
      let db = wx.cloud.database()
      const $ = db.command.aggregate
      let maxItem = await db.collection('recordlist')
              .aggregate()
              .match({
                pid:this.properties.pid
              }).sort({
                createTime:1
              }).limit(1).end()
      console.log(maxItem)
     if(!maxItem.list || maxItem.list.length == 0) {
      return await this.doUpdateDay()
     }else {
       let maxDateTime = maxItem.list[0].createTime
       let b = moment().isAfter(maxDateTime,'day')
       if(b) {
         return await this.doUpdateDay()
       }
     }
      
    },
    async doUpdateDay() {
      let db = wx.cloud.database()
      const _ = db.command
     let result =  await db.collection('planlist').doc(this.properties.pid).update({
        data:{
          over:_.inc(1)
        }
      })
      return result
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
          sData.createTime = new Date().getTime()
          sData.pid=this.properties.pid;
          this.submitData(sData)
        }
      })
    },

    deleteHandler(e){
      let url = e.detail.item.url
      if(url) {
        wx.cloud.deleteFile({
          fileList:[url]
        }).then(res=>{
          wx.showToast({
            title: '删除成功',
            icon:'none'
          })
        }).catch(error=>{
          console.log(error)
        })
      }
    },
    selectFile(files) {
        console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    uplaodFile(files) {
        console.log('upload files', files)
        // 文件上传的函数，返回一个promise
        let path = files.tempFilePaths[0];
        let ext = path.split('.').pop()
        return new Promise((resolve,reject)=>{
          wx.cloud.uploadFile({
            cloudPath:`${new Date().getTime()}.${ext}`,
            filePath:path
          }).then((res)=>{
            if(res.fileID) {
              resolve({urls:[res.fileID]})
            }else {
              reject(new Error('上传失败'))
            }
          })
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        let urls = e.detail.urls;
        this.setData({
          "formData.files":[...this.data.formData.files,...urls]
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
