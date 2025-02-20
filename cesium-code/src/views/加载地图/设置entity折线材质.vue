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
  PolylineGlowMaterialProperty
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

  // let material = Color.RED;
  // 设置虚线材质
  // let material = new PolylineDashMaterialProperty({
  //   dashLength: 30,
  //   color: Color.RED,
  // });

  // 设置箭头材质
  // let material = new PolylineArrowMaterialProperty(Color.RED);

  // 设置发光飞线效果
  let material = new PolylineGlowMaterialProperty({
    // 设置发光程度
    glowPower: 0.8,
    // 尾椎缩小程度
    taperPower: 0.7,
    color: Color.RED,
  });

  const redLine = viewer.entities.add({
    polyline: {
      positions: Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
      width: 20,
      material: material,
    },
  });

  viewer.camera.setView(viewer.entities);
});
</script>
<style scoped></style>
