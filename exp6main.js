import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

// importing internal files
// import { createMaterials } from "./exp1/materials.js";
import { AddCam, OldCam } from "./js/camera.js";
import { createCube, createDodecahedron, createOctahedron, createTetrahedron } from "./js/shapes.js";
import { ProjectTo2D } from "./js/2dprojection.js";
import { createArm } from "./js/mech_arm.js";
// import { scene, camera, orbit, renderer, shapes, grid1, grid2, grid3, dragx, dragy, dragz, two_geometry, two_plane, first_time, is_2D, arrowHelper } from "./js/global_vars.js";

const move_button = document.getElementById("move-button");
const modalbutton1 = document.querySelector(".buttonisprimary");
const modalbutton2 = document.querySelector(".buttonissecondary");
let threeD = document.getElementById("3d-toggle-cb");
let lock_vertices = document.getElementById("lock-vertices-cb");
let transform_axes = document.getElementById("transform-axes-cb");
let xy_grid = document.getElementById("xy-grid-cb");
let yz_grid = document.getElementById("yz-grid-cb");
let xz_grid = document.getElementById("xz-grid-cb");
let cam_pos = new THREE.Vector3(17, 15, 15);
let cam_target = new THREE.Vector3(0, 0, 0);
let modal_add = document.getElementById("add-modal");
let modal_edit = document.getElementById("edit-modal");
let initial_pos = [3,3,3];
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max = document.getElementById("finalx").value - initial_pos[0];
document.getElementById("slider").min = 0;
slider.step =(document.getElementById("slider").max - document.getElementById("slider").min) / document.getElementById("frames").value;

let final_pos = [ document.getElementById("finalx").value, document.getElementById("finaly").value, document.getElementById("finalz").value ];

let frames = document.getElementById("frames").value;

let span_edit_modal = document.getElementsByClassName("close")[0];
let deletebutton = document.getElementById("deletebutton");
let scene,
    camera,
    renderer,
    orbit,
    shapes = [],
    rot = 0.01,
    variable = 0,
    grid1 = [],
    grid2 = [],
    grid3 = [],
    dragx = [],
    dragy = [],
    dragz = [],
    dir = [],
    two_plane,
    two_geometry,
    first_time = 1,
    is_2D = 0,
    arrowHelper = [];


// Modal controls for Add Shape Button
let addModal = document.getElementById("add-modal");
let span_add_modal = document.getElementsByClassName("close")[1];

span_add_modal.onclick = function() {
    addModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === Addmodal) {
        addModal.style.display = "none";
    }
}

// Modal controls for Add Camera Button
let camModal = document.getElementById("cam-modal");
let camBtn = document.getElementById("new-cam-btn");

let span_new_cam = document.getElementsByClassName("close")[4];

camBtn.onclick = function() {
    camModal.style.display = "block";
}

span_new_cam.onclick = function() {
    camModal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target === camModal) {
        camModal.style.display = "none";
    }
}

// Section of Checkboxes
// --------------------------------------------------------------------------------------------------
// 2D
threeD.addEventListener("click", () => {
    if (threeD.checked) {
        ProjectTo2D(camera, orbit, is_2D, two_plane, first_time, two_geometry);
    } else {
        //
    }
});

