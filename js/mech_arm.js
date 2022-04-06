import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export let createArm = function(scene, hand_comp)
{
    console.log("createArm");
    const arm_geo = new THREE.BoxGeometry( 1, 2, 1 );
    const arm_mat = new THREE.MeshBasicMaterial( {color: 0xFF7F50} );
    const arm = new THREE.Mesh( arm_geo, arm_mat );
    arm.position.set( 0, -1, 0 );
    
    scene.add( arm );
    hand_comp.push(arm);
    console.log( arm );
    
    const f_geo = new THREE.BoxGeometry( 5, 0.5, 1 );
    const f_mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const fore_arm = new THREE.Mesh( f_geo, f_mat );
    fore_arm.position.set( 3, -1.75, 0 );
    
    scene.add( fore_arm );
    hand_comp.push(fore_arm);
    console.log( fore_arm );
    

    const p_geo = new THREE.BoxGeometry( 5, 1, 5 ) ;
    const p_mat = new THREE.MeshBasicMaterial( {color: 0x00abcd} );
    const palm = new THREE.Mesh( p_geo, p_mat );
    palm.position.set( 8, -1.75, 0 );
    
    scene.add( palm );
    hand_comp.push( palm );
    console.log( palm );
}
