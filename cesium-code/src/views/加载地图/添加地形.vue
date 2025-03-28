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
  createWorldTerrainAsync,
  CesiumTerrainProvider
} from "cesium";
import { createViewer } from "../../utils";

Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  // 西边的经度
  89.5,
  // 南边维度
  20.4,
  // 东边经度
  110.4,
  // 北边维度
  61.2
);

onMounted(async () => {
  const terrainProvider = await createWorldTerrainAsync({
    requestVertexNormals: true,
    requestWaterMask: true,
  });
  const viewer = createViewer("cesiumContainer", {
    // 设置地形
    // terrainProvider: terrainProvider,
    // TODO: 从哪里去下载地形数据？
    terrainProvider: await CesiumTerrainProvider.fromUrl("/terrains/gz"),
  });

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
<style scoped></style>
