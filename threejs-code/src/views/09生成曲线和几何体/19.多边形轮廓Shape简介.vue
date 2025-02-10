<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  ExtrudeGeometry,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  WebGLRenderer
} from "three";

function getModel() {

  const shape = new Shape();
// console.log('currentPoint',shape.currentPoint);
  shape.moveTo(10, 0); //.currentPoint变为(10,0)
// 绘制直线线段，起点(10,0)，结束点(100,0)
  shape.lineTo(100, 0);//.currentPoint变为(100, 0)
  shape.lineTo(100, 100);//.currentPoint变为(100, 100)
  shape.lineTo(10, 100);//.currentPoint变为(10, 100)

// ShapeGeometry填充Shape获得一个平面几何体
// const geometry = new ShapeGeometry(shape);
// ExtrudeGeometry拉伸Shape获得一个长方体几何体
  const geometry = new ExtrudeGeometry(shape, {
    depth:20,//拉伸长度
    bevelEnabled:false,//禁止倒角
  });
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    // wireframe:true
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