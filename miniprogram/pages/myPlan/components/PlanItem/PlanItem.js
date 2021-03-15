// pages/myPlan/components/PlanItem.js
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

  }
})
