# threejs 兔子岛

## GLTF加载器（GLTFLoader）
`glTF`（gl传输格式）是一种开放格式的规范 （open format specification）， 用于更高效地传输、加载3D内容。该类文件以JSON（.gltf）格式或二进制（.glb）格式提供， 外部文件存储贴图（.jpg、.png）和额外的二进制数据（.bin）。一个glTF组件可传输一个或多个场景， 包括网格、材质、贴图、蒙皮、骨架、变形目标、动画、灯光以及摄像机。

```javascript
const loader = new GLTFLoader();
```
点击查看：[例子](https://threejs.org/examples/#webgl_loader_gltf)

## 导入兔子模型

```javascript
		const loader = new GLTFLoader();
		//兔子
		loader.load(
			Rabbit1, //import 兔子模型
			function (gltf) {
				console.log('兔子1', gltf);
				gltf.scene.scale.set(10, 10, 10);
				gltf.scene.position.set(10, 7, -125);
				gltf.scene.rotation.y = - 4;

				mixer = startAnimation( // 执行动画操作
					gltf.scene,
					gltf.animations,
					gltf.animations[3].name
				);

				scene.add(gltf.scene);
				animate();
			},
		);
```
打印查看兔子模型的动画有哪些：

![在这里插入图片描述](https://img-blog.csdnimg.cn/616a68cff2e44d15a355d0ee8c693f19.png)

通过startAnimation()执行动画操作：

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

动画混合器是用于场景中特定对象的动画的播放器。当场景中的多个对象独立动画时，每个对象都可以使用同一个动画混合器。

```javascript
AnimationMixer( rootObject : Object3D )
```

 - `rootObject` - 混合器播放的动画所属的对象
 - `time` - 全局的混合器时间
 - `timeScale` - 全局时间(mixer time)的比例因子

一些方法：


 - `.clipAction (clip : AnimationClip, optionalRoot : Object3D)` ：返回所传入的剪辑参数的AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。第一个参数可以是动画剪辑(AnimationClip)对象或者动画剪辑的名称。
- `.existingAction (clip : AnimationClip, optionalRoot : Object3D)` ：返回传入剪辑的已有AnimationAction, 根对象参数可选，默认值为混合器的默认根对象。
 - `.getRoot ()` ：返回混合器的根对象
- `.stopAllAction ()` ：停用混合器上所有预定的动作
- `.update (deltaTimeInSeconds : Number)` ：推进混合器时间并更新动画
 - `.setTime (timeInSeconds : Number)` ：设置全局混合器到一个给定的时间，并相应地更新动画。
 - `.uncacheClip (clip : AnimationClip)`：释放剪辑的所有内存资源
- `.uncacheRoot (root : Object3D)` ：释放根对象的所有内存资源
- `.uncacheAction (clip : AnimationClip, optionalRoot : Object3D)` ：释放动作的所有内存资源

## 源码体验地址
github：[动画兔子岛](https://github.com/lqq-code/threejs-rabbit-island)
在线体验：[https://threejs-rabbit-island.vercel.app/](https://threejs-rabbit-island.vercel.app/)
