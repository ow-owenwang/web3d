<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from "vue";
import {
  Cartesian3,
  createOsmBuildingsAsync,
  createWorldTerrainAsync,
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
  SampledPositionProperty,
  JulianDate,
  TimeInterval,
  PathGraphics,
  VelocityOrientationProperty,
  Color,
  TimeIntervalCollection,
} from "cesium";
import { createViewer } from "../../utils";
import planeData from "../../utils/plane.json";

onMounted(async () => {
  const terrainProvider = await createWorldTerrainAsync({
    requestVertexNormals: true,
    requestWaterMask: true,
  });

  const viewer = createViewer("cesiumContainer", {
    infoBox: false,
    terrainProvider: terrainProvider,
    shouldAnimate: true,
  });

  // 隐藏logo
  viewer.cesiumWidget.creditContainer.style.display = "none";
  // 添加3D建筑
  let tiles3d = await createOsmBuildingsAsync();
  const osmBuildings = viewer.scene.primitives.add(tiles3d);

  const positionProperty = new SampledPositionProperty();

  // 时间间隔 30秒
  const timeStepInSeconds = 30;
  // 整个飞行花费的时间
  const totalSeconds = (planeData.length - 1) * timeStepInSeconds;

  // 设置起点时间
  const time = new Date("2022-03-09T23:10:00Z");

  // cesium，默认使用的是儒略日的时间
  // 所以需要起点时间转换成儒略日的时间
  const startJulianDate = JulianDate.fromDate(time);
  // 设置终点时间
  const stopJulianDate = JulianDate.addSeconds(
    startJulianDate,
    totalSeconds,
    new JulianDate()
  );

  // 将查看器的时间调整到起点和结束点的范围
  viewer.clock.startTime = startJulianDate.clone();
  viewer.clock.stopTime = stopJulianDate.clone();
  viewer.clock.currentTime = startJulianDate.clone();
  // console.log(planeData);
  viewer.timeline.zoomTo(startJulianDate, stopJulianDate);

  planeData.forEach((dataPoint, i) => {
    // 当前点的时间
    const time = JulianDate.addSeconds(
      startJulianDate,
      i * timeStepInSeconds,
      new JulianDate()
    );
    // 设置当前点的位置
    const position = Cartesian3.fromDegrees(
      dataPoint.longitude,
      dataPoint.latitude,
      dataPoint.height
    );
    // 添加轨迹采样点
    positionProperty.addSample(time, position);

    // 添加点
    viewer.entities.add({
      position: position,
      point: {
        pixelSize: 10,
        color: Color.RED,
        outlineColor: Color.WHITE,
        outlineWidth: 2,
      },
    });
  });
  console.log(positionProperty);

  // 创建飞机
  const planeEntity = viewer.entities.add({
    availability: new TimeIntervalCollection([
      new TimeInterval({
        start: startJulianDate,
        stop: stopJulianDate,
      }),
    ]),
    name: "飞机",
    // 设置飞机的可用
    position: positionProperty,
    // VelocityOrientationProperty会自动根据采样点，计算出飞机的速度和方向
    orientation: new VelocityOrientationProperty(positionProperty),
    model: {
      uri: "/models/Air.glb",
      // minimumPixelSize: 128,
      // maximumScale: 20000,
    },
    // 绘制轨迹线
    path: new PathGraphics({
      width: 5,
    }),
  });

  // 相机追踪运动的问题
  viewer.trackedEntity = planeEntity;

  // 设置时间速率
  viewer.clock.multiplier = 60;
});
</script>
<style scoped></style>
