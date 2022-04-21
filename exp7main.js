"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

// importing internal files
import { createCube, createDodecahedron, createOctahedron, createTetrahedron } from "./js/shapes.js";
import { createArm } from "./js/mech_arm.js";
import { VRMLLoader } from "./js/VRMLloader.js";


const moveButton = document.getElementById("move-button");
const modalbutton1 = document.querySelector(".edit-button");
const modalbutton2 = document.querySelector(".add-button");
let lockVertices = document.getElementById("lock-vertices-cb");
let xyGrid = document.getElementById("xy-grid-cb");
let yzGrid = document.getElementById("yz-grid-cb");
let xzGrid = document.getElementById("xz-grid-cb");
let cam_pos = new THREE.Vector3(17, 15, 15);
let cam_target = new THREE.Vector3(0, 0, 0);
let modalAdd = document.getElementById("add-modal");
let modalEdit = document.getElementById("edit-modal");
let initial_pos = [3, 3, 3];

let loader = THREE.VRMLLoader();
loader.load("./bunny.wrl", function (model) {

    console.log(model);

    model.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
            console.log(child.geometry);
        }
    });

    model.scale.set(10, 10, 10);

    scene.add(model);

});

let frames = document.getElementById("frames").value;

let Shoulder = document.getElementById("shoulder");
Shoulder.addEventListener("input", Level1);

let Elbow = document.getElementById("elbow");
Elbow.addEventListener("input", Level2);

let Wrist = document.getElementById("wrist");
Wrist.addEventListener("input", Level3);

document.getElementById("shoulder").max = frames;
document.getElementById("shoulder").min = 0;
shoulder.step = 1;

document.getElementById("elbow").max = frames;
document.getElementById("elbow").min = 0;
elbow.step = 1;

document.getElementById("wrist").max = frames;
document.getElementById("wrist").min = 0;
wrist.step = 1;

let ShldPrev = 0,
    ElbwPrev = 0,
    WrstPrev = 0;

let ShldAngl = 90,
    ElbwAngl = 45,
    WrstAngl = 45;

let spanEditModal = document.getElementsByClassName("close")[0];
let scene,
    PI = 3.141592653589793,
    camera,
    renderer,
    orbit,
    shapes = [],
    grid1 = [],
    grid2 = [],
    grid3 = [],
    dragX = [],
    dragY = [],
    dragZ = [],
    dir = [],
    arrowHelper = [];

let arm_dim = new THREE.Vector3(1, 2, 1);
let arm_pos = new THREE.Vector3((arm_dim.x / 2), -(arm_dim.y / 2), 0);
let fore_dim = new THREE.Vector3(5, 0.5, 1);
let fore_pos = new THREE.Vector3((fore_dim.x / 2 + arm_dim.x / 2), (fore_dim.y / 2 - arm_dim.y / 2), 0);
let palm_dim = new THREE.Vector3(5, 1, 5);
let palm_pos = new THREE.Vector3((fore_dim.x / 2 + palm_dim.x / 2), 0, 0);

// Modal controls for Add Shape Button
let addModal = document.getElementById("add-modal");
let spanAddModal = document.getElementsByClassName("close")[1];

spanAddModal.onclick = function () {
    addModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === addModal) {
        addModal.style.display = "none";
    }
}

// Modal controls for Add Camera Button
let camModal = document.getElementById("cam-modal");
let camBtn = document.getElementById("new-cam-btn");

let span_new_cam = document.getElementsByClassName("close")[4];

camBtn.onclick = function () {
    camModal.style.display = "block";
}

span_new_cam.onclick = function () {
    camModal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === camModal) {
        camModal.style.display = "none";
    }
}

// Section of Checkboxes
// --------------------------------------------------------------------------------------------------
// lock vertices
lockVertices.addEventListener("click", () => {
    if (lockVertices.checked) {
        lock = 1;
        //console.log("hello");
        orbit.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE,
        };
        orbit.target.set(0, 0, 0);
        orbit.enableDamping = true;
    } else {
        lock = 0;
        orbit.mouseButtons = {
            //  LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE,
        };
        orbit.target.set(0, 0, 0);
        orbit.enableDamping = true;
        //
    }
});

// XY Grid
xyGrid.addEventListener("click", () => {
    if (xyGrid.checked) {
        let grid = new THREE.GridHelper(size, divisions);
        let vector3 = new THREE.Vector3(0, 0, 1);
        grid.lookAt(vector3);
        grid1.push(grid);
        scene.add(grid1[0]);
    } //
    else {
        scene.remove(grid1[0]);
        grid1.pop();
    }
});
// XZ Grid
xzGrid.addEventListener("click", () => {
    if (xzGrid.checked) {
        let grid = new THREE.GridHelper(size, divisions);
        grid.geometry.rotateZ(PI / 2);
        grid3.push(grid);
        scene.add(grid3[0]);
    } else {
        scene.remove(grid3[0]);
        grid3.pop();
        //
    }
});
// YZ Grid
yzGrid.addEventListener("click", () => {
    if (yzGrid.checked) {
        let grid = new THREE.GridHelper(size, divisions);
        let vector3 = new THREE.Vector3(0, 1, 0);
        grid.lookAt(vector3);
        grid2.push(grid);
        scene.add(grid2[0]);
    } else {
        scene.remove(grid2[0]);
        grid2.pop();
        //
    }
});
// Section of Buttons
// --------------------------------------------------------------------------------------------------

