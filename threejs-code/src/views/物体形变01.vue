<script setup lang="ts">
import * as THREE from "three";
import {SRGBColorSpace} from "three";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {onMounted, ref} from "vue";

const canvasRef = ref();

onMounted(() => {
  const scene = new THREE.Scene();

  // 2、创建相机
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  // 设置相机位置
  camera.position.set(0, 0, 20);
  scene.add(camera);

  // 灯光
  // 环境光
  // const light = new THREE.AmbientLight(0xffffff, 1); // soft white light
  // scene.add(light);

  // 添加hdr环境纹理
  const loader = new RGBELoader();
  loader.load("/textures/038.hdr", function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // 加载纹理
  const textureLoader = new THREE.TextureLoader();
  let params = {
    value0: 0,
    value1: 0,
  };
  // 加载压缩的glb模型
  let material = null;
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  dracoLoader.setDecoderConfig({ type: "js" });
  dracoLoader.preload();
  gltfLoader.setDRACOLoader(dracoLoader);
  let mixer;
  let stem, petal, stem1, petal1, stem2, petal2, stem3, petal3;
  gltfLoader.load("/models/f4.glb", function (gltf) {
    console.log(gltf);
    gltf.scene.rotation.x = Math.PI;
    gltf.scene.traverse((item) => {
      if (item.material && item.material.name == "Water") {
        console.log(item);
        // item.renderOrder = 9;
        // item.material.blending = THREE.AdditiveBlending;
        // item.scale.set(0.8, 0.8, 0.8);
        // item.material.depthTest = false;

        // // item.material.transparent = false;
        // item.material.depthWrite = true;
        // item.material.side = THREE.DoubleSide;
        // item.material = new THREE.MeshBasicMaterial({
        //   color: "skyblue",
        //   depthWrite: false,
        //   depthTest: false,
        //   transparent: true,
        //   opacity: 0.7,
        // });

        item.material = new THREE.MeshStandardMaterial({
          color: "skyblue",
          depthWrite: false,
          depthTest: false,
          transparent: true,
          opacity: 0.7,
        });
      }
      if (item.material && item.material.name == "Stem") {
        stem = item;
      }

      if (item.material && item.material.name == "Petal") {
        console.log(item);
        petal = item;

        gltfLoader.load("/models/f2.glb", (gltf) => {
          gltf.scene.traverse((item) => {
            if (item.material && item.material.name == "Petal") {
              petal1 = item;
              // console.log(petal1.geometry.attributes.position);
              if (!petal.geometry.morphAttributes.position) {
                petal.geometry.morphAttributes.position = [];
              }
              petal.geometry.morphAttributes.position[0] =
                petal1.geometry.attributes.position;

              console.log(petal.morphTargetInfluences);
              petal.updateMorphTargets();
              petal.morphTargetInfluences[0] = 1;
              console.log(petal.geometry.morphAttributes);

              gsap.to(params, {
                value0: 1,
                duration: 10,
                // repeat: -1,
                delay: 0,
                onUpdate: function () {
                  petal.morphTargetInfluences[0] = params.value0;
                  stem.morphTargetInfluences[0] = params.value0;
                },
              });
            }
            if (item.material && item.material.name == "Stem") {
              stem1 = item;
              if (!stem.geometry.morphAttributes.position) {
                stem.geometry.morphAttributes.position = [];
              }
              stem.geometry.morphAttributes.position[0] =
                stem1.geometry.attributes.position;
              stem.updateMorphTargets();
              stem.morphTargetInfluences[0] = 1;
            }
          });

          gltfLoader.load("./models/f1.glb", (gltf) => {
            gltf.scene.traverse((item) => {
              if (item.material && item.material.name == "Petal") {
                petal2 = item;

                // console.log(petal1.geometry.attributes.position);
                petal.geometry.morphAttributes.position[1] =
                  petal2.geometry.attributes.position;
                console.log(petal.morphTargetInfluences);
                petal.updateMorphTargets();
                petal.morphTargetInfluences[1] = 0;
                console.log(petal.geometry.morphAttributes);

                gsap.to(params, {
                  value1: 1,
                  duration: 10,
                  delay: 10,
                  // repeat: -1,
                  onUpdate: function () {
                    // console.log(petal.morphTargetInfluences);
                    console.log(stem.morphTargetInfluences);
                    petal.morphTargetInfluences[0] = params.value0;
                    stem.morphTargetInfluences[0] = params.value0;
                    petal.morphTargetInfluences[1] = params.value1;
                    stem.morphTargetInfluences[1] = params.value1;
                  },
                });
              }
              if (item.material && item.material.name == "Stem") {
                stem2 = item;

                stem.geometry.morphAttributes.position[1] =
                  stem2.geometry.attributes.position;
                stem.updateMorphTargets();
                stem.morphTargetInfluences[1] = 0;
              }
            });
          });
        });
      }
    });
    scene.add(gltf.scene);
  });

  // 初始化渲染器
  const renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    logarithmicDepthBuffer: true,
    antialias: true,
  });
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  renderer.setClearColor(0xcccccc, 1);
  renderer.autoClear = false;
  // 设置电影渲染模式
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  // renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.outputColorSpace = SRGBColorSpace
  renderer.sortObjects = true;
  renderer.logarithmicDepthBuffer = true;

  // 将webgl渲染的canvas内容添加到body
  // document.body.appendChild(renderer.domElement);

  // // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
  controls.enableDamping = true;

  // 添加坐标轴辅助器
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  // 设置时钟
  const clock = new THREE.Clock();
  function render() {
    let time = clock.getDelta();
    if (mixer) {
      // console.log(mixer);
      mixer.update(time);
    }
    controls.update();

    renderer.render(scene, camera);
    //   渲染下一帧的时候就会调用render函数
    requestAnimationFrame(render);
  }

  render();

  // 监听画面变化，更新渲染画面
  window.addEventListener("resize", () => {
    //   console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比
    renderer.setPixelRatio(window.devicePixelRatio);
  });
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
