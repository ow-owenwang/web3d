<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  LatheGeometry,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer
} from "three";

function getModel() {

// Vector2表示的三个点坐标，三个点构成的轮廓相当于两端直线相连接
  const pointsArr = [
    new Vector2(50, 60),
    new Vector2(25, 0),
    new Vector2(50, -60)
  ];
// LatheGeometry：pointsArr轮廓绕y轴旋转生成几何体曲面
// pointsArr：旋转几何体的旋转轮廓形状
// 30：旋转圆周方向几何体细分精度
  const geometry = new LatheGeometry(pointsArr, 30);

// 0, Math.PI：旋转的开始角度和结束角度
// const geometry = new LatheGeometry(pointsArr, 30,0, Math.PI);

  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    side: DoubleSide //两面可见
  });
  const mesh = new Mesh(geometry, material);
  return mesh;
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


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




// 渲染循环
  function render() {
    renderer.render(scene, camera);
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