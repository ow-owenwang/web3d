<script setup lang="ts">

import {onMounted, ref} from "vue";
import {Mesh, OrthographicCamera, Scene, WebGLRenderer} from "three";

const canvasRef = ref()
onMounted(() => {
  const scene = new Scene()
  const mesh = new Mesh()
  const camera = new OrthographicCamera()

  let k
  let s
  const width = window.innerWidth;
  const height = window.innerHeight;
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setClearColor(0xb9d3ff, 1)

  function render() {
    mesh.rotateY(0.01)
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }

  render()

  // 渲染范围跟着变化
  window.onresize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    k = window.innerWidth / window.innerHeight
    camera.left = -s * k
    camera.right = s * k
    camera.top = s
    camera.bottom = -s
    camera.updateProjectionMatrix()
  }
})
</script>

<template>

</template>

<style scoped>

</style>
