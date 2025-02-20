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
  DistanceDisplayCondition,
  VerticalOrigin,
  HorizontalOrigin,
  LabelStyle,
  Cartesian2
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
  const tileset = await createOsmBuildingsAsync();
  const osmBuildings = viewer.scene.primitives.add(tileset);

  // 创建一个点
  /* const point = viewer.entities.add({
    // 定位点
    position: Cartesian3.fromDegrees(113.3191, 23.109, 700),
    // 点
    point: {
      pixelSize: 10,
      color: Color.RED,
      outlineColor: Color.WHITE,
      outlineWidth: 4,
    },
  }); */

  // 添加文字标签和广告牌
  const label = viewer.entities.add({
    position: Cartesian3.fromDegrees(113.3191, 23.109, 750),
    label: {
      text: "广州塔",
      font: "24px sans-serif",
      fillColor: Color.WHITE,
      outlineColor: Color.BLACK,
      outlineWidth: 4,
      // FILL填充文字，OUTLINE勾勒标签，FILL_AND_OUTLINE填充文字和勾勒标签
      style: LabelStyle.FILL_AND_OUTLINE,
      // 设置文字的偏移量
      pixelOffset: new Cartesian2(0, -24),
      // 设置文字的显示位置,LEFT /RIGHT /CENTER
      horizontalOrigin: HorizontalOrigin.CENTER,
      // 设置文字的显示位置
      verticalOrigin: VerticalOrigin.BOTTOM,
    },
    billboard: {
      image: "/texture/gzt.png",
      width: 50,
      height: 50,
      // 设置广告牌的显示位置
      verticalOrigin: VerticalOrigin.TOP,
      // 设置广告牌的显示位置
      horizontalOrigin: HorizontalOrigin.CENTER,
    },
  });
});
</script>
<style scoped></style>
