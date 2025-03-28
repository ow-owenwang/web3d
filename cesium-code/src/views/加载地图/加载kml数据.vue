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
  KmlDataSource
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
  const viewer = createViewer("cesiumContainer", {});

  // 加载kml数据
  let kmlUrl = "/facilities1.kml";
  let kmlDataPromise = KmlDataSource.load(kmlUrl, {
    camera: viewer.scene.camera,
    canvas: viewer.scene.canvas,
    screenOverlayContainer: viewer.container,
  });
  console.log(kmlDataPromise);
  kmlDataPromise.then(function (dataSource) {
    console.log(dataSource);
    viewer.dataSources.add(dataSource);
  });
});
</script>
<style scoped></style>
