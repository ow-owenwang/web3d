<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

function getModel() {
  const loader = new GLTFLoader(); //创建一个GLTF加载器

  const model = new Group(); //声明一个组对象，用来添加加载成功的三维场景

  loader.load("/工厂.glb", function (gltf) {
    // 查看gltf所有颜色贴图的.encoding值
    gltf.scene.traverse(function(obj) {
      if (obj.isMesh) {
        if(obj.material.map){//判断是否存在贴图
          console.log('obj.material.map.encoding',obj.material.map.encoding);
        }
      }
    });
    model.add(gltf.scene);
  })

// 工厂三维场景中添加一个球体
  const geometry = new SphereGeometry(20);
  const texLoader = new TextureLoader();
  const texture = texLoader.load('/earth.jpg');
// texture.encoding = LinearEncoding;//默认值
//设置纹理对象.encoding和webgl渲染器renderer.outputEncoding一致
  texture.colorSpace = SRGBColorSpace
  // console.log('texture.encoding',texture.encoding);
  const material = new MeshLambertMaterial({
    map: texture,
  });
  const mesh = new Mesh(geometry, material);
  mesh.position.y+=20;
  model.add(mesh);
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
  camera.position.set(100, 100, 100);//根据渲染范围尺寸数量级设置相机位置
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