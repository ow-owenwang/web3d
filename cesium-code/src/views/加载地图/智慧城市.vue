<template>
  <div id="cesiumContainer" ref="cesiumContainer"></div>
</template>

<script setup lang="ts">
import initViewer from '../../utils/cesium/initViewer'
import MousePosition from "../../utils/cesium/MousePosition";
import CesiumNavigaion from "cesium-navigation-es6";
import modifyMap from "../../utils/cesium/modifyMap";
import modifyBuild from "../../utils/cesium/modifyBuild";
import LightCone from "../../utils/cesium/LightCone";
import RectFlyLight from "../../utils/cesium/RectFlyLight";
import RoadLightLine from "../../utils/cesium/RoadLightLine";
import RadarLight from "../../utils/cesium/RadarLight";
import LightSpread from "../../utils/cesium/LightSpread";
import LightWall from "../../utils/cesium/LightWall";
import ParticleLight from "../../utils/cesium/ParticleLight";
import { onMounted } from 'vue';
import {
    Color
} from 'cesium'

onMounted(() => {
  let viewer = initViewer();
  // 根据鼠标位置生成经纬度值
  let mousePosition = new MousePosition(viewer);
  // 设置导航罗盘的配置
  var options = {
    // 启用罗盘
    enableCompass: true,
    // 是否启用缩放
    enableZoomControls: false,
    // 是否启用指南针外环
    enableCompassOuterRing: true,
    // 是否启用距离的图例
    // enableDistanceLegend: false,
  };
  // 初始化导航罗盘
  let navigation = new CesiumNavigaion(viewer, options);
  // 修改地图的底色
  modifyMap(viewer);
  // 修改建筑的颜色
  modifyBuild(viewer);
  // 添加动态的光锥特效
  let lightCone = new LightCone(viewer);
  // 创建区域上升流光飞线
  let rectFlyLight = new RectFlyLight(viewer);
  // 创建道路飞线
  let roadLightLine = new RoadLightLine(viewer);
  // 创建雷达
  let radarLight = new RadarLight(viewer);
  // 6边形光波扩散特效
  let lightSpread = new LightSpread(viewer);
  // 创建光墙
  let lightWall = new LightWall(viewer);
  // particleLight,创建烟花粒子
  let particleLight = new ParticleLight(viewer, Color.RED);
  let particleLight1 = new ParticleLight(viewer, Color.AQUA);
  let particleLight2 = new ParticleLight(viewer, Color.GREEN);
});
</script>