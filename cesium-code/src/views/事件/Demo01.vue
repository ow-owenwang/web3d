<script setup lang="ts">
import {onMounted} from "vue";
import {Event} from 'cesium'

//地图组件
class Map3DClass {
  constructor(opts) {
    //初始化事件
    this._initStartEvent = new Event();
    this._initEndEvent = new Event();

    this._eleId = opts.eleId;

    //初始化前可能需要进行一些处理
    // fetch("/xxx/init").then(res=>{
    //     return res.json();
    // }).then(res=>{
    //     this._initStartEvent.raiseEvent();
    //     this._init();
    // })

    //用定时器代替
    setTimeout(e => {
      this._initStartEvent.raiseEvent();
      this._init();
    }, 1000)
  }

  //初始化操作
  _init() {
    let viewer = new Viewer(this._eleId);
    this._viewer = viewer;

    //当然 初始化可能会有很多耗时的操作
    //比如需要进行权限处理 环境处理等等

    //用定时器代替
    setTimeout(e => {
      this._initEndEvent.raiseEvent();
    }, 2000)
  }

  get viewer() {
    return this._viewer;
  }
}


//使用地图组件
let map3d = new Map3DClass({
  eleId: "cesiumContainer"
});
//注册地图组件的相关事件
map3d._initStartEvent.addEventListener(handleInitStart);
map3d._initEndEvent.addEventListener(handleInitEnd);

function handleInitStart() {
  //显示一个遮罩
  let mask = document.createElement("div");
  mask.setAttribute("id", 'initMask');
  mask.innerHTML = "初始化中，请稍后...";
  mask.style.cssText = `
     position: absolute;
     left: 0;
     top: 0;
     height: 100%;
     width: 100%;
     background: black;
     color: white;
     font-size: 20px;
     display: flex;
     align-items: center;
     justify-content: center;`;
  document.body.appendChild(mask);
}

function handleInitEnd() {
  //隐藏或删除遮罩
  document.getElementById('initMask')!.remove();
}


onMounted(() => {

})
</script>

<template>
  <div id="cesiumContainer"></div>
</template>

<style scoped>

</style>
