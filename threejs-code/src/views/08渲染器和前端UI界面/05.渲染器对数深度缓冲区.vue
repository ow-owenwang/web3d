<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";

const canvasRef = ref()

function getModel() {

// 两个矩形平面Mesh重合，产生闪烁
// 闪烁原因：两个矩形面位置重合，GPU无法分清谁在前谁在后
  const geometry = new PlaneGeometry(250, 250);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    side: DoubleSide,
  });
  const mesh = new Mesh(geometry, material);


  const geometry2 = new PlaneGeometry(300, 300);
  const material2 = new MeshLambertMaterial({
    color: 0xff6666,
    side: DoubleSide,
  });
  const mesh2 = new Mesh(geometry2, material2);

// 在使用透视投影相机渲染的时候，两个模型距离很近，如果距离相机比较远，也可能出现闪烁
  mesh2.position.z = 0.1;

// 当两个mesh间隙过小，或者重合，你设置webgl渲染器对数深度缓冲区也是无效的。
// mesh2.position.z = 0.00001;

  const group = new Group();
  group.add(mesh,mesh2);
  return group
}

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
// camera.position.set(292, 223, 185);
  camera.position.set(292*5, 223*5, 185*5);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
    // 设置对数深度缓冲区，优化深度冲突问题
    logarithmicDepthBuffer: true
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