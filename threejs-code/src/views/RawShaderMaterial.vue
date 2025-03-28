<script setup lang="ts">
import {onMounted, ref} from 'vue'
import * as THREE from 'three'

const canvasRef = ref()

const vertexShader = `
precision mediump float;
        precision mediump int;

        uniform mat4 modelViewMatrix; // optional
        uniform mat4 projectionMatrix; // optional

        attribute vec3 position;
        attribute vec4 color;

        varying vec3 vPosition;
        varying vec4 vColor;

        void main()\t{

            vPosition = position;
            vColor = color;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
`

const fragmentShader = `
 precision mediump float;
        precision mediump int;

        uniform float time;

        varying vec3 vPosition;
        varying vec4 vColor;

        void main()\t{

            vec4 color = vec4( vColor );
            color.r += sin( vPosition.x * 10.0 + time ) * 0.5;

            gl_FragColor = color;

        }
`
onMounted(() => {
  const scene = new THREE.Scene();
  //设置相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;
  //设置渲染器
  const renderer = new THREE.WebGLRenderer({canvas: canvasRef.value, antialias: true});
  //renderer.setClearColor(0xFFFFFF);
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);
  //生成模型
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.RawShaderMaterial({

    uniforms: {
      time: {value: 1.0}
    },
    vertexShader,
    fragmentShader

  });

  const cube = new THREE.Mesh(geometry, material);

  const wireframeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000, wireframe: true});
  const cubeWireframe = new THREE.Mesh(geometry, wireframeMaterial);
  //设置场景
  const group = new THREE.Group()
  group.add(cube)
  group.add(cubeWireframe)
  scene.add(group);
  //设置光照
  const light = new THREE.AmbientLight(0x111111);
  scene.add(light);
  const pointLight = new THREE.PointLight(0xFFFFFF, 1, 100);
  pointLight.position.set(5, 5, 10);
  scene.add(pointLight);

  function animate() {
    group.rotation.x += 0.005;
    group.rotation.y += 0.005;
    group.rotation.z += 0.005;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  //开始动画
  animate()
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
