import Vue from 'vue';
import App from "./App";
import CarouselInstall from "./index";

Vue.use(CarouselInstall);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
