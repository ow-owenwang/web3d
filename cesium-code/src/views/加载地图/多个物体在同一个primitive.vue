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
    createWorldTerrainAsync,
    Color,
    RectangleGeometry,
    PerInstanceColorAppearance,
    Primitive,
    GeometryInstance,
    ColorGeometryInstanceAttribute
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
      terrainProvider: await createWorldTerrainAsync(),
    });
  
    const tileset = await createOsmBuildingsAsync();
    const osmBuildings = viewer.scene.primitives.add(tileset);
    

    var rectangle = viewer.entities.add({
    rectangle: {
      coordinates: Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30
      ),
      material: Color.RED.withAlpha(0.5),
    },
  });

  // primivite创建矩形
  // 01-创建几何体
  let rectGeometry = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
  });

  // 02-创建几何体实例
  let instance = new GeometryInstance({
    geometry: rectGeometry,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(
        Color.RED.withAlpha(0.5)
      ),
    },
  });

  let rectGeometry1 = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(
      // 西边的经度
      140,
      // 南边维度
      20,
      // 东边经度
      160,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: PerInstanceColorAppearance.VERTEX_FORMAT,
  });

  let instance2 = new GeometryInstance({
    geometry: rectGeometry1,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(
        Color.BLUE.withAlpha(0.5)
      ),
    },
  });

  // 03-设置外观
  let appearance = new PerInstanceColorAppearance({
    flat: true,
  });
  // 04-图元
  let primitive = new Primitive({
    geometryInstances: [instance, instance2],
    appearance: appearance,
  });
  // 05-添加到viewer
  viewer.scene.primitives.add(primitive);

  viewer.camera.setView(viewer.entities);
  });
  </script>
  <style scoped></style>
  