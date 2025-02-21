<script setup lang="ts">
import {onMounted, ref} from "vue";

import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import {
  AxesHelper,
  Clock,
  Color,
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  WebGLRenderer
} from "three";

const canvasRef = ref();

onMounted(() => {
  //创建gui对象
  const gui = new dat.GUI();

  // console.log(THREE);
  // 初始化场景
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
  const axesHelper = new AxesHelper(5);
  scene.add(axesHelper);

  // 加载纹理

  // 创建纹理加载器对象
  const textureLoader = new TextureLoader();
  const texture = textureLoader.load("/textures/da.jpeg");
  const params = {
    uFrequency: 10,
    uScale: 0.1,
  };

  // 创建着色器材质;
  const shaderMaterial = new ShaderMaterial({
    vertexShader: `
    // attribute vec3 position;
// uniform mat4 modelMatrix;
// uniform mat4 viewMatrix;
// uniform mat4 projectionMatrix;
uniform vec3 uColor;
uniform float uFrequency;
uniform float uScale;
uniform float uTime;

varying float vElevation;

varying vec2 vUv;


// highp -2^16-2^16
// mediump = -2^10-2^10
// lowp -2^8-2^8
precision highp float;
void main(){
    vec4 modelPosition = modelMatrix * vec4( position, 1.0 );

    modelPosition.z += sin((modelPosition.x+uTime) * uFrequency)*uScale ;
    modelPosition.z += cos((modelPosition.y+uTime) * uFrequency)*uScale ;

    vElevation = modelPosition.z;
    gl_Position =  projectionMatrix * viewMatrix * modelPosition;
    vUv = uv;

}


    `,
    fragmentShader: `
    uniform vec3 uColor;
varying float vElevation;
precision highp float;
varying vec2 vUv;

uniform sampler2D uTexture;
void main(){
    float alpha = (vElevation+0.1)+0.8;
    // gl_FragColor = vec4(uColor,alpha);
    // gl_FragColor = vec4(uColor*alpha,1);
    // gl_FragColor= vec4(vUv,0,1);


    vec4 textureColor = texture2D(uTexture,vUv);
    textureColor.rgb*=alpha;
    gl_FragColor = textureColor;
}
    `,
    uniforms: {
      uColor: {
        value: new Color("purple"),
      },
      // 波浪的频率
      uFrequency: {
        value: params.uFrequency,
      },
      // 波浪的幅度
      uScale: {
        value: params.uScale,
      },
      // 动画时间
      uTime: {
        value: 0,
      },
      uTexture: {
        value: texture,
      },
    },
    side: DoubleSide,
    transparent: true,
  });
  // const rawSahderMaterial = new RawShaderMaterial({
  //   vertexShader: basicVertexShader,
  //   fragmentShader: basicFragmentShader,
  //   uniforms: {
  //     uColor: {
  //       value: new Color("purple"),
  //     },
  //   },
  // });

  gui
    .add(params, "uFrequency")
    .min(0)
    .max(50)
    .step(0.1)
    .onChange((value) => {
      shaderMaterial.uniforms.uFrequency.value = value;
    });
  gui
    .add(params, "uScale")
    .min(0)
    .max(1)
    .step(0.01)
    .onChange((value) => {
      shaderMaterial.uniforms.uScale.value = value;
    });

  // new MeshBasicMaterial({ color: "#00ff00" })
  // 创建平面
  const floor = new Mesh(
    new PlaneGeometry(1, 1, 64, 64),
    shaderMaterial
  );

  console.log(floor);
  scene.add(floor);

  // 初始化渲染器
  const renderer = new WebGLRenderer({
    canvas: canvasRef.value,
    alpha: true,
  });
  // renderer.shadowMap.enabled = true;
  // renderer.shadowMap.type = BasicShadowMap;
  // renderer.shadowMap.type = VSMShadowMap;

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
  // controls.autoRotate = true;

  const clock = new Clock();
  function animate() {
    const elapsedTime = clock.getElapsedTime();
    shaderMaterial.uniforms.uTime.value = elapsedTime;
    //   console.log(elapsedTime);
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