// lock vertices
lock_vertices.addEventListener("click", () => {
    if (lock_vertices.checked) {
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

// Transformation
transform_axes.addEventListener("click", () => {
    if (transform_axes.checked) {
        //
    } else {
        //
    }
});

// XY Grid
xy_grid.addEventListener("click", () => {
    if (xy_grid.checked) {
        var grid = new THREE.GridHelper(size, divisions);
        var vector3 = new THREE.Vector3(0, 0, 1);
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
xz_grid.addEventListener("click", () => {
    if (xz_grid.checked) {
        var grid = new THREE.GridHelper(size, divisions);
        grid.geometry.rotateZ(Math.PI / 2);
        grid3.push(grid);
        scene.add(grid3[0]);
    } else {
        scene.remove(grid3[0]);
        grid3.pop();
        //
    }
});
// YZ Grid
yz_grid.addEventListener("click", () => {
    if (yz_grid.checked) {
        var grid = new THREE.GridHelper(size, divisions);
        var vector3 = new THREE.Vector3(0, 1, 0);
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

function NewCam(event) {
    // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
    // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
    AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3, 5, 2), new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 1);
}
document.getElementById("new-cam").onclick = function() {
    // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
    // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
    // AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3,5,2), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 1);
    alert("hi");
    let near = document.getElementById("near-coord").value;
    let far = document.getElementById("far-coord").value;
    let left = document.getElementById("left-coord").value;
    let right = document.getElementById("right-coord").value;
    let bottom = document.getElementById("bottom-coord").value;
    let top = document.getElementById("top-coord").value;

    let camera_pos = new THREE.Vector3(document.getElementById("cam-x").value, document.getElementById("cam-y").value, document.getElementById("cam-z").value);
    let target = new THREE.Vector3(document.getElementById("target-x").value, document.getElementById("target-y").value, document.getElementById("target-z").value);
    let up_vec = new THREE.Vector3(document.getElementById("up-x").value, document.getElementById("up-y").value, document.getElementById("up-z").value);
    // let ortho_persp = document.getElementById("ortho-id").value;
    let camtype = document.getElementById("cam-type").value;

    // debug
    console.log(near, far, left, right, top, bottom, camera_pos, target, up_vec, parseInt(camtype));

}

document.getElementById("add-shape-btn").onclick = function() {
    modal_add.style.display = "block";
    modalbutton2.addEventListener("click", () => {
        let xcoord = document.getElementById("x1").value;
        let ycoord = document.getElementById("y1").value;
        let zcoord = document.getElementById("z1").value;
        // alert(document.getElementById("hi").value);
        no_of_shapes++;
        console.log(document.getElementById("shape-add-dropdown").value);
        if (document.querySelector("select").value == "Cube") {
            createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
        }
        if (document.querySelector("select").value == "Tetrahedron") {
            createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
        }
        if (document.querySelector("select").value == "Octahedron") {
            createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
        }
        if (document.querySelector("select").value == "Dodecahedron") {
            createDodecahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
        }
        modal_add.style.display = "none";
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
let shapevertex = [];
let hand_comp = [];
let no_of_shapes = 0;

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
        document.getElementById("delete-shape-btn").onclick = function() {
            scene.remove(line);
            for (let i = 0; i < intersects.length; i++) {
                scene.remove(intersects[i].object);
                no_of_shapes--;
                console.log(no_of_shapes);
            }
        };
        // geometry.translate(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
        document.getElementById("edit-shape-btn").onclick = function() {
            document.getElementById("edit-modal").style.display = "block";
            document
                .querySelector(".buttonisprimary")
                .addEventListener("click", () => {
                    for (let i = 0; i < intersects.length; i++) {
                        scene.remove(intersects[i].object);
                        scene.remove(line);
                    }
                    var xcoord = document.getElementById("x").value;
                    var ycoord = document.getElementById("y").value;
                    var zcoord = document.getElementById("z").value;
                    // alert(document.querySelector("select").value);
                    no_of_shapes++;
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

span_edit_modal.onclick = function() {
    modal_edit.style.display = "none";
};

// Slider Implementation
// ---------------------------------------------------------------------------------------
function movePoint(e) {
    var target = e.target ? e.target : e.srcElement;
  
    
  }
  
  document.getElementById("finalx").onchange = function () {
    
  };
  document.getElementById("finaly").onchange = function () {
    
  };
  document.getElementById("finalz").onchange = function () {
   
  };
  document.getElementById("frames").onchange = function () {
  };
  // --------------------------------------------------------------------------------------------------

move_button.addEventListener("click", () => {
    
});


scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.x, camera.position.y, camera.position.z = cam_pos.x, cam_pos.y, cam_pos.z;
camera.updateProjectionMatrix();


// Main Function
// --------------------------------------------------------------------------------------------------
let init = function() {
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
    let PointGeometry = createArm(scene, hand_comp);
    renderer = new THREE.WebGLRenderer();
    let container = document.getElementById("canvas-main");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    console.log(w, h);
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
let mainLoop = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};
init();
mainLoop();
