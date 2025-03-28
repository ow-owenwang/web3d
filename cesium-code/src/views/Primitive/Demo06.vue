<script setup lang="ts">
function addListener () {
  let scene = viewer.scene
  var handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (click) {
    // setColor()
    var pickedFeature = viewer.scene.pick(click.position)
    console.log("pickedFeature=", pickedFeature)
    if (pickedFeature) {
      // selectFeature(pickedFeature)
      getAllProperty(pickedFeature)
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
}
function getAllProperty (feature) {
  var propertyNames = feature.getPropertyNames()
  var length = propertyNames.length
  for (var i = 0; i < length; ++i) {
    var propertyName = propertyNames[i]
    console.log(propertyName + ': ' + feature.getProperty(propertyName))
  }
}

var tileset
function add3dtiles (url) {
  tileset = viewer.scene.primitives.add(new Cesium3DTileset({
    url: url
  }))
  tileset.readyPromise.then((tileset) => {
    //后面相应的效果代码都是放这里。
    setColorByHeight()
    viewer.flyTo(tileset)
  })
}
function setColorByHeight () {
  tileset.style = new Cesium3DTileStyle({
    color: {
      conditions: [
        ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
        ["${height} >= 200", "rgb(102, 71, 151)"],
        ["${height} >= 100", "rgb(170, 162, 204)"],
        ["${height} >= 50", "rgb(224, 226, 238)"],
        ["${height} >= 25", "rgb(252, 230, 200)"],
        ["${height} >= 10", "rgb(248, 176, 87)"],
        ["${height} >= 5", "rgb(198, 106, 11)"],
        ["true", "rgb(127, 59, 8)"],
      ],
    },
  });
}


function colorByDistance () {
  tileset.style = new Cesium3DTileStyle({
    defines: {
      distance:
          "distance(vec2(${longitude},${latitude}), vec2(-1.291777521, 0.7105706624))",
    },
    color: {
      conditions: [
        ["${distance} > 0.0012", "color('red')"],
        [
          "${distance} > 0.0008",
          "mix(color('yellow'), color('red'), (${distance} - 0.008) / 0.0004)",
        ],
        [
          "${distance} > 0.0004",
          "mix(color('green'), color('yellow'), (${distance} - 0.0004) / 0.0004)",
        ],
        ["${distance} < 0.00001", "color('white')"],
        [
          "true",
          "mix(color('blue'), color('green'), ${distance} / 0.0004)",
        ],
      ],
    },
  });
}


function hideByHeight () {
  tileset.style = new Cesium3DTileStyle({
    show: "${height} > 200",
  });
}


function addListener () {
  var handler = new ScreenSpaceEventHandler(viewer.scene.canvas);
  handler.setInputAction(function (click) {
    // setColor()
    var pickedFeature = viewer.scene.pick(click.position)
    console.log("pickedFeature=", pickedFeature)
    if (pickedFeature) {
      // selectFeature(pickedFeature)
      // getAllProperty(pickedFeature)
    }
  }, ScreenSpaceEventType.LEFT_CLICK);
}
function selectFeature (feature) {
  var selectbuilding = feature.getProperty('id');
  var s = "${id} ===" + selectbuilding
  console.log("s=", s)
  var selectcontent = s;
  var transparentStyle = new Cesium3DTileStyle({
    color: {
      conditions: [
        [selectcontent, "rgb(255,255,0)"],
        ["${height} >= 300", "rgba(45, 0, 75, 0.5)"],
        ["${height} >= 200", "rgb(102, 71, 151)"],
        ["${height} >= 100", "rgb(170, 162, 204)"],
        ["${height} >= 50", "rgb(224, 226, 238)"],
        ["${height} >= 25", "rgb(252, 230, 200)"],
        ["${height} >= 10", "rgb(248, 176, 87)"],
        ["${height} >= 5", "rgb(198, 106, 11)"],
        ["true", "rgb(127, 59, 8)"],
      ]
    },
  });
  tileset.style = transparentStyle
}
</script>

<template>

</template>

<style scoped>

</style>
