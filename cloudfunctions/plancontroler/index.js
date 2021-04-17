// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
//学习计划删除
async function delPlanById(id) {
  let db = cloud.database()
  try {
    await db.collection('planlist').doc(id).remove()
    await delRecordsByPid(id)
    return {status:200,message:'操作成功'}
  } catch (error) {
    return {status:500,message:error.message}
  }
}
//学习记录删除
async function delRecordsByPid(pid) {
  let db = cloud.database()
  let resc = await db.collection('recordlist').where({
    pid:pid
  }).remove()
  return resc
}
//订阅消息
async function requestSubscribeMessage(){

}

// 云函数入口函数
exports.main = async (event, context) => {
  if(event.Type === 'timer') {
    return sendSubscribeMessage()
  }
  let {method,params}  = event;
  switch(method) {
    case 'delPlanById' : 
    if(params.id) {
     return await delPlanById(params.id)
    }
  }
}