const apiConfig = require('../../config/api.js');

Page({
  data: {
    form: {
      phone: '',
      code: '',
      newPassword: '',
      confirmPassword: ''
    },
    countdown: 0
  },

  onLoad() {
    // 页面加载
  },

  // 表单输入
  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`form.${field}`]: e.detail.value
    });
  },

  // 获取验证码
  getCode() {
    if (!this.data.form.phone) {
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(this.data.form.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 调用后端发送验证码接口骚鸡
    wx.showLoading({
      title: '发送中...'
    });

    wx.request({
      url: apiConfig.baseURL + apiConfig.apis.sendCode,
      dataType: "JSON",
      method: "POST",
      timeout: apiConfig.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "phone": this.data.form.phone
      }),
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
          
          // 开始倒计时
          this.startCountdown();
        } else {
          wx.showToast({
            title: res.data.message || '发送失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('发送验证码失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 开始倒计时
  startCountdown() {
    this.setData({ countdown: 60 });
    const timer = setInterval(() => {
      if (this.data.countdown <= 1) {
        clearInterval(timer);
        this.setData({ countdown: 0 });
      } else {
        this.setData({ countdown: this.data.countdown - 1 });
      }
    }, 1000);
  },

  // 确认重置密码
  confirmReset() {
    const { phone, code, newPassword, confirmPassword } = this.data.form;
    
    if (!phone) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!code) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }

    if (!newPassword) {
      wx.showToast({
        title: '请输入新密码',
        icon: 'none'
      });
      return;
    }

    if (newPassword.length < 6) {
      wx.showToast({
        title: '新密码至少6位',
        icon: 'none'
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    // 调用后端重置密码接口等骚鸡
    wx.showLoading({
      title: '重置中...'
    });

    wx.request({
      url: apiConfig.baseURL + apiConfig.apis.resetPassword,
      dataType: "JSON",
      method: "POST",
      timeout: apiConfig.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({
        "phone": phone,
        "code": code,
        "newPassword": newPassword
      }),
      success: (res) => {
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data) {
          wx.showToast({
            title: '密码重置成功',
            icon: 'success'
          });

          // 清空表单
          this.setData({
            form: {
              phone: '',
              code: '',
              newPassword: '',
              confirmPassword: ''
            }
          });

          // 延迟返回
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        } else {
          wx.showToast({
            title: res.data.message || '重置失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('重置密码失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  }
})
