<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper, BoxGeometry, CircleGeometry, Clock,
  DirectionalLight,
  DirectionalLightHelper, DoubleSide, Mesh, MeshLambertMaterial,
  PerspectiveCamera, PointLight, Scene,
  WebGLRenderer, Group, SRGBColorSpace, CubeTextureLoader, MeshPhysicalMaterial, Vector3
} from "three";

function getModel() {
  const geometry = new BoxGeometry(50, 50, 50);
  const material = new MeshLambertMaterial({
    color: 0x00ffff,
    transparent: true,
    opacity: 0.5,
  });
  const mesh = new Mesh(geometry, material);

// 位置属性.position使用threejs三维向量对象Vector3表示的
  console.log('模型位置属性.position的值', mesh.position);

//new Vector3()实例化一个三维向量对象
  const v3 = new Vector3(0, 0, 0);
  console.log('v3', v3);
  v3.set(10, 0, 0);//set方法设置向量的值
  v3.x = 100;//访问x、y或z属性改变某个分量的值


// .position的值是Vector3，意味着你想改变.position,可以查询文档Vector3类
// 直接设置网格模型的位置
  mesh.position.set(100, 100, 100);
  mesh.position.x = 100;//设置模型的x坐标

// 网格模型沿着x轴方向平移100,
  mesh.translateX(100);

  mesh.scale.y = 3;//y方向放大3倍
// 网格模型xyz方向分别缩放0.5,1.5,2倍
  mesh.scale.set(0.5, 1.5, 2);
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
  const pointLight = new PointLight(0xffffff, 1.0);
  pointLight.position.set(400, 200, 300);
  scene.add(pointLight);
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