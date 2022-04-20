import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export let dot = function (scene, dotList, initialPos) {
  let tmp_vec = new THREE.Vector3(initialPos[0], initialPos[1], initialPos[2]);
  let dotGeometry = new THREE.BufferGeometry().setFromPoints([tmp_vec]);
  let dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });

  let point = new THREE.Points(dotGeometry, dotMaterial);
  dotList.push(point);
  scene.add(dotList[0]);

  return dotGeometry;
};
