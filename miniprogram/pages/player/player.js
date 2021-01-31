// pages/player/player.js
let musiclist = []
let playingIndex = 0
const backgroundAudioManager = wx.getBackgroundAudioManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying:false,
    sliderValue: 0,
    updateState: false, 
    playStates: true
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(options.musicId, typeof (options.musicId))
    playingIndex = options.index
    musiclist = wx.getStorageSync('musiclist')
    this._loadMusicDetail(options.musicId)
  },

     _loadMusicDetail(musicId){
      let music = musiclist[playingIndex]
      console.log(music)
      wx.setNavigationBarTitle({
        title: music.name
      })
      this.setData({
        picUrl: music.al.picUrl
      })
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url:'musicUrl'
        }
    }).then((res) =>{
      console.log(res)
      const url = res.result.data[0].url
      if(url === null) {
        wx.showToast({
          title: '没有权限播放',
        })
        backgroundAudioManager.pause()
        this.setData({
          isPlaying: false
        })
        return
      }

      backgroundAudioManager.src = url
      backgroundAudioManager.title = music.name
      backgroundAudioManager.coverImgUrl = music.al.picUrl
      backgroundAudioManager.singer = music.ar[0].name
      this.setData({
        isPlaying:true
      })
    })
  },
  togglePlaying(){
    if(this.data.isPlaying){
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },

  onPrev(){
    playingIndex --;
    if(playingIndex === 0) {
      playingIndex = musiclist.length - 1
    }
    this._loadMusicDetail(musiclist[playingIndex].id)
  },

  onNext() {
    playingIndex ++;
    if(playingIndex === musiclist.length) {
      playingIndex =0
    }
    this._loadMusicDetail(musiclist[playingIndex].id)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('musicId', component)
    this.setData({
      updateState: true
    })
  },

  viedoUpdate(e) {
    if(this.data.updateState) {
      let sliderValue = e.detail.currentTime / e.detail.duration * 100;
      this.setData({
        sliderValue,
        duration: e.detail.duration
      })
    }
  },

  sliderChanging(e) {
    this.setData({
    updateState: false //拖拽过程中，不允许更新进度条
    })
    },

    sliderChange(e) {
      if (this.data.duration) {
      this.videoContext.seek(e.detail.value / 100 * this.data.duration); //完成拖动后，计算对应时间并跳转到指定位置
      this.setData({
      sliderValue: e.detail.value,
      updateState: true //完成拖动后允许更新滚动条
      
      })
      
      }
      
      },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})