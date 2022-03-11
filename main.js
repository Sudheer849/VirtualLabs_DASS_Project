import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
const button = document.querySelector(".submit_button");
const modelbutton1 = document.querySelector(".buttonisprimary");
const modelbutton2 = document.querySelector(".buttonissecondary");
var checkboxes = [];
checkboxes[0] = document.getElementById("checkbox1");
checkboxes[1] = document.getElementById("checkbox2");
checkboxes[2] = document.getElementById("checkbox3");
checkboxes[3] = document.getElementById("checkbox4");
checkboxes[4] = document.getElementById("checkbox5");
checkboxes[5] = document.getElementById("checkbox6");
checkboxes[6] = document.getElementById("checkbox7");
var Model = document.getElementById("AddModal");
var Model1 = document.getElementById("ModelAdd");
var ModelAdd = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];
var deletebutton = document.getElementById("deletebutton");
let scene,
  camera,
  renderer,
  orbit,
  shapes = [],
  rot = 0.01,
  variable = 0,
  con = 0,
  vargrid1 = 0,
  vargrid2 = 0,
  vargrid3 = 0,
  grid1 = [],
  grid2 = [],
  grid3 = [],
  dragx = [],
  dragy = [],
  dragz = [],
  xcor = 3,
  ycor = 3,
  zcor = 3,
  lock = 0,
  dir = [],
  arrowHelper = [];

function vertexShader() {
  return `varying vec3 vUv; 
    
                void main() {
                  vUv = position; 
    
                  vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
                  gl_Position = projectionMatrix * modelViewPosition; 
                }`;
}
function fragmentShader() {
  return `uniform vec3 colorA; 
                  uniform vec3 colorB; 
                  varying vec3 vUv;
    
                  void main() {
                gl_FragColor = vec4(mix(colorA, colorB, vUv.z), 1.0);
                  }`;
}

// Section of Checkboxes
// --------------------------------------------------------------------------------------------------
// 2D
checkboxes[0].addEventListener("click", () => {
  if (checkboxes[0].checked) {
    //
  } else {
    //
  }
});

// lock vertices

