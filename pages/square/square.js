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
        id: 'q1',
        user: { name: '解知恒', avatar: '/images/avatar-default.png' },
        time: '3分钟前',
        tag: '继电保护',
        image: '',
        content: '4-5 改怎么分析',
        likes: 0,
        comments: 2
      },
      {
        id: 'q2',
        user: { name: '李海阳', avatar: '/images/avatar-default.png' },
        time: '8分钟前',
        tag: '电路原理',
        image: '',
        content: '第八题不能列一下网孔的式子嘛老师',
        likes: 0,
        comments: 0
      }
    ];
    this.setData({ list: mock });
  },
  onExamTypeChange(e) { this.setData({ examTypeIndex: Number(e.detail.value) }); },
  onSubjectChange(e) { this.setData({ subjectIndex: Number(e.detail.value) }); },
  onStageChange(e) { this.setData({ stageIndex: Number(e.detail.value) }); }
});

