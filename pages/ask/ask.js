const STORAGE_KEY = 'qa_questions';
import { requireLogin } from '../../utils/auth.js';

Page({
  data: {
    examTypes: ['计算机类', '英语类', '公共课'],
    subjects: ['请选择科目', '电路原理', '继电保护', '数据结构'],
    stages: ['请选择阶段', '备考', '期中', '期末'],
    examTypeIndex: 0,
    subjectIndex: 0,
    stageIndex: 0,
    content: '',
    images: [], // 改为数组存储多张图片
    maxImages: 9 // 最多上传9张图片
  },
  onExamTypeChange(e) { this.setData({ examTypeIndex: Number(e.detail.value) }); },
  onSubjectChange(e) { this.setData({ subjectIndex: Number(e.detail.value) }); },
  onStageChange(e) { this.setData({ stageIndex: Number(e.detail.value) }); },
  onContentInput(e) { this.setData({ content: e.detail.value }); },
  onShow() {
    if (!requireLogin()) {
      return;
    }
  },
  // 选择图片
  chooseImage() {
    const { images, maxImages } = this.data;
    const remainingCount = maxImages - images.length;
    
    if (remainingCount <= 0) {
      wx.showToast({
        title: `最多只能上传${maxImages}张图片`,
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remainingCount,
      mediaType: ['image'],
      sizeType: ['compressed'],
      sourceType: ['album', 'camera']
    }).then(res => {
      const newImages = res.tempFiles.map(file => ({
        id: 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        url: file.tempFilePath,
        size: file.size
      }));
      
      this.setData({
        images: [...images, ...newImages]
      });
    }).catch(err => {
      console.error('选择图片失败:', err);
      wx.showToast({
        title: '选择图片失败',
        icon: 'none'
      });
    });
  },

  // 删除图片
  deleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这张图片吗？',
      success: (res) => {
        if (res.confirm) {
          images.splice(index, 1);
          this.setData({ images });
        }
      }
    });
  },

  // 预览图片
  previewImage(e) {
    const { index } = e.currentTarget.dataset;
    const { images } = this.data;
    const urls = images.map(img => img.url);
    
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },
  aiAnswer() {
    wx.showToast({ title: 'AI正在思考...', icon: 'none' });
  },
  submitQuestion() {
    const { content, images } = this.data;
    if (!content.trim()) {
      wx.showToast({ title: '请输入问题内容', icon: 'none' });
      return;
    }
    
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    const item = {
      id: 'q_' + Date.now(),
      content: this.data.content,
      images: images, // 存储多张图片
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

