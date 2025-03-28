<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from "vue";
import {
  Cartesian3,
  createOsmBuildingsAsync,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
} from "cesium";
import { createViewer } from "../../utils";

onMounted(async () => {
    // 最简单案例
    const viewer = createViewer()

});
</script>
<style scoped>

</style>
