<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AxesHelper,
  Clock,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

  // 创建透视相机
  const camera = new PerspectiveCamera(
    90,
    window.innerHeight / window.innerHeight,
    0.1,
    1000
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.position.set(0, 0, 10);
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 加入辅助轴，帮助我们查看3维坐标轴
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  let basicMaterial = new MeshBasicMaterial({
    color: "#00ff00",
    side: DoubleSide,
  });

  const basicUnifrom = {
    uTime: {
      value: 0,
    },
  };
  basicMaterial.onBeforeCompile = (shader, renderer) => {
    console.log(shader);
    console.log(shader.vertexShader);
    console.log(shader.fragmentShader);

    // console.log(renderer)
    shader.uniforms.uTime = basicUnifrom.uTime;
    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `
    #include <common>
    uniform float uTime;
    `
    );
    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `
    #include <begin_vertex>
    transformed.x += sin(uTime)* 2.0;
    transformed.z += cos(uTime)* 2.0;
    `
    );
  };

  let standardMaterial = new MeshStandardMaterial({
    color: "#ffff00",
  });

  // 创建平面
  const floor = new Mesh(
    new PlaneGeometry(1, 1, 64, 64),
    basicMaterial
  );
  // console.log(floor);
  scene.add(floor);

  const light = new DirectionalLight(0xffffff, 1);
  light.position.set(5, 5, 5);
  scene.add(light);

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
  });
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = BasicShadowMap;
  // renderer.shadowMap.type = VSMShadowMap;

  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);

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
  });

  // 将渲染器添加到body
  // document.body.Child(renderer.domElement);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  // 设置自动旋转
  // controls.autoRotate = true;

  const clock = new Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();

    basicUnifrom.uTime.value = elapsedTime;
    //   console.log(elapsedTime);
    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
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
