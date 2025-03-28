<script setup lang="ts">
import {onMounted} from "vue";
import {createViewer} from "../utils";
import {defined, ScreenSpaceEventType} from "cesium";

/*
scene.pick	直接监听鼠标点击	适用于普通点击交互
selectedEntityChanged	监听实体的选中状态	适用于有 viewer.selectedEntity 变化的场景，如 infoBox 交互
 */
onMounted(() => {
  const viewer = createViewer("cesiumContainer", {});

  viewer.screenSpaceEventHandler.setInputAction((event) => {
    const pickedObject = viewer.scene.pick(event.position);
    if (defined(pickedObject) && pickedObject.id) {
      const entity = pickedObject.id;
      console.log("点击的实体信息：", entity.properties);
      alert(`名称: ${entity.properties.name}\nIP: ${entity.properties.ip}\n状态: ${entity.properties.status}`);
    }
  }, ScreenSpaceEventType.LEFT_CLICK);


  viewer.selectedEntityChanged.addEventListener((entity) => {
    if (defined(entity)) {
      console.log("选中的实体信息：", entity.properties);
      alert(`名称: ${entity.properties.name}\nIP: ${entity.properties.ip}\n状态: ${entity.properties.status}`);
    }
  })
})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>

</style>
