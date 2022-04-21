"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";

const origin = { x: 0, y: 0, z: 0 };
export const createArm = function (scene, hand_comp, arm_dim, arm_pos, fore_dim, fore_pos, palm_dim, palm_pos) {
    // Creating groups, which hold the arm, forearm and palm
    const shoulder = new THREE.Group();
    shoulder.position.set(origin.x, origin.y, origin.z);

    // creating geometries for hand components
    const arm_geo = new THREE.BoxGeometry(arm_dim.x, arm_dim.y, arm_dim.z);
    const arm_mat = new THREE.MeshBasicMaterial({ color: 0xFF7F50 });
    const arm = new THREE.Mesh(arm_geo, arm_mat);
    arm.position.set(arm_dim.x / 2, -arm_dim.y / 2, 0);       // set position for object, similarly for others

    const elbow = new THREE.Group();
    elbow.position.set(arm_dim.x, -arm_dim.y, 0);

    const f_geo = new THREE.BoxGeometry(fore_dim.x, fore_dim.y, fore_dim.z);
    const f_mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const fore_arm = new THREE.Mesh(f_geo, f_mat);
    fore_arm.position.set(fore_dim.x / 2, fore_dim.y / 2, 0);

    const wrist = new THREE.Group();
    wrist.position.set(fore_dim.x, 0, 0);

    const p_geo = new THREE.BoxGeometry(palm_dim.x, palm_dim.y, palm_dim.z);
    const p_mat = new THREE.MeshBasicMaterial({ color: 0x00abcd });
    const palm = new THREE.Mesh(p_geo, p_mat);
    palm.position.set(palm_dim.x / 2, 0, 0);

    // adding objects in a hierarchical fashion
    wrist.add(palm);

    elbow.add(fore_arm);
    elbow.add(wrist);

    shoulder.add(arm);
    shoulder.add(elbow);

    scene.add(shoulder);

    // push the groups into the hand object
    hand_comp.push(shoulder);
    hand_comp.push(elbow);
    hand_comp.push(wrist);
}

export const moveArm = function (hand_comp, moveBy) {
    // hand_comp.forEach(Object => {
        // let curPos = new Vector3( Object.position.x, Object.position.y, Object.position.z );
        // let newPos = new THREE.Vector3( Object.position.x + moveBy.x, Object.position.y + moveBy.y, Object.position.z + moveBy.z); 

        hand_comp[0].translateOnAxis( new THREE.Vector3(1,0,0), moveBy.x );
        hand_comp[0].translateOnAxis( new THREE.Vector3(0,1,0), moveBy.y );
        hand_comp[0].translateOnAxis( new THREE.Vector3(0,0,1), moveBy.z );
    // });
}