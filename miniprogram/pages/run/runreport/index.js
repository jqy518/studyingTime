// pages/run/runreport/index.js
Component({
  /**
   * 页面的初始数据
   */
  data: {
    name:'zhangsan',
    srcArr:[],

  },
  methods:{
    scanCode(){
      wx.scanCode({
        scanType:"pdf417",
        success:(res)=>{
          console.log(res)
        }
      })
    },
    choseVideo(){
      wx.chooseVideo({
        maxDuration:30,
        success:(res)=>{
          console.log(res.size)
          let path = res.tempFilePath
          wx.openVideoEditor({
            filePath:path,
            success:(eres)=>{
              console.log(eres.tempFilePath)
            }
          })
          // //压缩
          // wx.compressVideo({
          //   bitrate: 0,
          //   fps: 0,
          //   quality: quality,
          //   resolution: 0,
          //   src: 'src',
          // })
        }
      })
    },
    showModal(){
      wx.showLoading({
        title: '加载中。。',
      })
      wx.showModal({
        title: '测试',
        content: '测试弹窗！！！',
        success(res){
          wx.hideLoading()
          console.log(res)
        }
      })
    },
    showImage(){
      wx.previewImage({
        urls: [...this.data.srcArr],
      })
    },
    getCode(res){
      console.log(res)
    },
    changePhone(){
      //从相机或拍照
      // wx.chooseImage({
      //   count: 2,
      //   success:(res)=>{
      //     console.log(res)
      //   }
      // })
      //从客户端会话选择文件
      wx.chooseMessageFile({
        count: 1,
        success:(res)=>{
          console.log(res)
        }
      })
    },
    takePhone() {
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality:'high',
        success:(res)=>{
          this.setData({
            srcArr:[...this.data.srcArr,res.tempImagePath]
          })
          // wx.cloud.uploadFile({
          //   cloudPath:`${new Date().getTime()}.jpg`,
          //   filePath:res.tempImagePath,
          //   success:(resdata)=>{
          //     console.log('上传成功',resdata)
          //   }
          // })
        }
      })
    }
  }
})