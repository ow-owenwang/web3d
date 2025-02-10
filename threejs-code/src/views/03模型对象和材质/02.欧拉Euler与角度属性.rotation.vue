<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  DirectionalLight,
  Euler,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer
} from "three";

function getModel() {
  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new Mesh(geometry, material);

// 角度属性.rotation使用threejs欧拉对象Euler表示的
  console.log('模型角度属性.rotation的值', mesh.rotation);

// 创建一个欧拉对象，表示绕着x、y、z轴分别旋转45度，0度，90度
// const Euler = new Euler( Math.PI/4,0, Math.PI/2);
  const euler = new Euler();
// 通过xyz分量属性定义和参数一样
  euler.x = Math.PI / 4;
  euler.y = 0;
  euler.z = Math.PI / 2;

//绕y轴的角度设置为60度
  mesh.rotation.y += Math.PI / 3;
//绕y轴的角度增加60度
  mesh.rotation.y += Math.PI / 3;
//绕y轴的角度减去60度
  mesh.rotation.y -= Math.PI / 3;

// 通过模型的旋转方法，也可以改变角度属性.rotation
  mesh.rotateY(Math.PI / 2);// 绕着Y轴旋转90度
//控制台查看：旋转方法，改变了rotation属性
  console.log('mesh.rotation', mesh.rotation);
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
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height);


// 渲染循环
  function render() {
    // 旋转动画
    // model.rotation.y+=0.01;
    // model.rotateY(0.01);
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