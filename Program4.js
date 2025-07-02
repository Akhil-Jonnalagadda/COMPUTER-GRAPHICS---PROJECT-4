"use strict";

var canvas;
var gl;

var numVertices = 54;
var pointsArray = [];
var colorsArray = [];

var vertices = [
    vec4(0, 0, 30, 1.0), vec4(0, 10, 30, 1.0), vec4(16, 10, 30, 1.0), vec4(16, 0, 30, 1.0),
    vec4(0, 0, 54, 1.0), vec4(0, 10, 54, 1.0), vec4(16, 10, 54, 1.0), vec4(16, 0, 54, 1.0),
    vec4(8, 16, 30, 1.0), vec4(8, 16, 54, 1.0)
];

for (let i = 0; i < 10; i++) {
    vertices[i][0] /= 100;
    vertices[i][1] /= 100;
    vertices[i][2] /= 100;
}

var vertexColors = [
    vec4(0.0, 0.0, 0.0, 1.0), vec4(1.0, 0.0, 0.0, 1.0), vec4(1.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0),
    vec4(0.0, 0.0, 1.0, 1.0), vec4(1.0, 0.0, 1.0, 1.0), vec4(0.0, 1.0, 1.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0),
    vec4(0.0, 1.0, 0.0, 1.0), vec4(0.0, 1.0, 0.0, 1.0)
];

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var eye = vec3(0.0, 0.0, 0.0);
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 0.01, 0.0);

var c1 = vec3(-0.8, 0.8, 10.0);
var c2 = vec3(-0.8, 0.8, -10.0);
var nc = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]];

var dvec = 0.0;
var count = 0;
var paused = false;
var theta = 0;
var radius = 0.6;
var pathType = "line";

const bezierPoints = [
    vec3(-0.5, 0.0, 0.5),
    vec3(-0.2, 0.4, 0.3),
    vec3(0.2, 0.2, -0.3),
    vec3(0.5, 0.0, -0.5)
];

function bezier(t, p0, p1, p2, p3) {
    const u = 1 - t;
    return add(
        add(scale(Math.pow(u, 3), p0), scale(3 * t * Math.pow(u, 2), p1)),
        add(scale(3 * u * Math.pow(t, 2), p2), scale(Math.pow(t, 3), p3))
    );
}

function quad(a, b, c, d) {
    pointsArray.push(vertices[a]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[a]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[d]); colorsArray.push(vertexColors[a]);
}

function tri(a, b, c) {
    pointsArray.push(vertices[a]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[b]); colorsArray.push(vertexColors[a]);
    pointsArray.push(vertices[c]); colorsArray.push(vertexColors[a]);
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
    quad(6, 2, 8, 9);
    quad(1, 5, 9, 8);
    tri(2, 1, 8);
    tri(5, 6, 9);
}

window.onload = function init() {
    alert("Please ensure that the coordinates fall within the range of (-64,64)");

    canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) alert("WebGL isn't available");

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    var program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    colorCube();

    var cBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW);
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    var vBufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBufferId);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

    requestAnimFrame(render);
};

function AnimateLine() {
    const selected = document.getElementById("circlePath");
    const type = selected?.value || "line";
    pathType = type;

    if (type === "line") {
        c1 = [parseFloat(document.getElementById("lx1").value || "0"),
              parseFloat(document.getElementById("ly1").value || "0"),
              parseFloat(document.getElementById("lz1").value || "0")];
        c2 = [parseFloat(document.getElementById("lx2").value || "0"),
              parseFloat(document.getElementById("ly2").value || "0"),
              parseFloat(document.getElementById("lz2").value || "0")];

        for (let i = 0; i < 2; i++) {
            c1[i] /= 100; c2[i] /= 100;
        }
        c1[2] = (c1[2] / 100) * 10;
        c2[2] = (c2[2] / 100) * 10;
        nc = [c2[0] - c1[0], c2[1] - c1[1], c2[2] - c1[2]];
    } else if (type === "circle") {
        theta = 0;
    } else {
        dvec = 0;
    }

    dvec = 0;
    count = 0;
    paused = false;
    document.getElementById("Button2").textContent = "Pause";
    requestAnimFrame(render);
}

function ToggleAnimation() {
    paused = !paused;
    document.getElementById("Button2").textContent = paused ? "Resume" : "Pause";
    if (!paused) requestAnimFrame(render);
}

function ResetAnimation() {
    dvec = 0;
    count = 0;
    theta = 0;
    paused = false;
    document.getElementById("Button2").textContent = "Pause";
    requestAnimFrame(render);
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (pathType === "circle") {
        theta += 0.01;
        eye = vec3(radius * Math.cos(theta), 0.2, radius * Math.sin(theta));
    } else if (pathType === "bezier") {
        eye = bezier(dvec, ...bezierPoints);
        dvec += 0.002;
        if (dvec > 1.0) dvec = 0;
    } else {
        eye[0] = c1[0] + (dvec * nc[0]);
        eye[1] = c1[1] + (dvec * nc[1]);
        eye[2] = c1[2] + (dvec * nc[2]);

        let flag = count <= 1 ? 1 : (count <= 2 ? 0 : (count = 0, 1));
        count += 0.002;
        dvec += flag ? 0.002 : -0.002;
    }

    modelViewMatrix = lookAt(eye, at, up);
    let projType = document.getElementById("projectionType").value;
    projectionMatrix = projType === "perspective"
        ? perspective(90, 1, 0.001, 512)
        : ortho(-1, 1, -1, 1, -10, 10);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, numVertices);

    if (!paused) requestAnimFrame(render);
}
