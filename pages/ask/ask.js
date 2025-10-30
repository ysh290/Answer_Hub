const STORAGE_KEY = 'qa_questions';
const apiConfig = require('../../config/api.js');
const app = getApp(); // 获取全局 App 实例
const userInfo = app.globalData.userInfo; // 从全局变量中获取用户信息
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
    maxImages: 9, // 最多上传9张图片
    //临时密钥
    tmpSecret: {},
    // 提交状态
    isSubmitting: false,
    uploadProgress: 0
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
  // deleteImage(e) {
  //   const { index } = e.currentTarget.dataset;
  //   const { images } = this.data;
    
  //   wx.showModal({
  //     title: '确认删除',
  //     content: '确定要删除这张图片吗？',
  //     success: (res) => {
  //       if (res.confirm) {
  //         images.splice(index, 1);
  //         this.setData({ images });
  //       }
  //     }
  //   });
  // },

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
  async submitQuestion() {
    const { content, images, examTypeIndex, subjectIndex, stageIndex, examTypes, subjects, stages, isSubmitting } = this.data;
    
    // 防止重复提交
    if (isSubmitting) {
      wx.showToast({ title: '正在提交中，请稍候...', icon: 'none' });
      return;
    }
    
    // 表单验证
    if (!content.trim()) {
      wx.showToast({ title: '请输入问题内容', icon: 'none' });
      return;
    }
    
    if (subjectIndex === 0) {
      wx.showToast({ title: '请选择科目', icon: 'none' });
      return;
    }
    
    if (stageIndex === 0) {
      wx.showToast({ title: '请选择考试阶段', icon: 'none' });
      return;
    }

    // 设置提交状态
    this.setData({ isSubmitting: true });

    try {
      // 显示加载状态
      wx.showLoading({ title: '准备提交...' });

      // 第一步：获取临时密钥
      console.log('开始获取临时密钥...');
      wx.showLoading({ title: '获取上传凭证...' });
      const tmpSecretRes = await this.getTempCredentials();
      console.log('临时密钥获取成功:', tmpSecretRes);
      
      // 第二步：上传图片到COS
      let imageUrls = [];
      if (images && images.length > 0) {
        console.log('开始上传图片到COS...');
        wx.showLoading({ title: `上传图片中 0/${images.length}` });
        
        // 逐个上传图片并显示进度
        for (let i = 0; i < images.length; i++) {
          wx.showLoading({ title: `上传图片中 ${i + 1}/${images.length}` });
          try {
            // const timestamp = Date.now();
            // const randomStr = Math.random().toString(36).substr(2, 9);
            // const fileExtension = images[i].url.split('.').pop() || 'jpg';
            // const key = `questions/${timestamp}_${i}_${randomStr}.${fileExtension}`;
            
            // const uploadResult = await this.uploadSingleImage(images[i].url, tmpSecretRes, key);
            const cosUrl = await getApp().uploadImage(images[i])
            imageUrls.push(cosUrl);
            console.log(`图片 ${i + 1} 上传成功:`, cosUrl);
          } catch (uploadError) {
            console.error(`图片 ${i + 1} 上传失败:`, uploadError);
            throw new Error(`第${i + 1}张图片上传失败: ${uploadError.message}`);
          }
        }
        console.log('所有图片上传成功:', imageUrls);
      }
      
      // 第三步：提交问题数据到后端
      console.log('开始提交问题数据...');
      wx.showLoading({ title: '提交问题中...' });
      
      const questionData = {
        question: content.trim(),
        imageUrl: imageUrls,
        askType: examTypes[examTypeIndex],
        askSubject: subjects[subjectIndex],
        askPhase: stages[stageIndex],
        type: 1
      };
      
      const submitRes = await this.submitQuestionToBackend(questionData);
      console.log('问题提交成功:', submitRes);
      console.log("问题提交成功",questionData)
      
      // 提交成功，清除表单数据
      this.clearForm();
      
      wx.hideLoading();
      wx.showToast({ 
        title: '提交成功', 
        icon: 'success',
        duration: 2000
      });
      
      // 延迟跳转到我的提问页面
      setTimeout(() => { 
        wx.switchTab({ url: '/pages/myask/myask' }); 
      }, 2000);
      
    } catch (error) {
      wx.hideLoading();
      console.error('提交问题失败:', error);
      
      // 根据错误类型显示不同的提示
      let errorMessage = '提交失败，请重试';
      if (error.message.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络后重试';
      } else if (error.message.includes('上传')) {
        errorMessage = '图片上传失败，请重试';
      } else if (error.message.includes('密钥')) {
        errorMessage = '获取上传凭证失败，请重试';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      wx.showModal({
        title: '提交失败',
        content: errorMessage,
        showCancel: false,
        confirmText: '确定'
      });
    } finally {
      // 重置提交状态
      this.setData({ isSubmitting: false });
    }
  },

  // 获取临时密钥
  getTempCredentials() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${apiConfig.baseURL}/cos/getTempCredentials`,
        method: "GET",
        timeout: 30000,
        header: {
          'content-type': 'application/json',
          'Authorization': userInfo.token
        },
        success: (res) => {
          if (res.data && res.data.code === 200) {
            resolve(res.data.data);
          } else {
            reject(new Error(res.data?.message || '获取临时密钥失败'));
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败'));
        }
      });
    });
  },

  // 上传单张图片到COS
  // 上传单张图片到COS - 修复版本
  uploadSingleImage(filePath, tmpSecret, key) {
    return new Promise((resolve, reject) => {
      const bucket = 'answer-hub-1258140596';
      const region = 'ap-shanghai';
      const cosUrl = `https://${bucket}.cos.${region}.myqcloud.com`;
      
      console.log('上传参数:', { filePath, key, tmpSecret });
      
      // 使用 POST Object 接口上传
      wx.uploadFile({
        url: cosUrl,
        filePath: filePath,
        name: 'file',
        formData: {
          'key': key,
          'success_action_status': '200',
          'x-cos-security-token': tmpSecret.sessionToken,
          'Signature': tmpSecret.sessionToken, // 直接使用 sessionToken 作为签名
        },
        header: {
          // 对于 POST 上传，通常不需要 Authorization 头
          // 所有认证信息都在 formData 中
        },
        success: (res) => {
          console.log('COS上传响应状态:', res.statusCode);
          console.log('COS上传响应数据:', res.data);
          
          if (res.statusCode === 200) {
            const imageUrl = `https://${bucket}.cos.${region}.myqcloud.com/${key}`;
            resolve({
              success: true,
              url: imageUrl,
              key: key
            });
          } else {
            let errorMsg = `上传失败: ${res.statusCode}`;
            if (res.data) {
              try {
                const errorData = res.data;
                errorMsg += ` - ${errorData}`;
              } catch (e) {
                errorMsg += ` - ${res.data}`;
              }
            }
            reject(new Error(errorMsg));
          }
        },
        fail: (err) => {
          console.error('COS上传网络错误:', err);
          reject(new Error(`网络错误: ${err.errMsg}`));
        }
      });
    });
  },

  // 提交问题数据到后端
  submitQuestionToBackend(questionData) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${apiConfig.baseURL}/ask/post`,
        method: "POST",
        timeout: 30000,
        header: {
          'content-type': 'application/json',
          'Authorization': `${userInfo.token}`
        },
        data: questionData,
        success: (res) => {
          
          console.log(res)
          
          if ( res.data.code === "200") {
           
            resolve(res.data.data);
          } else {
            reject(new Error(res.data?.message || '提交问题失败'));
          }
        },
        fail: (err) => {
          reject(new Error('网络请求失败'));
        }
      });
    });
  },

  // 清除表单数据
  clearForm() {
    this.setData({
      content: '',
      images: [],
      examTypeIndex: 0,
      subjectIndex: 0,
      stageIndex: 0,
      tmpSecret: {},
      isSubmitting: false,
      uploadProgress: 0
    });
  }
});

