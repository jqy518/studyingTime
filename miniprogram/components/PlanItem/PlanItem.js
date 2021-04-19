// pages/myPlan/components/PlanItem.js
import gradientColor from '../color'
const computedBehavior = require('miniprogram-computed')
const app = getApp()
Component({ 
  
  /**
   * 组件的属性列表
   */
  properties: {
    planItem:{
      type:Object
    },
    offsetTop:{
      type:Number
    }
  },

  /**
   * 这是一坑：computedBehavior.behavior，文档上没写明确，可能是miniprogram-computed版本太高的原因
   */
  behaviors: [computedBehavior.behavior],
  data: {
    isopen:false,
    rshow:false,
    dialogShow: false,
    buttons: [{text: '取消'}, {text: '确定'}],
    children:[],
    step:0,
    bgimage:'',
    slideButtons: [{
      text: '打卡',
      src:'/images/dak.svg'
    },{
      text: '提醒',
      src:'/images/tix.svg'
    },{
      type: 'warn',
      text: '删除',
      src:'/images/del.svg'
    }],
  },
  observers:{
    'offsetTop':function(nval) {
      this.calculateOffset()
    }
  },
  lifetimes:{
    ready() {
      this.calculateStep(this.properties.planItem)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calculateStep(planItem) {
      if(planItem) {
        let step = Math.floor(planItem.over * 10 /planItem.days);
        let gradient =  new gradientColor('#D24D07','#74A043',10)
        let bgs =  new gradientColor('#fc8b87','#d1fca0',10)
        let mcolor = gradient[step]
        let bg = bgs[step]
        let bgimage =  `linear-gradient(-45deg, ${mcolor}, ${mcolor} 25%, ${bg} 25%, ${bg} 50%, ${mcolor} 50%, ${mcolor} 75%, ${bg} 75%, ${bg})`
        this.setData({
          step:step,
          bgimage:bgimage
        })
      }
    },
    calculateOffset() {
      let query = this.createSelectorQuery()
      query.select('.weui-slidecell').boundingClientRect((res)=>{
        let topOffset = res.top;
        if(-40<topOffset&&topOffset<35){
          this.triggerEvent('getyear',this.properties.planItem.year)
        }
      }).exec()
    },
    addRecord:function() {
      this.setData({
          rshow: true
      })
    },
    slideButtonTap(event){
     let index = event.detail.index;
     switch(index) {
       case 0:
         this.addRecord()
         break;
       case 1:
         this.ringPlan()
         //this.sendMessage()
         break;
       case 2:
         this.delRecord()
         break;
     }
    },
    async sendMessage() {
     let res =  await wx.cloud.callFunction({
        name:'message',
        data:{
          method:'sendSubscribeMessage'
        }
      })
      console.log(res)
    },
    async ringPlan(){
      let mid = this.properties.planItem._id;
      let res = await app.wxp.requestSubscribeMessage({
        tmplIds:['vyg4YXhVLLTm2mQOGg0vpIaHXyZa3yO1y1m6B8qHYvY'],
      })
      if(res['vyg4YXhVLLTm2mQOGg0vpIaHXyZa3yO1y1m6B8qHYvY'] === 'accept') {
        let cres = await wx.cloud.callFunction({
          name:'message',
          data:{
            method:'requestSubscribeMessage',
            params:{
              tid:'vyg4YXhVLLTm2mQOGg0vpIaHXyZa3yO1y1m6B8qHYvY',
              bindid:mid,
              _openid:this.properties.planItem._openid,
              page:'pages/myPlan/myPlan',
              sendTime:new Date(this.properties.planItem.startTime).getTime(),
              thing1:this.properties.planItem.title,
              thing4:this.properties.planItem.desc,
              time6:this.properties.planItem.startTime
            }
          }
        })
        if(cres.result._id){
          wx.showToast({
            title:'订阅成功',
            icon:"none"
          })
        }
      }
    },
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
      let pid = this.properties.planItem._id
      let res = await wx.cloud.callFunction({
        name:'plancontroler',
        data:{
          method:'delPlanById',
          params:{
            id:pid
          }
        }
      })
      res = res.result || {}
      if(res.status === 200) {
        this.triggerEvent('update')
      }else {
        wx.showToast({
          title: 'title',
        })
      }
      
    },
    openAndHiddlen(event) {
      this.setData({
        isopen:!this.data.isopen
      },()=>{
        if(this.data.isopen && this.data.children.length === 0) {
          this.queryChildren()
        }
      })
    },
    async queryChildren() {
      let pid = this.properties.planItem._id;
      if(pid) {
        let db = wx.cloud.database();
        let cres = await db.collection('recordlist').where({
          pid:pid
        }).get()
        this.setData({
          rshow:false,
          children:cres.data || []
        })
      }
    }
  }
})
