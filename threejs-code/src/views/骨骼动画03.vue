<script setup lang="ts">
import {onMounted, ref} from "vue";
// 导入轨道控制器
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {
  AdditiveBlending,
  AnimationMixer,
  AxesHelper,
  Clock,
  DirectionalLight,
  DoubleSide,
  EquirectangularReflectionMapping,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  RepeatWrapping,
  Scene,
  SphereGeometry,
  TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

  // 2、创建相机
  const camera = new PerspectiveCamera(
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
  // const light = new AmbientLight(0xffffff, 1); // soft white light
  // scene.add(light);

  // 添加hdr环境纹理
  const loader = new RGBELoader();
  loader.load("/textures/Dosch-Space_0026_4k.hdr", function (texture) {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // 加载纹理
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("/textures/cloth_pos.png");
  const normalMap = textureLoader.load("/textures/cloth_norm.png");
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.repeat.set(0.2, 0.2);
  normalMap.wrapS = RepeatWrapping;
  normalMap.wrapT = RepeatWrapping;
  normalMap.repeat.set(0.2, 0.2);
  texture.offset.set(0, 0);

  gsap.to(texture.offset, {
    x: 1,
    y: 1,
    duration: 1,
    repeat: -1,
    onUpdate: function () {
      // console.log(texture.offset);
      texture.needsUpdate = true;
    },
  });
  // 加载压缩的glb模型
  let material = null;
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("/draco/gltf/");
  dracoLoader.setDecoderConfig({ type: "js" });
  dracoLoader.preload();
  gltfLoader.setDRACOLoader(dracoLoader);
  let mixer;
  gltfLoader.load("/models/jianshen-min.glb", function (gltf) {
    console.log(gltf);
    scene.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      // if (child.name == "Body") {
      //   console.log(child);
      // }
      // if (child.name == "Floor") {
      //   child.material = new MeshStandardMaterial({
      //     color: 0xffffff,
      //   });
      //   console.log(child);
      // }
      if (child.isMesh) {
        child.material = new MeshStandardMaterial({
          map: texture,
          emissiveMap: texture,
          side: DoubleSide,
          transparent: true,
          blending: AdditiveBlending,
          depthWrite: false,
          normalMap: normalMap,
        });
      }
    });
    // 设置动画
    mixer = new AnimationMixer(gltf.scene);
    const action = mixer.clipAction(gltf.animations[0]);

    action.play();
    action.timeScale = 4;

    // 添加平行光;
    const light = new DirectionalLight(0xffffff, 2);
    light.position.set(0, 100, -100);
    scene.add(light);
    // 添加点光源
    // const pointLight = new PointLight(0xffffff, 10);
    // pointLight.position.set(0, 100, 100);
  });

  // 创建一个金属球添加到场景中
  const geometry = new SphereGeometry(1, 32, 32);
  const material1 = new MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.5,
  });
  const sphere = new Mesh(geometry, material1);
  sphere.position.set(-2, 0, 0);
  scene.add(sphere);

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
  });
  // 设置渲染的尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 开启场景中的阴影贴图
  renderer.shadowMap.enabled = true;
  renderer.physicallyCorrectLights = true;
  renderer.setClearColor(0xcccccc, 1);

  // console.log(renderer);
  // 将webgl渲染的canvas内容添加到body
  // document.body.appendChild(renderer.domElement);

  // // 使用渲染器，通过相机将场景渲染进来
  // renderer.render(scene, camera);

  // 创建轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
  controls.enableDamping = true;

  // 添加坐标轴辅助器
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);
  // 设置时钟
  const clock = new Clock();

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
