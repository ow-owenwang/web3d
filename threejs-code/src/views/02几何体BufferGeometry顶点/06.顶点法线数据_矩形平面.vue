<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  DirectionalLight,
  DoubleSide,
  GridHelper,
  Group, Line,
  LineBasicMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer
} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";

/*
当你不设置法向量的时候，threejs光线无法正常计算，当你测试案例源码时候，模型可能不显示，也可能闪烁或偶然显示，总而言之，不管哪种现象，都是非正常显示。


法向量用来表征几何体表面的法线方向，在threejs内部会用于光照计算，你只需要知道，只有设置了顶点法线，物体表面的光照才能进行正常反射计算，初学者只要知道法线影响光照反射计算这一点就足够了。
 */
function getModel() {

  const geometry = new BufferGeometry(); //创建一个几何体对象
//类型数组创建顶点数据
  const vertices = new Float32Array([
    0, 0, 0, //顶点1坐标
    80, 0, 0, //顶点2坐标
    80, 80, 0, //顶点3坐标
    0, 0, 0, //顶点4坐标   和顶点1位置相同
    80, 80, 0, //顶点5坐标  和顶点3位置相同
    0, 80, 0, //顶点6坐标
  ]);
// 创建属性缓冲区对象
  const attribue = new BufferAttribute(vertices, 3); //3个为一组，表示一个顶点的xyz坐标
// 设置几何体attributes属性的位置属性
  geometry.attributes.position = attribue;

// 每个顶点的法线数据和顶点位置数据一一对应
  const normals = new Float32Array([
    0, 0, 1, //顶点1法线( 法向量 )
    0, 0, 1, //顶点2法线
    0, 0, 1, //顶点3法线
    0, 0, 1, //顶点4法线
    0, 0, 1, //顶点5法线
    0, 0, 1, //顶点6法线
  ]);
// 设置几何体的顶点法线属性.attributes.normal
  geometry.attributes.normal = new BufferAttribute(normals, 3); //3个为一组,表示一个顶点的法线数据



// MeshBasicMaterial不受光照影响
// 使用受光照影响的材质，Geometry几何体需要定义顶点法线数据
  const material = new MeshLambertMaterial({
    color: 0x0000ff,
    side: DoubleSide, //两面可见
  });
// 网格模型本质：一个一个三角形(面)构成
  const mesh = new Mesh(geometry, material);
  
  return mesh
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