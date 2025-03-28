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
    ColorGeometryInstanceAttribute,
    ScreenSpaceEventHandler,
    Cartesian2,
    defined,
    GridMaterialProperty
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
      // terrainProvider: await createWorldTerrainAsync(),
    });
  
    //   const tileset = await createOsmBuildingsAsync();
    //   const osmBuildings = viewer.scene.primitives.add(tileset);
  
    // let material = new ColorMaterialProperty(
  //   new Color(1.0, 1.0, 1.0, 1.0)
  // );
  // 棋盘纹理
  // let material = new CheckerboardMaterialProperty({
  //   evenColor: Color.RED,
  //   oddColor: Color.YELLOW,
  //   repeat: new Cartesian2(2, 2),
  // });
  // 条纹纹理
  // let material = new StripeMaterialProperty({
  //   evenColor: Color.WHITE,
  //   oddColor: Color.BLACK,
  //   repeat: 8,
  // });
  // 网格纹理
  let material = new GridMaterialProperty({
    color: Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cartesian2(4, 4),
    lineThickness: new Cartesian2(4.0, 4.0),
  });

  console.log(material);

  var rectangle = viewer.entities.add({
    id: "entityRect",
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
      // 设置entity材质，MaterialProperty
      // material: Color.RED.withAlpha(0.5),
      material: material,
    },
  });
  console.log(rectangle);

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
    id: "redRect",
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
    id: "blueRect",
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
  