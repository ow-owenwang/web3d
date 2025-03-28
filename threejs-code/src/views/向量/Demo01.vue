<script setup lang="ts">
import {Vector3} from "three";

const v1 = new Vector3(3, 4, 0)

console.log('v1', v1.length(), v1)

// 归一化
console.log(v1.normalize(), new Vector3(1, 1, 0).normalize())
// 手动实现归一化
const v2 = new Vector3(1, 1, 0)
const len = v2.length()
v2.x = v2.x / len
v2.y = v2.y / len
v2.z = v2.z / len
console.log(v2)

// 单位向量
console.log(new Vector3(1, 0, 0))

</script>

<template>
<div></div>
</template>

<style scoped>

</style>