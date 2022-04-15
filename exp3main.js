import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

import { AddCam, OldCam } from "./js/camera.js";
import {
  createCube,
  createDodecahedron,
  createOctahedron,
  createTetrahedron,
} from "./js/shapes.js";
import { ProjectTo2D } from "./js/2dprojection.js";
import { Dot } from "./js/point.js";

const move_button = document.getElementById("move-button");
const set_rotation_axis = document.getElementById("set-rotation-axis");
const modalbutton1 = document.querySelector(".buttonisprimary");
const modalbutton2 = document.querySelector(".buttonissecondary");
let threeD = document.getElementById("3d-toggle-cb");
let lock_vertices = document.getElementById("lock-vertices-cb");
let transform_axes = document.getElementById("transform-axes-cb");
let xy_grid = document.getElementById("xy-grid-cb");
let yz_grid = document.getElementById("yz-grid-cb");
let xz_grid = document.getElementById("xz-grid-cb");
let modal_add = document.getElementById("add-modal");
let modal_edit = document.getElementById("edit-modal");
let container = document.getElementById("canvas-main");
let initial_pos = [3, 3, 3];
let span_edit_modal = document.getElementsByClassName("close")[0];
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max = document.getElementById("theta").value;
document.getElementById("slider").min = 0;
slider.step =
  (document.getElementById("slider").max -
    document.getElementById("slider").min) /
  document.getElementById("frames").value;

let rot_axis = new THREE.Vector3(
  document.getElementById("x-comp").value,
  document.getElementById("y-comp").value,
  document.getElementById("z-comp").value
);
// convert axis to unit vector
rot_axis.normalize();
// console.log("normalised axis ", rot_axis);

let total_angle = document.getElementById("theta").value;
let frames = document.getElementById("frames").value;
let deletebutton = document.getElementById("deletebutton");
let present_theta = 0;
let scene,
  camera,
  renderer,
  orbit,
  shapes = [],
  grid1 = [],
  grid2 = [],
  grid3 = [],
  dragx = [],
  dragy = [],
  dragz = [],
  lock = 0,
  dir = [],
  two_plane,
  two_geometry,
  first_time = 1,
  is_2D = 0,
  arrowHelper = [];

let trans_matrix = new THREE.Matrix4();
trans_matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);

// Modal controls for Add Shape Button
let addModal = document.getElementById("add-modal");
let span_add_modal = document.getElementsByClassName("close")[1];

span_add_modal.onclick = function () {
  addModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === Addmodal) {
    addModal.style.display = "none";
  }
};

// Modal controls for Add Camera Button
let camModal = document.getElementById("cam-modal");
let camBtn = document.getElementById("new-cam-btn");

let span_new_cam = document.getElementsByClassName("close")[4];

camBtn.onclick = function () {
  camModal.style.display = "block";
};

span_new_cam.onclick = function () {
  camModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === camModal) {
    camModal.style.display = "none";
  }
};

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
    orbit.dampingFactor = 0.05;
    orbit.enableDamping = true;
  } else {
    lock = 0;
    orbit.mouseButtons = {
      //  LEFT: MOUSE.PAN,
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.dampingFactor = 0.05;
    orbit.enableDamping = true;
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
  AddCam(
    0.01,
    100,
    -3.2,
    3.2,
    -2.4,
    2.4,
    new THREE.Vector3(3, 5, 2),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 1, 0),
    1
  );
}

document.getElementById("new-cam").onclick = function () {
  // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  // AddCam(0.1, 1000, -10, -10, -10, 10, new THREE.Vector3(7,-6,2), new THREE.Vector3(1,1,1), new THREE.Vector3(1,0,1), 0);
  // AddCam(0.01, 100, -3.2, 3.2, -2.4, 2.4, new THREE.Vector3(3,5,2), new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 1);

  let near = document.getElementById("near-coord").value;
  let far = document.getElementById("far-coord").value;
  let left = document.getElementById("left-coord").value;
  let right = document.getElementById("right-coord").value;
  let bottom = document.getElementById("bottom-coord").value;
  let top = document.getElementById("top-coord").value;

  let camera_pos = new THREE.Vector3(
    document.getElementById("cam-x").value,
    document.getElementById("cam-y").value,
    document.getElementById("cam-z").value
  );
  let target = new THREE.Vector3(
    document.getElementById("target-x").value,
    document.getElementById("target-y").value,
    document.getElementById("target-z").value
  );
  let up_vec = new THREE.Vector3(
    document.getElementById("up-x").value,
    document.getElementById("up-y").value,
    document.getElementById("up-z").value
  );
  let camtype = document.getElementById("cam-type").value;

  // debug
  // console.log(near, far, left, right, top, bottom, camera_pos, target, up_vec, parseInt(camtype));

  AddCam(
    parseFloat(near),
    parseFloat(far),
    parseFloat(left),
    parseFloat(right),
    parseFloat(top),
    parseFloat(bottom),
    camera_pos,
    target,
    up_vec,
    parseInt(camtype)
  );
};

