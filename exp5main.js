"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
import { createCube, createDodecahedron, createOctahedron, createTetrahedron } from "./js/shapes.js";
import { Triangle } from "./js/Triangle.js";

const moveButton = document.getElementById("move-button");
const modalbutton1 = document.querySelector(".edit-button");
const modalbutton2 = document.querySelector(".add-button");
let lockVertices = document.getElementById("lock-vertices-cb");
let xyGrid = document.getElementById("xy-grid-cb");
let yzGrid = document.getElementById("yz-grid-cb");
let xzGrid = document.getElementById("xz-grid-cb");

let modalAdd = document.getElementById("add-modal");
let modalEdit = document.getElementById("edit-modal");
let initial_pos = [3, 3, 3];
let spanEditModal = document.getElementsByClassName("close")[0];
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max = document.getElementById("frames").value;
document.getElementById("slider").min = 0;
slider.step = 1;

let trans_matrix = new THREE.Matrix4();
trans_matrix.set( 
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
); 

let max_x_scale = document.getElementById("scale-x").value;
let max_y_scale = document.getElementById("scale-y").value;
let max_z_scale = document.getElementById("scale-z").value;

let vertexA = new THREE.Vector3( document.getElementById("vertex-00").value, document.getElementById("vertex-01").value, document.getElementById("vertex-02").value ),
    vertexB = new THREE.Vector3( document.getElementById("vertex-10").value, document.getElementById("vertex-11").value, document.getElementById("vertex-12").value ),
    vertexC = new THREE.Vector3( document.getElementById("vertex-20").value, document.getElementById("vertex-21").value, document.getElementById("vertex-22").value );

let old_scale = [1, 1, 1];

let frames = document.getElementById("frames").value;
let present_theta = 0;
let scene,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  vargrid1 = 0,
  vargrid2 = 0,
  vargrid3 = 0,
  grid1 = [],
  grid2 = [],
  grid3 = [],
  dragX = [],
  dragY = [],
  dragZ = [],
  lock = 0,
  dir = [],
  arrowHelper = [];

// Modal controls for Add Shape Button
let addModal = document.getElementById("add-modal");
let spanAddModal = document.getElementsByClassName("close")[1];

