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
    shapes[shapes.length-1].name = "cube";
    let shapeVertex = shapes[shapes.length - 1].geometry.vertices;
    let i=0;
    shapeVertex.forEach(vertex =>
        {
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
                shapevertex.push(dot);
            }
            i++;
        });
    /*for (let i = 0; i < shapeVertex.length; i++) {
        let dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapeVertex[i]);
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
            shapevertex.push(dot);
        }
    }*/
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
    shapes[shapes.length-1].name = "dodecahedron";
    scene.add(shapes[shapes.length - 1]);
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        let dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        let dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        let dot = new THREE.Points(dotGeometry, dotMaterial);
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
    shapes[shapes.length-1].name = "octahedron";
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        let dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        let dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        let dot = new THREE.Points(dotGeometry, dotMaterial);
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
    shapes[shapes.length-1].name = "tetrahedron";
    for (let i = 0; i < shapes[shapes.length - 1].geometry.vertices.length; i++) {
        let dotGeometry = new THREE.Geometry();
        dotGeometry.vertices.push(shapes[shapes.length - 1].geometry.vertices[i]);
        let dotMaterial = new THREE.PointsMaterial({
            color: "white",
            size: 6,
            sizeAttenuation: false,
        });
        let dot = new THREE.Points(dotGeometry, dotMaterial);
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
