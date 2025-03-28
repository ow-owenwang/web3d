<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer
} from "three";

function getModel() {

  //矩形几何体PlaneGeometry的参数3,4表示细分数，默认是1,1
// const geometry = new PlaneGeometry(100,50,1,1);//两个三角形
  const geometry = new PlaneGeometry(100,50,2,1);//矩形一分为二,四个三角形
// const geometry = new PlaneGeometry(100,50,2,2);//8个三角形

// 球体，参数2、3分别代表宽高度两个方向上的细分数，默认32,16
// 细分数，越大，表面越光滑，但是三角形和顶点数量却越多
// const geometry = new SphereGeometry( 50, 32, 16 );
// 球体细分数比较低，表面就不会那么光滑
// const geometry = new SphereGeometry( 15, 8, 8 );


  console.log('几何体',geometry);
  console.log('顶点位置数据',geometry.attributes.position);
  console.log('顶点索引数据',geometry.index);

  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    wireframe:true,//线条模式渲染mesh对应的三角形数据
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