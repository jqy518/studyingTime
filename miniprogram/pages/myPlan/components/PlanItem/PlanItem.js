// pages/myPlan/components/PlanItem.js
Component({ 
  /**
   * 组件的属性列表
   */
  properties: {
    planItem:{
      type:Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isopen:false,
    children:[],
    arrowAnimationData:{},
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

  /**
   * 组件的方法列表
   */
  methods: {
    slideButtonTap(event){
      console.log(event)
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
    queryChildren() {
      console.log('xxxxxxxxxxxxxxx----')
    }
  }
})
