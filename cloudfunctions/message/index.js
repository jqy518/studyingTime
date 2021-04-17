// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
})

//订阅消息
async function requestSubscribeMessage(params){
  const db = cloud.database()
  let rs = await db.collection('message').add({
    data:Object.assign({flag:true},params)
  })
  return rs
}
//发送消息
async function sendSubscribeMessage() {
  const log = cloud.logger()
  let db = cloud.database()
  const _ = db.command
  let res =  await db.collection('message').where({
    flag:_.eq(true),
    sendTime:_.lt(new Date().getTime())
  }).get()
  let list = res.data || []
  if(list.length > 0) {
    let sendTasks = list.map((item)=>{
      return new Promise((resolve,reject)=>{
        let _tid = item.tid
        cloud.openapi.subscribeMessage.getPubTemplateKeyWordsById({tid:_tid}).then((tres)=>{
          let keyDatas = tres.data || []
          sendData = keyDatas.reduce((obj,kitem)=>{
            obj[kitem.rule] = {
              value:item[kitem.rule]
            }
            return obj
          },{})
          cloud.openapi.subscribeMessage.send({
            touser: item._openid,
            templateId:_tid,
            page: res.page,
            data:sendData
          }).then((sres)=>{
            resolve(sres)
          })
        })
      })
    })
    let sendResults = await Promise.all(sendTasks)
    return sendResults
  }
}
//更新message
async function updateMessage() {
  db.collection('message').doc(first._id).update({
    data:{
      sendTime:false
    },
    success:function(res) {
      console.log('hahaha.....')
    }
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.Type === 'timer') {
    return sendSubscribeMessage()
  }
  let {method,params}  = event;
  switch(method) {
    case 'requestSubscribeMessage' : 
    if(params.tid) {
     return await requestSubscribeMessage(params)
    }
    case 'sendSubscribeMessage' : 
    return await sendSubscribeMessage()
  }
}