<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, ArcCurve,
  AxesHelper, BoxGeometry,
  BufferAttribute,
  BufferGeometry, CatmullRomCurve3,
  CircleGeometry, CubicBezierCurve, CurvePath,
  DirectionalLight,
  DoubleSide, EllipseCurve,
  GridHelper,
  Group, Line,
  LineBasicMaterial, LineCurve3,
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
  TextureLoader, TubeGeometry, Vector2, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {

// 创建多段线条的顶点数据
  const p1 = new Vector3(0, 0,100)
  const p2 = new Vector3(0, 0,30);
  const p3 = new Vector3(0, 0,0);
  const p4 = new Vector3(30, 0, 0);
  const p5 = new Vector3(100, 0, 0);
// 1. 3D直线线段
  const line1 = new LineCurve3(p1, p2);
// 2. 三维二次贝塞尔曲线
  const curve = new QuadraticBezierCurve3(p2, p3, p4);
// 3. 3D直线线段
  const line2 = new LineCurve3(p4, p5);

  const curvePath = new CurvePath();
// 三条线拼接为一条曲线
  curvePath.curves.push(line1, curve, line2);

// CurvePath:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
  const geometry = new TubeGeometry(curvePath, 50, 2, 25);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    side: DoubleSide, //双面显示看到管道内壁
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