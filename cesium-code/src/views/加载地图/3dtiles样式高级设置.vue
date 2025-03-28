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
  createOsmBuildingsAsync,
} from "cesium";
import { createViewer } from "../../utils";

onMounted(async () => {
  const viewer = createViewer("cesiumContainer", {
    shouldAnimate: true,
  });

  // 设置沙箱允许使用js
  var iframe = document.getElementsByClassName("cesium-infoBox-iframe")[0];
  iframe.setAttribute(
    "sandbox",
    "allow-same-origin allow-scripts allow-popups allow-forms"
  );
  iframe.setAttribute("src", "");

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
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
    defines: {
      distance:
        "distance(vec2(${feature['cesium#longitude']},${feature['cesium#latitude']}),vec2(113.3191,23.109))",
    },
    color: {
      conditions: [
        ["${distance} < 0.01", "color('rgba(0,0,50, 0.7)')"],
        ["${distance} < 0.02", "color('rgba(0,0,50, 0.5)')"],
        ["${distance} < 0.04", "color('rgba(0,0,50, 0.2)')"],
        ["true", "color('white')"],
      ],
    },
    show: "${distance} < 0.04 && ${feature['building']} === 'apartments'",
  });
});
</script>
<style scoped></style>
