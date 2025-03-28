<template>
  <div id="cesiumContainer"></div>
  <button class="btn" @click="onClick">底图切换</button>
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
  ImageryLayer,
  ArcGisMapServerImageryProvider,
  Credit
} from "cesium";
import {createViewer} from "../../utils";

const tdtUrl = "https://t{s}.tianditu.gov.cn"
const token = "3bfb9868e5867155296970898fb5db06"
const basemapOptions = [
  /**
   * type代表地图服务类型
   * 0 代表ArcGisMapServerImageryProvider;
   * 1 代表createOpenStreetMapImageryProvider;
   * 2 代表WebMapTileServiceImageryProvider;
   * 3 代表createTileMapServiceImageryProvider;
   * 4 代表UrlTemplateImageryProvider;
   * 5 代表WebMapServiceImageryProvider);
   */
  {
    id: 'TDTSL',
    img: '',//缩略图
    type: 2,
    label: '天地图矢量',
    params: [
      {
        url: tdtUrl + '/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + token,
        layer: 'veccva',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        credit: new Credit('天地图矢量注记'),
        maximumLevel: 18
      },
      {
        url: tdtUrl + '/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + token,
        layer: 'vec',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        credit: new Credit('天地图矢量'),
        maximumLevel: 18
      },
    ]
  },
  {
    id: 'TDTYX',
    img: '',//缩略图
    type: 2,
    label: '天地图影像',
    params: [
      {
        url: tdtUrl + '/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + token,
        layer: 'imgcia',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        credit: new Credit('天地图影像注记'),
        maximumLevel: 18
      },
      {
        url: tdtUrl + '/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + token,
        layer: 'img',
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'w',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        credit: new Credit('天地图影像'),
        maximumLevel: 18
      },
    ]
  }
]


const changeBasemap = (viewer, val) => {
  const f = viewer.imageryLayers._layers.filter(item => {
    return item.lyr_id;
  })
  if (f.length == 0) {
    viewer.imageryLayers.remove(viewer.imageryLayers.get(0))
    const l = getLayer(getLayerOption('TDTSL'));//默认加载天地图矢量
    l.forEach(itme => {
      viewer.imageryLayers.add(itme);
      viewer.imageryLayers.lowerToBottom(itme);
    })
  } else {
    for (const elem of f) {
      viewer.imageryLayers.remove(elem);
    }
    const l = getLayer(getLayerOption(val));//默认加载天地图矢量
    l.forEach(itme => {
      viewer.imageryLayers.add(itme);
      viewer.imageryLayers.lowerToBottom(itme);
    })
  }
}

function getLayerOption(val) {
  return basemapOptions.find(item => {
    return item.id == val;
  })
}

function getLayer(val) {
  let tempLayerList = [];
  switch (val.type) {
    case 0: {
      break;
    }
    case 1: {
      break;
    }
    case 2: {
      val.params.forEach(item => {
        let l = new ImageryLayer(
            new WebMapTileServiceImageryProvider(item)
        )
        l.lyr_id = 'basemapLayer';
        l.lyr_name = val.id;
        tempLayerList.push(
            l
        )
      })
      break;
    }
  }
  return tempLayerList;
}

// TODO: 方法2，通过控制viewer.imageryLayers各图层的显示与隐藏来实现  someLayer.show = false

let viewer
let layer = ''
const onClick = () => {
  if (layer === 'TDTYX') {
    layer = 'TDTSL'
    changeBasemap(viewer, 'TDTSL')
  } else if (layer === 'TDTSL') {
    layer = 'TDTYX'
    changeBasemap(viewer, 'TDTYX')
  } else {
    layer = 'TDTSL'
    changeBasemap(viewer, 'TDTSL')
  }
}
onMounted(async () => {
  Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      89.5,
      20.4,
      110.4,
      61.2
  )
  viewer = createViewer("cesiumContainer", {})


})
</script>
<style scoped>
.btn {
  background-color: #000000;
  position: absolute;
  left: 20px;
  top: 20px;
  font-size: 16px;
  color: white;
}
</style>
