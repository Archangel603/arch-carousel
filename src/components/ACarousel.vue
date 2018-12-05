<template>
    <div class="a-slider-container">
        <div class="a-slider" ref="slider" :style="sliderStyles">

            <div v-if="dots && dotsPos === 'slideTop'" class="inner-dots-container dots-top">
                <dots :type="dotsType"
                      :slides="slides"
                      :active="activeIndex"
                      @change="changeSlide"
                ></dots>
            </div>

            <div class="a-slides-container">
                <slot>
                    <a-slide v-for="(item, index) in images"
                           :image="item"
                           :key="'slide-' + index"
                    ></a-slide>
                </slot>
            </div>

            <div class="a-inner-dots-container dots-bottom">

                <dots v-if="dots && dotsPos === 'slideBottom'"
                      :type="dotsType"
                      :slides="slides"
                      :active="activeIndex"
                      @change="changeSlide"
                ></dots>

                <div class="a-thumbnail-dots" v-if="thumbnails === 'dots'">
                    <div v-for="(item, index) in slides"
                         :class="{ 'a-thumbnail-dot': true, active: index === activeIndex }"
                         :key="'thumbnail-dot-' + index"
                         @click="changeSlide(index)"
                    >
                        <img :src="item.image" :alt="'thumb-dot-' + index"/>
                    </div>
                </div>

            </div>

            <div class="a-slider-arrow-container left" v-if="navigation">
                <div class="a-slider-arrow a-slider-arrow-left" @click="goPrev">
                    <slot name="arrow-left">
                        <img :src="leftArrowSrc" alt="slider-arrow-left" />
                    </slot>
                </div>
            </div>

            <div class="a-slider-arrow-container right" v-if="navigation">
                <div class="a-slider-arrow a-slider-arrow-right" @click="goNext">
                    <slot name="arrow-right">
                        <img :src="rightArrowSrc" alt="slider-arrow-right" />
                    </slot>
                </div>
            </div>

        </div>
        <div class="a-slider-thumbnails" v-if="thumbnails === 'bottom'">
            <div v-for="(item, index) in slides"
                 :class="{ 'a-thumbnail': true, active: index === activeIndex }"
                 :key="'thumbnail-' + index"
                 @click="changeSlide(index)"
                 @touchstart="changeSlide(index)"
            >
                <img :src="item.image" :alt="'thumb-' + index"/>
            </div>
        </div>
    </div>
</template>

