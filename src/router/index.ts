import Vue from 'vue';
import Router from 'vue-router';
Vue.use(Router);

import Home from '../views/Home.vue';
import Diy from '../views/Diy.vue';
import Empty from '../views/Empty.vue';

import NotFound from '../views/NotFound.vue';
import Login from '../views/register/Login.vue';
import Register from '../views/register/Register.vue';
import Setting from '../views/register/Setting.vue';
import SettledAgreement from '../views/register/SettledAgreement.vue';
import PersonApprove from '../views/register/PersonApprove.vue';
import CompanyApprove from '../views/register/CompanyApprove.vue';
import Pay from '../views/register/Pay.vue';

import SettlementInformation from '../views/register/SettlementInformation.vue';
import AddIndustryCate from '../views/register/AddIndustryCate.vue';


export const route_list = [
    {
      path: '/',
      name: 'Home',
      component: Home,
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
      path: '/NotFound',
      name: 'NotFound',
      component: NotFound,
      meta:{
        title:'NotFound'
      }
    },
    {
      path: '*',
      redirect:'/NotFound'
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      meta: {
        title: '登录'
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
      meta: {
        title: '注册'
      }
    },
    {
      path: '/setting',
      name: 'Setting',
      component: Setting,
      meta: {
        title: '商家入驻'
      }
    },
    {
      path: '/SettledAgreement',
      name: 'SettledAgreement',
      component: SettledAgreement,
      meta: {
        title: '签署协议'
      }
    },
    {
      path: '/PersonApprove',
      name: 'PersonApprove',
      component: PersonApprove,
      meta: {
        title: '个人认证'
      }
    },
    {
      path: '/CompanyApprove',
      name: 'CompanyApprove',
      component: CompanyApprove,
      meta: {
        title: '个人认证'
      }
    },
    {
      path: '/Pay',
      name: 'Pay',
      component: Pay,
      meta: {
        title: '付款'
      }
    },
    {
      path: '/SettlementInformation',
      name: 'SettlementInformation',
      component: SettlementInformation,
      meta: {
        title: '入驻资料设置'
      }
    },
  {
    path: '/AddIndustryCate',
    name: 'AddIndustryCate',
    component: AddIndustryCate,
    meta: {
      title: '添加行业分类'
    }
  }

  ]

const createRouter = () => new Router({
  routes: route_list
})

const routerInstance = createRouter()

export default routerInstance