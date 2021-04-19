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
          cloud.openapi.subscribeMessage.send({
            touser: item._openid,
            templateId:_tid,
            page: item.page,
            data:{
              thing1:{
                value:item.thing1
              },
              thing4:{
                value:item.thing4
              },
              time6:{
                value:item.time6
              }
            }
          }).then((sres)=>{
            resolve({
              _id:item._id,
              ...sres
            })
          }).catch((err)=>{
            resolve({
              _id:item._id,
              ...err
            })
          })
      })
    })
    let sendResults = await Promise.all(sendTasks)
    return sendResults
  }else {
    return null
  }
}
//更新message
async function updateMessage(sendRess) {
  let db = cloud.database()
  let tasks = sendRess.map((item)=>{
    return new Promise((resolve,reject)=>{
      if(item.errCode){
        resolve(item)
      }else {
        db.collection('message').doc(item._id).update({
          data:{
            flag:false
          }
        }).then((res)=>{
          resolve({
            _id:item._id,
            ...res
          })
        }).catch((res)=>{
          resolve({
            _id:item._id,
            ...res
          })
        })
      }
    })
  })
  return Promise.all(tasks)
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
    let sendRess = await sendSubscribeMessage()
    console.log(sendRess)
    let updateRes = await updateMessage(sendRess)
    console.log(updateRes)
    return updateRes

  }
}