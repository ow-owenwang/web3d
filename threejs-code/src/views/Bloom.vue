<script setup lang="ts">
import {onMounted, ref} from 'vue'
import * as THREE from 'three'
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";

const canvasRef = ref()

onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  const geometry = new THREE.SphereGeometry(1, 32, 32);

  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  const sphere = new THREE.Mesh(geometry, material);

  scene.add(sphere);

  camera.position.z = 5;


  const renderScene = new RenderPass(scene, camera);
  //constructor( resolution, strength, radius, threshold )
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 1, 0);
  bloomPass.renderToScreen = true;
  // bloomPass.threshold = params.bloomThreshold;
  // bloomPass.strength = params.bloomStrength;
  // bloomPass.radius = params.bloomRadius;

  const composer = new EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  const animate = function () {
    requestAnimationFrame(animate);

    sphere.rotation.x += 0.01;
    //group.rotation.y += 0.01;

    //renderer.render(scene, camera);
    composer.render();
  };

  animate();
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