<script>

    import { throttle, upperFirst } from "lodash";
    import { onSwipe } from "../utils/swipe";
    import Dots from "./ADots";
    import leftArrow from "../svg/left-arrow.svg";
    import rightArrow from "../svg/right-arrow.svg";

    export default {
        name: 'ACarousel',

        components: {
            Dots
        },

        //#region Props

        props: {
            /**
             * You can pass array of URL in here
             * in case you don't need any HTML content
             * inside slides
             */
            images: {
                type: Array,
                default: function () {
                    return [];
                }
            },
            /**
             * Show arrows
             */
            navigation: {
                type: Boolean,
                default: true
            },
            /**
             * Show dots
             */
            dots: {
                type: Boolean,
                default: true
            },
            /**
             * Type of dots
             * Possible values: "", "rounds", "line", "sepLines"
             */
            dotsType: {
                type: String,
                default: ""
            },
            /***
             * Position of dots
             * Possible values: "aboveSlide" and "underSlider"
             */
            dotsPos: {
                type: String,
                default: "aboveSlide"
            },
            thumbnails: {
                type: [String],
                default: "" // Also can be 'dots' and 'bottom'
            },
            ratio: {
                type: Number,
                default: 1.5
            },
            minHeight: {
                type: Number,
                default: 0
            },
            maxHeight: {
                type: Number,
                default: 0
            },
            animation: {
                type: String,
                default: "slide"
            },
            directions: {
                type: Boolean,
                default: true
            },
            /**
             * Make slider set minHeight to the height of the
             * largest slide and keep it up to date
             * (e.g. change it on window.resize)
             */
            adjustable: {
                type: Boolean,
                default: false
            },
            /**
             * Duration of slide's animation in ms
             * It may be duration of your custom animation
             * By default possible values are: 500; 800; 1000; 2000; 3000
             */
            duration: {
                type: Number,
                default: 800
            },
            minContentVerticalOffset: {
                type: Number,
                default: 50
            },
            autoplay: {
                type: Boolean,
                default: false
            },
            autoplayInterval: {
                type: Number,
                default: 4000
            }
        },

        //#endregion

        //#region Data

        data: function () {
            return {
                activeIndex: 0,
                direction: "right",
                width: 0,
                changeInterval: null,
                slides: [],
                largestSlide: null,
                leftArrowSrc: leftArrow,
                rightArrowSrc: rightArrow
            };
        },

        provide() {
            return {
                carousel: this
            };
        },

        //#endregion

        //#region Computed

        computed: {

            active() {
                return this.slides.length && this.slides[this.activeIndex] ? this.slides[this.activeIndex] : null;
            },

            nextSlide() {
                if (this.images.length === 1)
                    return this.activeIndex;

                return this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1;
            },

            prevSlide() {
                if (this.images.length === 1)
                    return this.activeIndex;

                return this.activeIndex === 0 ? this.slides.length - 1 : this.activeIndex - 1;
            },

            durationClass() {
                switch (this.duration) {
                    case 500:
                        return "faster";
                    case 800:
                        return "fast";
                    case 2000:
                        return "slow";
                    case 3000:
                        return "slower";
                    default:
                        return "";
                }
            },

            reverseDirection() {
                return this.direction === "left" ? "right" : "left";
            },

            enterClass() {
                let direction = this.directions ? upperFirst(this.direction) : "";

                return `animated ${ this.durationClass } ${ this.animation }In${ direction }`;
            },

            leaveClass() {
                let direction = this.directions ? upperFirst(this.reverseDirection) : "";

                return `animated ${ this.durationClass } ${ this.animation }Out${ direction }`;
            },

            largestSlideHeight() {
                return this.largestSlide.contentEl.clientHeight + this.minContentVerticalOffset * 2;
            },

            height() {
                let height = this.width / this.ratio;

                let minHeight = this.adjustable && !this.minHeight && this.largestSlide
                                ? this.largestSlideHeight : this.minHeight;

                if (minHeight && height < minHeight) {
                    height = minHeight;
                }
                else if (this.maxHeight && height > this.maxHeight) {
                    height = this.maxHeight;
                }

                return height;
            },

            sliderStyles() {
                return {
                    height: this.height + "px"
                };
            }
        },

        //#endregion

        //#region Hooks

        created() {

            let opts = {leading: true};

            this.next = throttle(this.next, this.duration, opts);
            this.prev = throttle(this.prev, this.duration, opts);

            if (this.autoplay) {
                this.changeInterval = setInterval(this.next, this.autoplayInterval);
            }
        },

        mounted() {
            window.addEventListener("resize", this.onResize);

            onSwipe(this.$refs.slider, null, {
                onLeftSwipe: this.goNext,
                onRightSwipe: this.goPrev
            });

            this.onResize();
        },

        updated() {
            if (this.activeIndex > 0 && this.activeIndex > this.slides.length - 1) {
                this.activeIndex = this.slides.length - 1;
            }
        },

        destroyed() {
            window.removeEventListener("onResize", this.onResize);
        },

        //#endregion

        //#region Methods

        methods: {

            registerSlide(id, image, el, contentEl) {
                this.slides.push({ id, image, el, contentEl });
            },

            goNext() {
                this.userInteracted();
                this.next();
            },

            goPrev() {
                this.userInteracted();
                this.prev();
            },

            next() {
                this.direction = "right";
                this.activeIndex = this.nextSlide;
            },

            prev() {
                this.direction = "left";
                this.activeIndex = this.prevSlide;
            },

            changeSlide(index) {

                this.userInteracted();

                if (index > this.activeIndex) {
                    this.direction = "right";
                }
                else if (index < this.activeIndex) {
                    this.direction = "left";
                }

                this.activeIndex = index;
            },

            onResize() {
                this.width = this.$refs.slider.clientWidth;

                if (this.adjustable) {
                    let contentHeights = this.slides.filter(s => s.contentEl != null).map(s => s.contentEl.clientHeight);

                    let index = contentHeights.indexOf(Math.max(...contentHeights));

                    if (~index) {
                        this.largestSlide = this.slides[index];
                    }
                }
            },

            userInteracted() {
                if (this.changeInterval && this.autoplay) {
                    this.removeInterval();
                }
            },

            removeInterval() {
                clearInterval(this.changeInterval);
                this.changeInterval = null;
            }
        },

        //#endregion

        //#region Watchers

        watch: {
            images(newValue, oldValue) {

                let removed = oldValue.filter(img => !newValue.includes(img));

                for (let img of removed) {
                    this.slides.splice(this.slides.indexOf(img), 1);
                }

            },
            autoplay(newValue, oldValue) {
                if (!newValue && oldValue && this.changeInterval) {
                    this.removeInterval();
                }
                else if (newValue && !this.changeInterval) {
                    this.changeInterval = setInterval(this.next, this.autoplayInterval);
                }
            },
            autoplayInterval(newValue) {
                if (newValue) {
                    if (this.changeInterval)
                        this.removeInterval();

                    this.changeInterval = setInterval(this.next, this.autoplayInterval);
                }
            },
            adjustable() {
                this.onResize();
            }
        }

        //#endregion
    }
