<script setup lang="ts">
import {onMounted, ref} from 'vue'
import * as THREE from 'three'
import {RenderPass} from "three/examples/jsm/postprocessing/RenderPass";
import {UnrealBloomPass} from "three/examples/jsm/postprocessing/UnrealBloomPass";
import {EffectComposer} from "three/examples/jsm/postprocessing/EffectComposer";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import {ShaderPass} from "three/examples/jsm/postprocessing/ShaderPass";

const canvasRef = ref()
const vertexShader = `
varying vec2 vUv;

        void main() {

            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

        }
`
const fragmentShader = `
uniform sampler2D baseTexture;
        uniform sampler2D bloomTexture;

        varying vec2 vUv;

        void main() {
            vec4 objColor = texture2D( baseTexture, vUv ) ;
            vec4 bloomColor = vec4( 1.0 ) * texture2D( bloomTexture, vUv ) ;
            gl_FragColor = objColor+bloomColor;

        }
`
onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  const ENTIRE_SCENE = 0, BLOOM_SCENE = 1;

  const bloomLayer = new THREE.Layers();
  bloomLayer.set(BLOOM_SCENE);
  const darkMaterial = new THREE.MeshBasicMaterial({ color: "black" });
  const materials = {};


  const geometry = new THREE.SphereGeometry(1, 32, 32);
  const sphere = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0xff0000 }));

  const boxGeo = new THREE.BoxGeometry();
  const box = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
  box.position.x = 5


  sphere.layers.enable(BLOOM_SCENE); //在1层和0层可见
  scene.add(sphere);
  box.layers.set(ENTIRE_SCENE); //在0层可见
  scene.add(box);
  camera.position.z = 10;


  const renderScene = new RenderPass(scene, camera);
  //constructor( resolution, strength, radius, threshold )
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 1, 0);


  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen=false;
  bloomComposer.addPass(renderScene);
  bloomComposer.addPass(bloomPass);

  const finalPass = new ShaderPass(
      new THREE.ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomComposer.renderTarget2.texture }
        },
        vertexShader,
        fragmentShader,
        defines: {}
      }), "baseTexture"
  );
  finalPass.needsSwap = true;

  const finalComposer = new EffectComposer(renderer);
  finalComposer.renderToScreen = true;
  finalComposer.addPass(renderScene);
  finalComposer.addPass(finalPass);

  let T0 = new Date();//上次时间
  const animate = function () {
    let T1 = new Date();//本次时间
    let t = T1 - T0;//时间差
    T0 = T1;//把本次时间赋值给上次时间
    requestAnimationFrame(animate);
    camera.layers.set(BLOOM_SCENE)
    bloomComposer.render();
    camera.layers.set(ENTIRE_SCENE)
    finalComposer.render();
    // scene.traverse((obj) => {
    //     if (obj.isMesh && bloomLayer.test(obj.layers) === false) {
    //         materials[obj.uuid] = obj.material;
    //         obj.material = darkMaterial;
    //     }
    // });
    // bloomComposer.render();
    // scene.traverse((obj) => {
    //     if (materials[obj.uuid]) {
    //         obj.material = materials[obj.uuid];
    //         delete materials[obj.uuid];
    //     }
    // });
    // finalComposer.render();
    // console.log(box.layers)
    scene.rotation.y += 0.001 * t;// 每毫秒旋转0.001

  };

  //添加鼠标控制
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.maxPolarAngle = Math.PI * 0.5;
  controls.minDistance = 1;
  controls.maxDistance = 100;
  // controls.addEventListener('change', animate);
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