checkboxes[1].addEventListener("click", () => {
  if (checkboxes[1].checked) {
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
    console.log("hi");
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
//Show Animation
checkboxes[2].addEventListener("click", () => {
  if (checkboxes[2].checked) {
    //
  } else {
    //
  }
});
// Transformation
checkboxes[3].addEventListener("click", () => {
  if (checkboxes[3].checked) {
    //
  } else {
    //
  }
});

// XY Grid
checkboxes[4].addEventListener("click", () => {
  if (checkboxes[4].checked) {
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
checkboxes[5].addEventListener("click", () => {
  if (checkboxes[5].checked) {
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
checkboxes[6].addEventListener("click", () => {
  if (checkboxes[6].checked) {
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

var buttons = document.getElementsByTagName("button");
buttons[0].addEventListener("click", XY, false);
buttons[1].addEventListener("click", XZ, false); //
buttons[2].addEventListener("click", YZ, false);
buttons[3].addEventListener("click", Change, false);
buttons[4].addEventListener("click", Rotate, false);
buttons[5].addEventListener("click", Delete, false);
buttons[6].addEventListener("click", Add, false);
//buttons[7].addEventListener("click", ADD, false);
buttons[8].addEventListener("click", lockV, false);
buttons[9].addEventListener("click", NewCam, false);
const size = 50;
const divisions = 25;

// Add a camera
function AddCam(
  near,
  far,
  left,
  right,
  bottom,
  top,
  camera_pos,
  target,
  up_vec,
  ortho_persp
) {
  // 1 == orthographic, 0 == perspective
  if (ortho_persp == 1) {
    camera = new THREE.OrthographicCamera(left, right, bottom, top, near, far);
  } else {
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      near,
      far
    );
  }

  camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
  camera.up.set(up_vec.x, up_vec.y, up_vec.z);
  camera.lookAt(target);

  scene.add(camera);
  let newRenderer = new THREE.WebGLRenderer();
  newRenderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(newRenderer.domElement);

  // orbit controls
  let controls = new OrbitControls(camera, newRenderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.mouseButtons = {
    LEFT: MOUSE.PAN,
    MIDDLE: MOUSE.DOLLY,
    RIGHT: MOUSE.ROTATE,
  };
  controls.target.set(target.x, target.y, target.z);
  newRenderer.render(scene, camera);

  return camera;
}

function NewCam(event) {
  // function AddCam ( near, far, left, right, bottom, top, camera_pos, target, up_vec, ortho_persp ) {
  AddCam(
    0.1,
    1000,
    -10,
    10,
    -10,
    10,
    new THREE.Vector3(2, 4, 3),
    new THREE.Vector3(1, 1, 1),
    new THREE.Vector3(-1, 0, 1),
    1
  );
}

function XY(event) {
  var grid = new THREE.GridHelper(size, divisions);
  var vector3 = new THREE.Vector3(0, 0, 1);
  grid.lookAt(vector3);
  if (vargrid1 == 0) {
    grid1.push(grid);
    scene.add(grid1[0]);
    vargrid1 = 1;
  } else {
    scene.remove(grid1[0]);
    grid1.pop();
    vargrid1 = 0;
  }
}

function XZ(event) {
  var grid = new THREE.GridHelper(size, divisions);
  var vector3 = new THREE.Vector3(0, 1, 0);
  grid.lookAt(vector3);
  if (vargrid2 == 0) {
    grid2.push(grid);
    scene.add(grid2[0]);
    vargrid2 = 1;
  } else {
    scene.remove(grid2[0]);
    grid2.pop();
    vargrid2 = 0;
  }
}
function YZ(event) {
  var grid = new THREE.GridHelper(size, divisions);
  grid.geometry.rotateZ(Math.PI / 2);
  if (vargrid3 == 0) {
    grid3.push(grid);
    scene.add(grid3[0]);
    vargrid3 = 1;
  } else {
    scene.remove(grid3[0]);
    vargrid3 = 0;
  }
}
function Change(event) {
  console.log("Hello");
  camera.position.y = 3;
  camera.position.x = 0;
  camera.position.z = 0;
  orbit.minPolarAngle = 0;
  orbit.maxPolarAngle = 0;
}
function Delete(event) {
  scene.remove(shapes[shapes.length - 1]);
  shapes.pop();
  var PointGeometry = Dot();
  con = 0;
}

// locks the vertices of the shape
function lockV(event) {
  /*if (cube[cube.length - 1].geometry.verticesNeedUpdate == true)
    cube[cube.length - 1].geometry.verticesNeedUpdate = false;
  else cube[cube.length - 1].geometry.verticesNeedUpdate = true;*/
}
function Add(event) {
  createCube(0, 0, 0);
  scene.remove(dott[0]);
  con = 1;
}

function Rotate(event) {
  if (variable == 0) {
    variable = 1;
  } else {
    variable = 0;
  }
  console.log(variable);
}

document.getElementById("myBtn").onclick = function () {
  Model1.style.display = "block";
  modelbutton2.addEventListener("click", () => {
    var xcoord = document.getElementById("x1").value;
    var ycoord = document.getElementById("y1").value;
    var zcoord = document.getElementById("z1").value;
    // alert(document.getElementById("hi").value);
    no_of_shapes++;
    if (document.getElementById("hi").value == "Cube") {
      createCube(xcoord, ycoord, zcoord);
      // createCube(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Tetrahedron") {
      createTetrahedron(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Octahedron") {
      createOctahedron(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("hi").value == "Dodecahedron") {
      createDodecahedron(xcoord, ycoord, zcoord);
    }
    scene.remove(dott[0]);
    con = 1;
    Model1.style.display = "none";
  });
};

// Section of mouse control functions
// --------------------------------------------------------------------------------------------------

var raycaster = new THREE.Raycaster();
var raycaster1 = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var plane = new THREE.Plane();
var pNormal = new THREE.Vector3(0, 1, 0); // plane's normal
var planeIntersect = new THREE.Vector3(); // point of intersection with the plane
var pIntersect = new THREE.Vector3(); // point of intersection with an object (plane's point)
var shift = new THREE.Vector3(); // distance between position of an object and points of intersection with the object
var isDragging = false;
var dragObject;
var point = [];
var shapevertex = [];
var dott = [];
var no_of_shapes = 0;
function SelectShape(e) {
  document.getElementById("Add-shape").value = e.target.value;
}

document.addEventListener("dblclick", ondblclick, false);
// double click
function ondblclick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster1.setFromCamera(mouse, camera);
  var intersects = raycaster1.intersectObjects(shapes);
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
    document.getElementById("deleteShape").onclick = function () {
      console.log("Hi");
      scene.remove(line);
      for (let i = 0; i < intersects.length; i++) {
        scene.remove(intersects[i].object);
        no_of_shapes--;
        console.log(no_of_shapes);
      }
      if (no_of_shapes == 0) {
        con = 0;
        scene.add(dott[0]);
      }
    };
    // geometry.translate(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
    document.getElementById("editShape").onclick = function () {
      document.getElementById("AddModal").style.display = "block";
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
          if (document.querySelector("select").value == "Cube") {
            createCube(xcoord, ycoord, zcoord);
            // createCube(xcoord, ycoord, zcoord);
          }
          if (document.querySelector("select").value == "Tetrahedron") {
            createTetrahedron(xcoord, ycoord, zcoord);
          }
          if (document.querySelector("select").value == "Octahedron") {
            createOctahedron(xcoord, ycoord, zcoord);
          }
          if (document.querySelector("select").value == "Dodecahedron") {
            createDodecahedron(xcoord, ycoord, zcoord);
          }
          document.getElementById("AddModal").style.display = "none";
        });
    };
  }
}

span.onclick = function () {
  Model.style.display = "none";
};
// mouse drag

document.addEventListener("pointermove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  if (isDragging && con == 1 && lock == 0) {
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
  } else if (isDragging && con == 0) {
    raycaster.ray.intersectPlane(plane, planeIntersect);
    //  dot.geometry.verticesNeedUpdate = true;
    dott[0].position.set(
      planeIntersect.x + shift.x,
      planeIntersect.y + shift.y,
      planeIntersect.z + shift.z
    );
    document.getElementById("quantityx").value = (
      dott[0].position.x + xcor
    ).toFixed(2);
    document.getElementById("quantityy").value = (
      dott[0].position.y + ycor
    ).toFixed(2);
    document.getElementById("quantityz").value = (
      dott[0].position.z + zcor
    ).toFixed(2);
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
      if (con == 1) {
        shift.subVectors(point[0].position, planeIntersect);
      } else {
        shift.subVectors(dott[0].position, planeIntersect);
      }
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

// Cube Function
// --------------------------------------------------------------------------------------------------

let createCube = function (x, y, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    const geometry = new THREE.SphereGeometry(15, 32, 16);
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});
// Dodecahedron Function
// --------------------------------------------------------------------------------------------------
let createDodecahedron = function (x, y, z) {
  const geometry = new THREE.DodecahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

// Octahedron Function
// --------------------------------------------------------------------------------------------------
let createOctahedron = function (x, y, z) {
  const geometry = new THREE.OctahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);
  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
// Tetrahedron Function
// --------------------------------------------------------------------------------------------------
let createTetrahedron = function (x, y, z) {
  const geometry = new THREE.TetrahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const cub = new THREE.Mesh(geometry, material);
  cub.geometry.verticesNeedUpdate = true;
  shapes.push(cub);
  shapes[shapes.length - 1].position.set(x, y, z);
  scene.add(shapes[shapes.length - 1]);

  // console.log(cube[cube.length - 1]);
  var vertex = new THREE.Vector3();
  // console.log(cube[cube.length - 1].geometry.vertices[0]);
  for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
    var dotMaterial = new THREE.PointsMaterial({
      color: "white",
      size: 6,
      sizeAttenuation: false,
    });
    var dot = new THREE.Points(dotGeometry, dotMaterial);
    point.push(dot);
    shapes[shapes.length - 1].add(point[point.length - 1]);
    if (i === 0) {
      shapevertex.push(dot);
    }
  }
  // console.log(cube[cube.length-1].geometry.vertices[0].x,cube[cube.length-1].geometry.vertices[0].y,cube[cube.length-1].geometry.vertices[0].z);
  dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
  dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
  dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});
button.addEventListener("click", () => {
  let x = document.getElementById("quantityx").value;
  let y = document.getElementById("quantityy").value;
  let z = document.getElementById("quantityz").value;
  console.log(x, y, z);
  dott[0].position.set(x - xcor, y - ycor, z - zcor);
});

// Dot Function
// --------------------------------------------------------------------------------------------------

let Dot = function () {
  var dotGeometry = new THREE.Geometry();
  dotGeometry.vertices.push(new THREE.Vector3(xcor, ycor, zcor));
  var dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });
  var point = new THREE.Points(dotGeometry, dotMaterial);
  dott.push(point);
  scene.add(dott[0]);
  console.log(dotGeometry.vertices[0]);
  return dotGeometry;
};

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
scene.background = new THREE.Color(0x36393e);
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
  var PointGeometry = Dot();
  renderer = new THREE.WebGLRenderer();
  var container = document.getElementById("hello");
  var w = container.offsetWidth;
  var h = container.offsetHeight;
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
  if (variable == 1) {
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
