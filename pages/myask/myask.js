const STORAGE_KEY = 'qa_questions';
<<<<<<< HEAD
import { requireLogin } from '../../utils/auth.js';
=======
>>>>>>> 76ecb50dd8ab3b0f753cebc9bd23af6c44997fa6

Page({
  data: {
    tab: 'all',
    list: [],
    displayList: [],
    counts: { all: 0, pending: 0, resolved: 0, adopted: 0 }
  },
<<<<<<< HEAD
  onLoad(options) {
  
    if (options.tab) {
      this.setData({ tab: options.tab });
    }
  },
  onShow() {
    if (!requireLogin()) {
      return;
    }
    this.loadData();
    this.applyFilter();
=======
  onShow() {
    this.loadData();
>>>>>>> 76ecb50dd8ab3b0f753cebc9bd23af6c44997fa6
  },
  loadData() {
    const list = wx.getStorageSync(STORAGE_KEY) || [];
    // mock statuses
    list.forEach((it, idx) => {
      it.status = idx % 3 === 0 ? 'resolved' : (idx % 2 === 0 ? 'pending' : 'adopted');
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
  }
});

