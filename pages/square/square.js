const apiConfig = require('../../config/api.js');
const app = getApp(); // 获取全局 App 实例
const userInfo = app.globalData.userInfo; // 从全局变量中获取用户信息
Page({
  data: {
    examTypes: ['计算机类', '英语类', '公共课'],
    subjects: ['请选择科目', '电路原理', '继电保护', '数据结构'],
    stages: ['请选择阶段', '备考', '期中', '期末'],
    examTypeIndex: 0,
    subjectIndex: 0,
    stageIndex: 0,
    list: [],
    page: 1, // 当前页码
    pageSize: 10, // 每页显示的数量
    loading: false,
    noMore: false
  },
  onLoad() {
    this.loadPost();
  },
  onReachBottom() {
    if (!this.data.loading && !this.data.noMore) {
      this.loadPosts();
    }
  },
  loadPost() {
    const { page, pageSize } = this.data;
      this.setData({ loading: true });
      wx.request({
        url: `${apiConfig.baseURL}/community/getPosts`, // 后端接口地址
        method: 'GET',
        header: {
          'Authorization': `${userInfo.token}`
        },
        data: {
          page,
          pageSize
        },
        success: (res) => {
          const { data } = res.data;
          if (data.length === 0) {
            this.setData({ noMore: true });
          } else {
          
            this.setData({
              list: this.data.list.concat(data), // 将新数据追加到列表
              page: this.data.page + 1 // 更新页码
            });
            console.log(data)
          }
        },
        complete: () => {
          this.setData({ loading: false });
        }
      });
  },
  likePost(e){

  },
  onExamTypeChange(e) { this.setData({ examTypeIndex: Number(e.detail.value) }); },
  onSubjectChange(e) { this.setData({ subjectIndex: Number(e.detail.value) }); },
  onStageChange(e) { this.setData({ stageIndex: Number(e.detail.value) }); },
  goToDetail(e){
    
    console.log(e.currentTarget)

    const postId=e.currentTarget.dataset.id
    
    wx.navigateTo({
      url: `/pages/squareDetail/squareDetail?id=${postId}`,
    })
  }
});

