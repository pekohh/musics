<template>
	<div class="home">
		<head-top></head-top>
		<swipe class="wrapper" :auto="7000" :speed="800">
		  <swipe-item v-for="img in images">
		  	<a :href="img.Recommended_Info_Url">
		  		<img :src="img.Recommended_Info_Pic" :alt="img.Recommended_Info_Name">
		  	</a>
		  </swipe-item>
		</swipe>
		<ul class="menu">
			<li v-for="menu in menus">
				<a href="menu.href">
					{{menu.text}}
				</a>
			</li>
		</ul>
		<div class="information">
			<div class="title">
				<span>留学资讯</span>
				<router-link to="/more">
					更多 >>
				</router-link>
			</div>
			<ul class="_info_list">
				<li v-for="item in items">
					<router-link :to="'/news/detail/' + item.News_ID" append>
						<img :src="item.News_Pic.split('|')[0]" alt="">
						<div class="_list_text">
							<p>{{item.News_Title}}</p>
							<div class="_list_num">
								<svg>
									<use xlink:href="#eyes"></use>
								</svg>
								<label>{{parseInt(item.News_Click) + 1000}}</label>
								<span>{{item.Add_Date.split(" ")[0]}}</span>
							</div>
						</div>
					</router-link>
				</li>
			</ul>
		</div>
		<div class="library">
			<div class="title">
				<span>日本院校库</span>
				<ul class="nav">
					<li class="active">关东</li>
					<li>近畿</li>
					<li>中国四国</li>
					<li>东海</li>
					<li>九州冲绳</li>
				</ul>
			</div>
			<ul class="_library_content">
				<li class="_library_wrapper" v-for="school in schools">
				{{school.List[0]}}
				<img :src="school.List[0].School_Pic">
					<a href="" class="_library_column" v-for="name in school.List">
						<img :src="name.School_Pic" :alt="name.School_Name">
						<span>{{name.School_Name}}</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="raiders">
			<div class="title">
				<span>留学攻略</span>
				<a href="">更多>></a>
			</div>
			<ol class="_news_list">
				<li v-for="(list,index) in lists">
					<router-link :to="'/news/detail/' + list.News_ID">
						<label>{{index+=1}}</label>
						<span>{{list.News_Title}}</span>
					</router-link>
				</li>
			</ol>
		</div>
		<div class="qaq">
			<div class="title">
				<span>在线问答</span>
				<a href="">更多>></a>
			</div>
			<ul class="_QAQ">
				<li v-for="qaq in qaqs">
					<a href="">
						<div class="_QAQ_user">
							<p><span>问</span>{{qaq.F_QAContent}}</p>
						</div>
						<div class="_QAQ_admin">
							<p><span>答</span>{{qaq.QA_Content}}</p>
						</div>
					</a>
				</li>
			</ul>
		</div>
		<div class="_group_img">
			<a href=""></a>
		</div>
		<foot-bottom></foot-bottom>
	</div>
</template>

<script>
	import headTop from 'components/headTop'
	import footBottom from 'components/footBottom'
	import request from 'superagent'
	import { Swipe, SwipeItem } from 'vue-swipe'
	export default {
		name: 'home',
		components: {
			headTop,
			footBottom,
			Swipe,
			SwipeItem
		},
		data() {
			return {
				menus: [
					{href: "",text: "语言学校"},
					{href: "",text: "日本研究生"},
					{href: "",text: "别科"},
					{href: "",text: "专门学校"},
					{href: "",text: "大学编入"},
					{href: "",text: "大学"},
					{href: "",text: "大学院"},
					{href: "",text: "私塾"}
				],
				schools: [],
				lists: [],
				images: [],
				items: [],
				qaqs: []
			}
		},
		computed: {
			getNews() {
				let self = this
				request
					.get("http://mrb.xsjedu.org/Home/StrategyNewsList")
					.end(function(err,res){
						if(!err){
							self.lists = JSON.parse(res.text)
						}else{
							console.log(err)
						}
					})
			},
			getSchool() {
				let self = this
				request
					.get("http://mrb.xsjedu.org/Home/schoollist")
					.end(function(err,res){
						if(!err){
							self.schools = JSON.parse(res.text)
						}else{
							console.log(err)
						}
					})
			},
			getImage() {
				let self = this
				request
					.get("http://mrb.xsjedu.org/Home/CarouselList")
					.end(function(err,res){
						if(!err){
							self.images = JSON.parse(res.text)
						}else{
							console.log(err)
						}
					})
			},
			getItems() {
				let self = this
				request
					.get("http://mrb.xsjedu.org/Home/InformationNewsList")
					.end(function(err,res){
						if(!err){
							self.items = JSON.parse(res.text)
						}else{
							console.log(err)
						}
					})
			},
			getQAQ() {
				let self = this
				request
					.get("http://mrb.xsjedu.org/Home/InterlocutionList")
					.end(function(err,res){
						if(!err){
							self.qaqs = JSON.parse(res.text)
						}else{
							console.log(err)
						}
					})
			}
		},
		mounted() {
			this.getNews
			this.getSchool
			this.getImage
			this.getItems
			this.getQAQ
		}
	}
</script>

