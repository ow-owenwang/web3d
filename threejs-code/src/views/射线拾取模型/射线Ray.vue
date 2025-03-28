<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  BufferAttribute,
  BufferGeometry,
  DirectionalLight,
  FrontSide,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Ray,
  Scene,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer
} from "three";

const canvasRef = ref();

function getModel() {
  const geometry = new BufferGeometry()
  const vertices = new Float32Array([
    100, 25, 0,
    100, -25, 25,
    100, -25, -25
  ])
  geometry.attributes.position = new BufferAttribute(vertices, 3)
  const material = new MeshBasicMaterial({
    color: 0x00ffff,
    side: FrontSide // 正面可见
  })
  const mesh = new Mesh(geometry, material)

  const ray = new Ray()
  console.log(ray)
  ray.origin.set(0, 0, 0);

  // 射线方向是一个三维向量，向量长度保证为1，也就是单位向量
  // 如何向量长度不为1，可以使用normalize()归一化
  ray.direction = new Vector3(1, 0, 0)

  const p1 = new Vector3(100, 25, 0)
  const p2 = new Vector3(100, -25, 25)
  const p3 = new Vector3(100, -25, -25)
  const point = new Vector3()

  const result = ray.intersectTriangle(p1, p2, p3, false, point)
  console.log(point) // 交叉点
  console.log(result) //是否相交

  return mesh
}


onMounted(() => {
  const scene = new Scene();
  const model = getModel();
  scene.add(model);

  const axesHelper = new AxesHelper(100);
  scene.add(axesHelper);

  const directionalLight = new DirectionalLight(0xffffff, 1)
  directionalLight.position.set(100, 60, 50)
  scene.add(directionalLight)
  const ambient = new AmbientLight(0xffffff, 0.4)
  scene.add(ambient)

  const width = window.innerWidth
  const height = window.innerHeight
  const camera = new PerspectiveCamera(30, width / height, 1, 3000)
  camera.position.set(292, 223, 185);
  camera.lookAt(0, 0, 0)

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
  renderer.outputColorSpace = SRGBColorSpace
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)


  function render() {
    // model.rotateY(0.01);
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }

  render();


  const controls = new OrbitControls(camera, renderer.domElement);
});
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
