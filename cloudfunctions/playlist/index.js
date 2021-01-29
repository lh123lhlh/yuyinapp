// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'lh-7g764pefd3152a87'
})
//引入云数据库，并定义一个常量方便调用
const db = cloud.database()
//引入云数据库的playlist集合，并定义一个常量方便使用
const playListCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {


  const res = await playListCollection.get()
  console.log('#######' + res.data)
  return res.data
}