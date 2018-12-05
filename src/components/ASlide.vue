<template>
    <transition
            :enter-active-class="animatedEnter ? '' : carousel.enterClass"
            :leave-active-class="carousel.leaveClass"
            :duration="$parent.duration"
            @enter="onEnter"
    >
        <div class="a-slide" v-show="carousel.active && carousel.active.id === id" ref="self">
            <div v-if="image" class="a-slide-image">
                <img :src="image" :style="{ objectFit: imageFit }" />
            </div>
            <div class="a-slide-content-container">
                <div class="a-slide-content" ref="content">
                    <slot></slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        name: "ASlide",

        props: {
            image: {
                type: String,
                default: ""
            },
            imageFit: {
                type: String,
                default: "cover"
            }
        },

        data() {
            return {
                id: Symbol(),
                wasShown: false
            };
        },

        computed: {
            animatedEnter() {
                return (
                    !this.wasShown && this.carousel.slides[0]
                    && this.id === this.carousel.slides[0].id
                );
            }
        },

        inject: [ "carousel" ],

        mounted() {

            let contentEl = this.$refs.content.innerHTML ? this.$refs.content : null;

            this.carousel.registerSlide(this.id, this.image, this.$refs.self, contentEl);

            // fix touch bug
            this.$el.addEventListener("touchstart", (e) => e.preventDefault(), { passive: true });
        },

        methods: {
            onEnter() {
                this.wasShown = true;
            }
        }
    }
</script>

<style lang="scss" scoped>

    .a-slide {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 100%;
        overflow: hidden;
    }

    .a-slide-image {
        height: 100%;

        img {
            width: 100%;
            height: 100%;
            user-select: none;
        }
    }

    .a-slide-content-container {
        position: absolute;
        display: flex;
        top: 2em;
        bottom: 2em;
        left: 5em;
        right: 5em;
        z-index: 1;
    }

    .a-slide-content {
        width: 100%;
    }

</style>