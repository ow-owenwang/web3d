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
    GeoJsonDataSource,
    ColorMaterialProperty,
    Color
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
    });


  // 加载geojson数据
  let dataGeo = GeoJsonDataSource.load(
    "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json",
    {
      stroke: Color.RED,
      fill: Color.SKYBLUE.withAlpha(0.5),
      strokeWidth: 4,
    }
  );
  // console.log(dataGeo);
  // viewer.dataSources.add(dataGeo);

  dataGeo.then((dataSources) => {
    console.log(dataSources);
    viewer.dataSources.add(dataSources);
    let entities = dataSources.entities.values;
    entities.forEach((entity, i) => {
      entity.polygon.material = new ColorMaterialProperty(
        Color.fromRandom({
          alpha: 1,
        })
      );
      entity.polygon.outline = false;
      let randomNum = parseInt(Math.random() * 5);
      entity.polygon.extrudedHeight = 100000 * randomNum;
    });
  });
  });
  </script>
  <style scoped></style>
  