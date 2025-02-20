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

onMounted(async () => {
  const viewer = createViewer("cesiumContainer", {});

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";

  // setView瞬间到达指定位置、视角，没有动画
  const position = Cartesian3.fromDegrees(116.393428, 39.90923, 100);
  /* viewer.camera.setView({
    // 指定相机位置
    destination: position,
    // 指定相机视角
    orientation: {
      // 指定相机的朝向,偏航角
      heading: CesiumMath.toRadians(0),
      // 指定相机的俯仰角,0度是竖直向上,-90度是向下
      pitch: CesiumMath.toRadians(-20),
      // 指定相机的滚转角,翻滚角
      roll: 0,
    },
  }); */

  // 带动画
  viewer.camera.flyTo({
    destination: position,
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-20),
      roll: 0,
    },
  });

  // 通过按键移动相机
  document.addEventListener("keydown", (e) => {
    // console.log(e);
    // 获取相机离地面的高度
    var height = viewer.camera.positionCartographic.height;
    var moveRate = height / 100;
    if (e.key == "w") {
      // 设置相机向前移动
      viewer.camera.moveForward(moveRate);
    } else if (e.key == "s") {
      // 设置相机向后移动
      viewer.camera.moveBackward(moveRate);
    } else if (e.key == "a") {
      // 设置相机向左移动
      viewer.camera.moveLeft(moveRate);
    } else if (e.key == "d") {
      // 设置相机向右移动
      viewer.camera.moveRight(moveRate);
    } else if (e.key == "q") {
      // 设置相机向左旋转相机
      viewer.camera.lookLeft(CesiumMath.toRadians(0.1));
    } else if (e.key == "e") {
      // 设置相机向右旋转相机
      viewer.camera.lookRight(CesiumMath.toRadians(0.1));
    } else if (e.key == "r") {
      // 设置相机向上旋转相机
      viewer.camera.lookUp(CesiumMath.toRadians(0.1));
    } else if (e.key == "f") {
      // 设置相机向下旋转相机
      viewer.camera.lookDown(CesiumMath.toRadians(0.1));
    } else if (e.key == "g") {
      // 向左逆时针翻滚
      viewer.camera.twistLeft(CesiumMath.toRadians(0.1));
    } else if (e.key == "h") {
      // 向右顺时针翻滚
      viewer.camera.twistRight(CesiumMath.toRadians(0.1));
    }
  });
});
</script>
<style scoped></style>
