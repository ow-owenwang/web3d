<template>
  <div class="box">
    <div class="map-tool">
      <button @click="add3DTiles">加载倾斜摄影</button>
      <button>移除倾斜摄影</button>
      <button @click="openSkylineAnay">打开天际线</button>
      <button @click="closeSkylineAnay">关闭天际线</button>
    </div>
    <div id="mapContainer"></div>
  </div>
</template>


<script>
import * as Cesium from 'cesium';

export default {
  name: "skyline-analysis",
  data() {
    return {
      viewer: null,
      skylineAnayStages:null,
      silhouette:null,
    }
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiODM2NzczYS04NDhmLTQyNTYtYjkwOS0zODdiODlmOWYzY2QiLCJpZCI6MjYyMzk1LCJpYXQiOjE3MzQxNjE1NzV9.QDNVMAkaZB66ctF29zEO8njoVdxykBprPqVesf5e-aM';
      //初始化视图
      this.viewer = new Cesium.Viewer(
          "mapContainer",
          {
            selectionIndicator: false,//是否创建选择指示符小部件，也就是在选择实体时实体本身会出现一个绿色方块。如果设置为false，则不创建选择指示符小部件
            timeline: false,//时间轴，默认值 true
            infoBox: false,//显示信息框
            imageryProvider: new Cesium.WebMapTileServiceImageryProvider({
              url: 'http://{s}.tianditu.gov.cn/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=' + '3bfb9868e5867155296970898fb5db06',
              layer: 'img',
              style: 'default',
              format: 'tiles',
              tileMatrixSetID: 'w',
              subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
              credit: new Cesium.Credit('天地图影像'),
              maximumLevel: 21
            }),
            terrainProvider: new Cesium.CesiumTerrainProvider({
              url: Cesium.IonResource.fromAssetId(1), // TODO: 这里没有资源，所以跑不起来
              requestVertexNormals: true,//顶点法线效果
              requestWaterMask: true,//水效果
            })
          }
      )

      // let h = new Cesium.ScreenSpaceEventHandler(this.viewer.canvas);
      // h.setInputAction((e)=>{
      //   let position =this.viewer.scene.pickPosition(e.position);
      //   var cartographic = Cesium.Cartographic.fromCartesian(position);
      //   //经纬度
      //   var x = Cesium.Math.toDegrees(cartographic.longitude);
      //   var y = Cesium.Math.toDegrees(cartographic.latitude);
      //   var z = cartographic.height;//高度
      //   let currenP={
      //     lon:x,lat:y,h:z
      //   }
      //   //heading
      //   var h = this.viewer.scene.camera.heading;
      //   // pitch
      //   var p = this.viewer.scene.camera.pitch;
      //   //roll
      //   var r = this.viewer.scene.camera.roll;
      //
      //   var info ={'head': h ,'pitch': p ,'roll': r};
      //   var cp = this.viewer.scene.camera.positionCartographic //with longitude and latitude expressed in radians and height in meters.
      //   //以下方式也可以获取相机位置只是返回的坐标系不一样
      //   // var position = viewer.scene.camera.position //cartesian3 空间直角坐标系
      //   // var ellipsoid = scene.globe.ellipsoid;
      //   // var position =ellipsoid.cartesianToCartographic(viewer.scene.camera.position)//
      //   // 弧度转经纬度
      //   var longitude = Cesium.Math.toDegrees(cp.longitude).toFixed(6)
      //   var latitude =  Cesium.Math.toDegrees(cp.latitude).toFixed(6)
      //   var height = cp.height
      //   let cameraP ={lon:longitude,lat:latitude,h:height}
      //   console.log(
      //       {"currenP":currenP,"cameraP":cameraP,mat:info})
      // },Cesium.ScreenSpaceEventType.LEFT_CLICK)
    },
    add3DTiles() {
      //加载大雁塔倾斜摄影
      this.viewer.scene.primitives.add(
          new Cesium.Cesium3DTileset({
            url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
            show: true,
            backFaceCulling: true,
          })
      ).readyPromise.then((tileset) => {
        //拉伸模型高度代码
        // let heightOffset = 0;
        // var boundingSphere = tileset.boundingSphere;
        // var cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center);
        // var surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
        // var offset = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, heightOffset);
        // var translation = Cesium.Cartesian3.subtract(offset, surface, new Cesium.Cartesian3());
        // tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
        // this.viewer.zoomTo(tileset)
        this.viewer.flyTo(tileset)
      })
    },
    //打开天际线分析
    openSkylineAnay(){
      if(this.skylineAnayStages){
        this.silhouette.enabled=true;
        return;
      }
      this.skylineAnayStages = this.viewer.scene.postProcessStages;
      let edgeDetection = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
      let postProccessStage = new Cesium.PostProcessStage({
        //此后处理阶段的唯一名称，供组合中其他阶段参考，如果未提供名称，将自动生成GUID
        // name:name,
        //unform着色器对象 textureScale
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D depthTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'float depth = czm_readDepth(depthTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(depth<1.0 - 0.000001){' +
            'gl_FragColor = color;' +
            '}' +
            'else{' +
            'gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
            '}' +
            '}'
      });

      //PostProcessStage:要使用的片段着色器。默认sampler2D制服是colorTexture和depthTexture。
      let postProccesStage_1 = new Cesium.PostProcessStage({
        // name:obj.name+'_1',
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D redTexture;' +
            'uniform sampler2D silhouetteTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'vec4 redcolor=texture2D(redTexture, v_textureCoordinates);' +
            'vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(redcolor.r == 1.0){' +
            'gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);' +
            '}' +
            'else{' +
            'gl_FragColor = color;' +
            '}' +
            '}',
        //uniform着色器对象
        uniforms: {
          redTexture: postProccessStage.name,
          silhouetteTexture: edgeDetection.name
        }
      });

      //如果inputPreviousStageTexture 是 true，则每个阶段输入是场景渲染到的输出纹理或之前执行阶段的输出纹理
      //如果inputPreviousStageTexture是false，则合成中每个阶段的输入纹理都是相同的
      this.silhouette= new Cesium.PostProcessStageComposite({
        //PostProcessStage要按顺序执行 的 s 或组合的数组。
        stages:[edgeDetection,postProccessStage,postProccesStage_1],
        //是否执行每个后处理阶段，其中一个阶段的输入是前一个阶段的输出。否则每个包含阶段的输入是组合之前执行的阶段的输出
        inputPreviousStageTexture:false,
        //后处理阶段制服的别名
        uniforms:edgeDetection.uniforms
      })
      this.skylineAnayStages.add(this.silhouette);
    },
    //关闭天际线分析
    closeSkylineAnay(){
      this.silhouette.enabled=false;
    }
  },
  components: {}
}
</script>

<style scoped>
</style>
