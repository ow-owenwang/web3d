<script setup lang="ts">
import {Cartesian3, VerticalOrigin} from "cesium";

// 使用entity的方式加载大量图标点会出现卡顿现象，cesium提供了BillboardCollection可以实现大量图标点的显示（测试过5万图标点还是比较流畅的）


function addPrimitives() {
  let points = turf.randomPoint(20000, { bbox: [73, 20, 135, 40] }); //使用turf生产20000个随机坐标点
  let features = points.features;
  let feature, geom, coordinates, position;

  for (let i = 0; i < features.length; i++) {
    feature = features[i];
    geom = feature.geometry;
    coordinates = geom.coordinates;
    position = Cartesian3.fromDegrees(coordinates[0], coordinates[1], 0);
    this.addPrimitive(position);
  }
}

//添加单个图标点
function addPrimitive(position) {
  this.billboards.add({
    position: position,
    image: '../static/images/monitor.png',
    verticalOrigin: VerticalOrigin.BOTTOM,
  });
}

</script>

<template>

</template>

<style scoped>

</style>
