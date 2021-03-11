// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
const decrypt = require('doubanbook')
const cheerio = require('cheerio')
cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})
 async function getBookinfo(code) {
  let src = await axios.get(`https://search.douban.com/book/subject_search?search_text=${code}&cat=1001`)
  let __DATA__ = src.data.match(/window\.__DATA__ = "(.*)"/)[1]
  let listData = decrypt(__DATA__)[0]
  if(!listData.url){
    return {}
  }
  let detailsrc = await axios.get(listData.url)
  let $ = cheerio.load(detailsrc.data)
  let title = $('h1').text().trim()
  let obj = {title:title}
  let info = $('#info').text().split('\n').map(v=>v.trim()).filter((item)=>!!item)
  let titleMap = {'作者':'author','出版社':'publishers','原作名':'oldname','译者':'translator','出版年':'year','ISBN':'isbn'}
  let value = [];
  let key = ''
  for(let i = 0; i < info.length; i++) {
    let cv = info[i];
    if(cv.includes(':')){
      if(key){
        obj[key] = value.join('')
      }
      value = []
      let cArr = cv.split(':')
      key = titleMap[cArr[0]]
      if(cArr[1]){
        value.push(cArr[1].trim())
      }
    }else {
      value.push(cv)
    }
  }
  //获取简介
  let bookinfo = $('#link-report').text().trim()
  let doubanRating = $('.rating_num').text().trim()
  bookinfo = bookinfo.split(/\s{2,}/).map((item)=>{
    return `<p>${item}</p>`
  }).join('')
  obj.bookinfo = bookinfo
  obj.doubanRating = doubanRating
  //图片
  let url = $("img[rel$='v:photo']").attr('src')
  obj.url = url;
  return obj

}
// 云函数入口函数
async function main (event, context) {
  let code = event.code
  if(code) {
    let data = await getBookinfo(code)
    return data
  }
}
exports.main = main
