// pages/myPlan/components/PlanItem.js
import gradientColor from '../color'
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
   * 组件的初始数据
   */
  data: {
    isopen:false,
    rshow:false,
    children:[],
    slideButtons: [{
      text: '打卡',
      src:'/images/打卡.svg'
    },{
      text: '提醒',
      src:'/images/提醒.svg'
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
      console.log(this.data.bgimage)
    }
  },
  computed:{
    bgimage:function() {
      console.log('xxxxxxxxxx')
      let gradient =  new gradientColor('#D24D07','#74A043',10)
      let mcolor = gradient[0]
      return `linear-gradient(-45deg, ${mcolor}, ${mcolor} 25%, #BFEFFF 25%, #BFEFFF 50%, ${mcolor} 50%, ${mcolor} 75%, #BFEFFF 75%, #BFEFFF)`
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
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
         console.log('ring...')
         break;
       case 2:
         console.log('delete...')
         break;
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
          children:cres.data || []
        })
      }
    }
  }
})
