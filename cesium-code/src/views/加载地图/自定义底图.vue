<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import {onMounted} from "vue";
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
  WebMapTileServiceImageryProvider,
  ImageryLayer, ArcGisMapServerImageryProvider
} from "cesium";
import {createViewer} from "../../utils";


onMounted(async () => {
  Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      89.5,
      20.4,
      110.4,
      61.2
  )
  const viewer = createViewer("cesiumContainer", {
    // arcGis
    // imageryProvider: await ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'),

    // 天地图矢量路径图
    // imageryProvider: new WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3bfb9868e5867155296970898fb5db06",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    //   天地图影像服务
    // imageryProvider: new WebMapTileServiceImageryProvider({
    //   url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3bfb9868e5867155296970898fb5db06",
    //   layer: "tdtBasicLayer",
    //   style: "default",
    //   format: "image/jpeg",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
    // OSM地图,
    // imageryProvider: new OpenStreetMapImageryProvider({
    //   url: "https://a.tile.openstreetmap.org/",
    // }),
    // 高德矢量地图,
    // imageryProvider: new UrlTemplateImageryProvider({
    //   url: "http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}",
    //   layer: "tdtVecBasicLayer",
    //   style: "default",
    //   format: "image/png",
    //   tileMatrixSetID: "GoogleMapsCompatible",
    // }),
  });

  console.log(viewer.imageryLayers)

  console.log(viewer.imageryLayers);
  const layer = viewer.imageryLayers.addImageryProvider(
      new WebMapTileServiceImageryProvider({
        url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=3bfb9868e5867155296970898fb5db06",
        layer: "tdtBasicLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible",
      })
  );

  layer.alpha = 0.5

  console.log(layer)


});
</script>
<style scoped></style>
