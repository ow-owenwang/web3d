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
  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
  });
  const mesh = new Mesh(geometry, material);
  return mesh;
}

const canvasRef = ref()

onMounted(() => {
  const height1 = window.innerHeight - 60;
  document.getElementById('left')!.style.height = height1 + 'px';

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
// const width = 600;//canvas画布高度
// const height = 400;//canvas画布宽度
// 200表示左侧div元素宽度195px+间距5px
  const width = window.innerWidth - 200; //canvas画布高度
//60表示顶部div元素高度55px+间距5px
  const height = window.innerHeight - 60; //canvas画布宽度


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
  renderer.setClearColor(0x444444);




// 渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();


  const controls = new OrbitControls(camera, renderer.domElement);

// 画布跟随窗口变化
  window.onresize = function () {
    const width = window.innerWidth - 200; //canvas画布高度
    const height = window.innerHeight - 60; //canvas画布宽度
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

    // 其它CSS代码，与threejs无关
    document.getElementById('left').style.height = height + 'px';
  };
})
</script>

<template>
  <div class="box">
    <div style="height: 55px;background-color: #444444;">上面布局</div>
    <div>
      <div id="left" style="position: absolute;top: 60px;background-color: #444444;width: 195px;">下面左侧布局</div>
      <div id="webgl" style="position: absolute;top: 60px;left: 200px;background-color: #444444;">
        <canvas ref="canvasRef"></canvas>
      </div>
    </div>
  </div>
</template>

<style scoped>
.box {
  background-color: #555;
}

canvas {
  width: 100%;
  height: 100%;
}
</style>