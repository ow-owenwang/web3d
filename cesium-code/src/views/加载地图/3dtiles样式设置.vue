<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from "vue";
import {
  Cartesian3,
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
  Cesium3DTileStyle,
  createOsmBuildingsAsync
} from "cesium";
import { createViewer } from "../../utils";

onMounted(async () => {
  const viewer = createViewer("cesiumContainer", {
    shouldAnimate: true,
  });

  // 添加3D建筑
  let tiles3d = await createOsmBuildingsAsync()
  const osmBuildings = viewer.scene.primitives.add(tiles3d);
  // 广州塔
  var postion = Cartesian3.fromDegrees(
    // 经度
    113.3191,
    // 纬度
    23.109,
    // 高度
    1000
  );
  viewer.camera.flyTo({
    destination: postion,
    duration: 2,
  });

  // console.log(tiles3d);
  // tiles3d.style = new Cesium3DTileStyle({
  //   // 颜色设置，颜色名称/16进制颜色值/rgba颜色值
  //   // color: "color('yellow')",
  //   // color: "rgba(255, 255, 0, 0.5)",
  //   color: "color('#f00')",
  //   show: true,
  // });

  tiles3d.style = new Cesium3DTileStyle({
    color: {
      conditions: [
        [
          "${feature['building']} === 'apartments'",
          "color('rgba(50, 255, 0, 0.5)')",
        ],
        [
          "${feature['building']} === 'office'",
          "color('rgba(255, 255, 0, 0.5)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 300",
          "color('rgba(200, 200, 255, 0.7)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 100",
          "color('rgba(100, 100, 255, 0.7)')",
        ],
        [
          "${feature['cesium#estimatedHeight']} > 50",
          "color('rgba(50, 50, 150, 0.7)')",
        ],
        ["true", "color('white')"],
      ],
    },
    show: true,
  });
});
</script>
<style scoped></style>
