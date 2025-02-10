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

  const model = new Group();

  loader.load("/地形.glb", function (gltf) {
    model.add(gltf.scene);
    //mesh表示地形网格模型
    const mesh = gltf.scene.children[0];
    // 顶点位置数据
    const pos = mesh.geometry.attributes.position;
    const count = pos.count; //几何体顶点数量
    // 批量设置所有几何体顶点位置的y坐标
    for (let i = 0; i < count; i++) {
      const y = pos.getY(i);//获取第i+1个顶点y坐标
      pos.setY(i,y*2)//设置第i+1个顶点y坐标为自身2倍
    }
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
  const directionalLight = new DirectionalLight(0xffffff, 1);
  directionalLight.position.set(100, 60, 50);
  scene.add(directionalLight);
  const ambient = new AmbientLight(0xffffff, 0.4);
  scene.add(ambient);


//相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(452, 373, 375);
  camera.lookAt(0, 0, 0);

// WebGL渲染器设置
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true, //开启优化锯齿
  });
  renderer.setPixelRatio(window.devicePixelRatio); //防止输出模糊
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