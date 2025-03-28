<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer
} from "three";


const canvasRef = ref();

function getModel() {
  const geometry = new SphereGeometry(25)
  const material = new MeshLambertMaterial({
    color: 0x009999
  })

  const mesh1 = new Mesh(geometry, material)
  const mesh2 = mesh1.clone()
  mesh2.material = new MeshLambertMaterial({
    color: 0x999900
  })
  mesh2.position.y = 100
  const mesh3 = mesh1.clone()
  mesh3.material = new MeshLambertMaterial({
    color: 0x990099
  })
  mesh3.position.x = 100
  const model = new Group()
  model.add(mesh1, mesh2, mesh3)

  return {model, mesh1, mesh2, mesh3}
}


onMounted(() => {
  const scene = new Scene();
  const {model, mesh1, mesh2, mesh3} = getModel();
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

  const raycaster = new Raycaster()
  console.log(raycaster.ray)
  raycaster.ray.origin = new Vector3(-100, 0, 0)
  raycaster.ray.direction = new Vector3(1, 0, 0)

  const intersects = raycaster.intersectObjects([mesh1, mesh2, mesh3])
  console.log(intersects)
  if(intersects.length > 0){
    intersects[0].object.material.color.set(0xff0000)
    intersects[1].object.material.color.set(0xff0000)

    console.log('交叉点', intersects[0].point)
  }
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
