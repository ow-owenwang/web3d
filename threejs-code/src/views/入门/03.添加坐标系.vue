<script setup lang="ts">
import {onMounted, ref} from "vue";
import {AxesHelper, BoxGeometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderer} from "three";


const canvasRef = ref()
onMounted(() => {
  /**
   * 创建3D场景对象Scene
   */
  const scene = new Scene();

  /**
   * 创建网格模型
   */
//创建一个长方体几何对象Geometry
  const geometry = new BoxGeometry(50, 50, 50);
//材质对象Material
  const material = new MeshBasicMaterial({
    color: 0x00ffff, //设置材质颜色
    transparent:true,//开启透明
    opacity:0.5,//设置透明度
  });
  const mesh = new Mesh(geometry, material); //网格模型对象Mesh
//设置网格模型在三维空间中的位置坐标，默认是坐标原点
// mesh.position.set(0,10,0);
  scene.add(mesh); //网格模型添加到场景中

// AxesHelper：辅助观察的坐标系
  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);


// width和height用来设置js输出的Canvas画布尺寸(像素px)
  const width = 800; //宽度
  const height = 500; //高度
  /**
   * 透视投影相机设置
   */
// 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(200, 200, 200); //相机在js三维坐标系中的位置
  camera.lookAt(0, 0, 0); //相机观察目标指向js坐标系原点

  /**
   * 创建渲染器对象
   */
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value
  });
  renderer.setSize(width, height); //设置js渲染区域的尺寸(像素px)
  renderer.render(scene, camera); //执行渲染操作
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