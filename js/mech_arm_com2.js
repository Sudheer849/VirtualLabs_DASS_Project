import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

export let createArm = function(scene, hand_comp, arm_dim, arm_pos, fore_dim, fore_pos, palm_dim, palm_pos )
{
    console.log("createArm");
    const arm_geo = new THREE.BoxGeometry( arm_dim.x, arm_dim.y, arm_dim.z );
    const arm_mat = new THREE.MeshBasicMaterial( {color: 0xFF7F50} );
    const arm = new THREE.Mesh( arm_geo, arm_mat );
    arm.position.set( arm_pos.x, arm_pos.y, arm_pos.z );
    
    scene.add( arm );
    hand_comp.push(arm);
    console.log( arm );
    
    const f_geo = new THREE.BoxGeometry( fore_dim.x, fore_dim.y, fore_dim.z );
    const f_mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const fore_arm = new THREE.Mesh( f_geo, f_mat );
    fore_arm.position.set( fore_pos.x, fore_pos.y, fore_pos.z );
    
    arm.add( fore_arm );
    hand_comp.push(fore_arm);
    console.log( fore_arm );
    
    const p_geo = new THREE.BoxGeometry( palm_dim.x, palm_dim.y, palm_dim.z );
    const p_mat = new THREE.MeshBasicMaterial( {color: 0x00abcd} );
    const palm = new THREE.Mesh( p_geo, p_mat );
    palm.position.set( palm_pos.x, palm_pos.y, palm_pos.z );
    
    fore_arm.add( palm );
    hand_comp.push( palm );
    console.log( palm );
}
