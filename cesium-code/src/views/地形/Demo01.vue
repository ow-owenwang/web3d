<script setup lang="ts">
import {CesiumTerrainProvider, UrlTemplateImageryProvider, Viewer} from "cesium";

let xt3dInit = {
  init(el) {
    this.initViewer(el);
    this.setView();
  },


  initViewer(el) {
    this.viewer = new Viewer(el, {
      infoBox: false,
      selectionIndicator: false,
      navigation: false,
      animation: true,
      timeline: false,
      baseLayerPicker: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      shouldAnimate: true,
      terrainProvider: new CesiumTerrainProvider({
        url: "http://data.xtgis.cn/terrain",
        requestWaterMask: true,
        requestVertexNormals: true
      }),
      imageryProvider: new UrlTemplateImageryProvider({
        url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
      })
    });
    this.viewer.scene.globe.depthTestAgainstTerrain = false; //默认为false
    this.viewer.animation.container.style.visibility = 'hidden'; // 不显示动画控件
  },

  setView() {
    let flyToOpts = {
      destination: {
        x: -1244121.9426581487,
        y: 5085439.458440664,
        z: 3654926.4730463736
      },
      orientation: {
        heading: 4.788047581496534,
        pitch: -0.4322797689024851,
        roll: 6.27971882399201
      },
      duration: 1
    };
    this.viewer.scene.camera.flyTo(flyToOpts);
  },

  destroy() {
    this.viewer.entities.removeAll();
    this.viewer.imageryLayers.removeAll(true);
    this.viewer.destroy();
  }
}

// 加载中国地形
xt3dInit.init("map3d");
</script>

<template>

</template>

<style scoped>

</style>
