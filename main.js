import Vue from 'vue'
import App from './app'
import VueRouter from 'vue-router'
import routes  from './config/route-config.js'
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import $$user from './model/user.js';

import under from './lib/underscore.v1.4.4.min.js'
window._ = under;


/* eslint-disable no-new */

Vue.config.devtools = false;
Vue.use(VueRouter)
// 实例化VueRouter
const router = new VueRouter({
    mode: 'hash',
    // mode: 'history',
    routes
});

//sync(store, router)
Vue.use(Element);

var vueResource = require('vue-resource');
Vue.use(vueResource);

window.app = {
    router: router,
    currentRouter: null
};
window.app.router.beforeEach((to, from, next) => {
    window.app.currentRouter = to;
    next();
});

//login 检测
$$user.login(function () {
    new Vue({
        el: '#app',
        router,
        render: h => h(App)
    })
});
    // new Vue({
    //     el: '#app',
    //     router,
    //     render: h => h(App)
    // })