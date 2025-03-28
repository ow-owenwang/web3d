<script setup lang="ts">


// 在模型上方加一个label，需要获取模型的高度

function addPoint () {
  point = viewer.entities.add({
    position: new CallbackProperty(updatePosition, false),
    point: {
      pixelSize: 10,
      color: Color.YELLOW,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: {
      show: false,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.BOTTOM,
      pixelOffset: new Cartesian2(5, 5),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
  objectsToExclude = [point]
}
var objectsToExclude
var cartographic = new Cartographic();
var point
function updatePosition (time, result) {
  let scene = viewer.scene
  var offset = (time.secondsOfDay % duration) / duration;
  var carto = Cartographic.fromDegrees(longitude, latitude, 0);
  cartographic.longitude = carto.longitude - range + offset * range * 2.0;
  cartographic.latitude = carto.latitude;
  var height;
  if (scene.sampleHeightSupported) {
    height = scene.sampleHeight(cartographic, objectsToExclude);
  }
  if (defined(height)) {
    cartographic.height = height;
    point.label.text = Math.abs(height).toFixed(2).toString() + " m";
    point.label.show = true;
  } else {
    cartographic.height = 0.0;
    point.label.show = false;
  }
  var reCartesian = Cartographic.toCartesian(
      cartographic,
      Ellipsoid.WGS84,
      result
  );
  return reCartesian;
}


function addPoint1 () {
  var position = getPosition()
  point = viewer.entities.add({
    position: position,// new CallbackProperty(updatePosition, false),// getPosition(),//
    point: {
      pixelSize: 10,
      color: Color.YELLOW,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    label: {
      show: true,
      showBackground: true,
      font: "14px monospace",
      text: "test",
      horizontalOrigin: HorizontalOrigin.LEFT,
      verticalOrigin: VerticalOrigin.BOTTOM,
      pixelOffset: new Cartesian2(5, 5),
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
  objectsToExclude = [point]
}
var objectsToExclude
var cartographic = new Cartographic();
var point
function getPosition () {
  let scene = viewer.scene
  var carto = Cartographic.fromDegrees(longitude, latitude, 0);
  console.log('carto=', carto)
  cartographic.longitude = carto.longitude;
  cartographic.latitude = carto.latitude;
  var height;
  if (scene.sampleHeightSupported) {
    height = scene.sampleHeight(cartographic);
  }
  console.log('height=', height)
  if (defined(height)) {
    cartographic.height = height;
  } else {
    cartographic.height = 77;
  }
  var reCartesian = Cartographic.toCartesian(
      cartographic,
      Ellipsoid.WGS84,
      new Cartesian3()
  );
  console.log('reCartesian=', reCartesian)
  return reCartesian;
}
</script>

<template>

</template>

<style scoped>

</style>
