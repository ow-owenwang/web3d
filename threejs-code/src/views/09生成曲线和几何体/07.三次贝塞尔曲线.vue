<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferGeometry,
  CubicBezierCurve,
  DirectionalLight,
  GridHelper,
  Group,
  Line,
  LineBasicMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer
} from "three";

function getModel() {

// p1、p2、p3、p4表示4个点坐标
// p1、p4是曲线起始点，p2、p3是曲线的控制点
  const p1 = new Vector2(-80, 0);
  const p2 = new Vector2(-40, 50);
  const p3 = new Vector2(50, 50);
  const p4 = new Vector2(80, 0);

// 二维三次贝赛尔曲线
  const curve = new CubicBezierCurve(p1, p2, p3, p4);


// const p1 = new Vector3(-80, 0, 0);
// const p2 = new Vector3(-40, 50, 0);
// const p3 = new Vector3(50, 50, 0);
// const p4 = new Vector3(80, 0, 100);
// // // 三维三次贝赛尔曲线
// const curve = new CubicBezierCurve3(p1, p2, p3, p4);


  const pointsArr = curve.getPoints(100); //曲线上获取点
  const geometry = new BufferGeometry();
  geometry.setFromPoints(pointsArr); //读取坐标数据赋值给几何体顶点

// 线材质
  const material = new LineBasicMaterial({
    color: 0x00fffff
  });
// 线模型
  const line = new Line(geometry, material);


// 可视化p1、p2、p3、p4三个点的位置，并用直线相连接，便于观察贝塞尔曲线的绘制规律
  const geometry2 = new BufferGeometry();
  geometry2.setFromPoints([p1, p2, p3, p4]);
  const material2 = new PointsMaterial({
    color: 0xff00ff,
    size: 10,
  });
//点模型对象
  const points = new Points(geometry2, material2);
// 点构成的线条
  const line2 = new Line(geometry2, new LineBasicMaterial());


  const group = new Group();
  group.add(line, points, line2);
  return group
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