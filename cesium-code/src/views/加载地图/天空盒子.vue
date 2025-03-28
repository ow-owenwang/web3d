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
  const viewer = createViewer("cesiumContainer", {
    infoBox: false,
    // 是否显示查询按钮
    geocoder: false,
    // 是否显示home按钮
    homeButton: false,
    // 是否显示查看器的显示模式
    sceneModePicker: false,
    // 是否显示帮助按钮
    navigationHelpButton: false,
    // 是否显示图层拾取
    baseLayerPicker: false,
    // 是否显示时间轴
    timeline: false,
    // 是否显示全屏按钮
    fullscreenButton: false,
    // 是否显示播放动画
    animation: false,
    skyBox: new SkyBox({
      sources: {
        positiveX: "/texture/sky/px.jpg",
        negativeX: "/texture/sky/nx.jpg",
        positiveY: "/texture/sky/ny.jpg",
        negativeY: "/texture/sky/py.jpg",
        positiveZ: "/texture/sky/pz.jpg",
        negativeZ: "/texture/sky/nz.jpg",
      },
    }),
  });

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
});
</script>
<style scoped></style>