let buttons = document.getElementsByTagName("button");
const size = 50;
const divisions = 25;

document.getElementById("add-shape-btn").onclick = function () {
    modalAdd.style.display = "block";
    modalbutton2.addEventListener("click", () => {
        let xcoord = document.getElementById("x1").value;
        let ycoord = document.getElementById("y1").value;
        let zcoord = document.getElementById("z1").value;
        // alert(document.getElementById("hi").value);
        noOfShapes++;
        console.log(document.getElementById("shape-add-dropdown").value);
        if (document.querySelector("select").value == "Cube") {
            createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
        }
        if (document.querySelector("select").value == "Tetrahedron") {
            createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
        }
        if (document.querySelector("select").value == "Octahedron") {
            createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
        }
        if (document.querySelector("select").value == "Dodecahedron") {
            createDodecahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
        }
        modalAdd.style.display = "none";
    });
};

// Section of mouse control functions
// --------------------------------------------------------------------------------------------------
let raycaster = new THREE.Raycaster();
let raycaster1 = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let plane = new THREE.Plane();
let pNormal = new THREE.Vector3(0, 1, 0); // plane's normal

let planeIntersect = new THREE.Vector3(); // point of intersection with the plane
let pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
let shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
let isDragging = false;
let dragObject;
let point = [];
let shapeVertex
 = [];
let hand_comp = [];
let noOfShapes
 = 0;

document.addEventListener("dblclick", ondblclick, false);
// double click
function ondblclick(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster1.setFromCamera(mouse, camera);
    let intersects = raycaster1.intersectObjects(shapes);
    if (intersects.length > 0) {
        console.log(
            intersects[0].object.position.x,
            intersects[0].object.position.y,
            intersects[0].object.position.z
        );
        const geometry = new THREE.SphereGeometry(1, 32, 16);
        const edges = new THREE.EdgesGeometry(geometry);
        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        line.position.set(
            intersects[0].object.position.x,
            intersects[0].object.position.y,
            intersects[0].object.position.z
        );
        scene.add(line);
        document.getElementById("delete-shape-btn").onclick = function () {
            scene.remove(line);
            for (let i = 0; i < intersects.length; i++) {
                scene.remove(intersects[i].object);
                noOfShapes--;
            }
        };
        // geometry.translate(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
        document.getElementById("edit-shape-btn").onclick = function () {
            document.getElementById("edit-modal").style.display = "block";
            document.querySelector(".edit-button").addEventListener("click", () => {
                for (let i = 0; i < intersects.length; i++) {
                    scene.remove(intersects[i].object);
                    scene.remove(line);
                }
                let xcoord = document.getElementById("x").value;
                let ycoord = document.getElementById("y").value;
                let zcoord = document.getElementById("z").value;
                // alert(document.querySelector("select").value);
                noOfShapes++;
                if (document.querySelector("select").value === "Cube") {
                    createCube(xcoord, ycoord, zcoord);
                    // createCube(xcoord, ycoord, zcoord);
                }
                if (document.querySelector("select").value === "Tetrahedron") {
                    createTetrahedron(xcoord, ycoord, zcoord);
                }
                if (document.querySelector("select").value === "Octahedron") {
                    createOctahedron(xcoord, ycoord, zcoord);
                }
                if (document.querySelector("select").value === "Dodecahedron") {
                    createDodecahedron(xcoord, ycoord, zcoord);
                }
                document.getElementById("edit-modal").style.display = "none";
            });
        };
    }
}

spanEditModal.onclick = function () {
    modalEdit.style.display = "none";
};

// Shoulder
// ---------------------------------------------------------------------------------------
function Level1(e) {
    // console.log(e);
    let target = e.target ? e.target : e.srcElement;
    // console.log(target.value);
    let PrevVal = ShldPrev;

    // console.log("frames " + frames);
    // console.log( frames + " nani1 " + target.value );
    let rot_axis = new THREE.Vector3(0, 1, 0);

    let rot_angle = ((target.value - PrevVal) / (frames / 1)) * ShldAngl;
    hand_comp[0].rotateOnAxis(rot_axis, (rot_angle * PI) / 180);

    // console.log(frames, target.value);
    ShldPrev = target.value;
}

