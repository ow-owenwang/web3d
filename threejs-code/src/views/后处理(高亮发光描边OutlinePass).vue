<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, ArcCurve,
  AxesHelper, BoxGeometry,
  BufferAttribute,
  BufferGeometry, CatmullRomCurve3,
  CircleGeometry, CubicBezierCurve,
  DirectionalLight,
  DoubleSide, EllipseCurve,
  GridHelper,
  Group, Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial, QuadraticBezierCurve,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader, Vector2, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {OutlinePass} from "three/examples/jsm/postprocessing/OutlinePass";

function getModel() {

  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x009999,
  });
  const mesh = new Mesh(geometry, material);

  const mesh2 = mesh.clone();
  mesh2.position.y = 100;
  const mesh3 = mesh.clone();
  mesh3.position.x = 100;
  const model = new Group();

// 三个网格模型用于高亮发光描边测试
  model.add(mesh,mesh2,mesh3);

  return {model,mesh,mesh2,mesh3};
}

const canvasRef = ref()

onMounted(() => {

  const {model,mesh,mesh2,mesh3} = getModel();
  const scene = new Scene();
  scene.add(model); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
  renderer.setSize(width, height);

// 创建后处理对象EffectComposer，WebGL渲染器作为参数
  const composer = new EffectComposer(renderer);
// 创建一个渲染器通道，场景和相机作为参数
  const renderPass = new RenderPass(scene, camera);
// 设置renderPass通道
  composer.addPass(renderPass);

// 创建OutlinePass通道,显示模型外轮廓边框
  const v2 = new Vector2(window.innerWidth, window.innerHeight);
// outlinePass第一个参数v2的尺寸和canvas画布保持一致
  const outlinePass = new OutlinePass(v2, scene, camera);
//设置需要高亮发光描边的模型对象
  outlinePass.selectedObjects = [mesh];
// 设置OutlinePass通道
  composer.addPass(outlinePass);

// 渲染循环
  function render() {
    // 使用后处理模块EffectComposer，可通过该对象的render方法调用渲染器的render方法
    composer.render();
    // renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();


  const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
  window.onresize = function () {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  };
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