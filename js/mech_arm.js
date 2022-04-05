import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export let createArm = function(scene, hand_comp)
{
    console.log("createArm");
    const f_geo = new THREE.BoxGeometry( 4, 1, 1 );
    const f_mat = new THREE.MeshBasicMaterial( {color: 0xFF7F50} );
    const fore_arm = new THREE.Mesh( f_geo, f_mat );
    fore_arm.position.set( 0, -4, -4 );
    scene.add( fore_arm );

    hand_comp.push(fore_arm);

    console.log( fore_arm );
    // console.log( hand_comp[0] );
}
