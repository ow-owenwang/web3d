<script setup lang="ts">
import {onMounted} from "vue";
import {createViewer} from "../../utils";
import {Cartesian2, Cartesian3, Color, HorizontalOrigin, NearFarScalar, VerticalOrigin, Math} from "cesium";

onMounted(() => {
  const viewer = createViewer("cesiumContainer", {});


  const position = Cartesian3.fromDegrees(116.43299, 39.91599)
  const entity = viewer.entities.add({
    position: position,
    // 和下面billboard不能同时设置吗？
    // point: {
    //   color: Color.BLUE, // 点位颜色
    //   pixelSize: 5 // 像素点大小
    // },
    billboard: {
      image: '/logo.png',
      // 设置广告牌的显示位置
      verticalOrigin: VerticalOrigin.TOP,
      // 设置广告牌的显示位置
      horizontalOrigin: HorizontalOrigin.CENTER,
      /*show: true,
      pixelOffset: new Cartesian2(10, -10),
      // eyeOffset: new Cartesian3(0.0, 0.0, 0.0),
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.BOTTOM,
      // 按距离缩放
      scaleByDistance: new NearFarScalar(1.5e2, 1, 10000, 0.0),
      scale: 2.0,
      color: Color.RED,
      rotation: Math.PI_OVER_FOUR,
      alignedAxis: Cartesian3.ZERO,*/
      width: 100,
      height: 50,
    }
  })

  // viewer.camera.flyTo({
  //   position: position,
  // })
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>

</style>
