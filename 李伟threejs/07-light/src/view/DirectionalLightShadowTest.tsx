import React, { useRef, useEffect } from 'react'
import {
	AddOperation,
	AmbientLight,
	BoxGeometry,
	BufferAttribute,
	Color,
	CubeCamera,
	CubeTextureLoader,
	DirectionalLight,
	DoubleSide,
	EquirectangularReflectionMapping,
	Fog,
	LightProbe,
	Mesh,
	MeshBasicMaterial,
	MeshLambertMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	MixOperation,
	MultiplyOperation,
	PlaneGeometry,
	SphereGeometry,
	sRGBEncoding,
	TextureLoader,
	Vector3,
	WebGLCubeRenderTarget,
} from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator'
import Stage from '../component/Stage'
import './fullScreen.css'

/* 快速初始化项目 */
const stage = new Stage(20, 20, 10)
const { scene, renderer } = stage
renderer.shadowMap.enabled = true

/* 灯光 */
{
	const light = new DirectionalLight()
	light.position.set(0, 8, 12)
	light.castShadow = true
	// 投影
	const {
		shadow: { mapSize, camera },
	} = light
	// mapSize.width = 512 // default
	// mapSize.height = 512 // default
	mapSize.width = 5120
	mapSize.height = 5120
	camera.near = 0.5 // default
	camera.far = 50 // default
	// camera.left = -5 // default
	// camera.right = 5 // default
	// camera.top = 5 // default
	// camera.bottom = -5 // default
	// camera.left = -10
	// camera.right = 10
	// camera.top = 10
	// camera.bottom = -10
	camera.left = -100
	camera.right = 100
	camera.top = 100
	camera.bottom = -100

	scene.add(light)
}

/* 柱子 */
{
	const mat = new MeshStandardMaterial({
		color: 0xeeeeee,
	})
	// const geo = new BoxGeometry(1, 4, 1)
	const geo = new BoxGeometry(15, 4, 15)
	const mesh = new Mesh(geo, mat)
	mesh.position.y = 2
	mesh.castShadow = true
	scene.add(mesh)
}

/* 地面 */
{
	const geometry = new PlaneGeometry(2000, 2000)
	geometry.rotateX(-Math.PI / 2)
	const material = new MeshStandardMaterial()
	const plane = new Mesh(geometry, material)
	plane.receiveShadow = true
	scene.add(plane)
}

/* 法线 */
const a = new Vector3(2, 0, 0)
const b = new Vector3(0, 1, 0)
const c = a.clone().cross(b)
c.x = a.y * b.z - a.z * b.y
c.y = a.z * b.x - a.x * b.z
c.z = a.x * b.y - a.y * b.x
c.setLength(1)
console.log(c)

const DirectionalLightShadowTest: React.FC = (): JSX.Element => {
	const divRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		const { current } = divRef
		if (!current) {
			return
		}
		current.append(renderer.domElement)
		stage.animate()
		return () => {
			renderer.domElement.remove()
		}
	}, [])
	return <div ref={divRef} className="canvasWrapper"></div>
}

export default DirectionalLightShadowTest
