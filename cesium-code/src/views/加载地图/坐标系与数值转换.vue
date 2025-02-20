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
  Cartographic,
  Math
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

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // 1/屏幕坐标系统，二维的笛卡尔坐标系，Cartesian2类型
  // 2/地理坐标系统，WGS-84坐标系，Cartographic类型,经度，纬度，高度
  // 3/笛卡尔空间直角坐标系，Cartesian3类型

  // 角度与弧度的转换
  var radians = Math.toRadians(90);
  console.log(radians);
  // 弧度转角度
  var degrees = Math.toDegrees(2 * Math.PI);
  console.log(degrees);

  // 将经纬度转为笛卡尔坐标
  var cartesian3 = Cartesian3.fromDegrees(
    // 经度
    89.5,
    // 纬度
    20.4,
    // 高度
    100
  );
  console.log(cartesian3);

  // 将笛卡尔坐标转为经纬度
  var cartographic = Cartographic.fromCartesian(cartesian3);
  console.log(cartographic);
});
</script>
<style scoped></style>
