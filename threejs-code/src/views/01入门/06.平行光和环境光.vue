<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  DirectionalLightHelper,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer
} from "three";

const canvasRef = ref()

onMounted(()=>{
  const scene = new Scene();

  /**
   * 创建网格模型
   */
//创建一个长方体几何对象Geometry
  const geometry = new BoxGeometry(100, 100, 100);
// 漫反射网格材质；MeshLambertMaterial
  const material = new MeshLambertMaterial({
    color: 0x00ffff, //设置材质颜色
  });
  const mesh = new Mesh(geometry, material); //网格模型对象Mesh
  scene.add(mesh); //网格模型添加到场景中

// AxesHelper：辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  /**
   * 光源设置
   */
// //点光源
const pointLight = new PointLight(0xffffff, 1.0);
// //点光源位置
pointLight.position.set(400, 200, 300);
scene.add(pointLight); //点光源添加到场景中

//环境光:没有特定方向，整体改变场景的光照明暗
//   const ambient = new AmbientLight(0xffffff, 0.4);
//   scene.add(ambient);

// 平行光
  const directionalLight = new DirectionalLight(0xffffff, 1);
// 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
  directionalLight.position.set(100, 60, 50);
// 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
// directionalLight.target = mesh;
  scene.add(directionalLight);

// DirectionalLightHelper：可视化平行光
  const dirLightHelper = new DirectionalLightHelper(directionalLight, 5,0xff0000);
  scene.add(dirLightHelper);


// width和height用来设置js输出的Canvas画布尺寸(像素px)
  const width = 800; //宽度
  const height = 500; //高度
  /**
   * 透视投影相机设置
   */
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185); //相机在js三维坐标系中的位置
  camera.lookAt(0, 0, 0); //相机观察目标指向js坐标系原点

  /**
   * 创建渲染器对象
   */
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height); //设置js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作

// 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
  controls.addEventListener('change', function () {
    renderer.render(scene, camera); //执行渲染操作
    // 浏览器控制台查看相机位置变化
    console.log('camera.position',camera.position);
  });//监听鼠标、键盘事件
})
</script>

<template>
<canvas ref="canvasRef"></canvas>
</template>

<style scoped>
canvas {
  width: 100%;
  height: 100%;
}
</style>