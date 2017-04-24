import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import goods from'./components/goods/goods'
import ratings from'./components/ratings/ratings'
import seller from'components/seller/seller' //webpack.base.conf.js 中alias可以配置路径 快速查找

import 'common/stylus/index.styl'

import App from './App'

Vue.use(VueRouter)
Vue.use(VueResource)

let app = Vue.extend(App);

let router = new VueRouter({
	linkActiveClass:"active"
});


//定义路由
router.map({
	'/goods':{
		component:goods
	},
	'/seller':{
		component:seller
	},
	'/ratings':{
		component:ratings
	}

})

router.start(app,'#app')
router.go('/goods')