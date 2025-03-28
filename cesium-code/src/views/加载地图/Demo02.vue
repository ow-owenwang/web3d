<template>
  <div style="height:100%">
    <div id="cesiumContainer"
         style="height:100%"></div>
  </div>
</template>

<script>
import * as Cesium from 'cesium'
import {createWorldTerrainAsync} from "cesium";

export default {
  name: 'cesium',
  data () {
    return {
      viewer: null,
      tToken: '3bfb9868e5867155296970898fb5db06',
      tUrl: 'https://t{s}.tianditu.gov.cn/',
      tSubdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
      cesiumToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODM2NzczYS04NDhmLTQyNTYtYjkwOS0zODdiODlmOWYzY2QiLCJpZCI6MjYyMzk1LCJpYXQiOjE3MzQxNjE1NzV9.QDNVMAkaZB66ctF29zEO8njoVdxykBprPqVesf5e-aM'
    }
  },
  async mounted () {
    await this.initCesium()
    this.cesiumFlyTo(117.3, 39.9, 800000, this.addPoint)
    this.addImageryLayers()
    this.addCountryLine()
    // 添加遮罩层
    // this.addMask()
  },
  methods: {
    async initCesium () {
      Cesium.Ion.defaultAccessToken = this.cesiumToken
      // 加载google卫星影像
      const viewer = new Cesium.Viewer('cesiumContainer', {
        baseLayerPicker: false, // 隐藏右上角影像拾取
        animation: false, // 隐藏左下角的动画仪表盘
        fullscreenButton: false, // 隐藏全屏按钮
        homeButton: false, // 隐藏home按钮
        geocoder: false, // 隐藏右上角搜索
        sceneModePicker: false, // 隐藏2d3d切换按钮
        timeline: false, // 隐藏时间轴
        navigationHelpButton: false, // 隐藏导航帮助按钮
        terrainProvider: await createWorldTerrainAsync()
      })
      // 添加3D建筑
      viewer.scene.primitives.add(await Cesium.createOsmBuildingsAsync())
      this.viewer = Object.freeze(viewer)
    },
    cesiumFlyTo (x, y, height, complete) {
      this.viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(x, y, height),
        duration: 8,
        complete: complete
      })
    },
    addImageryLayers () {
      // 加载天地图影像
      const imgMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + this.tToken,
        subdomains: this.tSubdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 18
      })
      this.viewer.imageryLayers.addImageryProvider(imgMap)
    },
    addCountryLine () {
      // 叠加国界服务
      var iboMap = new Cesium.UrlTemplateImageryProvider({
        url: this.tUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + this.tToken,
        subdomains: this.tSubdomains,
        tilingScheme: new Cesium.WebMercatorTilingScheme(),
        maximumLevel: 10
      })
      this.viewer.imageryLayers.addImageryProvider(iboMap)
    },
    addPoint () {
      // 添加坐标点
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.20, 39.56),
        point: {
          pixelSize: 30,
          color: Cesium.Color.RED
        }
      })
      // 添加文字
      this.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(116.328327, 39.945162),
        label: {
          text: '北京',
          font: '24px Helvetica',
          fillColor: Cesium.Color.SKYBLUE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE
        }
      })
    },
    // addMask () {
    //   // 添加遮罩层,遮罩层是按照顺序叠加起来的会被覆盖，如果透明则会变色
    //   const entities = this.viewer.entities
    //   var stripeMaterial = new Cesium.StripeMaterialProperty({
    //     evenColor: Cesium.Color.YELLOW.withAlpha(0.5),
    //     oddColor: Cesium.Color.YELLOW.withAlpha(0.5),
    //     repeat: 5.0
    //   })
    //   entities.add({
    //     polygon: {
    //       hierarchy: new Cesium.PolygonHierarchy(
    //           Cesium.Cartesian3.fromDegreesArray(point.c100010)
    //       ),
    //       outline: true,
    //       outlineColor: Cesium.Color.WHITE,
    //       outlineWidth: 4,
    //       material: stripeMaterial
    //     }
    //   })
    //   stripeMaterial = new Cesium.StripeMaterialProperty({
    //     evenColor: Cesium.Color.BLUE.withAlpha(0.5),
    //     oddColor: Cesium.Color.BLUE.withAlpha(0.5),
    //     repeat: 5.0
    //   })
    //   entities.add({
    //     polygon: {
    //       hierarchy: new Cesium.PolygonHierarchy(
    //           Cesium.Cartesian3.fromDegreesArray(point.c100000)
    //       ),
    //       outline: true,
    //       outlineColor: Cesium.Color.WHITE,
    //       outlineWidth: 4,
    //       material: stripeMaterial
    //     }
    //   })
    // }
  }
}
</script>

<style scoped>
</style>
