Page({
  data: {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  },

  // 输入当前密码
  onCurrentPasswordInput(e) {
    this.setData({
      currentPassword: e.detail.value
    });
  },

  // 输入新密码
  onNewPasswordInput(e) {
    this.setData({
      newPassword: e.detail.value
    });
  },

  // 输入确认密码
  onConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    });
  },

  // 确认修改密码
  confirmChange() {
    const { currentPassword, newPassword, confirmPassword } = this.data;

    // 验证输入
    if (!currentPassword) {
      wx.showToast({
        title: '请输入当前密码',
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

    // 模拟密码修改
    wx.showLoading({
      title: '修改中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '密码修改成功',
        icon: 'success'
      });
      
      // 清空输入
      this.setData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 2000);
  }
})
