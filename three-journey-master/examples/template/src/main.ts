import './style.css'
import * as THREE from 'three'
import Sketch from './Sketch'

const sketch = new Sketch()

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00FF00 })
const box = new THREE.Mesh(geometry, material)
sketch.add(box)

sketch.play()
