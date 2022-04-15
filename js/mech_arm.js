import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

let origin = {x:0, y:0, z:0};
export let createArm = function(scene, hand_comp, arm_dim, arm_pos, fore_dim, fore_pos, palm_dim, palm_pos )
{
    console.log("createArm");
    // const arm_geo = new THREE.BoxGeometry( arm_dim.x, arm_dim.y, arm_dim.z );
    // const arm_mat = new THREE.MeshBasicMaterial( {color: 0xFF7F50} );
    // const arm = new THREE.Mesh( arm_geo, arm_mat );
    // arm.position.set( arm_pos.x, arm_pos.y, arm_pos.z );
    // 
    // scene.add( arm );
    // hand_comp.push(arm);
    // console.log( arm );
    // 
    // const f_geo = new THREE.BoxGeometry( fore_dim.x, fore_dim.y, fore_dim.z );
    // const f_mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    // const fore_arm = new THREE.Mesh( f_geo, f_mat );
    // fore_arm.position.set( fore_pos.x, fore_pos.y, fore_pos.z );
    // 
    // arm.add( fore_arm );
    // hand_comp.push(fore_arm);
    // console.log( fore_arm );
    // 
    // const p_geo = new THREE.BoxGeometry( palm_dim.x, palm_dim.y, palm_dim.z );
    // const p_mat = new THREE.MeshBasicMaterial( {color: 0x00abcd} );
    // const palm = new THREE.Mesh( p_geo, p_mat );
    // palm.position.set( palm_pos.x, palm_pos.y, palm_pos.z );
    // 
    // fore_arm.add( palm );
    // hand_comp.push( palm );
    // console.log( palm );

    const shoulder = new THREE.Group();
    shoulder.position.set( origin.x, origin.y, origin.z );

    const arm_geo = new THREE.BoxGeometry( arm_dim.x, arm_dim.y, arm_dim.z );
    const arm_mat = new THREE.MeshBasicMaterial( {color: 0xFF7F50} );
    const arm = new THREE.Mesh( arm_geo, arm_mat );
    arm.position.set( arm_dim.x/2, -arm_dim.y/2, 0 );
    
    const elbow = new THREE.Group();
    elbow.position.set( arm_dim.x, -arm_dim.y, 0);

    const f_geo = new THREE.BoxGeometry( fore_dim.x, fore_dim.y, fore_dim.z );
    const f_mat = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const fore_arm = new THREE.Mesh( f_geo, f_mat );
    fore_arm.position.set( fore_dim.x/2, fore_dim.y/2, 0 );
    
    const wrist = new THREE.Group();
    wrist.position.set( fore_dim.x, 0, 0);

    const p_geo = new THREE.BoxGeometry( palm_dim.x, palm_dim.y, palm_dim.z );
    const p_mat = new THREE.MeshBasicMaterial( {color: 0x00abcd} );
    const palm = new THREE.Mesh( p_geo, p_mat );
    palm.position.set( palm_dim.x/2, 0, 0 );

    wrist.add( palm );

    elbow.add( fore_arm );
    elbow.add( wrist );

    shoulder.add( arm );
    shoulder.add( elbow );

    scene.add( shoulder );

    hand_comp.push(shoulder);
    // hand_comp.push(arm);
    hand_comp.push(elbow);
    // hand_comp.push(fore_arm);
    hand_comp.push(wrist);
    // hand_comp.push(palm);
}
