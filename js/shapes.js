import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { createMaterials } from "./materials.js";
export let createCube = function(x, y, z, shapes, scene, point, shapevertex, dragx, dragy, dragz) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
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
    dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

export let createDodecahedron = function(x, y, z, shapes, scene, point, shapevertex, dragx, dragy, dragz) {
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
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
    dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

export let createOctahedron = function(x, y, z, shapes, scene, point, shapevertex, dragx, dragy, dragz) {
    const geometry = new THREE.OctahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
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
    dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
export let createTetrahedron = function(x, y, z, shapes, scene, point, shapevertex, dragx, dragy, dragz) {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
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
    dragx.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragy.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragz.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
