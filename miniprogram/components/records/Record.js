// pages/myPlan/components/records/Record.js
import moment from 'moment'
const app = getApp();
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
    itemData:{},
    dialogShow: false,
    buttons: [{text: '取消'}, {text: '确定'}],
  },
  lifetimes:{
    ready() {
      this.adapteData(this.properties.info)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    delRecord(){
      this.setData({
        dialogShow:true
      })
    },
    delDo(e){
     let index = e.detail.index;
     if(index == 1) {
       this.delAjax()
     }
     this.setData({
      dialogShow:false
     })
    },
    async delAjax() {
      let pid = this.properties.info._id
      let db = wx.cloud.database()
      let res = await db.collection('recordlist').doc(pid).remove()
      if(res.stats.removed === 1) {
        this.triggerEvent('updatercord',null,{ bubbles: true, composed: true })
      }else {
        wx.showToast({
          title: 'title',
        })
      }  
    },

    showDetail() {
      this.triggerEvent('showd',this.data.itemData.article,{ bubbles: true, composed: true })
    },
    adapteData(nobj) {
      let currObj = Object.assign({},nobj)
      currObj.createTime = moment(currObj.createTime).format('MM-DD')
      currObj.article = app.towxml(currObj.desc,'markdown',{
        //base:'https://xxx.com',				// 相对资源的base路径
        theme:'light',					// 主题，默认`light`
        events:{					// 为元素绑定的事件方法
          tap:(e)=>{
            console.log('tap',e);
          }
        }
      });
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
