<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group, Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {

  const geometry = new BufferGeometry(); //创建一个几何体对象
  const R = 100; //圆弧半径
  const N = 50; //分段数量
// 批量生成圆弧上的顶点数据
  const arr = [];
  const sp = 2 * Math.PI / N;//两个相邻点间隔弧度
// const sp = 1 * Math.PI / N;//半圆弧
  for (let i = 0; i < N + 1; i++) {
    const angle =  sp * i;
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = R * Math.cos(angle);
    const y = R * Math.sin(angle);
    arr.push(x, y, 0);
  }
// // 设置圆心坐标
// const cx = 200;
// const cy = 100;
// for (let i = 0; i < N + 1; i++) {
//     const angle = sp * i;//当前点弧度
//     const x = cx + R * Math.sin(angle);
//     const y = cy + R * Math.cos(angle);
//     arr.push(x, y, 0);
// }
//类型数组创建顶点数据
  const vertices = new Float32Array(arr);
// 创建属性缓冲区对象
  const attribue = new BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;

// 线材质
  const material = new LineBasicMaterial({
    color: 0xff0000 //线条颜色
  });
// 创建线模型对象   构造函数：Line、LineLoop、LineSegments

// const line = new LineLoop(geometry, material);//线条模型对象
  const line = new Line(geometry, material);
  
  return line
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