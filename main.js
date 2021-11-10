import App from './App'
import uView from "uview-ui";
import _ from 'lodash';
import dayjs from 'dayjs';


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false;
Vue.prototype._ = _;
Vue.prototype.dayjs = dayjs;
Vue.use(uView);
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif