import React, { useEffect, useRef, useState } from "react"
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import HouseModal from './models/sea_house.glb'
import Rabbit1 from './models/rabbit1.glb'
import Rabbit2 from './models/rabbit2.glb'
import { Sky } from 'three/examples/jsm/objects/Sky';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'

export default function ThreeMap() {
	const [mixers, setMixers] = useState([])

	useEffect(() => {
		handleInitial()
	}, [])

	let clock = new THREE.Clock();
	let mixer;
	let mixer2;
	var scene, camera, renderer;

	const handleInitial = () => {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(120, document.body.clientWidth / document.body.clientHeight, 0.1, 1000);
		camera.position.set(60, 110, -180);
		camera.lookAt(new THREE.Vector3(0, 0, 0));

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(document.body.clientWidth, document.body.clientHeight);
		document.getElementById("container").appendChild(renderer.domElement);

		var controls = new OrbitControls(camera, renderer.domElement);
		controls.target.set(60, 0, 0);
		controls.enableDamping = true;
		controls.enablePan = false;
		controls.maxPolarAngle = 1.5;
		controls.minDistance = 50;
		controls.maxDistance = 1200;

		// 添加平行光
		const dirLight = new THREE.DirectionalLight(0xffffff, 1);
		dirLight.color.setHSL(.1, 1, .95);
		dirLight.position.set(1, 1.75, 1);
		dirLight.position.multiplyScalar(30);
		scene.add(dirLight);
		// 添加环境光
		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);

		// 页面缩放监听并重新更新场景和相机
		window.addEventListener('resize', () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}, false);

		//天空
		const sky = new Sky();
		sky.scale.setScalar(10000);
		scene.add(sky);
		const skyUniforms = sky.material.uniforms;
		skyUniforms['turbidity'].value = 20; //浑浊度
		skyUniforms['rayleigh'].value = 6; //夕阳红
		skyUniforms['mieCoefficient'].value = 0.005;
		skyUniforms['mieDirectionalG'].value = 0.8;
		// 太阳
		const sun = new THREE.Vector3();
		const pmremGenerator = new THREE.PMREMGenerator(renderer);
		const phi = THREE.MathUtils.degToRad(88);
		const theta = THREE.MathUtils.degToRad(10);
		sun.setFromSphericalCoords(1, phi, theta);
		sky.material.uniforms['sunPosition'].value.copy(sun);
		scene.environment = pmremGenerator.fromScene(sky).texture;


		loop();
		function loop() {
			requestAnimationFrame(loop);
			renderer.render(scene, camera);
		}

		//房子
		const loader = new GLTFLoader();
		loader.load(
			HouseModal,
			function (gltf) {
				gltf.scene.position.set(0, -2, 0);
				scene.add(gltf.scene);
			},
		);

		//兔子
		loader.load(
			Rabbit1,
			function (gltf) {
				console.log('兔子1', gltf);
				gltf.scene.scale.set(10, 10, 10);
				gltf.scene.position.set(10, 7, -125);
				gltf.scene.rotation.y = - 4;

				mixer = startAnimation(
					gltf.scene,
					gltf.animations,
					gltf.animations[3].name
				);

				scene.add(gltf.scene);
				animate();
			},
		);
		loader.load(
			Rabbit2,
			function (gltf) {
				console.log('兔子2', gltf);
				gltf.scene.scale.set(10, 10, 10);
				gltf.scene.position.set(60, 5, -110);
				gltf.scene.rotation.y = - 4;

				mixer = startAnimation(
					gltf.scene,
					gltf.animations,
					gltf.animations[1].name
				);

				scene.add(gltf.scene);
				animate();
			},
		);

		function animate() {
			requestAnimationFrame(animate);
			if (mixer) {
				mixer.update(clock.getDelta());
			}
			renderer.render(scene, camera);
			controls && controls.update();

			const timer = Date.now() * 0.0005;
			camera && (camera.position.y += Math.sin(timer) * .15);

		};

		function startAnimation(skinnedMesh, animations, animationName) {
			const m_mixer = new THREE.AnimationMixer(skinnedMesh);
			const clip = THREE.AnimationClip.findByName(animations, animationName);
			if (clip) {
				const action = m_mixer.clipAction(clip);
				action.play();
			}
			return m_mixer;
		};
		
	}


	return (
		<div>
			<div id="container" style={{ width: document.documentElement.clientWidth, height: document.documentElement.clientHeight }}></div>
		</div>
	)
}
