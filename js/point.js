import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export let Dot = function(scene, dot_list, initial_pos) {
    let tmp_vec = new THREE.Vector3( initial_pos[0], initial_pos[1], initial_pos[2] );
    let dotGeometry = new THREE.BufferGeometry().setFromPoints( [ tmp_vec ] );
    let dotMaterial = new THREE.PointsMaterial({
      size: 6,
      sizeAttenuation: false,
    });
  
    let point = new THREE.Points( dotGeometry, dotMaterial );
    dot_list.push(point);
    scene.add(dot_list[0]);
  
    return dotGeometry;
};
