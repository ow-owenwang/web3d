import * as Cesium from "cesium";

/* export default async function modifyBuild(viewer) {
  // 添加3D建筑
  let tiles3d = await Cesium.createOsmBuildingsAsync();
  const osmBuildings = viewer.scene.primitives.add(tiles3d);

  tiles3d.style = new Cesium.Cesium3DTileStyle({
    show: "${feature['name']} !== '广州塔'",
  });

  //监听当瓦片加载时候执行事件
  tiles3d.tileVisible.addEventListener(function (tile) {
    // console.log(tile);
    const cesium3DTileCon = tile.content;
    const featuresLength = cesium3DTileCon.featuresLength;
    console.log(cesium3DTileCon, featuresLength);
    for (let i = 0; i < featuresLength; i++) {
      const models = cesium3DTileCon.getFeature(i).content._model;
      console.log(cesium3DTileCon.getFeature(i), cesium3DTileCon.getFeature(i).content, cesium3DTileCon.getFeature(i).content._model)

      // TODO: 这里有问题！model上没有这个属性_rendererResources
      // 修改模型的片元着色器
      // const fragmentShaderSource =
      //   (models._rendererResources.sourceShaders[1] = `
      //         varying vec3 v_positionEC;

      //         void main()
      //         {
      //             czm_materialInput materialInput;
      //             // 获取模型position信息
      //             vec4 position = czm_inverseModelView * vec4(v_positionEC, 1.0);
      //             //   根据高度来设置渐变颜色
      //             float  strength = position.z/200.0;
      //             gl_FragColor = vec4(strength,0.3*strength,strength, 1.0);

      //             //   动态光环
      //             //   czm_frameNumber获取当前帧数
      //             //   fract(x),返回x的小数部分
      //             float time  = fract(czm_frameNumber/(60.0*10.0));
      //           //   float time  = fract(czm_frameNumber/60.0)*6.28 ;
      //           //   实现往返的操作
      //              time = abs(time-0.5)*2.0;
      //           // time = sin(time);
      //           // clamp(x, min, max)，返回x在min和max之间的最小值
      //           float diff = abs(clamp(position.z/500.0, 0.0, 1.0) - time) ;
      //           // step(edge, x)，如果x大于等于edge，返回1，否则返回0
      //           diff = step(0.01, diff);
      //           gl_FragColor.rgb += vec3(0.5)*(1.0-diff);



      //         }

      //     `);

      // // 片元着色器已经修改，需要更新
      // models._shouldRegenerateShaders = true;
    }
  });
} */

export default async function modifyBuild(viewer) {
  // 添加 OSM 3D 建筑
  let tiles3d = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(tiles3d);

  // 设置建筑物的可见性
  tiles3d.style = new Cesium.Cesium3DTileStyle({
    show: "${feature['name']} !== '广州塔'",
  });

  // 使用 `CustomShader` 替代手动修改 `_rendererResources`
  const customShader = new Cesium.CustomShader({
    lightingModel: Cesium.LightingModel.UNLIT, // 取消默认光照影响，确保颜色正确显示
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
          vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionMC, 1.0);
          float strength = position.z / 200.0;
          material.diffuse = vec3(strength, 0.3 * strength, strength); // 只修改颜色，不影响其他材质
          material.alpha = 1.0;
  
          // 动态光环效果
          float time = fract(czm_frameNumber / (60.0 * 10.0));
          time = abs(time - 0.5) * 2.0;
          float diff = abs(clamp(position.z / 500.0, 0.0, 1.0) - time);
          diff = step(0.01, diff);
          material.diffuse += vec3(0.5) * (1.0 - diff);
      }
    `,
  });

  // 绑定 `CustomShader` 到 OSM Buildings
  tiles3d.customShader = customShader;
}
