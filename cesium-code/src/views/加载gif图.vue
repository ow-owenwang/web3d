<script setup lang="ts">
import {onMounted} from "vue";
import {createViewer} from "../utils";
import {CallbackProperty, Cartesian3, HeightReference, NearFarScalar, VerticalOrigin} from "cesium";

onMounted(() => {
  const viewer = createViewer("cesiumContainer", {});


  const canvas = document.createElement("canvas");
  canvas.width = 100;
  canvas.height = 100;
  const context = canvas.getContext("2d");


  const gifImage = new Image();
  gifImage.src = "/fire.gif";


  const gif = new SuperGif({gif: gifImage});
  gif.load(() => {
    // let currentFrame = 0;
    //
    // function updateCanvas() {
    //   gif.move_to(currentFrame);
    //   context.clearRect(0, 0, canvas.width, canvas.height);
    //   context.drawImage(gifImage, 0, 0, canvas.width, canvas.height);
    //
    //   currentFrame = (currentFrame + 1) % gif.get_length();
    //   requestAnimationFrame(updateCanvas);
    // }
    //
    // updateCanvas();


    const billboard = viewer.entities.add({
      position: Cartesian3.fromDegrees(116.39, 39.9, 0),
      // billboard: {
      //   image: canvas,
      //   width: 100,
      //   height: 100,
      // },
      billboard: {
        image: new CallbackProperty(() => {
          return gif.get_canvas().toDataURL("image/png");
        }, false),
        verticalOrigin: VerticalOrigin.BOTTOM,
        heightReference: HeightReference.RELATIVE_TO_GROUND,
        scaleByDistance: new NearFarScalar(500, 1.0, 2000, 0.1),
        transparent: true
      }
    })
  })


})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>

</style>
