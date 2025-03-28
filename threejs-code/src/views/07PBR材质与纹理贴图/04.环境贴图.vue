<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {AxesHelper, CubeTextureLoader, Group, PerspectiveCamera, Scene, SRGBColorSpace, WebGLRenderer} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

const canvasRef = ref()

function getModel() {
  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  loader.load("/工厂.glb", function (gltf) {
    gltf.scene.traverse(function (obj) {
      if (obj.isMesh) { //判断是否是网格模型
        // obj.material.envMap = textureCube; //设置环境贴图
        obj.material.envMapIntensity = 1.0;
      }
    });
    model.add(gltf.scene);
  })

  return model;
}

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中

  const textureCube = new CubeTextureLoader()
      // .setPath('/环境贴图/环境贴图0/')
      .setPath('/环境贴图/环境贴图3/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  textureCube.colorSpace = SRGBColorSpace
// 环境贴图纹理对象textureCube作为.environment属性值,影响所有模型
  scene.environment = textureCube;

//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
// const directionalLight = new DirectionalLight(0xffffff, 0.8);
// directionalLight.position.set(400, 200, 300);
// scene.add(directionalLight);
// const ambient = new AmbientLight(0xffffff, 0.4);
// scene.add(ambient);


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(100, 100,100);
  camera.lookAt(0, 0, 0);


  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias:true,//抗锯齿
  });
  renderer.setSize(width, height);
  renderer.outputColorSpace = SRGBColorSpace

// 设置相机控件轨道控制器OrbitControls
  const controls = new OrbitControls(camera, renderer.domElement);


// 渲染循环
  function render() {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  render();



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