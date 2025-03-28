<script setup lang="ts">


import {Viewer} from "cesium";

const viewer = new Viewer("cesiumContainer", {
  contextOptions: {
    id: "cesiumCanvas",
    webgl: {
      preserveDrawingBuffer: true //此处为true
    }
  }
})

const sceneExport = {
  saveToFile(filename) {
    const {viewer} = global;
    viewer.scene.render();
    let canvas = viewer.scene.canvas;
    let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement("a");
    let blob = this.dataURLtoBlob(image);
    let objUrl = URL.createObjectURL(blob);
    link.download = filename + ".png";
    link.href = objUrl;
    link.click();
  },
  dataURLtoBlob(dataUrl) {
    let arr = dataUrl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bStr = atob(arr[1]),
        n = bStr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bStr.charCodeAt(n);
    }
    return new Blob([u8arr], {type: mime});
  }
}


export function saveToFile(scene) {
  let canvas = scene.canvas;
  let image = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");

  let link = document.createElement("a");
  let blob = dataURLtoBlob(image);
  let objurl = URL.createObjectURL(blob);
  link.download = "scene.png";
  link.href = objurl;
  link.click();

}

function dataURLtoBlob(dataurl) {
  let arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type: mime});
}


</script>

<template>

</template>

<style scoped>

</style>
