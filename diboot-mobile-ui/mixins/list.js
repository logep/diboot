import dibootApi from '@/utils/dibootApi'
import more from './more'

export default {
	mixins: [more],
	data() {
		return {
			primaryKey: 'id',
			// 请求接口基础路径
			baseApi: '/',
			// 列表数据接口
			listApi: '',
			// 是否从mixin中自动获取初始的列表数据
			getListFromMixin: true,
			// 与查询条件绑定的参数（会被查询表单重置和改变的参数）
			queryParam: {},
			// //下拉刷新的状态
			triggered: false, 
			// load状态
			status: 'loadmore',
			loadText: {
				loadmore: '上拉加载更多',
				loading: '努力加载中',
				nomore: '没有更多了'
			},
			// 分页
			page: {
				pageIndex: 1,
				pageSize: 20,
				totalCount: 0
			},
			// 激活的Index
			activeIndex: -100,
			// 是否弹出删除
			deleteShow: false,
			// 右滑菜单列表
			actionOptions: [{
				text: '编辑',
				type: 'handleUpdate',
				style: {
					backgroundColor: this.$color.warning
				}
			}, {
				text: '删除',
				type: 'handleDelete',
				style: {
					backgroundColor: this.$color.error
				}
			}],
			allowGoDetail: true,
			// 数据列表
			list: [],
			diStatusBarHeight: 0
		}
	},
	onLoad() {
		this.diStatusBarHeight = uni.getSystemInfoSync().statusBarHeight
		this.getListFromMixin && this.getList();
	},
	methods: {
		/**
		 * 新增
		 */
		handleCreate() {
			uni.navigateTo({
				url: './form'
			})
		},
		/*
		 * 详情
		 */
		handleDetail(id) {
			uni.navigateTo({
				url:`./detail?id=${id}`
			})
		},
		/* 
		 * 编辑
		 */
		handleUpdate(id) {
			uni.navigateTo({
				url: `./form?id=${id}`
			})
		},
		/**
		 * 删除
		 */
		handleDelete(id) {
			this.deleteShow = true
			this.activeIndex = id
		},
		/**
		 * 确认删除
		 * @param {Object} id
		 */
		async handleConfirmDel(id) {
			try{
				const res = await dibootApi.remove(`${this.baseApi}/${id}`)
				this.showToast(res.msg, res.code === 0 ? 'success' : 'error')
			}catch(e){
				this.showToast('网络异常！')
			} finally {
				this.handleCancelDel()
			}
			
		},
		/**
		 * 取消删除
		 */
		handleCancelDel() {
			this.deleteShow = false
			this.activeIndex = -100
		},
		/**
		 * @param {Number} index  所在列表的primaryKey
		 * @param {Number} optionIdx  操作列表actionOptions的下标
		 */
		handleActionClick(index, optionIdx) {
			this[this.actionOptions[optionIdx]['type']](index)
		},
		/*
		 * 打开左滑操作
		 */
		handleActiveSwipeAction(index) {
			this.activeIndex = index
		},
		/**
		 * 下拉刷新
		 */
		handlePullDownRefresh() {
			if (this.triggered) return
			this.triggered = true
			this.page.pageIndex = 1
			this.getList(true)
		},
		/**
		 * 触底加载
		 */
		handleOnreachBottom() {
			this.status = 'nomore'
			if (this.page.pageIndex < this.page.totalCount / this.page.pageSize) {
				this.status = 'loading'
				this.getList()
			}
		},
		/**
		 * 获取数据列表
		 */
		async getList(replace = false) {
			const res = await dibootApi.get(this.listApi ? this.listApi : `${this.baseApi}/list`, this.queryParam)
			if (res.code === 0) {
				this.list = replace ? res.data : this.list.concat(res.data)
				this.page = res.page
				this.page.pageIndex++
			} else {
				this.showToast(res.msg)
			}
			this.triggered = false
		},
		/**
		 * 展示提示
		 * @param {Object} title 提示内容
		 * @param {Object} icon 提示icon, 默认使用error
		 */
		showToast(title, icon = 'error') {
			uni.showToast({
			    title,
				icon
			});
		}
	}
}