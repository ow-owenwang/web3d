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
  TextureLoader,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {
  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  const texLoader = new TextureLoader();
  const texture = texLoader.load('/黑色.png');// 加载手机mesh另一个颜色贴图
  texture.colorSpace = SRGBColorSpace

// 纹理对象texture.flipY默认值
  console.log('texture.flipY', texture.flipY);
  texture.flipY = false;//是否翻转纹理贴图


  loader.load("/手机模型.glb", function (gltf) {
    // console.log('gltf.scene',gltf.scene);
    const mesh = gltf.scene.children[0]; //获取Mesh
    // 查看gltf里面Mesh颜色贴图的.flipY值
    console.log('.flipY', mesh.material.map.flipY);

    mesh.material.map = texture; //更换不同风格的颜色贴图

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
  camera.position.set(200, 200, 200);//根据渲染范围尺寸数量级设置相机位置
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias:true,//开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio);//防止输出模糊
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