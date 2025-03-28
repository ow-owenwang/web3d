<script setup lang="ts">
import {onMounted, ref} from "vue";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import {RGBELoader} from "three/examples/jsm/loaders/RGBELoader";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {
  ACESFilmicToneMapping,
  Clock,
  DoubleSide,
  EquirectangularReflectionMapping,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  const scene = new Scene();

  // 创建透视相机
  const camera = new PerspectiveCamera(
      90,
      window.innerHeight / window.innerHeight,
      0.1,
      1000
  );
  // 设置相机位置
  // object3d具有position，属性是1个3维的向量
  camera.position.set(0, 0, 2);
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  scene.add(camera);

  // 加入辅助轴，帮助我们查看3维坐标轴
  // const axesHelper = new AxesHelper(5);
  // scene.add(axesHelper);

  // 创建纹理加载器对象
  const rgbeLoader = new RGBELoader();
  rgbeLoader.loadAsync("/2k.hdr").then((texture) => {
    texture.mapping = EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;
  });

  // 创建着色器材质;
  const shaderMaterial = new ShaderMaterial({
    vertexShader: `
    precision lowp float;



varying vec4 vPosition;
varying vec4 gPosition;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    vPosition = modelPosition;
    gPosition = vec4( position, 1.0 );
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    

}


    `,
    fragmentShader: `
    precision lowp float;
varying vec4 vPosition;
varying vec4 gPosition;

void main(){
    vec4 redColor = vec4(1,0,0,1);
    vec4 yellowColor = vec4(1,1,0.5,1);
    vec4 mixColor = mix(yellowColor,redColor,gPosition.y/3.0);



    if(gl_FrontFacing){
        gl_FragColor = vec4(mixColor.xyz-(vPosition.y-20.0)/80.0-0.1,1);
        // gl_FragColor = vec4(1,1,1,1);
    }else{
        gl_FragColor = vec4(mixColor.xyz,1);
    }
}
    `,
    uniforms: {},
    side: DoubleSide,
    //   transparent: true,
  });

  const renderer = new WebGLRenderer({canvas: canvasRef.value, alpha: true});
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = BasicShadowMap;
  // renderer.shadowMap.type = VSMShadowMap;
  // renderer.outputEncoding = sRGBEncoding; // 最新版移除
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping;
  // renderer.toneMapping = LinearToneMapping;
  // renderer.toneMapping = ReinhardToneMapping;
  // renderer.toneMapping = CineonToneMapping;
  renderer.toneMappingExposure = 0.2;

  const gltfLoader = new GLTFLoader();
  let LightBox = null;
  // TODO: 与效果不符
  gltfLoader.load("/model/flyLight.glb", (gltf) => {
    console.log(gltf);

    LightBox = gltf.scene.children[1];
    LightBox.material = shaderMaterial;

    for (let i = 0; i < 150; i++) {
      let flyLight = gltf.scene.clone(true);
      let x = (Math.random() - 0.5) * 300;
      let z = (Math.random() - 0.5) * 300;
      let y = Math.random() * 60 + 25;
      flyLight.position.set(x, y, z);
      gsap.to(flyLight.rotation, {
        y: 2 * Math.PI,
        duration: 10 + Math.random() * 30,
        repeat: -1,
      });
      gsap.to(flyLight.position, {
        x: "+=" + Math.random() * 5,
        y: "+=" + Math.random() * 20,
        yoyo: true,
        duration: 5 + Math.random() * 10,
        repeat: -1,
      });
      scene.add(flyLight);
    }
  });

  // 设置渲染尺寸大小
  renderer.setSize(window.innerWidth, window.innerHeight);

  // 监听屏幕大小改变的变化，设置渲染的尺寸
  window.addEventListener("resize", () => {
    //   console.log("resize");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight;
    //   更新摄像机的投影矩阵
    camera.updateProjectionMatrix();

    //   更新渲染器
    renderer.setSize(window.innerWidth, window.innerHeight);
    //   设置渲染器的像素比例
    renderer.setPixelRatio(window.devicePixelRatio);
  });

  // 将渲染器添加到body
  // document.body.appendChild(renderer.domElement);

  // 初始化控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置控制器阻尼
  controls.enableDamping = true;
  // 设置自动旋转
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.1;
  controls.maxPolarAngle = (Math.PI / 3) * 2;
  controls.minPolarAngle = (Math.PI / 3) * 2;

  const clock = new Clock();

  function animate() {
    controls.update();
    const elapsedTime = clock.getElapsedTime();

    requestAnimationFrame(animate);
    // 使用渲染器渲染相机看这个场景的内容渲染出来
    renderer.render(scene, camera);
  }

  animate();
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
