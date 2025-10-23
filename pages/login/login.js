const apiConfig = require('../../config/api.js');

Page({
  data: {
    currentTab: 'login', 
    loginForm: {
      phone: '',
      password: ''
    },
    registerForm: {
      phone: '',
      code: '',
      nickname: '',
      password: '',
      confirmPassword: '',
      campus: '',
      examType: ''
    },
    countdown: 0,
    campuses: ['北京校区', '上海校区', '广州校区', '深圳校区'],
    examTypes: ['国家电网', '南方电网', '其他'],
    showCampusPicker: false,
    showExamTypePicker: false,
    agreeTerms: false,
    // 微信登录相关
    showAvatarNickname: false,
    tempAvatarUrl: '',
    tempNickname: '',
    wechatCode: ''
  },

  onLoad() {
    // 页面加载
  },

  // 切换标签页
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab
    });
  },

  // 登录表单输入
  onLoginInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`loginForm.${field}`]: e.detail.value
    });
  },

  // 注册表单输入
  onRegisterInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [`registerForm.${field}`]: e.detail.value
    });
  },

  // 获取验证码
  getCode() {
    console.log('📱 开始获取验证码流程');
    const phone = this.data.registerForm.phone;
    
    console.log('📝 手机号:', phone);
    
    if (!phone) {
      console.log('❌ 手机号为空');
      wx.showToast({
        title: '请先输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!/^1[3-9]\d{9}$/.test(phone)) {
      console.log(' 手机号格式不正确:', phone);
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    console.log(' 手机号验证通过，开始调用后端发送验证码接口');
    
    // 调用后端发送验证码接口
    wx.showLoading({
      title: '发送中...'
    });

    const requestData = {
      "phone": phone
    };
    
    console.log('发送验证码请求数据:', requestData);

    wx.request({
      url: apiConfig.baseURL + apiConfig.apis.sendCode,
      dataType: "JSON",
      method: "POST",
      timeout: apiConfig.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      success: (res) => {
        console.log(' 发送验证码接口响应:', res);
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data) {
          console.log('验证码发送成功，响应数据:', res.data);
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          });
          
          // 开始倒计时
          console.log('开始60秒倒计时');
          this.startCountdown();
        } else {
          console.log(' 验证码发送失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({
            title: res.data.message || '发送失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error('发送验证码请求失败:', err);
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

  // 显示校区选择器
  showCampusPicker() {
    this.setData({ showCampusPicker: true });
  },

  // 显示考试类型选择器
  showExamTypePicker() {
    this.setData({ showExamTypePicker: true });
  },

  // 选择校区
  onCampusChange(e) {
    this.setData({
      'registerForm.campus': this.data.campuses[e.detail.value],
      showCampusPicker: false
    });
  },

  // 选择考试类型
  onExamTypeChange(e) {
    this.setData({
      'registerForm.examType': this.data.examTypes[e.detail.value],
      showExamTypePicker: false
    });
  },


  // 登录
  login() {
    console.log(' 开始普通登录流程');
    const { phone, password } = this.data.loginForm;
    
    console.log(' 登录表单数据:', { phone, password: '***' });
    
    if (!phone) {
      console.log(' 手机号为空');
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      console.log(' 密码为空');
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    if (!this.data.agreeTerms) {
      console.log(' 用户未同意协议');
      wx.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }

    console.log(' 表单验证通过，开始调用后端登录接口');
    
    // 调用后端登录接口
    wx.showLoading({
      title: '登录中...'
    });

    const requestData = {
      "code": phone, // 使用手机号作为登录主提
      "userName": phone,
      "userType": "ROLE_USER"
    };
    
    console.log(' 发送登录请求数据:', requestData);

    wx.request({
      url: apiConfig.baseURL + apiConfig.apis.login,
      dataType: "JSON",
      method: "POST",
      timeout: apiConfig.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      success: (res) => {
        console.log(' 登录接口响应:', res);
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data) {
          console.log(' 登录成功，后端返回数据:', res.data);
          
          const userInfo = {
            phone: phone,
            nickname: res.data.nickname || '用户' + phone.slice(-4),
            token: res.data.token,
            userType: res.data.userType || 'ROLE_USER',
            isLogin: true
          };
          
          console.log(' 保存用户信息到本地存储:', userInfo);
          wx.setStorageSync('user_info', userInfo);

          console.log(' 登录完成，显示成功提示');
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });

          setTimeout(() => {
            console.log(' 返回上一页');
            wx.navigateBack();
          }, 1500);
        } else {
          console.log(' 登录失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({
            title: res.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error(' 登录请求失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 注册
  register() {
    console.log(' 开始用户注册流程');
    const { phone, code, nickname, password, confirmPassword, campus, examType } = this.data.registerForm;
    
    console.log(' 注册表单数据:', { 
      phone, 
      code, 
      nickname, 
      password: '***', 
      confirmPassword: '***', 
      campus, 
      examType 
    });
    
    if (!phone) {
      console.log(' 手机号为空');
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return;
    }

    if (!code) {
      console.log(' 验证码为空');
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      });
      return;
    }

    if (!nickname) {
      console.log(' 昵称为空');
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    if (!password) {
      console.log(' 密码为空');
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      });
      return;
    }

    if (password !== confirmPassword) {
      console.log(' 两次密码输入不一致');
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      });
      return;
    }

    if (!campus) {
      console.log(' 校区未选择');
      wx.showToast({
        title: '请选择校区',
        icon: 'none'
      });
      return;
    }

    if (!examType) {
      console.log('考试类型未选择');
      wx.showToast({
        title: '请选择考试类型',
        icon: 'none'
      });
      return;
    }

    if (!this.data.agreeTerms) {
      console.log(' 用户未同意协议');
      wx.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }

    console.log(' 表单验证通过，开始调用后端注册接口');
    
    // 调用后端注册接口
    wx.showLoading({
      title: '注册中...'
    });

    const requestData = {
      "phone": phone,
      "code": code,
      "nickname": nickname,
      "password": password,
      "campus": campus,
      "examType": examType,
      "userType": "ROLE_USER"
    };
    
    console.log(' 发送注册请求数据:', requestData);

    wx.request({
      url: apiConfig.baseURL + apiConfig.apis.register,
      dataType: "JSON",
      method: "POST",
      timeout: apiConfig.timeout,
      header: {
        'Content-Type': 'application/json'
      },
      data: JSON.stringify(requestData),
      success: (res) => {
        console.log(' 注册接口响应:', res);
        wx.hideLoading();
        
        if (res.statusCode === 200 && res.data) {
          console.log(' 注册成功，后端返回数据:', res.data);
          
          const userInfo = {
            phone: phone,
            nickname: nickname,
            campus: campus,
            examType: examType,
            token: res.data.token,
            userType: res.data.userType || 'ROLE_USER',
            isLogin: true
          };
          
          console.log(' 保存用户信息到本地存储:', userInfo);
          wx.setStorageSync('user_info', userInfo);

          console.log(' 注册完成，显示成功提示');
          wx.showToast({
            title: '注册成功',
            icon: 'success'
          });

          setTimeout(() => {
            console.log(' 返回上一页');
            wx.navigateBack();
          }, 1500);
        } else {
          console.log(' 注册失败，状态码:', res.statusCode, '响应数据:', res.data);
          wx.showToast({
            title: res.data.message || '注册失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error(' 注册请求失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

  // 切换协议勾选
  toggleAgreeTerms() {
    this.setData({
      agreeTerms: !this.data.agreeTerms
    });
  },

  // 忘记密码
  forgotPassword() {
    wx.navigateTo({
      url: '/pages/forgotpassword/forgotpassword'
    });
  },

  // 微信快捷登录
  wechatLogin() {
    console.log(' 开始微信快捷登录流程');
    
    if (!this.data.agreeTerms) {
      console.log(' 用户未同意协议，无法登录');
      wx.showToast({
        title: '请先同意用户协议和隐私政策',
        icon: 'none'
      });
      return;
    }

    console.log(' 用户已同意协议，开始获取微信登录code');
    
    // 先获取微信登录code
    wx.login({
      success: (res) => {
        console.log(' wx.login() 成功回调:', res);
        
        if (res.code) {
          console.log(' 获取到微信登录code:', res.code);
          
          // 保存code，显示头像昵称填写界面
          this.setData({
            wechatCode: res.code,
            showAvatarNickname: true,
            tempNickname: '微信用户' + Math.floor(Math.random() * 1000)
          });
        } else {
          console.log(' 未获取到微信登录code，响应:', res);
          wx.showToast({
            title: '获取微信登录信息失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error(' wx.login() 调用失败:', err);
        wx.showToast({
          title: '微信登录失败',
          icon: 'none'
        });
      }
    });
  },

  // 选择头像
  onChooseAvatar(e) {
    console.log(' 选择头像:', e.detail);
    this.setData({
      tempAvatarUrl: e.detail.avatarUrl
    });
  },

  // 输入昵称
  onNicknameInput(e) {
    this.setData({
      tempNickname: e.detail.value
    });
  },

  // 取消头像昵称填写
  cancelAvatarNickname() {
    this.setData({
      showAvatarNickname: false,
      tempAvatarUrl: '',
      tempNickname: '',
      wechatCode: ''
    });
  },

  // 确认头像昵称填写
  confirmAvatarNickname() {
    const { tempNickname, tempAvatarUrl, wechatCode } = this.data;
    
    if (!tempNickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      });
      return;
    }

    console.log(' 确认用户信息，开始登录');
    
    // 显示加载提示
    wx.showLoading({
      title: '登录中...'
    });

    // 调用后端微信登录接口
    wx.request({
      url: `${apiConfig.baseURL}/user/login`,
      method: "POST",
      timeout: 30000,
      header: {
        'Content-Type': 'application/json'
      },
      data: {
        "code": wechatCode,
        "userName": tempNickname,
        "userType": "学生"
      },
      success: (loginRes) => {
        console.log(' 后端登录接口响应:', loginRes);
        wx.hideLoading();
        
        if (loginRes.statusCode === 200 && loginRes.data) {
          console.log(' 后端登录成功，响应数据:', loginRes.data);
          
          const userInfo = {
            nickname: loginRes.data.data?.userName || tempNickname,
            avatar: tempAvatarUrl || '/static/user/用户.png',
            token: loginRes.data.data?.token || '',
            userType: loginRes.data.data?.userType || '学生',
            isLogin: true,
            isWechatLogin: true
          };
          
          console.log(' 保存用户信息到本地存储:', userInfo);
          wx.setStorageSync('user_info', userInfo);

          // 隐藏头像昵称填写界面
          this.setData({
            showAvatarNickname: false,
            tempAvatarUrl: '',
            tempNickname: '',
            wechatCode: ''
          });

          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });

          setTimeout(() => {
            console.log(' 返回上一页');
            wx.navigateBack();
          }, 1500);
        } else {
          console.log(' 后端登录失败，状态码:', loginRes.statusCode, '响应数据:', loginRes.data);
          wx.showToast({
            title: loginRes.data.message || '登录失败',
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        wx.hideLoading();
        console.error(' 微信登录请求失败:', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      }
    });
  },

})
