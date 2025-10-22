Page({
  data: {
    examTypes: ['计算机类', '英语类', '公共课'],
    subjects: ['请选择科目', '电路原理', '继电保护', '数据结构'],
    stages: ['请选择阶段', '备考', '期中', '期末'],
    examTypeIndex: 0,
    subjectIndex: 0,
    stageIndex: 0,
    list: []
  },
  onLoad() {
    this.loadMock();
  },
  loadMock() {
    const mock = [
      {
        id: '1',
        user: { name: '解知恒', avatar: '/static/user/用户.png' },
        time: '3分钟前',
        tag: '继电保护',
        image:  '/static/继电保护.png',
        content: '这个怎么分析',
        likes: 0,
        comments: 2,
        collections:0,
        issolved:true
      },
      {
        id: '2',
        user: { name: '李海阳', avatar: '/static/user/用户.png' },
        time: '8分钟前',
        tag: '电路原理',
        image: '/static/电路原理.png',
        content: '老师这个怎么分析',
        likes: 0,
        comments: 0,
        collections:0,
        issolved:false
      }
    ];
    this.setData({ list: mock });
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

