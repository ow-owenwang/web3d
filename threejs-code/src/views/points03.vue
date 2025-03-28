<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AdditiveBlending,
  AxesHelper,
  Clock,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  SphereGeometry,
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

  // 创建球几何体
  const sphereGeometry = new SphereGeometry(3, 30, 30);
  // const material = new MeshBasicMaterial({
  //   color: 0xff0000,
  //   wireframe: true,
  // });
  // const mesh = new Mesh(sphereGeometry, material);
  // scene.add(mesh);

  // 设置点材质
  const pointsMaterial = new PointsMaterial();
  pointsMaterial.size = 0.1;
  pointsMaterial.color.set(0xfff000);
  // 相机深度而衰减
  pointsMaterial.sizeAttenuation = true;

  // 载入纹理
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("./textures/particles/2.png");
  // 设置点材质纹理
  pointsMaterial.map = texture;
  pointsMaterial.alphaMap = texture;
  pointsMaterial.transparent = true;
  pointsMaterial.depthWrite = false;
  pointsMaterial.blending = AdditiveBlending;

  const points = new Points(sphereGeometry, pointsMaterial);

  scene.add(points);

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;

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
    let time = clock.getElapsedTime();
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
