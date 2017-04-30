<template>
	<section class="shopcart">
		<div class="content">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo" :class = "{'heighlight':totalCount>0}">
						<i class="icon-shopping_cart" :class = "{'heighlight':totalCount>0}"></i>
					</div>
					<div class="num" v-show="totalCount>0">{{totalCount}}</div>
				</div>
				<div class="price" :class = "{'heighlight':totalPrice>0}">￥{{totalPrice}}</div>
				<div class="desc">另需配送费￥{{deliveryPrice}}元</div>
			</div>
			<div class="content-right">
				<div class="pay" :class="payClass">{{payDesc}}</div>
			</div>
		</div>

	</section>
</template>
<script>
	export default{
		//接收父组件传递的值
		props:{
			selectFoods:{
				// 如果类型是数组对象,default需为函数
				type:Array,
				default(){
					return [{price:10,count:1}]
				}
			},
			deliveryPrice:{
				//设置类型和默认值
				type:Number,
				default:0
			},
			minPrice:{
				type:Number,
				default:0
			}
		},//props end

		computed:{

			//计算选中的food总价
			totalPrice(){
			  let total = 0;
			  this.selectFoods.forEach((food)=>{
			  	//为food添加count属性,并利用该属性计算总价
			  	total += food.price * food.count
			  })
			  return total;
			},//totalPrice end

			//计算数量总和
			totalCount(){
				let count = 0;
				this.selectFoods.forEach((food)=>{
					count += food.count;
				});
				return count;
			}, //totalCount end

			//计算配送费差额
			payDesc() {
				if(this.totalPrice === 0){
					//用`${}`可以将变量传入,不用去拼字符串(es6 字符串扩展)
					return `￥${this.minPrice}元起送`
				}else if(this.totalPrice<this.minPrice){
					let diff = this.minPrice - this.totalPrice
					return `还差￥${diff}远起送`
				} else {
					return '去结算'
				}
			},//payDesc end

			payClass(){
				if(this.totalPrice<this.minPrice){
					return 'not-enough'
				}else{
					return "enough"
				}
			}
		},//computed end
	};
</script>
<style lang="stylus">
	.shopcart
		position:fixed
		left:0
		bottom:0
		height:48px
		width:100%
		z-index:50
		.content
			display:flex
			background:#141d27
			font-size:0
			color:rgba(255,255,255,0.4)
			.content-left
				flex:1
				.logo-wrapper
					display:inline-block
					position:relative
					top:-10px 
					margin:0 12px
					padding:6px
					width:56px
					height:56px
					box-sizing:border-box
					border-radius:50%
					background:#141d27
					.logo
						width:100%
						height:100%
						border-radius:50%
						text-align:center
						background:#2b343c
						&.heighlight
							background:rgb(0,160,220)
						.icon-shopping_cart
							line-height:44px
							font-size:24px
							color:#80858a
							&.heighlight
								color:#fff
					.num
						position:absolute
						top:0
						right:0
						width:24px
						height:16px
						line-height:16px
						text-align:center
						border-radius:16px
						font-size:9px
						font-weight:700
						color:#fff
						background:rgb(240,20,20)
						box-shadow:0 4px 8px 0 rgba(0,0,0,0.4)
				.price
					display:inline-block
					vertical-align:top
					line-height:24px
					margin-top:12px
					box-sizing:border-box
					padding-right:12px
					border-right:1px solid rgba(255,255,255,0.1)
					font-size:16px
					font-weight:700
					&.heighlight
						color:#fff
				.desc	
					display:inline-block
					vertical-align:top
					line-height:24px
					margin:12px 0 0 12px
					font-size:10px
			.content-right
				flex:0 0 105px
				width:105px		
				.pay
					height:48px
					line-height:48px
					text-align:center
					font-size:12px
					font-weight:700
					background:#2b333b
					&.not-enough
						background:#2b333b
					&.enough
						background:#00b43c
						color:#fff	
</style>