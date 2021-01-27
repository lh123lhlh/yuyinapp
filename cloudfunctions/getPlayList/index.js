// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'lh-7g764pefd3152a87'
})
const db = cloud.database()

const playListCollection = db.collection('playList')

const axios = require('axios')

const URL = 'http://localhost:3000/top/playlist/highquality?before=1503639064232&limit=20'

exports.main  = async (event,context)=>{
  const{
    data
  } = await axios.get(URL)
  console.log('######' + JSON.stringify(data))

  if(data.code >= 1000) {
    console.log(data.msg)
    return 0
  }
  const playList = data.playLists

  const newData = []

  for(let i = 0, len = playList.length; i < len; i++) {
    let pl = playList[i]

    pl.createTime = db.serverDate()
    newData.push(pl)
  }
  console.log(newData)

  if(newData.length > 0){
    await playListCollection.add({
      data: [...newData]
    }).then((res) =>{
      console.log('插入成功')
    }).catch((err) =>{
      console.log(err)
      console.error('插入失败')
    })
  }
  return newData.length
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}