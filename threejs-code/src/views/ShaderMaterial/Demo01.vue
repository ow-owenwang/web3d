<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {
  AmbientLight,
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer
} from "three";

const canvasRef = ref();

function getModel() {
  const geometry = new PlaneGeometry(100, 50);
  console.log('顶点位置数据', geometry.attributes.position)

  const vertexShader = `
    void main() {
      // 投影矩阵 * 试图矩阵 * 视图矩阵 * 顶点坐标
      // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
      // 投影矩阵 * 模型视图矩阵 * 模型顶点坐标
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    void main() {
      // gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0);
      gl_FragColor = vec4(0.0, 1.0, 1.0, 0.3); // 半透明
    }
  `;

  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    side: DoubleSide,
    transparent: true,
  })

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 100
  mesh.rotateY(Math.PI / 2)

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
  const camera = new PerspectiveCamera(30, width / height, 1, 3000);
  camera.position.set(200, 200,200);
  camera.lookAt(0, 0, 0);

  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
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