document.getElementById("add-shape-btn").onclick = function () {
  modal_add.style.display = "block";
  modalbutton2.addEventListener("click", () => {
    let xcoord = document.getElementById("x1").value;
    let ycoord = document.getElementById("y1").value;
    let zcoord = document.getElementById("z1").value;
    no_of_shapes++;
    console.log(document.getElementById("shape-add-dropdown").value);
    if (document.getElementById("shape-add-dropdown").value === "Cube") {
      createCube( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz );
    }
    if (document.getElementById("shape-add-dropdown").value === "Tetrahedron") {
      createTetrahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz );
    }
    if (document.getElementById("shape-add-dropdown").value === "Octahedron") {
      createOctahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz );
    }
    if (document.getElementById("shape-add-dropdown").value === "Dodecahedron") {
      createDodecahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz );
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
let dot_list = [];
let no_of_shapes = 0;

document.addEventListener("dblclick", ondblclick, false);
// double click
function ondblclick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster1.setFromCamera(mouse, camera);
  let intersects = raycaster1.intersectObjects(shapes);
  if (intersects.length > 0) {
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
        no_of_shapes--;
        console.log(no_of_shapes);
      }
    };

    document.getElementById("edit-shape-btn").onclick = function () {
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
            createCube( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value === "Tetrahedron") {
            createTetrahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value === "Octahedron") {
            createOctahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          if (document.querySelector("select").value === "Dodecahedron") {
            createDodecahedron( xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
          }
          document.getElementById("edit-modal").style.display = "none";
        });
    };
  }
}

span_edit_modal.onclick = function () {
  modal_edit.style.display = "none";
};

// mouse drag
document.addEventListener("pointermove", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  mouse.x = (x / container.clientWidth) * 2 - 1;
  mouse.y = (y / container.clientHeight) * -2 + 1;
  if (mouse.x < 1 && mouse.x > -1 && mouse.y < 1 && mouse.y > -1) {
    raycaster.setFromCamera(mouse, camera);
    if (isDragging && lock === 0) {
      for (let i = 0; i < shapes.length; i++) {
        raycaster.ray.intersectPlane(plane, planeIntersect);
        shapes[i].geometry.vertices[0].set(
          planeIntersect.x + shift.x,
          planeIntersect.y + shift.y,
          planeIntersect.z + shift.z
        );
        shapes[i].geometry.verticesNeedUpdate = true;
        shapevertex[i].position.set(
          planeIntersect.x + shift.x - dragx[i],
          planeIntersect.y + shift.y - dragy[i],
          planeIntersect.z + shift.z - dragz[i]
        );
      }
      raycaster.ray.intersectPlane(plane, planeIntersect);
    } else if (isDragging) {
      raycaster.ray.intersectPlane(plane, planeIntersect);
    }
  }
});

// mouse click

document.addEventListener("pointerdown", () => {
  switch (event.which) {
    case 1:
      //  Left mouse button pressed
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / container.clientWidth) * 2 - 1;
      mouse.y = (y / container.clientHeight) * -2 + 1;
      pNormal.copy(camera.position).normalize();
      plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      // shift.subVectors(dot_list[0].geometry.getAttribute('position').array, planeIntersect);
      let position = new THREE.Vector3(
        shapevertex[0].position.x,
        shapevertex[0].position.y,
        shapevertex[0].position.z
      );
      // position.x = shapevertex[0].position.x;
      // position.y = shapevertex[0].position.y;
      // position.z =  shapevertex[0].position.z;

      // console.log(position)
      shift.subVectors(position, planeIntersect);
      isDragging = true;
      dragObject = shapes[shapes.length - 1];
      break;
  }
});
// mouse release
document.addEventListener("pointerup", () => {
  isDragging = false;
  dragObject = null;
});
move_button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  //console.log(dot_list[0].geometry.getAttribute('position').array[0]);
  console.log(x, y, z);
  let translate_M = new THREE.Matrix4();
  translate_M.makeTranslation(x - dot_list[0].geometry.getAttribute('position').array[0], y - dot_list[0].geometry.getAttribute('position').array[1], z - dot_list[0].geometry.getAttribute('position').array[2]);
  // console.log(translate_M);
  dot_list[0].geometry.applyMatrix4(translate_M);
  dot_list[0].geometry.verticesNeedUpdate = true;
  trans_matrix.multiply(translate_M);
  initial_pos[0] = x
  initial_pos[1] = y
  initial_pos[2] = z
  console.log(dot_list[0].geometry.getAttribute('position').array[0], dot_list[0].geometry.getAttribute('position').array[1], dot_list[0].geometry.getAttribute('position').array[2]);
});

