<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferGeometry,
  DirectionalLight,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector3,
  WebGLRenderer
} from "three";

function getModel() {

  const pointsArr = [
    // 三维向量Vector3表示的坐标值
    new Vector3(0,0,0),
    new Vector3(0,100,0),
    new Vector3(0,100,100),
    new Vector3(0,0,100),
  ];
// const pointsArr = [
//     // 三维向量Vector2表示的坐标值
//     new Vector2(0,0),
//     new Vector2(100,0),
//     new Vector2(100,100),
//     new Vector2(0,100),
// ];

  const geometry = new BufferGeometry();
// 把数组pointsArr里面的坐标数据提取出来，赋值给`geometry.attributes.position`属性
  geometry.setFromPoints(pointsArr);
  console.log('几何体变化',geometry.attributes.position);

// 点材质
  const material = new PointsMaterial({
    color: 0xffff00,
    size: 10.0 //点对象像素尺寸
  });
// 点模型
  const points = new Points(geometry, material);
  
  return points;
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