</script>

<style scoped lang="scss">

    .a-slider-container {
        display: flex;
        flex-direction: column;
        overflow: hidden;

        * {
            outline: none !important;
            -webkit-tap-highlight-color: rgba(0,0,0,0);
        }
    }

    .a-slider {
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 500px;
    }

    .a-slides-container {
        height: 100%;
    }

    .a-thumbnail-dot img, .a-thumbnail img {
        object-fit: cover;
        width: 100%;
        height: 100%;
        user-select: none;
    }

    .a-slider-arrow-container {
        position: absolute;
        display: flex;
        align-items: center;
        height: 100%;
        top: 0;
        z-index: 1;

        &.left {
            left: 0;
        }

        &.right {
            right: 0;
        }
    }

    .a-slider-arrow {
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 2em;
        padding: 0.5em 0.75em;
        margin: 0 0.2em;
        transition: opacity 0.3s;
        cursor: pointer;

        &:active {
            opacity: 0.2;
        }

        img {
            max-height: 40px;
        }

        @media all and (min-width: 961px) {
            &:hover {
                opacity: 0.6;
            }
        }
    }

    .a-slider-arrow-left i {
        margin-left: -5px;
    }

    .a-slider-arrow-right i {
        margin-right: -5px;
    }

    .a-inner-dots-container {
        position: absolute;
        display: flex;
        flex-direction: column;
        width: 100%;
        padding: 1em 4em;
        z-index: 2;

        &.dots-top {
            top: 0;
        }

        &.dots-bottom {
            bottom: 0;
        }
    }

    .a-thumbnail-dot:not(.active), .thumbnail:not(.active) {
        cursor: pointer;
    }

    .a-thumbnail-dots {
        display: flex;
        height: 130px;
        z-index: 2;
    }

    .a-thumbnail-dot {
        height: 100%;
        width: 100%;
        margin: 0 0.25em;
        border: 1px solid #bbb;
        transition: border-color .2s;

        &.active {
            border-color: white;
        }

        @media all and (min-width: 961px) {
            &:hover {
                border-color: #ddd;
            }
        }
    }

    .a-slider-thumbnails {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        padding: 0.5em .3em;
    }

    .a-thumbnail {
        height: 100px;
        max-width: 100px;
        margin: .2em .3em;
    }

    @media all and (max-width: 960px) {
        .a-thumbnail-dots {
            display: none;
        }
    }

</style>