// Elbow
// ---------------------------------------------------------------------------------------
function Level2(e) {
    let target = e.target ? e.target : e.srcElement;
    let PrevVal = ElbwPrev;

    // console.log("frames " + frames);
    // console.log( frames + " nani2 " + target.value );

    let rot_axis = new THREE.Vector3(0, 0, 1);
    let rot_angle = ((target.value - PrevVal) / (frames / 1)) * ElbwAngl;
    hand_comp[1].rotateOnAxis(rot_axis, (rot_angle * PI) / 180);

    // console.log(frames, target.value);
    ElbwPrev = target.value;
}

// Wrist
// ---------------------------------------------------------------------------------------
function Level3(e) {
    let target = e.target ? e.target : e.srcElement;
    let PrevVal = WrstPrev;

    // console.log("frames " + frames);
    // console.log( frames + " nani3 " + target.value );
    let rot_axis = new THREE.Vector3(0, 0, 1);
    let rot_angle = ((target.value - PrevVal) / (frames / 1)) * WrstAngl;
    // console.log(rot_angle)
    hand_comp[2].rotateOnAxis(rot_axis, (rot_angle * PI) / 180);

    // console.log(frames, target.value);
    WrstPrev = target.value;
}

document.getElementById("frames").onchange = function () {
    let NewFrames = document.getElementById("frames").value;

    document.getElementById("shoulder").max = NewFrames;
    document.getElementById("elbow").max = NewFrames;
    document.getElementById("wrist").max = NewFrames;

    let rot_axis = new THREE.Vector3(0, 1, 0);
    let NewAngle = (frames / NewFrames) * ShldAngl;
    if (NewAngle > ShldAngl) {
        NewAngle = ShldAngl;
    }
    let OldAngle = document.getElementById("shoulder").value / (frames / 1) * ShldAngl;
    hand_comp[0].rotateOnAxis(rot_axis, ((NewAngle - OldAngle) * PI) / 180);

    rot_axis = new THREE.Vector3(0, 0, 1);
    NewAngle = (frames / NewFrames) * ElbwAngl;
    if (NewAngle > ElbwAngl) {
        NewAngle = ElbwAngl;
    }
    OldAngle = document.getElementById("elbow").value / (frames / 1) * ElbwAngl;
    hand_comp[1].rotateOnAxis(rot_axis, ((NewAngle - OldAngle) * PI) / 180);

    rot_axis = new THREE.Vector3(0, 0, 1);
    NewAngle = (frames / NewFrames) * WrstAngl;
    if (NewAngle > WrstAngl) {
        NewAngle = WrstAngl;
    }
    OldAngle = document.getElementById("wrist").value / (frames / 1) * WrstAngl;
    hand_comp[2].rotateOnAxis(rot_axis, ((NewAngle - OldAngle) * PI) / 180);

    frames = NewFrames;
};
// --------------------------------------------------------------------------------------------------

scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.x, camera.position.y, camera.position.z = cam_pos.x, cam_pos.y, cam_pos.z;
camera.updateProjectionMatrix();

// Main Function
// --------------------------------------------------------------------------------------------------
let init = function () {
    camera.position.z = 5;
    camera.position.x = 2;
    camera.position.y = 2;
    const gridHelper = new THREE.GridHelper(size, divisions);
    const count = 1;
    dir[0] = new THREE.Vector3(1, 0, 0);
    dir[1] = new THREE.Vector3(0, 1, 0);
    dir[2] = new THREE.Vector3(0, 0, 1);
    dir[3] = new THREE.Vector3(-1, 0, 0);
    dir[4] = new THREE.Vector3(0, -1, 0);
    dir[5] = new THREE.Vector3(0, 0, -1);
    //dir1.normalize();
    const origin = new THREE.Vector3(0, 0, 0);
    const length = 10;
    arrowHelper[0] = new THREE.ArrowHelper(dir[0], origin, length, "red");
    arrowHelper[1] = new THREE.ArrowHelper(dir[1], origin, length, "yellow");
    arrowHelper[2] = new THREE.ArrowHelper(dir[2], origin, length, "blue");
    arrowHelper[3] = new THREE.ArrowHelper(dir[3], origin, length, "red");
    arrowHelper[4] = new THREE.ArrowHelper(dir[4], origin, length, "yellow");
    arrowHelper[5] = new THREE.ArrowHelper(dir[5], origin, length, "blue");
    for (let i = 0; i < 6; i++) {
        scene.add(arrowHelper[i]);
    }

    let PointGeometry = createArm(scene, hand_comp, arm_dim, arm_pos, fore_dim, fore_pos, palm_dim, palm_pos);
    renderer = new THREE.WebGLRenderer();
    let container = document.getElementById("canvas-main");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    // console.log(w, h);
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.mouseButtons = {
        MIDDLE: MOUSE.DOLLY,
        RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
};
let mainLoop = function () {
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};
init();
mainLoop();
