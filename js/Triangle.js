import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

// Creates the triangle
// --------------------------------------------------------------------------------------------------
export let Triangle = function (A, B, C, scene, dot_list) {
  const tri_mater = new THREE.MeshNormalMaterial();
  let tri_geom = new THREE.BufferGeometry();

  let vertices = [A, B, C];
  tri_geom.setFromPoints(vertices);
  tri_geom.computeVertexNormals();

  const mesh = new THREE.Mesh(tri_geom, tri_mater);
  dot_list.push(mesh);
  scene.add(mesh);

  return tri_geom;
};