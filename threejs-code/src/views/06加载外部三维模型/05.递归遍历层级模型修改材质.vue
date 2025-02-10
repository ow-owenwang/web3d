<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SRGBColorSpace,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {

  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

// loader.load("./简易小区.glb", function (gltf) { 
//     // 递归遍历所有模型节点批量修改材质
//     gltf.scene.traverse(function(obj) {
//         if (obj.isMesh) {//判断是否是网格模型
//             console.log('模型节点',obj);
//             console.log('模型节点名字',obj.name);
//             console.log('gltf默认材质',obj.material);
//         }
//     });
//     model.add(gltf.scene);
// })

  loader.load("/工厂.glb", function (gltf) {
    // 递归遍历所有模型节点批量修改材质
    gltf.scene.traverse(function(obj) {
      if (obj.isMesh) {//判断是否是网格模型
        // 重新设置材质
        obj.material = new MeshLambertMaterial({
          color:0xffffff,
        });
      }
    });
    model.add(gltf.scene);
  })
  return model;
}

const canvasRef = ref()

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
  camera.position.set(200, 200, 200);
  camera.lookAt(0, 0, 0);


  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height);

//解决加载gltf格式模型颜色偏差问题
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