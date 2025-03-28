<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  TextureLoader,
  WebGLRenderer
} from "three";

function getModel() {

  const geometry = new BufferGeometry(); //创建一个几何体对象
//类型数组创建顶点数据
  const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    160, 0, 0, //顶点2坐标
    160, 80, 0, //顶点3坐标
    0, 80, 0, //顶点4坐标
  ]);
// 创建属性缓冲区对象
  const attribue = new BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;

// Uint16Array类型数组创建顶点索引数据
  const indexes = new Uint16Array([
    0, 1, 2, 0, 2, 3,
  ])
// 索引数据赋值给几何体的index属性
  geometry.index = new BufferAttribute(indexes, 1); //1个为一组

  /**纹理坐标0~1之间随意定义*/
  const uvs = new Float32Array([
    0, 0, //图片左下角
    1, 0, //图片右下角
    1, 1, //图片右上角
    0, 1, //图片左上角
  ]);
// 获取纹理贴图左下角四分之一部分的像素值
// const uvs = new Float32Array([
//     0, 0, 
//     0.5, 0, 
//     0.5, 0.5, 
//     0, 0.5, 
// ]);
// 设置几何体attributes属性的位置normal属性
  geometry.attributes.uv = new BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标


//纹理贴图加载器TextureLoader
  const texLoader = new TextureLoader();
  const texture = texLoader.load('/earth.jpg');
  const material = new MeshBasicMaterial({
    map: texture, //map表示材质的颜色贴图属性
  });
  const mesh = new Mesh(geometry, material);
  return mesh;
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


//渲染器和相机
  const width = window.innerWidth;
  const height = window.innerHeight;
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height);



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