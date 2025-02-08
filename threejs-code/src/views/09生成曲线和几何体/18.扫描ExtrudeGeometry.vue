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
  MeshLambertMaterial,
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

// 1.扫描轮廓：Shape表示一个平面多边形轮廓
  const shape = new Shape([
    // 按照特定顺序，依次书写多边形顶点坐标
    new Vector2(0,0), //多边形起点
    new Vector2(0,10),
    new Vector2(10,10),
    new Vector2(10,0),
  ]);


// 2.扫描轨迹：创建轮廓的扫描轨迹(3D样条曲线)
  const curve = new CatmullRomCurve3([
    new Vector3( -10, -50, -50 ),
    new Vector3( 10, 0, 0 ),
    new Vector3( 8, 50, 50 ),
    new Vector3( -5, 0, 100)
  ]);

//3.扫描造型：扫描默认没有倒角
  const geometry = new ExtrudeGeometry(
      shape, //扫描轮廓
      {
        extrudePath:curve,//扫描轨迹
        steps:100//沿着路径细分精度，越大越光滑
      }
  );

  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    // wireframe:true,
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
  const directionalLight = new DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const directionalLight2 = new DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(-100, -60, -50);
  scene.add(directionalLight2);
  const ambient = new AmbientLight(0xffffff, 0.2);
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