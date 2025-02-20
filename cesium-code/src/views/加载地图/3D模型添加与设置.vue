<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from "vue";
import {
  Cartesian3,
  Ion,
  Math as CesiumMath,
  Terrain,
  Viewer,
  Camera,
  Rectangle,
  SkyBox,
  Color,
  createOsmBuildingsAsync,
  DistanceDisplayCondition
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

  // 生成广州塔的位置,113.3191, 23.109
  var position2 = Cartesian3.fromDegrees(113.3191, 23.109, 2000);

  viewer.camera.flyTo({
    destination: position2,
    orientation: {
      heading: CesiumMath.toRadians(0),
      pitch: CesiumMath.toRadians(-90),
      roll: 0,
    },
  });

  // 添加3D建筑
  const tileset = await createOsmBuildingsAsync()
  const osmBuildings = viewer.scene.primitives.add(
    tileset
  );

  // 添加3D模型
  const airplane = viewer.entities.add({
    name: "Airplane",
    position: Cartesian3.fromDegrees(113.3191, 23.109, 1500),
    model: {
      uri: "/model/Air.glb",
      // 设置飞机的最小像素
      minimumPixelSize: 128,
      // 设置飞机的轮廓
      silhouetteSize: 5,
      // 设置轮廓的颜色
      silhouetteColor: Color.WHITE,
      // 设置相机距离模型多远的距离显示
      distanceDisplayCondition: new DistanceDisplayCondition(0, 200000),
    },
  });
});
</script>
<style scoped></style>
