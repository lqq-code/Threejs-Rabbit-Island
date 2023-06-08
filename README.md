# threejs rabbit island

## GLTF loader (GLTFLoader)
`glTF` (gl Transport Format) is an open format specification (open format specification) for more efficient transmission and loading of 3D content. The class files are provided in JSON (.gltf) or binary (.glb) format, with external files storing textures (.jpg, .png) and additional binary data (.bin). A glTF component can transfer one or more scenes, including meshes, materials, textures, skinning, skeletons, morph targets, animations, lights, and cameras.

```javascript
const loader = new GLTFLoader();
```
Click to view: [Example](https://threejs.org/examples/#webgl_loader_gltf)

## Import the rabbit model

```javascript
		const loader = new GLTFLoader();
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
```
Print to see what are the animations of the rabbit model:

![Insert picture description here](https://img-blog.csdnimg.cn/616a68cff2e44d15a355d0ee8c693f19.png)

Perform animation operations through startAnimation():

```javascript
function startAnimation(skinnedMesh, animations, animationName) {
			const m_mixer = new THREE.AnimationMixer(skinnedMesh);
			const clip = THREE.AnimationClip.findByName(animations, animationName);
			if (clip) {
				const action = m_mixer.clipAction(clip);
				action.play();
			}
			return m_mixer;
		};
```

**AnimationMixer**

An animation mixer is a player for animations of specific objects in the scene. When multiple objects in a scene are animated independently, each object can use the same animation mixer.

```javascript
AnimationMixer( rootObject : Object3D )
```

- `rootObject` - The object that the animation played by the mixer belongs to
  - `time` - global mixer time
  - `timeScale` - scaling factor for global time (mixer time)

Some methods:
- `.clipAction (clip : AnimationClip, optionalRoot : Object3D)` : Returns the AnimationAction of the clip parameter passed in, the root object parameter is optional, and the default value is the default root object of the mixer. The first parameter can be an AnimationClip object or the name of an animation clip.
- `.existingAction (clip : AnimationClip, optionalRoot : Object3D)` : returns the existing AnimationAction of the incoming clip, the root object parameter is optional, and the default value is the default root object of the mixer.
  - `.getRoot ()` : returns the root object of the blender
- `.stopAllAction ()` : Stops all scheduled actions on the mixer
- `.update (deltaTimeInSeconds : Number)` : advance mixer time and update animation
  - `.setTime (timeInSeconds : Number)` : Sets the global mixer to a given time and updates the animation accordingly.
  - `.uncacheClip (clip : AnimationClip)`: Release all memory resources of the clip
- `.uncacheRoot (root : Object3D)`: Release all memory resources of the root object
- `.uncacheAction (clip : AnimationClip, optionalRoot : Object3D)` : Release all memory resources of the action

## Source code experience address
github: [Animated Rabbit Island](https://github.com/lqq-code/threejs-rabbit-island)

Online experience: [https://threejs-rabbit-island.vercel.app/](https://threejs-rabbit-island.vercel.app/)
