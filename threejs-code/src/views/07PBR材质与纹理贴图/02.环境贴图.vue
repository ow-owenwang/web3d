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

const canvasRef = ref()

function getModel() {
  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景
// 加载环境贴图
// 加载周围环境6个方向贴图
// 上下左右前后6张贴图构成一个立方体空间
// 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
// 'py.jpg', 'ny.jpg'：y轴贴图
// 'pz.jpg', 'nz.jpg'：z轴贴图
// CubeTexture表示立方体纹理对象，父类是纹理对象Texture
  const textureCube = new CubeTextureLoader()
      .setPath('/环境贴图/环境贴图0/')
      .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);



  loader.load("/金属.glb", function (gltf) {
    // 递归遍历所有模型节点批量修改材质
    gltf.scene.traverse(function (obj) {
      if (obj.isMesh) { //判断是否是网格模型
        // console.log('obj.material',obj.material);
        // 重新设置材质的金属度和粗糙度属性
        obj.material.metalness = 1.0; //金属度
        obj.material.roughness = 0.35; //表面粗糙度
        obj.material.envMap = textureCube; //设置环境贴图
        // envMapIntensity：控制环境贴图对mesh表面影响程度
        obj.material.envMapIntensity = 1.0;//默认值1, 设置为0.0,相当于没有环境贴图


        // obj.material = new THREE.MeshStandardMaterial({
        //     color: obj.material.color, //读取材质原来的颜色
        //     metalness: 1.0, //金属度
        //     roughness: 0.5, //粗糙度
        //     envMap: textureCube, //设置pbr材质环境贴图
        //     // envMapIntensity：控制环境贴图对mesh表面影响程度
        //     envMapIntensity: 0.0, //默认值1, 设置为0.0,相当于没有环境贴图
        // })
      }
    });
    model.add(gltf.scene);
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


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(40.0, 40.0,40.0);
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