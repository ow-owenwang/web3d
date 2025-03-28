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

function getModel() {

  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  loader.load("/简易小区.glb", function (gltf) {
    // console.log('控制台查看gltf对象结构', gltf);
    console.log('场景3D模型树结构', gltf.scene);


    // 返回名.name为"1号楼"对应的对象
    const nameNode = gltf.scene.getObjectByName("1号楼");
    nameNode.material.color.set(0xff0000);//改变1号楼Mesh材质颜色

    //获得所有'洋房'房子的父对象
    const obj = gltf.scene.getObjectByName('洋房');
    console.log('obj', obj); //控制台查看返回结果
    console.log('obj.children', obj.children);
    // obj的所有子对象.children都是Mesh，改变Mesh对应颜色
    obj.children.forEach(function (mesh) {
      mesh.material.color.set(0xffff00);
    })


    model.add(gltf.scene); //三维场景添加到model组对象中
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
// camera.position.set(292, 223, 185);
  camera.position.set(200, 200, 200);//根据渲染范围尺寸数量级设置相机位置
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height);

//解决加载gltf格式模型颜色偏差问题
  renderer.outputColorSpace = SRGBColorSpace

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