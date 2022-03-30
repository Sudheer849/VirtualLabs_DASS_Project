import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

export function AddCam(near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp, scene, camera, controls, renderer) {
    // 1 == orthographic, 0 == perspective
    scene.remove(camera);
    if (ortho_persp == 1) {
        camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
    } else {
        // cam2 = new THREE.PerspectiveCamera( Math.atan( ( (top - bottom)/( near + far ) ), (left - right) / (top - bottom) , near, far) );
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, near, far);
        camera.up.set(up_vec.x, up_vec.y, up_vec.z);
    }

    camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
    camera.lookAt(target);

    scene.add(camera);
    // renderer.render(scene, camera);

    // let newRenderer = new THREE.WebGLRenderer();
    // newRenderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(newRenderer.domElement);

    // orbit controls
    // if (ortho_persp == 0) {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.mouseButtons = {
        // LEFT: THREE.MOUSE.PAN,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.ROTATE,
    };
    controls.target.set(target.x, target.y, target.z);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.update();
    // }

    return camera;
}

// Add a camera 
export function OldCam(scene, camera, orbit, renderer) {
    scene.remove(camera);

    camera = new THREE.PerspectiveCamera(
        30,
        window.innerWidth / window.innerHeight,
        1,
        1000
    );

    camera.position.x = 2;
    camera.position.y = 2;
    camera.position.z = 5;

    origin = new THREE.Vector3(0, 0, 0);
    camera.lookAt(origin);

    scene.add(camera);
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.mouseButtons = {
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.05;

    renderer.render(scene, camera);

    return camera;
}