spanAddModal.onclick = function () {
  addModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === addModal) {
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

// XY Grid
xyGrid.addEventListener("click", () => {
  if (xyGrid.checked) {
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
xzGrid.addEventListener("click", () => {
  if (xzGrid.checked) {
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
yzGrid.addEventListener("click", () => {
  if (yzGrid.checked) {
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

document.getElementById("add-shape-btn").onclick = function () {
  modalAdd.style.display = "block";
  modalbutton2.addEventListener("click", () => {
    let xcoord = document.getElementById("x1").value;
    let ycoord = document.getElementById("y1").value;
    let zcoord = document.getElementById("z1").value;
    noOfShapes++;
    console.log(document.getElementById("shape-add-dropdown").value);
    if (document.getElementById("shape-add-dropdown").value === "Cube") {
      createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
    }
    if (document.getElementById("shape-add-dropdown").value === "Tetrahedron") {
      createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
    }
    if (document.getElementById("shape-add-dropdown").value === "Octahedron") {
      createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
    }
    if (document.getElementById("shape-add-dropdown").value === "Dodecahedron") {
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
let dotList = [];
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
    const geometry = new THREE.SphereGeometry(1, 32, 16);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    line.position.set( intersects[0].object.position.x, intersects[0].object.position.y, intersects[0].object.position.z
    );
    scene.add(line);
    document.getElementById("delete-shape-btn").onclick = function () {
      scene.remove(line);
      for (let i = 0; i < intersects.length; i++) {
        scene.remove(intersects[i].object);
        noOfShapes--;
      }
    };

    document.getElementById("edit-shape-btn").onclick = function () {
      document.getElementById("edit-modal").style.display = "block";
      document
        .querySelector(".edit-button")
        .addEventListener("click", () => {
          for (let i = 0; i < intersects.length; i++) {
            scene.remove(intersects[i].object);
            scene.remove(line);
          }
          var xcoord = document.getElementById("x").value;
          var ycoord = document.getElementById("y").value;
          var zcoord = document.getElementById("z").value;
          // alert(document.querySelector("select").value);
          noOfShapes++;
          if (document.querySelector("select").value === "Cube") {
            createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
          }
          if (document.querySelector("select").value === "Tetrahedron") {
            createTetrahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
          }
          if (document.querySelector("select").value === "Octahedron") {
            createOctahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
          }
          if (document.querySelector("select").value === "Dodecahedron") {
            createDodecahedron(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
, dragX, dragY, dragZ);
          }
          document.getElementById("edit-modal").style.display = "none";
        });
    };
  }
}

spanEditModal.onclick = function () {
  modalEdit.style.display = "none";
};

// mouse drag
document.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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
      shapeVertex
[i].position.set(
        planeIntersect.x + shift.x - dragX[i],
        planeIntersect.y + shift.y - dragY[i],
        planeIntersect.z + shift.z - dragZ[i]
      );
    }

  } else if (isDragging) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
  }
});

// mouse click

document.addEventListener("pointerdown", () => {
  switch (event.which) {
    case 1:
      //  Left mouse button pressed
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      pNormal.copy(camera.position).normalize();
      plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
      raycaster.setFromCamera(mouse, camera);
      raycaster.ray.intersectPlane(plane, planeIntersect);
      shift.subVectors(dotList[0].geometry.getAttribute('position').array, planeIntersect);
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

// Slider Implementation
// ---------------------------------------------------------------------------------------
function movePoint(e) {
    var target = e.target ? e.target : e.srcElement;
    let scale = new Array();
    scale[0] = 1 + (target.value/frames)*( max_x_scale - 1);
    scale[1] = 1 + (target.value/frames)*( max_y_scale - 1);
    scale[2] = 1 + (target.value/frames)*( max_z_scale - 1);

    let scale_m = new THREE.Matrix4();
    scale_m.makeScale(scale[0]/old_scale[0], scale[1]/old_scale[1], scale[2]/old_scale[2] );

    dotList[0].geometry.applyMatrix4(scale_m);
    dotList[0].geometry.verticesNeedUpdate = true;
    
    for( let i = 0; i < 3; i++)
        old_scale[i] = scale[i];    

    trans_matrix.multiply(scale_m);

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
}

document.getElementById("frames").onchange = function () {
  let new_value = document.getElementById("frames").value; // new value
  // slider adjusts according to the new number of frames

  let new_factor = [frames/new_value, frames/new_value, frames/new_value];
  for( let i = 0; i < 3; i++ )
  {
    if( old_scale[i] === 1 )
    {
      new_factor[i] = 1;
    }
  }

  let scale_m = new THREE.Matrix4();
  scale_m.makeScale( new_factor[0], new_factor[1], new_factor[2] );
  dotList[0].geometry.applyMatrix4(scale_m);
  dotList[0].geometry.verticesNeedUpdate = true;

  for( let i = 0; i < 3; i++)
      old_scale[i] *= frames/new_value;

  trans_matrix.multiply(scale_m);
  document.getElementById("matrix-00").value = trans_matrix.elements[0];
  document.getElementById("matrix-11").value = trans_matrix.elements[5];
  document.getElementById("matrix-22").value = trans_matrix.elements[10];
  
  document.getElementById("slider").max = new_value;
  // setTimeout( () => {console.log('waiting');}, 2000 );
};

document.getElementById("scale-x").onchange = function () {
  let new_scale = document.getElementById("scale-x").value;
  // scale x component of each point of buffergeometry by new_scale/x_scale amount. 
  if( old_scale[0] !== 1 )
  {
    let scale_m = new THREE.Matrix4();
    scale_m.makeScale( new_scale/max_x_scale, 1, 1 );
    dotList[0].geometry.applyMatrix4(scale_m);
    dotList[0].geometry.verticesNeedUpdate = true;
  
    old_scale[0] *= new_scale/max_x_scale;

    trans_matrix.multiply(scale_m);
    document.getElementById("matrix-00").value = trans_matrix.elements[0];
  }

  max_x_scale = new_scale;
};
document.getElementById("scale-y").onchange = function () {
  let new_scale = document.getElementById("scale-y").value;
  // scale x component of each point of buffergeometry by new_scale/x_scale amount. 
  if( old_scale[1] !== 1)
  {
    let scale_m = new THREE.Matrix4();
    scale_m.makeScale( 1, new_scale/max_y_scale, 1 );
    dotList[0].geometry.applyMatrix4(scale_m);
    dotList[0].geometry.verticesNeedUpdate = true;
  
    old_scale[1] *= new_scale/max_y_scale;

    trans_matrix.multiply(scale_m);
    document.getElementById("matrix-11").value = trans_matrix.elements[5];
  }

  max_y_scale = new_scale;
};
document.getElementById("scale-z").onchange = function () {
  let new_scale = document.getElementById("scale-z").value;
  // scale x component of each point of buffergeometry by new_scale/x_scale amount. 
  if( old_scale[2] !== 1)
  {
    let scale_m = new THREE.Matrix4();
    scale_m.makeScale( 1, 1, new_scale/max_z_scale );
    dotList[0].geometry.applyMatrix4(scale_m);
    dotList[0].geometry.verticesNeedUpdate = true;

    old_scale[2] *= new_scale/max_z_scale;

    trans_matrix.multiply(scale_m);
    document.getElementById("matrix-22").value = trans_matrix.elements[10];
  }

  max_z_scale = new_scale;
}

// Function for Lights
function createLights() {
  // Create a directional light
  const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 9);
  const mainLight = new THREE.DirectionalLight(0xffffff, 3.0);
  scene.add(ambientLight);

  // move the light back and up a bit
  mainLight.position.set(10, 10, 10);

  // remember to add the light to the scene
  scene.add(ambientLight, mainLight);
}

scene = new THREE.Scene();
// scene.background = new THREE.Color(0x36393e);
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera(
  30,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
// Materials Function

function createMaterials() {
  const cubeShader = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { type: "vec3", value: new THREE.Color(0xff0000) },
      colorB: { type: "vec3", value: new THREE.Color(0x0000ff) },
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });

  return {
    cubeShader,
  };
}
// Geometries Function
function createGeometries() {
  const cube = new THREE.BoxGeometry(1, 1, 1);
  return {
    cube,
  };
}
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
  let tri_geo = Triangle(vertexA, vertexB, vertexC,scene, dotList);
  renderer = new THREE.WebGLRenderer();
  let container = document.getElementById("canvas-main");
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
  //console.log(scene.children);
  if (variable === 1) {
    for (let cub of cube) {
      cub.rotation.y += rot;
      if (cub.position.x <= -3 || cub.position.x >= 3) rot *= -1;
    }
  }

  // orbit.update();
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};
init();
mainLoop();
