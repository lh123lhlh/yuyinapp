// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'lh-7g764pefd3152a87'
})

// 云函数入口函数
exports.main = async (event, context) => {
  const app = new TcbRouter({
    event
  })

  app.use(async (ctx,next)=>{
    console.log('进入全局中间件')
    ctx.data = {}
    ctx.data.openId = aevent.userInfo.openId
    await next()
    console.log('退出全局中间件')
  })

  app.router('music',async(ctx,next)=>{
    console.log('进入音乐名称中间件')
    ctx.data.musicName = '数鸭子'
    await next()
    console.log('退出音乐名称中间件')
  },async(ctx,next)=>{
    console.log('进入音乐类型中间件')
    ctx.data.musicType = '儿歌'
    ctx.body ={
      data:ctx.data
    }
    console.log('退出音乐类型中间件')
  })

  app.router('blog',async(ctx,next)=>{
    console.log('进入博客名称中间件')
    ctx.data.movieName = '千与千寻'
    await next()
    console.log('退出博客名称中间件')
  },async(ctx,next)=>{
    console.log('进入博客类型中间件')
    ctx.data.movicType = '日本动画片'
    ctx.body = {
      data:ctx.data
    }
    console.log('退出博客类型中间件')
  })
  return app.serve()
}