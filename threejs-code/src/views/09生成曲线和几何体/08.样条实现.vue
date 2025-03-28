<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferGeometry,
  CatmullRomCurve3,
  DirectionalLight,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

function getModel() {

// p1、p3轨迹线起始点坐标
  const p1 = new Vector3(-100, 0, -100);
  const p3 = new Vector3(100, 0, 100);
// 计算p1和p3的中点坐标
  const x2 = (p1.x + p3.x)/2;
  const z2 = (p1.z + p3.z)/2;
  const h = 50;
  const p2 = new Vector3(x2, h, z2);

  const arr = [p1, p2, p3];
// 三维样条曲线
  const curve = new CatmullRomCurve3(arr);

  const pointsArr = curve.getPoints(100); //曲线上获取点
  const geometry = new BufferGeometry();
  geometry.setFromPoints(pointsArr); //读取坐标数据赋值给几何体顶点

// 线材质
  const material = new LineBasicMaterial({
    color: 0x00fffff
  });
// 线模型
  const line = new Line(geometry, material);


// 用点模型可视化样条曲线经过的顶点位置
  const geometry2 = new BufferGeometry();
  geometry2.setFromPoints(arr);
  const material2 = new PointsMaterial({
    color: 0xff00ff,
    size: 10,
  });
//点模型对象
  const points = new Points(geometry2, material2);


  const group = new Group();
  group.add(line,points);
  
  return group;
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

// 添加一个辅助网格地面
  const gridHelper = new GridHelper(300, 25, 0x004444, 0x004444);
  scene.add(gridHelper);
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