import { requireLogin } from '../../utils/auth.js';

Page({
  onShow() {
    if (!requireLogin()) {
      return;
    }
  }
})

