"use strict";
import * as THREE from "https://threejsfundamentals.org/threejs/resources/threejs/r115/build/three.module.js";
import { createMaterials } from "./materials.js";
export const createCube = function (x, y, z, shapes, scene, point, shapeVertex
    , dragX, dragY, dragZ) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
    shapes[shapes.length - 1].name = "cube";
    let verticesList = shapes[shapes.length - 1].geometry.vertices;
    let i = 0;
    verticesList.forEach(vertex => {
        let dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(vertex);
        let dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        const geometry = new THREE.SphereGeometry(15, 32, 16);
        let dot = new THREE.Points(dotGeometry, dotMaterial);
        point.push(dot);
        shapes[shapes.length - 1].add(point[point.length - 1]);
        if (i === 0) {
            shapeVertex.push(dot);
        }
        i++;
    });
    dragX.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragY.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragZ.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

export const createDodecahedron = function (x, y, z, shapes, scene, point, shapeVertex
    , dragX, dragY, dragZ) {
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    shapes[shapes.length - 1].name = "dodecahedron";
    scene.add(shapes[shapes.length - 1]);
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        const dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        const dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        point.push(dot);
        shapes[shapes.length - 1].add(point[point.length - 1]);
        if (i === 0) {
            shapeVertex
                .push(dot);
        }
    }
    dragX.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragY.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragZ.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};

export const createOctahedron = function (x, y, z, shapes, scene, point, shapeVertex
    , dragX, dragY, dragZ) {
    const geometry = new THREE.OctahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
    shapes[shapes.length - 1].name = "octahedron";
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        const dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        const dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        point.push(dot);
        shapes[shapes.length - 1].add(point[point.length - 1]);
        if (i === 0) {
            shapeVertex
                .push(dot);
        }
    }
    dragX.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragY.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragZ.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
export const createTetrahedron = function (x, y, z, shapes, scene, point, shapeVertex
    , dragX, dragY, dragZ) {
    const geometry = new THREE.TetrahedronGeometry(1);
    const material = createMaterials().cubeShader;
    const cub = new THREE.Mesh(geometry, material);
    cub.geometry.verticesNeedUpdate = true;
    shapes.push(cub);
    shapes[shapes.length - 1].position.set(x, y, z);
    scene.add(shapes[shapes.length - 1]);
    shapes[shapes.length - 1].name = "tetrahedron";
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        const dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        const dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        point.push(dot);
        shapes[shapes.length - 1].add(point[point.length - 1]);
        if (i === 0) {
            shapeVertex
                .push(dot);
        }
    }
    dragX.push(shapes[shapes.length - 1].geometry.vertices[0].x);
    dragY.push(shapes[shapes.length - 1].geometry.vertices[0].y);
    dragZ.push(shapes[shapes.length - 1].geometry.vertices[0].z);
};