<style lang="scss" scoped>
	@import '../style/mixin.scss';
	.wrapper{
		height: px2rem(280px);
		img{
			width: 100%;
		}
		@at-root .mint-swipe-indicator{
			width: 12px !important;
			height: 6px !important;
			border-radius: 6px !important;
		}
	}
	.menu{
		@include flex;
		flex-wrap: wrap;
		align-content: space-between;
		background: #fff;
		padding-top: px2rem(20px);
		padding-bottom: px2rem(30px);
		li{
			width: 25%;
			padding-top: px2rem(90px);
			margin-top: px2rem(15px);
			@extend .center;
			@for $i from 1 through 8 {
				&:nth-child(#{$i}){
					@include bis('./_menu@#{$i}.png');
				}
			}
			background-size: px2rem(85px);
			background-position: 50% 0;
			background-repeat: no-repeat;
			a{
				font-size: px2rem(24px);
				color: #454545;
			}
		}
	}
	.information{
		@extend .mt_24;
		background: #fff;
		@at-root .title{
			padding-left: px2rem(10px);
			padding-right: px2rem(30px);
			position: relative;
			height: px2rem(59px);
			line-height: px2rem(59px);
			border-bottom: 1px solid #dfdfdf;
			span{
				font-size: px2rem(26px);
				color: #32a9f1;
				font-weight: 700;
			}
			&>a{
				position: absolute;
				display: block;
				font-size: 12px;
				height: 12px;
				right: px2rem(30px);
				top: 0;
				bottom: 0;
				margin: auto;
				color: #454545;
				line-height: 1
			}
			.nav{
				position: absolute;
				top: 0;
				right: px2rem(30px);
				li{
					float: left;
					padding: 0 px2rem(10px);
					font-size: px2rem(18px);
					color: #32a9f1;
					&.active{
						border-bottom: 1px solid #32a9f1;
					}
				}
			}
		}
		@at-root ._info_list{
			padding: 0 px2rem(20px);
			li{
				padding: px2rem(25px) 0;
				border-bottom: 1px solid #dfdfdf;
				height: px2rem(144px);
				max-height: px2rem(144px);
				overflow: hidden;
				position: relative;
				&:last-child{
					border-bottom: none;
				}
				img{
					display: block;
					width: px2rem(190px);
					height: px2rem(144px);
					background: #333;
					vertical-align: middle;
					float: left;
				}
				._list_text{
					margin-left: px2rem(206px);
					p{
						margin: 0;
						font-size: px2rem(24px);
						color: #383838;
						line-height: 1.375;
					}
				}
				._list_num{
					position: relative;
					margin-top: px2rem(10px);
					svg{
						width: px2rem(30px);
						height: px2rem(30px);
						vertical-align: middle;
					}
					span{
						color: #bebebe;
						font-size: 12px;
						display: block;
						line-height: 1;
						height: 12px;
						position: absolute;
						top: 0;
						bottom: 0;
						right: 0;
						margin: auto;
					}
					label{
						vertical-align: middle;
						color: #bebebe;
					}
				}
			}
		}
	}
	.library{
		@extend .mt_24;
		background: #fff;
		@at-root ._library_wrapper{
			@include flex;
			flex-wrap: wrap;
			align-content: space-between;
			._library_column{
				display: block;
				width: 33.3333%;
				height: px2rem(200px);
				border-right: 1px solid #dfdfdf;
				border-bottom: 1px solid #dfdfdf;
				box-sizing: border-box;
				@extend .center;
				img{
					display: block;
					width: 100%;
					height: px2rem(150px);
					background: #333;
					margin-bottom: px2rem(8px);
				}
				span{
					font-size: px2rem(24px);
					color: #454545;
				}
				&:nth-child(3n){
					border-right: none;
				}
			}
		}
	}
	.raiders{
		background: #fff;
		@extend .mt_24;
		@at-root ._news_list{
			padding: px2rem(10px) px2rem(20px) px2rem(15px);
			li{
				position: relative;
				border-bottom: 1px solid #dfdfdf;
				&:last-child{
					border-bottom: none;
				}
				a{
					color: #454545;
					font-size: px2rem(22px);
					display: block;
					width: 100%;
					height: px2rem(45px);
					line-height: px2rem(45px);
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				label{
					display: inline-block;
					width: px2rem(25px);
					height: px2rem(25px);
					line-height: px2rem(25px);
					@extend .center;
					background: #f88445;
					color: #fff;
					font-size: px2rem(20px);

				}
			}
		}
	}
	.qaq{
		background: #fff;
		@extend .mt_24;
		@at-root ._QAQ{
			padding: 0 px2rem(35px);
			li{
				padding: px2rem(20px) 0 px2rem(30px) px2rem(70px);
				border-bottom: 1px solid #dfdfdf;
				&:last-child{
					border-bottom: none;
				}
				._QAQ_user{
					font-size: px2rem(24px);
					font-weight: 700;
					color: #444444;
					line-height: 1.4;
					span{
						width: px2rem(68px);
						height: px2rem(68px);
						background: #f78c39;
						font-size: px2rem(28px);
						@extend .center;
						line-height: px2rem(68px);
						top: px2rem(-10px);
						left: px2rem(-80px);
					}
				}
				._QAQ_admin{
					font-size: px2rem(18px);
					color: #7a7a7a;
					margin-top: px2rem(40px);
					span{
						width: px2rem(48px);
						height: px2rem(48px);
						background: #32a9f1;
						font-size: px2rem(20px);
						@extend .center;
						line-height: px2rem(48px);
						top: px2rem(-10px);
						left: px2rem(-70px);
					}
				}
				p{
					position: relative;
					margin: 0;
					span{
						position: absolute;
						display: block;
						color: #fff;
						border-radius: 100%;
					}
				}
			}
		}
	}
</style>