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
  DoubleSide, EllipseCurve, ExtrudeGeometry,
  GridHelper,
  Group, LatheGeometry, Line,
  LineBasicMaterial, LineCurve3,
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

// Shape外轮廓：矩形
  const shape = new Shape();
// 绘制直线线段，线段起点：.currentPoint，线段结束点：(100,0)
  shape.lineTo(100, 0);//.currentPoint变为(100, 0)
  shape.lineTo(100, 100);//.currentPoint变为(100, 100)
  shape.lineTo(0, 100);//.currentPoint变为(0, 100)

//Shape内孔轮廓
  const path1 = new Path();// 圆孔1
  path1.absarc(20, 20, 10);
  const path2 = new Path();// 圆孔2
  path2.absarc(80, 20, 10);
  const path3 = new Path();// 方形孔
  path3.moveTo(50, 50);
  path3.lineTo(80, 50);
  path3.lineTo(80, 80);
  path3.lineTo(50, 80);
//三个内孔轮廓分别插入到holes属性中
  shape.holes.push(path1, path2,path3);


// const geometry = new ShapeGeometry(shape);

  const geometry = new ExtrudeGeometry(shape, {
    depth:20,//拉伸长度
    bevelEnabled:false,//禁止倒角
    curveSegments:50,
  });
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
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
  const directionalLight = new DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.5);
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