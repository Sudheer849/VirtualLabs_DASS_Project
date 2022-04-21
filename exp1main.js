"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

import {
    createCube,
    createDodecahedron,
    createOctahedron,
    createTetrahedron
} from "./js/shapes.js";
import { dot } from "./js/point.js";

const moveButton = document.getElementById("move-button");
let lockVertices = document.getElementById("lock-vertices-cb");
let xyGrid = document.getElementById("xy-grid-cb");
let yzGrid = document.getElementById("yz-grid-cb");
let xzGrid = document.getElementById("xz-grid-cb");

let modalAdd = document.getElementById("add-modal");
let modalEdit = document.getElementById("edit-modal");

let spanEditModal = document.getElementsByClassName("close")[0];
let container = document.getElementById("canvas-main");
let scene,
  PI = 3.141592653589793,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  xygrid = [],
  yzgrid = [],
  xzgrid = [],
  dragX = [],
  dragY = [],
  dragZ = [],
  initialPos = [3, 3, 3],
  lock = 0,
  scale = 1,
  arrowHelper = [],
  dir = [],
  noOfShapes = 0,
  isShapeExist = 0;
let dbl = 0;

lockVertices.addEventListener("click", () => {
  if (lockVertices.checked) {
    lock = 1;
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
      MIDDLE: MOUSE.DOLLY,
      RIGHT: MOUSE.ROTATE,
    };
    orbit.target.set(0, 0, 0);
    orbit.enableDamping = true;
  }
});

xyGrid.addEventListener("click", () => {
  if (xyGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 0, 1);
    grid.lookAt(vector3);
    xygrid.push(grid);
    scene.add(xygrid[0]);
  }
  else {
    scene.remove(xygrid[0]);
    xygrid.pop();
  }
});

xzGrid.addEventListener("click", () => {
  if (xzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(PI / 2);
    xzgrid.push(grid);
    scene.add(xzgrid[0]);
  } else {
    scene.remove(xzgrid[0]);
    xzgrid.pop();
  }
});

yzGrid.addEventListener("click", () => {
  if (yzGrid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    let vector3 = new THREE.Vector3(0, 1, 0);
    grid.lookAt(vector3);
    yzgrid.push(grid);
    scene.add(yzgrid[0]);
  } else {
    scene.remove(yzgrid[0]);
    yzgrid.pop();
  }
});

const size = 50;
const divisions = 25;

let spanAddModal = document.getElementsByClassName("close")[1];

spanAddModal.onclick = function () {
  modalAdd.style.display = "none";
};

document.getElementById("add-shape-btn").onclick = function () {
  modalAdd.style.display = "block";
  document.querySelector(".add-button").onclick = function () {
    let xcoord = document.getElementById("x1").value;
    let ycoord = document.getElementById("y1").value;
    let zcoord = document.getElementById("z1").value;

    noOfShapes++;
    isShapeExist = 1;
    if (document.getElementById("shape-add-dropdown").value === "Cube") {
      createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapeVertex
        , dragX, dragY, dragZ);
      createCube(xcoord, ycoord, zcoord, shapes, scene, point, shapevertex, dragx, dragy, dragz);
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
  };
};
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let plane = new THREE.Plane();
let pNormal = new THREE.Vector3(0, 1, 0);

let planeIntersect = new THREE.Vector3();
let pIntersect = new THREE.Vector3();
let shift = new THREE.Vector3();
let isDragging = false;
let dragObject;
let point = [];
let shapeVertex
  = [];
let dotList = [];
let isDeleted = [];
for (let i = 0; i < 1000; i++) {
  isDeleted.push(0);
}

document.getElementById("canvas-main").ondblclick = function (event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    mouse.x = (x / container.clientWidth) * 2 - 1;
    mouse.y = (y / container.clientHeight) * -2 + 1;
  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(shapes);
  let shapeIntersects = 0;
  for (let i = 0; i < intersects.length; i++) {
    if ((intersects[i].object.name === "cube" || intersects[i].object.name === "tetrahedron" || intersects[i].object.name === "octahedron" || intersects[i].object.name === "dodecahedron")) {
      shapeIntersects++;
    }
  }
  if (shapeIntersects != 0) {
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
      //   for(let i=0;i<intersects.length;i++){
      //   }
      for (let i = 0; i < intersects.length; i++) {
        if ((intersects[i].object.name === "cube" || intersects[i].object.name === "tetrahedron" || intersects[i].object.name === "octahedron" || intersects[i].object.name === "dodecahedron")) {
          noOfShapes--;
          scene.remove(intersects[i].object);
        }
      }
    };

    document.getElementById("edit-shape-btn").onclick = function () {
      if (noOfShapes != 0) {
        document.getElementById("edit-modal").style.display = "block";
      }
    };
    document.querySelector(".edit-button").onclick = function () {
      let intersecting_shapes = 0;
      for (let i = 0; i < intersects.length; i++) {
        if ((intersects[i].object.name === "cube" || intersects[i].object.name === "tetrahedron" || intersects[i].object.name === "octahedron" || intersects[i].object.name === "dodecahedron")) {
          intersecting_shapes++;
        }
        scene.remove(intersects[i].object);
        scene.remove(line);
      }
      let xcoord = document.getElementById("x").value;
      let ycoord = document.getElementById("y").value;
      let zcoord = document.getElementById("z").value;

      if (intersecting_shapes != 0) {
        for (let i = 0; i < intersecting_shapes; i++) {
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
        }
      }
      document.getElementById("edit-modal").style.display = "none";
    };
  }
};

