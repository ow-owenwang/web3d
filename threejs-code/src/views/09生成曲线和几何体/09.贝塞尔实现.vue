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
  PointsMaterial, QuadraticBezierCurve, QuadraticBezierCurve3,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader, Vector2, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {

// p1、p3轨迹线起始点坐标
  const p1 = new Vector3(-100, 0, -100);
  const p3 = new Vector3(100, 0, 100);
// 计算p1和p3的中点坐标
  const x2 = (p1.x + p3.x)/2;
  const z2 = (p1.z + p3.z)/2;
  const h = 100;
  const p2 = new Vector3(x2, h, z2);
// 三维二次贝赛尔曲线
  const curve = new QuadraticBezierCurve3(p1, p2, p3);

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
  geometry2.setFromPoints([p1, p2, p3]);
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