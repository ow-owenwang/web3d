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
    GridMaterialProperty,
    PolylineGlowMaterialProperty,
    MaterialAppearance,
    EllipsoidSurfaceAppearance,
    Material
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
    vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 03-设置外观

  // 使用instance的颜色去着色
  // let appearance = new PerInstanceColorAppearance({
  //   flat: true,
  // });
  // type color
  let material1 = new Material.fromType("Color", {
    color: Color.AQUA.withAlpha(0.5),
  });

  // 设定几何体都是与地球的椭球体平行
  //假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
  // let appearance = new EllipsoidSurfaceAppearance({
  //   material: material1,
  //   aboveGround: true,
  // });

  let appearance = new MaterialAppearance({
    material: material1,
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
  