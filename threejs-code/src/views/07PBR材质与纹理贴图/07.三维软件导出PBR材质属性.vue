<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  CubeTextureLoader,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

const canvasRef = ref()

const gui = new GUI();
//改变交互界面style属性
gui.domElement.style.right = '0px';
gui.domElement.style.width = '300px';

function getModel() {
// 创建材质子菜单
  const matFolder1 = gui.addFolder('外壳材质');
  matFolder1.close(); //关闭菜单
  const matFolder2 = gui.addFolder('玻璃材质');
  matFolder2.close(); //关闭菜单


  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景
// 加载环境贴图
  const textureCube = new CubeTextureLoader()
      .setPath('/环境贴图/环境贴图1/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  textureCube.colorSpace = SRGBColorSpace
  loader.load("/车pbr.glb", function (gltf) {
    model.add(gltf.scene);
    // 注意如果车外壳或玻璃共享了材质，修改一个其他的也会变化和影响

    const mesh1 = gltf.scene.getObjectByName('外壳01');
    mesh1.material.envMap = textureCube; //环境贴图
    mesh1.material.envMapIntensity = 1.0; ////环境贴图对Mesh表面影响程度


    const mesh2 = gltf.scene.getObjectByName('玻璃01');
    mesh2.material.envMap = textureCube; //环境贴图
    mesh2.material.envMapIntensity = 1.0; ////环境贴图对Mesh表面影响程度

    // 查看threejs解析的PBR材质
    gltf.scene.traverse(function (obj) {
      if (obj.isMesh) {
        console.log('obj.material', obj.material);
      }
    });
    console.log('外壳', mesh1.material);
    console.log('玻璃', mesh2.material);

    const obj = {
      color1: mesh1.material.color.getHex(), // 外壳颜色
      color2: mesh2.material.color.getHex(), // 玻璃颜色
    };
    // 车壳材质gui界面
    matFolder1.addColor(obj, 'color1').onChange(function (value) {
      mesh1.material.color.set(value);
    });
    matFolder1.add(mesh1.material, 'metalness', 0, 1);
    matFolder1.add(mesh1.material, 'roughness', 0, 1);
    matFolder1.add(mesh1.material, 'clearcoat', 0, 1);
    matFolder1.add(mesh1.material, 'clearcoatRoughness', 0, 1);
    matFolder1.add(mesh1.material, 'envMapIntensity', 0, 10);

    // 玻璃材质gui界面
    matFolder2.addColor(obj, 'color2').onChange(function (value) {
      mesh2.material.color.set(value);
    });
    matFolder2.add(mesh2.material, 'metalness', 0, 1);
    matFolder2.add(mesh2.material, 'roughness', 0, 1);
    matFolder2.add(mesh2.material, 'transmission', 0, 1);
    matFolder2.add(mesh2.material, 'ior', 1, 2.333);
    matFolder2.add(mesh2.material, 'envMapIntensity', 0, 10);
  })
  return model;
}

onMounted(() => {
  const scene = new Scene();
  scene.add(getModel()); //模型对象添加到场景中


//辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


//光源设置
  const directionalLight = new DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(400, 200, 300);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

// 环境光子菜单
  const ambientFolder = gui.addFolder('环境光');
  ambientFolder.close();//关闭菜单
// 环境光强度
  ambientFolder.add(directionalLight, 'intensity', 0, 2);
// 平行光子菜单
  const dirFolder = gui.addFolder('平行光');
  dirFolder.close();//关闭菜单
// 平行光强度
  dirFolder.add(directionalLight, 'intensity', 0, 2);
  const dirFolder2 = dirFolder.addFolder('位置');//子菜单的子菜单
  dirFolder2.close();//关闭菜单
// 平行光位置
  dirFolder2.add(directionalLight.position, 'x', -400, 400);
  dirFolder2.add(directionalLight.position, 'y', -400, 400);
  dirFolder2.add(directionalLight.position, 'z', -400, 400);


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(-400, 400, 200);
  camera.lookAt(0, 0, 0);


  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,//抗锯齿
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