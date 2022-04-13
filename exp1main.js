import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";

import {
  createCube,
  createDodecahedron,
  createOctahedron,
  createTetrahedron
} from "./js/shapes.js";
import { Dot } from "./js/point.js";

const move_button = document.getElementById("move-button");
let threeD = document.getElementById("3d-toggle-cb");
let lock_vertices = document.getElementById("lock-vertices-cb");
let transform_axes = document.getElementById("transform-axes-cb");
let xy_grid = document.getElementById("xy-grid-cb");
let yz_grid = document.getElementById("yz-grid-cb");
let xz_grid = document.getElementById("xz-grid-cb");

let modal_add = document.getElementById("add-modal");
let modal_edit = document.getElementById("edit-modal");

let span_edit_modal = document.getElementsByClassName("close")[0];
let deletebutton = document.getElementById("deletebutton");
let container = document.getElementById("canvas-main");
let scene,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  xygrid = [],
  yzgrid = [],
  xzgrid = [],
  dragx = [],
  dragy = [],
  dragz = [],
  initial_pos = [3, 3, 3],
  lock = 0,
  dir = [],
  scale = 1,
  two_plane,
  two_geometry,
  no_of_shapes = 0,
  first_time = 1,
  is_2D = 0,
  is_shapeexist = 0,
  arrowHelper = [];

lock_vertices.addEventListener("click", () => {
  if (lock_vertices.checked) {
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

xy_grid.addEventListener("click", () => {
  if (xy_grid.checked) {
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

xz_grid.addEventListener("click", () => {
  if (xz_grid.checked) {
    let grid = new THREE.GridHelper(size, divisions);
    grid.geometry.rotateZ(Math.PI / 2);
    xzgrid.push(grid);
    scene.add(xzgrid[0]);
  } else {
    scene.remove(xzgrid[0]);
    xzgrid.pop();
  }
});

yz_grid.addEventListener("click", () => {
  if (yz_grid.checked) {
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

let buttons = document.getElementsByTagName("button");
const size = 50;
const divisions = 25;

let span_add_modal = document.getElementsByClassName("close")[1];

span_add_modal.onclick = function () {
  modal_add.style.display = "none";
};

document.getElementById("add-shape-btn").onclick = function () {
  modal_add.style.display = "block";

  document.querySelector(".buttonissecondary").addEventListener("click", () => {
    let xcoord = document.getElementById("x1").value;
    let ycoord = document.getElementById("y1").value;
    let zcoord = document.getElementById("z1").value;
    no_of_shapes++;
    console.log(no_of_shapes);
    is_shapeexist = 1;
    console.log(document.getElementById("shape-add-dropdown").value);
    if (document.getElementById("shape-add-dropdown").value == "Cube") {
      createCube(
        xcoord,
        ycoord,
        zcoord,
        shapes,
        scene,
        point,
        shapevertex,
        dragx,
        dragy,
        dragz
      );
    }
    if (document.getElementById("shape-add-dropdown").value == "Tetrahedron") {
      createTetrahedron(
        xcoord,
        ycoord,
        zcoord,
        shapes,
        scene,
        point,
        shapevertex,
        dragx,
        dragy,
        dragz
      );
    }
    if (document.getElementById("shape-add-dropdown").value == "Octahedron") {
      createOctahedron(
        xcoord,
        ycoord,
        zcoord,
        shapes,
        scene,
        point,
        shapevertex,
        dragx,
        dragy,
        dragz
      );
    }
    if (document.getElementById("shape-add-dropdown").value == "Dodecahedron") {
      createDodecahedron(
        xcoord,
        ycoord,
        zcoord,
        shapes,
        scene,
        point,
        shapevertex,
        dragx,
        dragy,
        dragz
      );
    }
    modal_add.style.display = "none";
  });
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
let shapevertex = [];
let dot_list = [];

document.addEventListener("dblclick", ondblclick, false);

function ondblclick(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  mouse.x = (x / container.clientWidth) * 2 - 1;
  mouse.y = (y / container.clientHeight) * -2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(shapes);
  console.log(intersects);
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
          let xcoord = document.getElementById("x").value;
          let ycoord = document.getElementById("y").value;
          let zcoord = document.getElementById("z").value;

          no_of_shapes++;

          if (document.querySelector("select").value === "Cube") {
            createCube(
              xcoord,
              ycoord,
              zcoord,
              shapes,
              scene,
              point,
              shapevertex,
              dragx,
              dragy,
              dragz
            );
          }
          if (document.querySelector("select").value === "Tetrahedron") {
            createTetrahedron(
              xcoord,
              ycoord,
              zcoord,
              shapes,
              scene,
              point,
              shapevertex,
              dragx,
              dragy,
              dragz
            );
          }
          if (document.querySelector("select").value === "Octahedron") {
            createOctahedron(
              xcoord,
              ycoord,
              zcoord,
              shapes,
              scene,
              point,
              shapevertex,
              dragx,
              dragy,
              dragz
            );
          }
          if (document.querySelector("select").value === "Dodecahedron") {
            createDodecahedron(
              xcoord,
              ycoord,
              zcoord,
              shapes,
              scene,
              point,
              shapevertex,
              dragx,
              dragy,
              dragz
            );
          }
          document.getElementById("edit-modal").style.display = "none";
        });
    };
  }
}

document.getElementById("h-s").onchange = function () {
  scale = document.getElementById("h-s").value;

  document.getElementById("h-x").value =
    document.getElementById("quantityx").value * scale;
  document.getElementById("h-y").value =
    document.getElementById("quantityy").value * scale;
  document.getElementById("h-z").value =
    document.getElementById("quantityz").value * scale;
};

span_edit_modal.onclick = function () {
  modal_edit.style.display = "none";
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
        console.log(shift.x);
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
      dot_list[0].position.set(
        planeIntersect.x + shift.x,
        planeIntersect.y + shift.y,
        planeIntersect.z + shift.z
      );
      document.getElementById("quantityx").value = (
        (dot_list[0].position.x + initial_pos[0]) *
        scale
      ).toFixed(2);
      document.getElementById("quantityy").value = (
        (dot_list[0].position.y + initial_pos[1]) *
        scale
      ).toFixed(2);
      document.getElementById("quantityz").value = (
        (dot_list[0].position.z + initial_pos[2]) *
        scale
      ).toFixed(2);

      let c_x = document.getElementById("quantityx").value * scale;
      let c_y = document.getElementById("quantityy").value * scale;
      let c_z = document.getElementById("quantityz").value * scale;

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
        shift.subVectors(dot_list[0].position, planeIntersect);
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

move_button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dot_list[0].position.set(
    x - initial_pos[0],
    y - initial_pos[1],
    z - initial_pos[2]
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
  for (let i = 0; i < 6; i++) {
    scene.add(arrowHelper[i]);
  }
  let PointGeometry = Dot(scene, dot_list, initial_pos);
  renderer = new THREE.WebGLRenderer();
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
let mainLoop = function () {
  renderer.render(scene, camera);
  requestAnimationFrame(mainLoop);
};
init();
mainLoop();
