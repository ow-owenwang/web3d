<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AxesHelper,
  BoxGeometry,
  Clock,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

// 2、创建相机
const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 导入纹理
const textureLoader = new TextureLoader();
const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAplhaTexture = textureLoader.load("/textures/door/alpha.jpg");

// 添加物体
const cubeGeometry = new BoxGeometry(1, 1, 1);
// 材质
const basicMaterial = new MeshBasicMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  //   alphaMap: doorAplhaTexture,
  transparent: true,
  opacity: 0.3,
  //   side: DoubleSide,
});
basicMaterial.side = DoubleSide;
const cube = new Mesh(cubeGeometry, basicMaterial);
scene.add(cube);

// 添加平面
const plane = new Mesh(
  new PlaneGeometry(1, 1),
  basicMaterial
);
plane.position.set(3, 0, 0);
scene.add(plane);

// 初始化渲染器
const renderer = new WebGLRenderer({canvas: canvasRef.value});
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
// document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new Clock();

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
});
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
