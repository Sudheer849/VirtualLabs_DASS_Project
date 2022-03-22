import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { OrbitControls } from "https://threejsfundamentals.org/threejs/resources/threejs/r115/examples/jsm/controls/OrbitControls.js";
import { MOUSE } from "https://unpkg.com/three@0.128.0/build/three.module.js";
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
let initial_pos = [3, 3, 3];
let span_edit_modal = document.getElementsByClassName("close")[0];
var slider = document.getElementById("slider");
slider.addEventListener("input", movePoint);
document.getElementById("slider").max = document.getElementById("theta").value;
document.getElementById("slider").min = 0;
slider.step =(document.getElementById("slider").max - document.getElementById("slider").min) / document.getElementById("frames").value;

let rot_axis = new THREE.Vector3( document.getElementById("x-comp").value, document.getElementById("y-comp").value, document.getElementById("z-comp").value );
// convert axis to unit vector
rot_axis.normalize();
console.log("normalised axis ", rot_axis);

let total_angle = document.getElementById("theta").value;
let frames = document.getElementById("frames").value;
let deletebutton = document.getElementById("deletebutton");
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
  dragx = [],
  dragy = [],
  dragz = [],
  lock = 0,
  dir = [],
  arrowHelper = [];

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
threeD.addEventListener("click", () => {
  if (threeD.checked) {
    //
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

let camera2, scene2, controls;
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
  // 1 === orthographic, 0 === perspective
  scene.remove(camera);
  if (ortho_persp === 1) {
    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  } else {
    // cam2 = new THREE.PerspectiveCamera( Math.atan( ( (top - bottom)/( near + far ) ), (left - right) / (top - bottom) , near, far) );
    camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      near,
      far
    );
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
  // if (ortho_persp === 0) {
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
  let ortho_persp = document.getElementById("ortho-id").value;

  AddCam(
    near,
    far,
    left,
    right,
    bottom,
    top,
    camera_pos,
    target,
    up_vec,
    parseInt(ortho_persp)
  );
};

// Add a camera
function OldCam() {
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

function Change(event) {
  // scene.remove(arrowHelper2);
  // scene.remove(arrowHelper5);
  is_2D = 1;

  camera_pos = new THREE.Vector3(3, 0, 0);
  camera_up = new THREE.Vector3(0, 0, 1);
  camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
  camera.up.set(0, 1, 0);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  orbit.screenSpacePanning = true;

  if (first_time === 1) {
    //create someplane to project to
    two_plane = new THREE.Plane().setFromCoplanarPoints(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0)
    );
    //create some geometry to flatten..
    // two_geometry = new THREE.BufferGeometry();
    // fillGeometry(two_geometry);
    first_time = 0;
  }

  var positionAttr = two_geometry.getAttribute("position");
  for (var i = 0; i < positionAttr.array.length; i += 3) {
    var point = new THREE.Vector3(
      positionAttr.array[i],
      positionAttr.array[i + 1],
      positionAttr.array[i + 2]
    );
    var projectedPoint = two_plane.projectPoint();
    positionAttr.array[i] = projectedPoint.x;
    positionAttr.array[i + 1] = projectedPoint.y;
    positionAttr.array[i + 2] = projectedPoint.z;
  }
  positionAttr.needsUpdate = true;
}

document.getElementById("add-shape-btn").onclick = function () {
  modal_add.style.display = "block";
  modalbutton2.addEventListener("click", () => {
    let xcoord = document.getElementById("x1").value;
    let ycoord = document.getElementById("y1").value;
    let zcoord = document.getElementById("z1").value;
    // alert(document.getElementById("hi").value);
    no_of_shapes++;
    console.log(document.getElementById("shape-add-dropdown").value);
    if (document.getElementById("shape-add-dropdown").value === "Cube") {
      createCube(xcoord, ycoord, zcoord);
      // createCube(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("shape-add-dropdown").value === "Tetrahedron") {
      createTetrahedron(xcoord, ycoord, zcoord);
    }
    if (document.getElementById("shape-add-dropdown").value === "Octahedron") {
      createOctahedron(xcoord, ycoord, zcoord);
    }
    if (
      document.getElementById("shape-add-dropdown").value === "Dodecahedron"
    ) {
      createDodecahedron(xcoord, ycoord, zcoord);
    }
    // scene.remove(dot_list[0]);
    //  con = 1;
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
      // if (no_of_shapes === 0) {
      //   con = 0;
      //    scene.add(dot_list[0]);
      // }
    };
    // geometry.translate(intersects[0].object.position.x,intersects[0].object.position.y,intersects[0].object.position.z);
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

span_edit_modal.onclick = function () {
  modal_edit.style.display = "none";
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
      shapevertex[i].position.set(
        planeIntersect.x + shift.x - dragx[i],
        planeIntersect.y + shift.y - dragy[i],
        planeIntersect.z + shift.z - dragz[i]
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
      shift.subVectors(dot_list[0].geometry.getAttribute('position').array, planeIntersect);
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
    let rot_angle = ( target.value * parseFloat(document.getElementById("theta").value) ) / target.max - present_theta;

    let quat = new THREE.Quaternion();
    // console.log(quat);
    let rot_matrix = new THREE.Matrix4();
    quat.setFromAxisAngle( rot_axis, rot_angle * Math.PI / 180 );
    // console.log(quat);
    rot_matrix.makeRotationFromQuaternion(quat);
    // console.log(rot_matrix);
    // rot_matrix.makeRotationAxis(rot_axis, rot_angle/frames);

    dot_list[0].geometry.applyMatrix4( rot_matrix );
    dot_list[0].geometry.verticesNeedUpdate = true;

    document.getElementById("quantityx").value = dot_list[0].geometry.getAttribute('position').array[0];
    document.getElementById("quantityy").value = dot_list[0].geometry.getAttribute('position').array[1];
    document.getElementById("quantityz").value = dot_list[0].geometry.getAttribute('position').array[2];

    present_theta += rot_angle;
}

document.getElementById("frames").onchange = function () {
  let new_value = document.getElementById("frames").value; // new value
  let cur_pos = new Array();
  for ( let i = 0; i < 3; i++ )  {
    cur_pos[i] = dot_list[0].geometry.getAttribute('position').array[i];
  }

  document.getElementById("quantityx").value = initial_pos[0] + parseFloat(( (cur_pos[0] - initial_pos[0]) * frames) / new_value);
  document.getElementById("quantityy").value = initial_pos[1] + parseFloat(( (cur_pos[1] - initial_pos[1]) * frames) / new_value);
  document.getElementById("quantityz").value = initial_pos[2] + parseFloat(( (cur_pos[2] - initial_pos[2]) * frames) / new_value);
  
  let translate_M = new THREE.Matrix4();
  translate_M.makeTranslation( document.getElementById("quantityx").value - cur_pos[0], document.getElementById("quantityy").value - cur_pos[1], document.getElementById("quantityz").value - cur_pos[2] );
  dot_list[0].geometry.applyMatrix4( translate_M );
  dot_list[0].geometry.verticesNeedUpdate = true;

  slider.step = (document.getElementById("slider").max - document.getElementById("slider").min) / document.getElementById("frames").value;
  let no_of_frames = frames * (slider.value / slider.max);
  slider.value = document.getElementById("slider").max * (no_of_frames / new_value);
  //  document.getElementById("slider").value =  * (new_value/frames)
  frames = new_value;
};

document.getElementById("theta").onchange = function () {
  let slider_value = document.getElementById("slider").value;
  // console.log(slider_value);
  let new_value = document.getElementById("theta").value; // new value
  let new_theta = present_theta * (new_value / total_angle);  
  
  let quat = new THREE.Quaternion();
  let rot_matrix = new THREE.Matrix4();
  quat.setFromAxisAngle( rot_axis, (new_theta - present_theta) * Math.PI / 180 );
  rot_matrix.makeRotationFromQuaternion(quat);

  dot_list[0].geometry.applyMatrix4( rot_matrix );
  dot_list[0].geometry.verticesNeedUpdate = true;

  document.getElementById("quantityx").value = dot_list[0].geometry.getAttribute('position').array[0];
  document.getElementById("quantityy").value = dot_list[0].geometry.getAttribute('position').array[1];
  document.getElementById("quantityz").value = dot_list[0].geometry.getAttribute('position').array[2];

  total_angle = new_value;
  document.getElementById("slider").value = slider_value;
  present_theta = new_theta;
};

set_rotation_axis.addEventListener("click", () => {
  rot_axis = new THREE.Vector3( parseFloat( document.getElementById("x-comp").value), parseFloat( document.getElementById("y-comp").value), parseFloat( document.getElementById("z-comp").value) );
});

// --------------------------------------------------------------------------------------------------

// Cube Function
// --------------------------------------------------------------------------------------------------

let createCube = function (x, y, z) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = createMaterials().cubeShader;
  const cube = new THREE.Mesh(geometry, material);
  cube.geometry.verticesNeedUpdate = true;
  shapes.push(cube);
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
move_button.addEventListener("click", () => {
  initial_pos[0] = parseFloat( document.getElementById("quantityx").value);
  initial_pos[1] = parseFloat( document.getElementById("quantityy").value);
  initial_pos[2] = parseFloat( document.getElementById("quantityz").value);

  let cur_pos = new Array();
  for ( let i = 0; i < 3; i++ ) 
    cur_pos[i] = dot_list[0].geometry.getAttribute('position').array[i];
  
  let translate_M = new THREE.Matrix4();
  translate_M.makeTranslation( initial_pos[0] - cur_pos[0], initial_pos[1] - cur_pos[1], initial_pos[2] - cur_pos[2] );
  dot_list[0].geometry.applyMatrix4( translate_M );  
  dot_list[0].geometry.verticesNeedUpdate = true;

  document.getElementById("slider").max = document.getElementById("finalx").value - initial_pos[0];
  slider.step = (document.getElementById("slider").max - document.getElementById("slider").min) / document.getElementById("frames").value;
});
// Dodecahedron Function
// --------------------------------------------------------------------------------------------------
let createDodecahedron = function (x, y, z) {
  const geometry = new THREE.DodecahedronGeometry(1);
  const material = createMaterials().cubeShader;
  const dodecahedron = new THREE.Mesh(geometry, material);
  dodecahedron.geometry.verticesNeedUpdate = true;
  shapes.push(dodecahedron);
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
  const octahedron = new THREE.Mesh(geometry, material);
  octahedron.geometry.verticesNeedUpdate = true;
  shapes.push(octahedron);
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
  const tetrahedron = new THREE.Mesh(geometry, material);
  tetrahedron.geometry.verticesNeedUpdate = true;
  shapes.push(tetrahedron);
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

// Dot Function
// --------------------------------------------------------------------------------------------------

let Dot = function () {
  
  let tmp_vec = new THREE.Vector3( initial_pos[0], initial_pos[1], initial_pos[2] );
  let dotGeometry = new THREE.BufferGeometry().setFromPoints( [ tmp_vec ] );
  let dotMaterial = new THREE.PointsMaterial({
    size: 6,
    sizeAttenuation: false,
  });

  let point = new THREE.Points( dotGeometry, dotMaterial );
  dot_list.push(point);
  scene.add(dot_list[0]);

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
  let PointGeometry = Dot();
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
