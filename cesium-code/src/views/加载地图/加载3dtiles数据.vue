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
  Camera,
  Rectangle,
  SkyBox,
  KmlDataSource,
  CzmlDataSource,
  Cesium3DTileset,
  viewerCesium3DTilesInspectorMixin,
} from "cesium";
import { createViewer } from "../../utils";


onMounted(async () => {
  const viewer = createViewer("cesiumContainer", {
    shouldAnimate: true,
  });

  const tileset = await Cesium3DTileset.fromUrl("/tileset.json");
  console.log(123, tileset);
  viewer.scene.primitives.add(tileset);
  viewer.zoomTo(tileset);
  //   tileset.readyPromise.then(function (tileset) {
  //  viewer.zoomTo(tileset);
  //   });
  // 3dtiles调试面板
  viewer.extend(viewerCesium3DTilesInspectorMixin);
});
</script>
<style scoped></style>
