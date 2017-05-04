<template>
	<section>
		<div v-show="showFlag" class="food" transition='move' >
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<div class="back" @click='hide'>
						<i class="icon-arrow_lift"></i>
					</div>
				</div>
				<div class="content">
					<h1 class="title">{{food.name}}</h1>
					<div class="detail">
						<span class="sell-count">月售{{food.sellCount}}份</span>
						<span class="rating">好评率{{food.rating}}%</span>
					</div>
					<div class="price">
						<span class="now">￥{{food.price}}</span>
						<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<cartcontrol :food="food"></cartcontrol>
					</div>
					<div @click.stop.prevent="addFirst" class="buy" v-show="!food.count || food.count===0">加入购物车</div>
				</div>
				<split v-show="food.info"></split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品信息</h1>
					<p class="text">{{food.info}}</p>
				</div>
				<split></split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<ratingselect :select-type='selectType' :only-content='onlyContent' :desc='desc' :ratings='food.ratings'></ratingselect>
					<div class="rating-wrapper">
						<!-- 此处可尝试 v-if -->
						<ul v-show="food.ratings && food.ratings.length">
							<!-- 通过v-show传入函数返回值,与selectType关联 -->
							<li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
								<div class="user">
									<span class="name">{{rating.username}}</span>
									<img :src="rating.avatar"  class="avatar" width="12" height="12">
								</div>
								<!-- 使用vue的filter来格式化时间 -->
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show=" !food.ratings || !food.ratings.length ">暂无评价</div>
					</div>
				</div>
			</div>
			</div>
	</section>
</template>

<script>
// import xx from ..  --对应export default
// import { xx } from .. --对应 export function xx
import cartcontrol from 'components/cartcontrol/cartcontrol'
import Vue from 'vue'
// import { formatDate } from 'common/js/date'
import split from 'components/split/split'
import ratingselect from 'components/ratingselect/ratingselect'
const ALL = 2;
const POSITIVE = 0;
const NEGATIVE = 1;

	export default{
		props:{
			food:{
				type:Object
			}
		},

		data(){
			return{
				showFlag:false,
				selectType:ALL,
				onlyContent:true,
				desc:{
					all:'全部',
					positive:'推荐',
					negative:'吐槽'
				}
			}
		},

		methods:{
			// 父组件可以调用子组件的方法,但是子组件无法调用父组件的方法
			show(){
				this.showFlag = true,
				this.selectType = ALL,
				this.onlyContent = true
			},

			//返回商品页面
			hide(){
				this.showFlag = false;
			},

			//添加购物车商品
			addFirst(event){
				Vue.set(this.food,'count',1)
			},

			//联动
			needShow(type,text){
				if (this.onlyContent && !text){
					return false
				}
				if(this.selectType === ALL){
					return true 
				}else {
					return type === this.selectType
				}
			}
		},//methods end

		//通过event监听子组件ratingselect中$dispatch的两个事件,实现商品评价类型的联动
		events:{
			'ratingtype.select'(type){
				this.selectType = type
			},
			'content.toggle'(onlyContent){
				this.onlyContent = onlyContent
			}
		},

		//定义过滤器filters
		 filters: {
      formatDate(time) {
        let date = new Date(time);
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        let d = date.getDate();
        let h = date.getHours();
        let min = date.getMinutes();

        if( m.toString().length<2){
        	m = "0"+ m
        }
        if(d.toString().length<2){
        	d = '0'+d
        }
        if(h.toString().length<2){
        	h = '0'+h
        }
        if(min.toString().length<2){
        	min = '0'+min
        }
        
        return  y + '-'+ m +  '-' + d + ' '+  h + ':' + min;
      }
    },
		

		components:{
			cartcontrol,
			split,
			ratingselect
		}
	}
</script>

<style lang="stylus">
@import "../../common/stylus/mixin.styl"

	.food
		position:fixed
		left:0
		top:0
		bottom:48px
		z-index:30
		width:100%
		background:#fff
		overflow-y: scroll
		-webkit-overflow-scrolling: touch
		&::-webkit-scrollbar
			display: none
		&.move-transition
			transition:all 0.2s linear
			transform:translate3d(0,0,0)
		&.move-enter,&.move-leave
			transform:translate3d(100%,0,0)
		.image-header
			position:relative
			width:100%
			height:0
			padding-top:100%  /*设置宽高相等的方法*/
			img
				position:absolute
				top:0
				left:0
				width:100%
				height:100%
			.back	
				position:absolute
				top:10px
				left:0
				.icon-arrow_lift
					display:block
					padding:10px
					font-size:20px
					color:#fff
		.content
			position relative
			padding:18px
			.title
				line-height:14px
				margin-bottom:8px
				font-size:14px
				font-weight:700
				color:rgb(7,17,27)			
			.detail
				margin-bottom:18px
				line-height:10px
				height:10px
				font-size:0
				.sell-count,.rating
					font-size:10px
					color:rgb(147,153,159)
				.sell-count
					margin-right:12px
			.price
				font-weight:700
				line-height:24px
				.now
					margin-right:8px
					font-size:14px
					color:rgb(240,20,20)
				.old
					text-decoration: line-through
					font-size:10px
					color:rgb(147,153,159)	
			.cartcontrol-wrapper	
				position:absolute
				right:12px
				bottom: 12px
			.buy
				position:absolute
				right:18px
				bottom:18px
				z-index :10
				height: 24px
				line-height 24px
				padding: 0 12px
				box-sizing: border-box
				border-radius 12px
				font-size 10px
				color #fff
				background: rgb(0,160,260)
		.info
			padding 18px
			line-height 14px
			margin-bottom 6px
			font-size 14px
			color rgb(7,17,27)
		.text 
			line-height 24px
			padding 0 8px
			font-size 12px
			color rgb(77,85,93)	
		.rating 
			padding-top 18px
			.title
				line-height 14px
				margin-left 18px
				font-size 14px
				color rgb(7,17,27)
			.rating-wrapper
				padding 0 18px
				.rating-item
					position relative
					padding 16px 0
					border-1px(rgba(7,17,27,0.1))	
					.user 
						position absolute
						right 0px
						top 16px
						line-height 12px
						font-size 0
						.name 
							display inline-block
							margin-right 6px
							vertical-align top 
							font-size 10px
							color rgb(147,153,159)
						.avatar
							border-radius 50%
					.time 
						margin-bottom 6px
						line-height 12px
						font-size 10px
						color rgb(147,153,159)
					.text 
						line-height 16px
						font-size 12px
						color rgb(7,17,27)	
						.icon-thumb_up,.icon-thumb_down
							margin-right 4px
							line-height 16px
							font-size 12px
						.icon-thumb_up
							color rgb(0,160,220)
						.icon-thumb_down
							color rgb(147,153,159)		
				.no-rating
					padding 16px 0
					font-size 12px
					color rgb(147,153,159)

</style>	