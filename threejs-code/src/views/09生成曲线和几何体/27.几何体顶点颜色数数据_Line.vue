<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight, ArcCurve,
  AxesHelper, BoxGeometry,
  BufferAttribute,
  BufferGeometry, CatmullRomCurve3,
  CircleGeometry, CubicBezierCurve, CurvePath, CylinderGeometry,
  DirectionalLight,
  DoubleSide, EdgesGeometry, EllipseCurve, ExtrudeGeometry,
  GridHelper,
  Group, LatheGeometry, Line,
  LineBasicMaterial, LineCurve3, LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial, Path,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial, QuadraticBezierCurve, QuadraticBezierCurve3,
  RepeatWrapping,
  Scene, Shape, ShapeGeometry,
  SphereGeometry, SplineCurve,
  SRGBColorSpace,
  TextureLoader, Vector2, Vector3,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {
  const geometry = new BufferGeometry(); //创建一个几何体对象
  const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    50, 0, 0, //顶点2坐标
    0, 25, 0, //顶点3坐标
  ]);
// 顶点位置数据
  geometry.attributes.position = new BufferAttribute(vertices, 3);

//类型数组创建顶点颜色color数据
  const colors = new Float32Array([
    1, 0, 0, //顶点1颜色
    0, 0, 1, //顶点2颜色
    0, 1, 0, //顶点3颜色
  ]);
// 设置几何体attributes属性的颜色color属性
//3个为一组,表示一个顶点的颜色数据RGB
  geometry.attributes.color = new BufferAttribute(colors, 3);


// 线模型渲染几何体顶点颜色，可以看到直线颜色渐变效果
  const material = new LineBasicMaterial({
    vertexColors:true,//默认false，设置为true表示使用顶点颜色渲染
  });
  const line = new Line(geometry, material);

  return line
}

const canvasRef = ref()

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
// scene.add(axesHelper);


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