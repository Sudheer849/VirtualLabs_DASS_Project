"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export const dot = function (scene, dotList, initial_pos) {
  const tmpVec = new THREE.Vector3(initial_pos[0], initial_pos[1], initial_pos[2]);
  const dotGeometry = new THREE.BufferGeometry().setFromPoints([tmpVec]);
  const dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });

  let point = new THREE.Points(dotGeometry, dotMaterial);
  dotList.push(point);
  scene.add(dotList[0]);

  return dotGeometry;
};
