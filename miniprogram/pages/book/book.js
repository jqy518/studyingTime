// pages/book.js
Component({
  /**
   * 组件的初始数据
   */
  data: {
    openid:'',
    freshering:false,
    keyword:'',
    placeholder:'输入书名或条码查找添加'
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
    async fresherHandler(){
     await this.queryBookList()
      this.setData({
        freshering:false
      })
    },
    bindscrolltolower() {
      console.log('xxxxxx----------')
    },
    async queryBookList(){
      let db = wx.cloud.database()
      let result = await db.collection('books').where({_openid:this.data.openid}).get()
      if(result.data) {
        this.setData({
          booklist:[...result.data]
        })
      }
    },
    setValue(event) {
      console.log(event.detail.value)
      this.setData({
        keyword:event.detail.value
      })
    },
    async doSearch() {
      if(this.data.keyword) {
        this.queryFromDouban(this.data.keyword)
      }
    },
   async getCode(){
      let code  = await getApp().wxp.scanCode({scanType:'pdf417'})
      console.log(code,code.result)
      if(code && code.result) {
        this.queryFromDouban(code.result)
      }
    },
    async queryFromDouban(keyword) {
      let data = await wx.cloud.callFunction({
        name:'doubanbook',
        data:{
          code:keyword
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
})
