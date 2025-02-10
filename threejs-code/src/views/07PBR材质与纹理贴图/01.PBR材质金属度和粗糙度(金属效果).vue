<script setup lang="ts">

import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
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

  loader.load("/金属.glb", function (gltf) {
    // 递归遍历所有模型节点批量修改材质
    gltf.scene.traverse(function (obj) {
      if (obj.isMesh) {//判断是否是网格模型
        // console.log('obj.material',obj.material);
        // 重新设置材质的金属度和粗糙度属性
        obj.material.metalness = 1.0;//金属度
        obj.material.roughness = 0.5;//表面粗糙度

        // obj.material = new THREE.MeshStandardMaterial({
        //     color: obj.material.color, //读取材质原来的颜色
        //     // 金属度属性metalness：材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。
        //     // metalness默认0.5,0.0到1.0之间的值可用于生锈的金属外观
        //     metalness: 1.0,
        //     // metalness: 0.0,//没有金属质感
        //     // 粗糙度属性roughness:模型表面粗糙程度,0.0表示平滑的镜面反射,1.0表示完全漫反射,默认0.5
        //     roughness: 0.5,
        //     // roughness: 1.0,//设置到完全漫反射状态，表面金属质感比较弱
        //     // roughness: 0.0,//完全镜面反射，就像一面镜子一样，注意配合环境贴图观察更明显
        // })
      }
    });
    model.add(gltf.scene);
  })

  return model;
}

onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model); //模型对象添加到场景中


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
  camera.position.set(40.0, 40.0, 40.0);
  camera.lookAt(0, 0, 0);


  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
  });
  renderer.setSize(width, height);

  // renderer.outputEncoding = sRGBEncoding;
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