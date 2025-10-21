const STORAGE_KEY = 'collections';

Page({
  data: {
    tab: 'all',
    list: [],
    displayList: [],
    counts: { all: 0, pending: 0, resolved: 0, adopted: 0 }
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  loadData() {
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    // mock statuses for demo
    list.forEach((it, idx) => {
      if (!it.status) {
        it.status = idx % 3 === 0 ? 'resolved' : (idx % 2 === 0 ? 'pending' : 'adopted');
      }
    });
    const counts = {
      all: list.length,
      pending: list.filter(i => i.status==='pending').length,
      resolved: list.filter(i => i.status==='resolved').length,
      adopted: list.filter(i => i.status==='adopted').length
    };
    this.setData({ list, counts });
    this.applyFilter();
  },
  switchTab(e) {
    this.setData({ tab: e.currentTarget.dataset.k });
    this.applyFilter();
  },
  applyFilter() {
    const { tab, list } = this.data;
    const filtered = tab === 'all' ? list : list.filter(i => i.status === tab);
    this.setData({ displayList: filtered });
  },
  removeCollection(e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.list.filter(item => item.id !== id);
    wx.setStorageSync(STORAGE_KEY, list);
    this.loadData();
    wx.showToast({
      title: '已取消收藏',
      icon: 'success'
    });
  }
});
