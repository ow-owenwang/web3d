<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {
  AmbientLight,
  AxesHelper,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  // 加载hdr环境图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("/textures/hdr/002.hdr").then((texture) => {
  texture.mapping = EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

// 1、创建场景
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

// 设置cube纹理加载器
const cubeTextureLoader = new CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/1/px.jpg",
  "/textures/environmentMaps/1/nx.jpg",
  "/textures/environmentMaps/1/py.jpg",
  "/textures/environmentMaps/1/ny.jpg",
  "/textures/environmentMaps/1/pz.jpg",
  "/textures/environmentMaps/1/nz.jpg",
]);

const sphereGeometry = new SphereGeometry(1, 20, 20);
const material = new MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  //   envMap: envMapTexture,
});
const sphere = new Mesh(sphereGeometry, material);
scene.add(sphere);

// 给场景添加背景
scene.background = envMapTexture;
// 给场景所有的物体添加默认的环境贴图
scene.environment = envMapTexture;

// 灯光
// 环境光
const light = new AmbientLight(0xffffff, 0.5); // soft white light
scene.add(light);
//直线光源
const directionalLight = new DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

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
