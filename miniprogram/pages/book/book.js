// pages/book.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    openid:''
  },

  /**
   * 组件的方法列表
   */
  lifetimes:{
    created(){
      //获取openId
      wx.cloud.callFunction({name:'login'}).then((data)=>{
        if(data.result && data.result.openid){
          this.setData({
            openid:data.result.openid
          },()=>{
            this.queryBookList()
          })
        }
      })
    }
  },
  methods: {
    async queryBookList(){
      let db = wx.cloud.database()
      let result = await db.collection('books').where({_openid:this.data.openid}).get()
      if(result.data) {
        this.setData({
          booklist:[...result.data]
        })
      }
    },
    async getCode(){
      let code  = await getApp().wxp.scanCode({scanType:'pdf417'})

      console.log(code,code.result)
      if(code && code.result) {
        let data = await wx.cloud.callFunction({
          name:'doubanbook',
          data:{
            code:code.result
          }
        })
        if(data.result) {
          if(data.result && data.result.title){
            let db = wx.cloud.database()
            let addresult = await db.collection('books').add({
              data:{
                ...data.result
              }
            })
            if(addresult._id){
              this.queryBookList()
            }
          }else {
            wx.showToast({
              title: '未查到相关书籍',
            })
          }
        }
      }
    }
  }
})
