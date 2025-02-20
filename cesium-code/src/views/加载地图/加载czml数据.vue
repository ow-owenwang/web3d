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
    KmlDataSource,
    CzmlDataSource
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
    
    const czml = [
    {
      id: "document",
      name: "box",
      version: "1.0",
    },
    {
      id: "shape1",
      name: "Blue box",
      position: {
        cartographicDegrees: [-114.0, 40.0, 300000.0],
      },
      box: {
        dimensions: {
          cartesian: [400000.0, 300000.0, 500000.0],
        },
        material: {
          solidColor: {
            color: {
              rgba: [0, 0, 255, 255],
            },
          },
        },
      },
    },
  ];

  // console.log(czml);
  // console.log(JSON.stringify(czml));

  let czmlUrl = "/box.czml";

  // 加载czml数据
  let promiseData = CzmlDataSource.load(czmlUrl);
  promiseData.then((dataSource) => {
    console.log(dataSource);
    viewer.dataSources.add(dataSource);
    viewer.flyTo(dataSource);
  });
  });
  </script>
  <style scoped></style>
  