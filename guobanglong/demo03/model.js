import * as THREE from 'three'

const geometry = new THREE.BoxGeometry(20, 20, 20);
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff,
});
const mesh1 = new THREE.Mesh(geometry, material);
const mesh2 = new THREE.Mesh(geometry, material);
mesh2.translateX(50);

// 组对象
const group = new THREE.Group();
group.add(mesh1);
group.add(mesh2);

export default group;
