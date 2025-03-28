<template>
  <div id="cesiumContainer"></div>
  <div class="btn-group">
    <button class="btn" @click="zoomIn(viewer)">放大</button>
    <button class="btn" @click="zoomOut(viewer)">缩小</button>
    <button class="btn" @click="goHome(viewer)">回归初始位置</button>
    <button class="btn" @click="fullScreen(viewer)">全屏</button>
    <button class="btn" @click="previousView(g_config.globalviewer)">前一视图</button>
    <button class="btn" @click="nextView(g_config.globalviewer)">后一视图</button>
  </div>
</template>
<script setup>
import {onMounted} from "vue";
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
  WebMapTileServiceImageryProvider,
  ImageryLayer,
  ArcGisMapServerImageryProvider,
  Credit, Fullscreen
} from "cesium";
import {createViewer} from "../../utils";

const token = "3bfb9868e5867155296970898fb5db06"

let viewer

// 放大
const zoomIn = (viewer) => {
  let position = viewer.camera.position;
  let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  // 每次放大 10 倍，参数可改
  let moveRate = cameraHeight / 10.0;
  viewer.camera.moveForward(moveRate);
}

// 缩小
const zoomOut = (viewer) => {
  let position = viewer.camera.position;
  let cameraHeight = viewer.scene.globe.ellipsoid.cartesianToCartographic(position).height;
  // 每次缩小 10 倍，参数可改
  let moveRate = cameraHeight / 10.0;
  viewer.camera.moveBackward(moveRate);
}

// 3D 初始位置
const originLocation3D = {
  destination: Cartesian3.fromDegrees(117.28, 31.86, 100000.0)
}

// 回归初始位置
const goHome = (viewer) => {
  viewer.camera.flyTo(originLocation3D, {
    duration: 1000
  })
}

// 全屏
const fullScreen = (viewer, domId) => {
  // Fullscreen.requestFullscreen(document.getElementById('domId'));
  //或 按需
  Fullscreen.requestFullscreen(viewer.scene.canvas)
}

// 前一视图
let viewPosition = [];
let viewIndex = -1;
let addviewPositionFlag = false;
let _is3D = true;


/**
 * 初始化地图移动监听事件
 * @param viewer
 */
const initWatchMoveEvent = (viewer) => {
  viewer.camera.moveEnd.addEventListener(() => {
    if (!addviewPositionFlag) {
      if (_is3D) {
        viewPosition.push({
          destination: new Cartesian3(
              Number(viewer.camera.position.x),
              Number(viewer.camera.position.y),
              Number(viewer.camera.position.z)
          ),
          orientation: {
            heading: viewer.scene.camera.heading,
            pitch: viewer.scene.camera.pitch,
            roll: viewer.scene.camera.roll
          }
        })
      } else {
        let cp = viewer.camera.positionCartographic;
        viewPosition.push({
          destination: new Cartesian3.fromDegrees(
              Math.toDegrees(cp.longitude).toFixed(6),
              Math.toDegrees(cp.latitude).toFixed(6),
              cp.height
          ),
        })
      }
      viewIndex++;
    }
    addviewPositionFlag = false;
  })
}


/**
 * 返回上一视图
 * @param viewer
 */
const previousView = (viewer) => {
  if (viewIndex != 0) {
    viewer.camera.flyTo(
        viewPosition[viewIndex - 1]
    )
    addviewPositionFlag = true;
    viewIndex--;
  }
}


/**
 * 返回下一视图
 * @param viewer
 */
const nextView = (viewer) => {
  if (viewPosition.length == 0) {
    return;
  }
  if (viewIndex != viewPosition.length - 1) {
    viewer.camera.flyTo(
        viewPosition[viewIndex + 1]
    )
    addviewPositionFlag = true;
    viewIndex++;
  }
}


/**
 * 重置
 */
const _resetWatchEvent = () => {
  viewPosition = [];
  viewIndex = -1;
  addviewPositionFlag = false;
}

onMounted(async () => {
  Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      89.5,
      20.4,
      110.4,
      61.2
  )
  viewer = createViewer("cesiumContainer", {})

  initWatchMoveEvent(viewer)
})
</script>
<style scoped>
.btn-group {
  background-color: #000000;
  position: absolute;
  left: 20px;
  top: 20px;
  font-size: 16px;
  color: white;
}
</style>
