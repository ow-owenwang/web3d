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
  ScreenSpaceEventType,
  defined
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

  // 动态修改图元颜色
  setInterval(() => {
    let attributes = primitive.getGeometryInstanceAttributes("blueRect");
    attributes.color = ColorGeometryInstanceAttribute.toValue(
      // Color.YELLOW.withAlpha(0.5)
      Color.fromRandom({
        alpha: 0.5,
      })
    );
  }, 2000);

  // 拾取
  var handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    // console.log(movement);
    // scene.pick选中物体
    var pickedObject = viewer.scene.pick(movement.position);
    console.log(pickedObject);
    if (defined(pickedObject) && typeof pickedObject.id == "string") {
      // console.log(pickedObject.id);
      let attributes = primitive.getGeometryInstanceAttributes(pickedObject.id);
      attributes.color = ColorGeometryInstanceAttribute.toValue(
        Color.YELLOW.withAlpha(0.5)
      );
    }
  }, ScreenSpaceEventType.LEFT_CLICK);

  viewer.camera.setView(viewer.entities);
});
</script>
<style scoped></style>
