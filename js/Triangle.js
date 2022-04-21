"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
export const Triangle = function (A, B, C, scene, dotList) {
  const tri_mater = new THREE.MeshNormalMaterial();
  const tri_geom = new THREE.BufferGeometry();

  let vertices = [A, B, C];
  tri_geom.setFromPoints(vertices);
  tri_geom.computeVertexNormals();

  const mesh = new THREE.Mesh(tri_geom, tri_mater);
  dotList.push(mesh);
  scene.add(mesh);

  return tri_geom;
};
