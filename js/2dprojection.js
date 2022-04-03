import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";


export function ProjectTo2D(camera, orbit, is_2D, two_plane, first_time, two_geometry) {
    is_2D = 1;

    let camera_pos = new THREE.Vector3(3, 0, 0);
    camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
    camera.up.set(0, 1, 0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    orbit.screenSpacePanning = true;

    if (first_time === 1) {
        //create someplane to project to
        two_plane = new THREE.Plane().setFromCoplanarPoints(new THREE.Vector3(0, 1, 0), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0));
        //create some geometry to flatten..
        // two_geometry = new THREE.BufferGeometry();
        // fillGeometry(two_geometry);
        first_time = 0;
    }

    let positionAttr = two_geometry.getAttribute("position");
    for (let i = 0; i < positionAttr.array.length; i += 3) {
        let point = new THREE.Vector3(positionAttr.array[i], positionAttr.array[i + 1], positionAttr.array[i + 2]);
        let projectedPoint = two_plane.projectPoint();
        positionAttr.array[i] = projectedPoint.x;
        positionAttr.array[i + 1] = projectedPoint.y;
        positionAttr.array[i + 2] = projectedPoint.z;
    }
    positionAttr.needsUpdate = true;

    // orbit.minPolarAngle = 0;
    // orbit.maxPolarAngle = 0;
}

// export function 
