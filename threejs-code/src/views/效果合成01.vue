<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

// 导入后期效果合成器
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

// three框架本身自带效果
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {DotScreenPass} from "three/examples/jsm/postprocessing/DotScreenPass";
import {SMAAPass} from "three/examples/jsm/postprocessing/SMAAPass";
import {GlitchPass} from "three/examples/jsm/postprocessing/GlitchPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {
  ACESFilmicToneMapping,
  Clock,
  CubeTextureLoader,
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  //创建gui对象
  const gui = new dat.GUI();

  // console.log(THREE);
  // 初始化场景
  const scene = new Scene();

  // 创建透视相机
  const camera = new PerspectiveCamera(
    75,
    window.innerHeight / window.innerHeight,
    1,
    50
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.position.set(0, 0, 3);
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 加入辅助轴，帮助我们查看3维坐标轴
  // const axesHelper = new AxesHelper(5);
  // scene.add(axesHelper);


  // 添加环境纹理
  const cubeTextureLoader = new CubeTextureLoader();
  const envMapTexture = cubeTextureLoader.load([
    "/textures/environmentMaps/0/px.jpg",
    "/textures/environmentMaps/0/nx.jpg",
    "/textures/environmentMaps/0/py.jpg",
    "/textures/environmentMaps/0/ny.jpg",
    "/textures/environmentMaps/0/pz.jpg",
    "/textures/environmentMaps/0/nz.jpg",
  ]);
  scene.background = envMapTexture;
  scene.environment = envMapTexture;

  const directionLight = new DirectionalLight("#ffffff", 1);
  directionLight.castShadow = true;
  directionLight.position.set(0, 0, 200);
  scene.add(directionLight);

  // 模型加载
  const gltfLoader = new GLTFLoader();
  gltfLoader.load("/models/DamagedHelmet/glTF/DamagedHelmet.gltf", (gltf) => {
    console.log(gltf);
    // scene.add(gltf.scene)
    const mesh = gltf.scene.children[0];

    scene.add(mesh);
  });

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  // 合成效果
  const effectComposer = new EffectComposer(renderer);
  effectComposer.setSize(window.innerWidth, window.innerHeight);

  // 添加渲染通道
  const renderPass = new RenderPass(scene, camera);
  effectComposer.addPass(renderPass);

  // 点效果
  const dotScreenPass = new DotScreenPass();
  dotScreenPass.enabled = false;
  effectComposer.addPass(dotScreenPass);

  // 抗锯齿
  const smaaPass = new SMAAPass();
  effectComposer.addPass(smaaPass);

  // 发光效果
  const unrealBloomPass = new UnrealBloomPass();
  effectComposer.addPass(unrealBloomPass);

  const glitchPass = new GlitchPass();
  effectComposer.addPass(glitchPass);

  // unrealBloomPass.exposure = 1;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  unrealBloomPass.strength = 1;
  unrealBloomPass.radius = 0;
  unrealBloomPass.threshold = 1;

  gui.add(renderer, "toneMappingExposure").min(0).max(2).step(0.01);
  gui.add(unrealBloomPass, "strength").min(0).max(2).step(0.01);
  gui.add(unrealBloomPass, "radius").min(0).max(2).step(0.01);
  gui.add(unrealBloomPass, "threshold").min(0).max(2).step(0.01);

  // 监听屏幕大小改变的变化，设置渲染的尺寸
  window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);

    effectComposer.setSize(window.innerWidth, window.innerHeight);
    effectComposer.setPixelRatio(window.devicePixelRatio);
  });

  // 将渲染器添加到body
//   document.body.appendChild(renderer.domElement);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  // 设置自动旋转
  // controls.autoRotate = true;

  const clock = new Clock();
  function animate() {
    controls.update();
    const time = clock.getElapsedTime();
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    // renderer.render(scene, camera);
    effectComposer.render();
  }

  animate();
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
