const STORAGE_KEY = 'qa_questions';

Page({
  data: { stats: { total: 0, pending: 0, resolved: 0, adopted: 0 } },
  onShow() {
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    const stats = {
      total: list.length,
      pending: list.filter(i => i.status==='pending').length,
      resolved: list.filter(i => i.status==='resolved').length,
      adopted: list.filter(i => i.status==='adopted').length
    };
    this.setData({ stats });
  }
});