// Slider Implementation
// ---------------------------------------------------------------------------------------
function movePoint(e) {
  var target = e.target ? e.target : e.srcElement;
  let rot_angle = (target.value * parseFloat(document.getElementById("theta").value)) /target.max - present_theta;

  let quat = new THREE.Quaternion();
  let rot_matrix = new THREE.Matrix4();
  quat.setFromAxisAngle(rot_axis, (rot_angle * Math.PI) / 180);
  rot_matrix.makeRotationFromQuaternion(quat);

  dot_list[0].geometry.applyMatrix4(rot_matrix);
  dot_list[0].geometry.verticesNeedUpdate = true;

  trans_matrix.multiply(rot_matrix);

  document.getElementById("quantityx").value =
    dot_list[0].geometry.getAttribute("position").array[0];
  document.getElementById("quantityy").value =
    dot_list[0].geometry.getAttribute("position").array[1];
  document.getElementById("quantityz").value =
    dot_list[0].geometry.getAttribute("position").array[2];

  if (target.value <= 0) {
    trans_matrix.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
  }

  document.getElementById("matrix-00").value = trans_matrix.elements[0];
  document.getElementById("matrix-01").value = trans_matrix.elements[1];
  document.getElementById("matrix-02").value = trans_matrix.elements[2];
  document.getElementById("matrix-03").value = trans_matrix.elements[3];

  document.getElementById("matrix-10").value = trans_matrix.elements[4];
  document.getElementById("matrix-11").value = trans_matrix.elements[5];
  document.getElementById("matrix-12").value = trans_matrix.elements[6];
  document.getElementById("matrix-13").value = trans_matrix.elements[7];

  document.getElementById("matrix-20").value = trans_matrix.elements[8];
  document.getElementById("matrix-21").value = trans_matrix.elements[9];
  document.getElementById("matrix-22").value = trans_matrix.elements[10];
  document.getElementById("matrix-23").value = trans_matrix.elements[11];

  document.getElementById("matrix-30").value = trans_matrix.elements[12];
  document.getElementById("matrix-31").value = trans_matrix.elements[13];
  document.getElementById("matrix-32").value = trans_matrix.elements[14];
  document.getElementById("matrix-33").value = trans_matrix.elements[15];

  present_theta += rot_angle;
}

document.getElementById("frames").onchange = function () {
  let new_value = document.getElementById("frames").value; // new value

  let quat = new THREE.Quaternion();
  let rot_matrix = new THREE.Matrix4();
  let rot_angle = slider.value * (frames / new_value - 1); // , (slider.max - slider.value)* Math.PI / 180 );
  if (rot_angle + present_theta > total_angle)
    rot_angle = total_angle - present_theta;

  quat.setFromAxisAngle(rot_axis, (rot_angle * Math.PI) / 180);
  // console.log( slider.value, frames, new_value );

  rot_matrix.makeRotationFromQuaternion(quat);
  dot_list[0].geometry.applyMatrix4(rot_matrix);
  dot_list[0].geometry.verticesNeedUpdate = true;

  document.getElementById("quantityx").value =
    dot_list[0].geometry.getAttribute("position").array[0];
  document.getElementById("quantityy").value =
    dot_list[0].geometry.getAttribute("position").array[1];
  document.getElementById("quantityz").value =
    dot_list[0].geometry.getAttribute("position").array[2];

  present_theta += slider.value * (frames / new_value - 1);

  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    new_value;
  let no_of_frames = frames * (slider.value / slider.max);
  slider.value =
    document.getElementById("slider").max * (no_of_frames / new_value);
  //  document.getElementById("slider").value =  * (new_value/frames)
  frames = new_value;
};

document.getElementById("theta").onchange = function () {
  let old_sli_val = document.getElementById("slider").value;
  let new_tot_angle = document.getElementById("theta").value; // new value
  let new_theta = present_theta * (new_tot_angle / total_angle);
  if (new_theta > total_angle) new_theta = total_angle;

  // console.log( new_theta, present_theta );
  let quat = new THREE.Quaternion();
  let rot_matrix = new THREE.Matrix4();
  quat.setFromAxisAngle(
    rot_axis,
    ((new_theta - present_theta) * Math.PI) / 180
  );
  rot_matrix.makeRotationFromQuaternion(quat);

  dot_list[0].geometry.applyMatrix4(rot_matrix);
  dot_list[0].geometry.verticesNeedUpdate = true;

  document.getElementById("quantityx").value =
    dot_list[0].geometry.getAttribute("position").array[0];
  document.getElementById("quantityy").value =
    dot_list[0].geometry.getAttribute("position").array[1];
  document.getElementById("quantityz").value =
    dot_list[0].geometry.getAttribute("position").array[2];

  document.getElementById("slider").value =
    old_sli_val * (new_tot_angle / total_angle);
  total_angle = new_tot_angle;
  document.getElementById("slider").max = new_tot_angle;
  slider.step =
    (document.getElementById("slider").max -
      document.getElementById("slider").min) /
    frames;
  // console.log( document.getElementById("slider").value, old_sli_val, new_tot_angle, total_angle );
  present_theta = new_theta;
};

set_rotation_axis.addEventListener("click", () => {
  rot_axis = new THREE.Vector3(
    parseFloat(document.getElementById("x-comp").value),
    parseFloat(document.getElementById("y-comp").value),
    parseFloat(document.getElementById("z-comp").value)
  );
});
// --------------------------------------------------------------------------------------------------

// Creating scene
scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);

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
  let PointGeometry = Dot(scene, dot_list, initial_pos);
  renderer = new THREE.WebGLRenderer();
  let w = container.offsetWidth;
  let h = container.offsetHeight;
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