document.getElementById("h-s").onchange = function() {
    scale = document.getElementById("h-s").value;

  document.getElementById("h-x").value =
    document.getElementById("x-value").value * scale;
  document.getElementById("h-y").value =
    document.getElementById("y-value").value * scale;
  document.getElementById("h-z").value =
    document.getElementById("z-value").value * scale;
};

spanEditModal.onclick = function () {
  modalEdit.style.display = "none";
};

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
        shapeVertex
        [i].position.set(
          planeIntersect.x + shift.x - dragX[i],
          planeIntersect.y + shift.y - dragY[i],
          planeIntersect.z + shift.z - dragZ[i]
        );
      }
      raycaster.ray.intersectPlane(plane, planeIntersect);
      dotList[0].position.set(
        planeIntersect.x + shift.x,
        planeIntersect.y + shift.y,
        planeIntersect.z + shift.z
      );
      document.getElementById("x-value").value = ( (dotList[0].position.x + initialPos[0]) * scale).toFixed(2);
      document.getElementById("y-value").value = ( (dotList[0].position.y + initialPos[1]) * scale).toFixed(2);
      document.getElementById("z-value").value = ( (dotList[0].position.z + initialPos[2]) * scale).toFixed(2);

      let c_x = document.getElementById("x-value").value * scale;
      let c_y = document.getElementById("y-value").value * scale;
      let c_z = document.getElementById("z-value").value * scale;

      document.getElementById("h-x").value = c_x.toFixed(2);
      document.getElementById("h-y").value = c_y.toFixed(2);
      document.getElementById("h-z").value = c_z.toFixed(2);
    }
}
});

document.addEventListener("pointerdown", () => {
  switch (event.which) {
    case 1:
      const rect = renderer.domElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      mouse.x = (x / container.clientWidth) * 2 - 1;
      mouse.y = (y / container.clientHeight) * -2 + 1;
      if (mouse.x < 1 && mouse.x > -1 && mouse.y < 1 && mouse.y > -1) {
        pNormal.copy(camera.position).normalize();
        plane.setFromNormalAndCoplanarPoint(pNormal, scene.position);
        raycaster.setFromCamera(mouse, camera);
        raycaster.ray.intersectPlane(plane, planeIntersect);
        shift.subVectors(dotList[0].position, planeIntersect);
        isDragging = true;
        dragObject = shapes[shapes.length - 1];
        break;
      }
  }
});

document.addEventListener("pointerup", () => {
    isDragging = false;
    dragObject = null;
});

moveButton.addEventListener("click", () => {
  let x = document.getElementById("x-value").value;
  let y = document.getElementById("y-value").value;
  let z = document.getElementById("z-value").value;
  dotList[0].position.set(
    x - initialPos[0],
    y - initialPos[1],
    z - initialPos[2]
  );

  document.getElementById("h-x").value = x * scale;
  document.getElementById("h-y").value = y * scale;
  document.getElementById("h-z").value = z * scale;
});

scene = new THREE.Scene();
scene.background = new THREE.Color(0x121212);
camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1000
);

let init = function () {
  camera.position.z = 5;
  camera.position.x = 2;
  camera.position.y = 2;
  const gridHelper = new THREE.GridHelper(size, divisions);
  const count = 1;
  let dir_x = new THREE.Vector3(1, 0, 0);
  let dir_y = new THREE.Vector3(0, 1, 0);
  let dir_z = new THREE.Vector3(0, 0, 1);
  let negdir_x = new THREE.Vector3(-1, 0, 0);
  let negdir_y = new THREE.Vector3(0, -1, 0);
  let negdir_z = new THREE.Vector3(0, 0, -1);
  const origin = new THREE.Vector3(0, 0, 0);
  const length = 10;
  arrowHelper[0] = new THREE.ArrowHelper(dir_x, origin, length, "red");
  arrowHelper[1] = new THREE.ArrowHelper(dir_y, origin, length, "yellow");
  arrowHelper[2] = new THREE.ArrowHelper(dir_z, origin, length, "blue");
  arrowHelper[3] = new THREE.ArrowHelper(negdir_x, origin, length, "red");
  arrowHelper[4] = new THREE.ArrowHelper(negdir_y, origin, length, "yellow");
  arrowHelper[5] = new THREE.ArrowHelper(negdir_z, origin, length, "blue");
  const numbers = [0, 1, 2, 3, 4, 5];
  arrowHelper.forEach(axis => scene.add(axis))
  let PointGeometry = dot(scene, dotList, initialPos);
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
let mainLoop = function() {
    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};
init();
mainLoop();