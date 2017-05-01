<template>
	<section class="cartcontrol">
		<div class="cart-decrease" v-show="food.count>0"  @click='decreaseCart'
		 transition="move">
			<span class="inner icon-remove_circle_outline"></span>
		</div>
		<div class="cart-count" v-show="food.count>0">{{food.count}}</div>
		<div class="cart-add icon-add_circle" @click="addCart"></div>
	</section>
</template>

<script>
	//全局引用Vue
	import Vue from 'vue'

	export default{
		//在使用该组件时,一定要传入food参数
		//cartcontrol 修改了food属性的时候,就会影响到父组件中的food
		props:{
			food:{
				type:Object
			}
		},

		created(){
			// console.log(this.food)
		},//created end

		methods:{
			addCart(){
				//首先判断food.count是否存在
				if(!this.food.count){
					//当给一个对象添加一个不存在的字段(属性)的时候,不能直接赋值,赋值vue检测不到该属性变化,在新增(删除)某个字段时,若要vue监听到该变化,需要使用vue的接口set
					// this.food.count = 1;

					//使用vue.set接口,为this.food添加count属性,值设为1;变化会被观测到
					Vue.set(this.food,'count',1)
				}else{
					this.food.count++
				}
			},//addCart end

			decreaseCart(){
				if(this.food.count){
					this.food.count--
				}
			}
		},//methods end

		
	}
</script>

<style lang="stylus">
	.cartcontrol
		font-size:0
		.cart-decrease
			display:inline-block
			padding:6px
			transition:all 0.4s linear
			&.move-transition    //动画完成后vue会添加该属性
				opacity:1
				transform:translate3D(0,0,0)  //使用3D能开启硬件加速,使动画更加流畅
				.inner	                      //inner嵌套在move-transition下
					display:inline-block
					font-size:24px
					line-height:24px
					color:rgb(0,160,220)
					transition:all 0.4s linear
					transform:rotate(0)
			&.move-enter,&.move-leave
				opacity:0
				transform:translate3D(24px, 0, 0)
				.inner
					transform:rotate(180deg)
		.cart-count
			display:inline-block
			vertical-align:top
			width:12px
			padding-top:6px
			line-height:24px
			text-align:center
			font-size:10px
			color:rgb(147,153,159)
		.cart-add
			display:inline-block
			padding:6px
			font-size:24px
			line-height:24px
			color:rgb(0,160,220)
</style>