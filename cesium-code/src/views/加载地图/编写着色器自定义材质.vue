<template>
  <div id="cesiumContainer"></div>
</template>
<script setup>
import { onMounted } from "vue";
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
  createWorldTerrainAsync,
  Color,
  RectangleGeometry,
  PerInstanceColorAppearance,
  Primitive,
  GeometryInstance,
  ColorGeometryInstanceAttribute,
  ScreenSpaceEventHandler,
  Cartesian2,
  defined,
  GridMaterialProperty,
  PolylineGlowMaterialProperty,
  MaterialAppearance,
  EllipsoidSurfaceAppearance,
  Material,
} from "cesium";
import { createViewer } from "../../utils";
import gsap from 'gsap';

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
  const viewer = createViewer("cesiumContainer", {
    // terrainProvider: await createWorldTerrainAsync(),
  });

  let material = new GridMaterialProperty({
    color: Color.YELLOW,
    cellAlpha: 0.2,
    lineCount: new Cartesian2(4, 4),
    lineThickness: new Cartesian2(4.0, 4.0),
  });

  console.log(material);

  var rectangle = viewer.entities.add({
    id: "entityRect",
    rectangle: {
      coordinates: Rectangle.fromDegrees(
        // 西边的经度
        90,
        // 南边维度
        20,
        // 东边经度
        110,
        // 北边维度
        30
      ),
      // 设置entity材质，MaterialProperty
      // material: Color.RED.withAlpha(0.5),
      material: material,
    },
  });
  console.log(rectangle);

  // primivite创建矩形
  // 01-创建几何体
  let rectGeometry = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(
      // 西边的经度
      115,
      // 南边维度
      20,
      // 东边经度
      135,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 0,
    vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 02-创建几何体实例
  let instance = new GeometryInstance({
    id: "redRect",
    geometry: rectGeometry,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(
        Color.RED.withAlpha(0.5)
      ),
    },
  });

  let rectGeometry1 = new RectangleGeometry({
    rectangle: Rectangle.fromDegrees(
      // 西边的经度
      140,
      // 南边维度
      20,
      // 东边经度
      160,
      // 北边维度
      30
    ),
    // 距离表面高度
    height: 1000,
  });

  let instance2 = new GeometryInstance({
    id: "blueRect",
    geometry: rectGeometry1,
    attributes: {
      color: ColorGeometryInstanceAttribute.fromColor(
        Color.BLUE.withAlpha(0.5)
      ),
    },
    vertexFormat: EllipsoidSurfaceAppearance.VERTEX_FORMAT,
  });

  // 03-设置外观

  // 使用instance的颜色去着色
  // let material1 = new Material({
  //   fabric: {
  //     type: "Color",
  //     uniforms: {
  //       color: new Color(1.0, 0.0, 0.0, 0.5),
  //     },
  //   },
  // });

  // let material1 = new Material({
  //   fabric: {
  //     type: "Image",
  //     uniforms: {
  //       image: "texture/logo.png",
  //     },
  //   },
  // });

  // 编写着色器修改材质
  // https://com/downloads/cesiumjs/releases/b28/Documentation/
  let material1 = new Material({
    fabric: {
      uniforms: {
        uTime: 0,
      },
      source: `
        czm_material czm_getMaterial(czm_materialInput materialInput)
        {
          // 生成默认的基础材质
          czm_material material = czm_getDefaultMaterial(materialInput);
          // material.diffuse = vec3(materialInput.st+uTime, 0.0);
          float strength = mod((materialInput.s-uTime) * 10.0, 1.0);
          material.diffuse = vec3(strength, 0.0, 0.0);
          return material;
        }
      `,
    },
  });

  gsap.to(material1.uniforms, {
    uTime: 1,
    duration: 2,
    repeat: -1,
    ease: "linear",
  });

  console.log(material1);
  console.log(material1.shaderSource);

  // 设定几何体都是与地球的椭球体平行
  //假定几何体与地球椭球体平行，就可以在计算大量顶点属性的时候节省内存
  let appearance = new EllipsoidSurfaceAppearance({
    material: material1,
    aboveGround: false,
    translucent: true,
  });

  console.log(appearance.vertexShaderSource);
  console.log(appearance.fragmentShaderSource);

  // let appearance = new MaterialAppearance({
  //   material: material1,
  // });
  // 04-图元
  let primitive = new Primitive({
    geometryInstances: [instance, instance2],
    appearance: appearance,
    show: true,
  });
  // 05-添加到viewer
  viewer.scene.primitives.add(primitive);

  viewer.camera.setView(viewer.entities);

});
</script>
<style scoped></style>
