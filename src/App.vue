<template>
    <div id="app">

        <h1 style="margin-bottom:50px;">A-Carousel</h1>

        <section class="first-look">
            <a-carousel :images="images"></a-carousel>
        </section>

        <section class="custom-slides">
            <h2>Custom slides</h2>
            <a-carousel v-bind="data">
                <a-slide :image="images[0]">
                    <div class="slider-content-1">Hi!</div>
                </a-slide>
                <a-slide :image="images[1]"></a-slide>
                <a-slide :image="images[2]"></a-slide>
                <a-slide :image="images[3]"></a-slide>
            </a-carousel>
        </section>

        <section class="sandbox">
            <h2>Sandbox</h2>
            <div>
                <a-carousel v-bind="data"></a-carousel>
            </div>
            <div class="slider-option-container">
                <div>
                    <div v-for="(input, index) in inputs" :key="'input-' + index">
                        <label>
                            <span>URL: </span>
                            <input v-model="inputs[index]" />
                        </label>
                        <span class="image-input-remove" @click="removeInput(index)">&times;</span>
                    </div>
                </div>
                <div>
                    <button class="button" @click="addInput">Add image to slider</button>
                </div>
            </div>
            <div class="slider-option-container">
                <label for="#animation">Animation:</label>
                <select id="animation" v-model="options.animation">
                    <option selected>slide</option>
                    <option>fade</option>
                </select>
            </div>
            <div class="slider-option-container">
                <label for="#duration">Animation duration:</label>
                <select id="duration" v-model.number="options.duration">
                    <option :value="500">500ms</option>
                    <option :value="800">800ms</option>
                    <option :value="1000" selected>1s</option>
                    <option :value="2000">2s</option>
                    <option :value="3000">3s</option>
                </select>
            </div>
            <div class="slider-option-container">
                <label for="#direction">Animation have direction</label>
                <input id="direction" type="checkbox" v-model="options.directions" checked />
            </div>
            <div class="slider-option-container">
                <label for="#adjustable">Adjustable</label>
                <input id="adjustable" type="checkbox" v-model="options.adjustable" checked />
            </div>
            <div class="slider-option-container">
                <label for="#navigation">Navigation</label>
                <input id="navigation" type="checkbox" v-model="options.navigation" checked />
            </div>
            <div class="slider-option-container">
                <label for="#thumbs">Thumbnails:</label>
                <select id="thumbs" v-model="options.thumbnails">
                    <option value="" selected>No thumbnails</option>
                    <option>bottom</option>
                    <option>dots</option>
                </select>
            </div>
            <div class="slider-option-container">
                <label for="#dots">Dots</label>
                <input id="dots" type="checkbox" v-model="options.dots" checked />
            </div>
            <div class="slider-option-container">
                <div>Dots position</div>
                <label for="dpos1">Slide bottom</label>
                <input id="dpos1" type="radio" name="dotsPos" v-model="options.dotsPos" value="slideBottom" checked />
                <br/>
                <label for="dpos2">Under slider</label>
                <input id="dpos2" type="radio" name="dotsPos" v-model="options.dotsPos" value="underSlider" checked />
            </div>
            <div class="slider-option-container">
                <label for="#ratio">Width : height ratio</label>
                <input id="ratio" type="text" v-model.number="options.ratio"/>
            </div>
            <div class="slider-option-container">
                <label for="#min-h">Min height (px)</label>
                <input id="min-h" type="text" v-model.number="options.minHeight"/>
            </div>
            <div class="slider-option-container">
                <label for="#mmax-h">Max height (px)</label>
                <input id="max-h" type="text" v-model.number="options.maxHeight"/>
            </div>
            <div class="slider-option-container">
                <label for="#autoplay">Autoplay</label>
                <input id="autoplay" type="checkbox" v-model="options.autoplay" checked />
            </div>
            <div class="slider-option-container">
                <label for="#interval">Autoplay interval (ms)</label>
                <input id="interval" type="text" v-model.number="options.autoplayInterval"/>
            </div>
        </section>

    </div>
</template>

<script>

    import image1 from "./exampleImages/image1.jpg";
    import image2 from "./exampleImages/image2.jpg";
    import image3 from "./exampleImages/image3.jpg";
    import image4 from "./exampleImages/image4.jpg";

    export default {
        name: 'app',
        data() {
            return {
                images: [
                    image1, image2, image3, image4
                ],
                inputs: [
                    image1, image2, image3, image4
                ],
                options: {
                    animation: "slide",
                    duration: 1000,
                    directions: true,
                    autoplay: false,
                    autoplayInterval: 4000,
                    ratio: 2,
                    thumbnails: "",
                    dots: true,
                    dotsType: "line",
                    dotsPos: "slideBottom",
                    minHeight: 0,
                    maxHeight: 0,
                    navigation: true,
                    adjustable: false
                }
            };
        },

        //#endregion

        //#region Computed

        computed: {
            data: function() {
                return Object.assign(this.options, { images: this.inputs.filter((i) => i !== "") });
            }
        },

        //#endregion

        //#region Subscriptions

        //#endregion

        //#region Methods

        methods: {
            addInput() {
                this.inputs.push("");
            },

            removeInput(index) {
                this.inputs.splice(index, 1);
            }
        }

        //#endregion
    }
</script>

<style lang="scss">

    *, *::before, *::after {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .slider-option-container {
        padding: 1em;
    }

    .image-input-remove {
        font-size: 1.5em;
        cursor: pointer;
    }

    .button {
        margin: 0.5em;
    }

    .slider-content-1 {
        display: block;
        background: rgba(0, 0, 0, 0.5);
        color: white;
        font-weight: 500;
        font-size: 1.5em;
        padding: 2em;
    }

</style>
