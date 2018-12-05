import Carousel from "./components/ACarousel";
import Slide from "./components/ASlide";
import "./styles/animate.min.css";

const install = Vue => {
    Vue.component("a-carousel", Carousel);
    Vue.component("a-slide", Slide);
};

export default {
    install
};

export { Carousel, Slide };