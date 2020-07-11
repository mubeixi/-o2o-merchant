import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

const Page = () => import('@/views/PageTmpl.vue')
const Home = () => import('@/views/Home.vue')
const Tmpl = () => import('@/views/Tmpl.vue')
const Diy = () => import('@/views/Diy.vue')
const Empty = () => import('@/views/Empty.vue')
const ProductForm = () => import('@/views/ProductForm.vue')
const UserList = () => import('@/views/UserList.vue')
const Marketing = () => import('@/views/Marketing.vue')
const DayMark = () => import('@/views/DayMark.vue')
const LabelManagement = () => import('@/views/LabelManagement.vue')
const LabelAdd = () => import('@/views/LabelAdd.vue')
const CrowdName = () => import('@/views/CrowdName.vue')
const CrowdClient = () => import('@/views/CrowdClient.vue')
const DayMarkDetail = () => import('@/views/DayMarkDetail.vue')
const StoreChannel = () => import('@/views/StoreChannel.vue')
const StorePurchase = () => import('@/views/StorePurchase.vue')
const SystemNotice = () => import('@/views/SystemNotice.vue')
const StorePurchaseApply = () => import('@/views/StorePurchaseApply.vue')
const StorePurchaseBack = () => import('@/views/StorePurchaseBack.vue')
const MessageSend = () => import('@/views/MessageSend.vue')
const MessageStationSend = () => import('@/views/MessageStationSend.vue')
const CouponGift = () => import('@/views/CouponGift.vue')
const GiftsGift = () => import('@/views/GiftsGift.vue')
const NotFound = () => import('@/views/NotFound.vue')
const ProductList = () => import('@/views/ProductList.vue')
const StoreProductList = () => import('@/views/StoreProductList.vue')
const DistributorLevel = () => import('@/views/DistributorLevel.vue')
const Rotate = () => import('@/views/Rotate.vue')
const RotateList = () => import('@/views/RotateList.vue')
const ProductStatistics = () => import('@/views/statistics/ProductStatistics.vue')
const VipStatistics = () => import('@/views/statistics/VipStatistics.vue')
const TransactionStatistics = () => import('@/views/statistics/TransactionStatistics.vue')
const Contribute = () => import('@/views/distributor/Contribute.vue')
const ContributeDetail = () => import('@/views/distributor/ContributeDetail.vue')
const DesignPanel = () => import('@/views/design/DesignPanel.vue')
const SameCityDelivery = () => import('@/views/SameCityDelivery.vue')
const JoinCate = () => import('@/views/JoinCate.vue')
const JoinMaterial = () => import('@/views/JoinMaterial.vue')
const RightCard = () => import('@/views/RightCard.vue')
const FreeSetting = () => import('@/views/FreeSetting.vue')
const RightCardDetail = () => import('@/views/RightCardDetail.vue')
const SystemConf = () => import('@/views/SystemConf.vue')
const Demo = ()=>import('@/views/Demo.vue')
const routerInstance = new Router({
  routes: [
    {
      path: '/',
      name: 'Tmpl',
      component: Tmpl,
    },
    {
      path:'/demo',
      name:'Demo',
      component: Demo,
      meta:{
        title:'demo'
      }
    },
    {
      path:'/StorePurchaseApply',
      name:'StorePurchaseApply',
      component: StorePurchaseApply,
      meta:{
        title:'进货记录'
      }
    },
    {
      path:'/SystemConf',
      name:'SystemConf',
      component: SystemConf,
      meta:{
        title:'系统设置'
      }
    },
    {
      path:'/JoinCate',
      name:'JoinCate',
      component: JoinCate,
      meta:{
        title:'行业分类'
      }
    },
    {
      path:'/JoinMaterial',
      name:'JoinMaterial',
      component: JoinMaterial,
      meta:{
        title:'入驻资料'
      }
    },
    {
      path:'/StorePurchaseBack',
      name:'StorePurchaseBack',
      component: StorePurchaseBack,
      meta:{
        title:'退货记录'
      }
    },
    {
      path:'/StoreChannel',
      name:'StoreChannel',
      component: StoreChannel,
      meta:{
        title:'选择进货渠道'
      }
    },
    {
      path:'/SystemNotice/:id',
      name:'SystemNotice',
      component: SystemNotice,
      meta:{
        title:'系统公告'
      }
    },
    {
      path:'/StorePurchase',
      name:'StorePurchase',
      component: StorePurchase,
      meta:{
        title:'进货'
      }
    },
    {
      path: '/diy',
      name: 'DIY',
      component: Diy,
    },
    {
      path: '/empty',
      name: 'empty',
      component: Empty,
    },
    {
      path: '/ProductForm',
      name: 'product',
      component: ProductForm,
      meta:{
        title:'发布商品'
      }
    }
    ,
    {
      path: '/userList',
      name: 'userlist',
      component: UserList,
    },
    {
      path: '/Marketing',
      name: 'Marketing',
      component: Marketing,
    },
    {
      path: '/DayMark',
      name: 'DayMark',
      component: DayMark
    },
    {
      path: '/LabelManagement',
      name: 'LabelManagement',
      component: LabelManagement,
      meta:{
        title:'标签列表'
      }

    },
    {
      path: '/LabelAdd',
      name: 'LabelAdd',
      component: LabelAdd,
      meta:{
        title:'添加标签'
      }
    },
    {
      path: '/CrowdName',
      name: 'CrowdName',
      component: CrowdName,
      meta:{
        title:'添加人群'
      }
    },
    {
      path: '/CrowdClient',
      name: 'CrowdClient',
      component: CrowdClient,
      meta:{
        title:'人群列表'
      }
    },
    {
      path: '/DayMarkDetail',
      name: 'DayMarkDetail',
      component: DayMarkDetail
    },
    {
      path: '/MessageSend',
      name: 'MessageSend',
      component: MessageSend,
      meta:{
        title:'群发短信'
      }
    },
    {
      path: '/MessageStationSend',
      name: 'MessageStationSend',
      component: MessageStationSend,
      meta:{
        title:'群发站内信'
      }
    },
    {
      path: '/CouponGift',
      name: 'CouponGift',
      component: CouponGift,
      meta:{
        title:'赠送优惠券'
      }
    },
    {
      path: '/GiftsGift',
      name: 'GiftsGift',
      component: GiftsGift,
      meta:{
        title:'赠送赠品'
      }
    },
    {
      path: '/design',
      name: 'DesignPanel',
      component: DesignPanel,
      meta:{
        title:'海报编辑'
      }
    },
    {
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound,
      meta:{
        title:'NotFound'
      }
    },
    {
      path: '/ProductList',
      name: 'ProductList',
      component: ProductList,
      meta:{
        title:'商品列表'
      }
    },
    {
      path: '/StoreProductList',
      name: 'StoreProductList',
      component: StoreProductList,
      meta:{
        title:'门店商品列表'
      }
    },
    {
      path:'/distributor',
      component:Page,
      meta:{
        title:'分销'
      },
      children:[
        {
          path:'contributeList',
          component:Contribute,
          meta:{
            title:'分销贡献'
          }
        },
        {
          path:'contributeDeatil',
          name:'DistributorContribute',
          component:ContributeDetail,
          meta:{
            title:'分销贡献详情'
          }
        }
      ]
    },
    {
      path: '/DistributorLevel',
      name: 'DistributorLevel',
      component: DistributorLevel,
      meta:{
        title:'分销商级别设置'
      }
    },
    {
      path: '/Rotate',
      name: 'Rotate',
      component: Rotate,
      meta:{
        title:'幸运大抽奖'
      }
    },
    {
      path: '/RotateList',
      name: 'RotateList',
      component: RotateList,
      meta:{
        title:'幸运大抽奖列表'
      }
    },
    {
      path: '/ProductStatistics',
      name: 'ProductStatistics',
      component: ProductStatistics,
      meta:{
        title:'商品统计'
      }
    },
    {
      path: '/VipStatistics',
      name: 'VipStatistics',
      component: VipStatistics,
      meta:{
        title:'会员统计'
      }
    },
    {
      path: '/TransactionStatistics',
      name: 'TransactionStatistics',
      component: TransactionStatistics,
      meta:{
        title:'交易统计'
      }
    },
    {
      path: '/SameCityDelivery',
      name: 'SameCityDelivery',
      component: SameCityDelivery,
      meta:{
        title:'同城配送'
      }
    },
    {
      path: '/RightCard',
      name: 'RightCard',
      component: RightCard,
      meta:{
        title:'权益卡'
      }
    },
    {
      path: '/RightCardDetail',
      name: 'RightCardDetail',
      component: RightCardDetail,
      meta:{
        title:'权益卡'
      }
    },
    {
      path: '/FreeSetting',
      name: 'FreeSetting',
      component: FreeSetting,
      meta:{
        title:'免单设置'
      }
    },
    {
      path: '*',
      redirect:'/NotFound'
    }
  ],
});
routerInstance.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default routerInstance
