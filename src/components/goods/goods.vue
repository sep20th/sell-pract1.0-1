<template>
	<div class="goods">
		<div class="menu-wrapper">
			<ul>
				<li v-for="item in goods" class="menu-item" :class="{'current':currentIndex === $index}" @click='selectMenu($index,$event)'>
				<!-- 当currentIndex与$index相等时候,会为li标签添加current名 -->
					<span class="text border-1px">
						<span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" v-el:foods-wrapper>
			<ul>
				<li v-for="item in goods" class = "food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="food in item.foods" class="food-item border-1px">
							<div class="icon">
								<img :src="food.icon" width="57" height="57">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span>
									<span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
								</div>
								<!-- 引入cartcontrol组件,便于绝对定位,添加包裹层 -->
								<div class="cartcontrol-wrapper">
									<!-- 在cartcontrol中food增加了count属性,会反过来影响父组件中的food -->
									<cartcontrol :food='food'></cartcontrol>
								</div>
							</div>
						</li>
					</ul>
				</li>
			</ul>
		</div>
		<!-- 引用shopcart(购物车)组件 -->
		<!-- 在初始化shopcart组件时,通过props传入属性值 -->
		<!-- 
			将选中的select-foods传入购物车组件 (需要用中划线)
			这样cart组件和cartcontrol组件联动
		-->
		<shopcart :select-foods="selectFoods" :delivery-price='seller.deliveryPrice' :min-price='seller.minPrice'></shopcart>
	</div>
</template>

<script>
//引用shopcart(购物车)组件
import shopcart from 'components/shopcart/shopcart' 
import cartcontrol from 'components/cartcontrol/cartcontrol' 
	const ERR_OK = 0;
	export default{
		// 外层组件传递给goods组件
		props:{
			seller:{
				type:Object
			}
		},//props end

		data(){
			return{
				goods:[],
				listHeight:[],
				scrollY:0

			}
		},//data end

		created(){
			this.$http.get('api/goods').then((response)=>{
				response = response.body;
				if(response.errno === ERR_OK){
					this.goods = response.data;
					this.$nextTick(()=>{
						this._calculateHeight();

					/*
						放在$nextTick中亦可;
						//获取dom并 监听foods-wrapper滚动事件
						let foodsWrapper = this.$els.foodsWrapper
				 		let _this = this
				 		var top = 0
						foodsWrapper.onscroll=function(){ 
							let top = 0
				      top = this.scrollTop
				      _this.scrollY = top
				    }
			    */ 
					}); //$nextTick end

					//获取dom并 监听foods-wrapper滚动事件
					let foodsWrapper = this.$els.foodsWrapper
			 		let _this = this
					foodsWrapper.onscroll=function(){ 
						let top = 0
			      top = this.scrollTop
			      _this.scrollY = top
			    }
			 		
				}
			});
			this.classMap = ['decrease','discount','special','invoice','guarantee'];
		},//created end

		computed:{
			//利用listheight计算左侧index值
			currentIndex(){
				for(let i=0;i<this.listHeight.length;i++){
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
						return i;
					}
				}
				return 0;
			},//currentIndex

			//被选中的food
			selectFoods (){
				let foods = [];
				this.goods.forEach((good)=>{
					good.foods.forEach((food)=>{
						if(food.count){
							foods.push(food);
						}
					});
				});
				return foods;
			}
	
		},//computed end

		methods:{
			_initScroll(){},

			//计算food-list高度,并保存到listheight中
			_calculateHeight(){
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height)
				for(let i=0;i<foodList.length;i++){
					let item = foodList[i];
					height += item.clientHeight;
					//listHeight数组来存储每个food-list的scrollTop(每个foodlist的clientHeight累加即可得到scrollTop)
					this.listHeight.push(height)
				}
			},

			//左右联动绑定
			//获取被点击DOM的index,然后利用之前listHeight中存储的scrollTop来完成定位
			selectMenu(ids,event){
				// console.log(event) //打酱油
				console.log(this.listHeight)
				let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
				let top = this.listHeight[ids]
				let foodsWrapper = this.$els.foodsWrapper
				foodsWrapper.scrollTop = top
			},//selectMenu end

		},//methods end

		//注册购物车组件
		components:{
			'shopcart':shopcart,
			'cartcontrol':cartcontrol
		}

	}
</script>

<style lang="stylus">
	@import "../../common/stylus/mixin.styl";

	.goods
		position:absolute
		display:flex
		width:100%
		top:174px
		bottom:46px
		overflow:hidden
		.menu-wrapper
			flex:0 0 80px
			width:80px
			background:#f3f5f7;
			// 设置屏幕滚动,隐藏scrollbar
			overflow-y: scroll;
			-webkit-overflow-scrolling: touch
			&::-webkit-scrollbar
				display: none
			.menu-item
				display:table
				height:54px
				width:56px
				line-height:14px
				padding:0 12px
				&.current
					position:relative
					margin-top:-1px
					background:#fff 
					font-weight:700
					z-index:10
					.text
						border-none()
				.icon
					display:inline-block
					vertical-align:top;
					width:12px
					height:12px
					margin-right:2px
					background-size:12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')	
				.text
					display:table-cell
					width:56px
					vertical-align:middle
					border-1px(rgba(7,17,27,0.1))
					font-size:12px
		.foods-wrapper
			flex:1
			// 设置屏幕滚动,隐藏scrollbar
			overflow-y: scroll
			-webkit-overflow-scrolling: touch
			&::-webkit-scrollbar
				display: none
			.title
				padding-left:14px
				height:26px
				line-height:26px
				border-left:2px solid #d9dde1
				font-size:12px
				color:rgb(147,153,159)
				background:#f3f5f7
			.food-item
				display:flex
				margin:18px
				padding-bottom:18px
				border-1px(rgba(7,17,27,0.1))	
				&:last-child
					border-none()
					margin-bottom:0
				.icon
					flex:0 0 57px
					margin-right:10px
				.content
					flex:1
					.name
						margin:2px 0 8px 0
						height:14px
						line-height:14px
						font-size:14px
						color:rgb(7,17,27)
					.desc,.extra
						line-height: 10px
						font-size: 10px
						color:rgb(147,153,159)	
					.desc
						line-height:12px
						margin-bottom:8px	
					.extra
						line-height:10px
						&.count
							margin-right:12px
					.price
						font-weight:700
						line-height:24px
						.now
							margin-right:8px
							font-size:14px
							color:rgb(240,20,20)
						.old
							text-decoration:line-thorgh
							font-size:10px
							color:rgb(147,153,159)	
					.cartcontrol-wrapper
						position:absolute
						right:0
						bottom:12px
								
								

</style>