const STORAGE_KEY = 'qa_questions';

Page({
  data: {
    examTypes: ['计算机类', '英语类', '公共课'],
    subjects: ['请选择科目', '电路原理', '继电保护', '数据结构'],
    stages: ['请选择阶段', '备考', '期中', '期末'],
    examTypeIndex: 0,
    subjectIndex: 0,
    stageIndex: 0,
    content: '',
    image: ''
  },
  onExamTypeChange(e) { this.setData({ examTypeIndex: Number(e.detail.value) }); },
  onSubjectChange(e) { this.setData({ subjectIndex: Number(e.detail.value) }); },
  onStageChange(e) { this.setData({ stageIndex: Number(e.detail.value) }); },
  onContentInput(e) { this.setData({ content: e.detail.value }); },
  chooseImage() {
    wx.chooseMedia({ count: 1, mediaType: ['image'] }).then(res => {
      const filePath = res.tempFiles[0]?.tempFilePath || '';
      this.setData({ image: filePath });
    }).catch(()=>{});
  },
  aiAnswer() {
    wx.showToast({ title: 'AI正在思考...', icon: 'none' });
  },
  submitQuestion() {
    const { content } = this.data;
    if (!content.trim()) {
      wx.showToast({ title: '请输入问题内容', icon: 'none' });
      return;
    }
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    const item = {
      id: 'q_' + Date.now(),
      content: this.data.content,
      image: this.data.image,
      examType: this.data.examTypes[this.data.examTypeIndex],
      subject: this.data.subjects[this.data.subjectIndex],
      stage: this.data.stages[this.data.stageIndex],
      time: '刚刚',
      likes: 0,
      comments: 0
    };
    list.unshift(item);
    wx.setStorageSync(STORAGE_KEY, list);
    wx.showToast({ title: '提交成功' });
    setTimeout(() => { wx.switchTab({ url: '/pages/myask/myask' }); }, 500);
  }
});

