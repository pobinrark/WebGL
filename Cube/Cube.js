// JavaScript source code
var vertexShaderText =
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
'   fragColor = vertColor;',
'	gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}',
].join('\n');

var InitCube = function ()
{
    console.log("Set up");

    var canvas = document.getElementById("surface");
    var gl = canvas.getContext('webgl');

    if (!gl) {
        gl = canvas.getContext('experimental-webgl');
    }

    if (!gl) {
        aler("Your browser does not support WebGL");
    }

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);

    gl.clearColor(0.75, 0.6, 0.15, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    /*gl.enable(gl.CULL_FACE);
    gl.frontFace(gl.CCW);
    gl.cullFace(gl.BACK);*/

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling vertex shader", gl.getShaderInfoLog(vertexShader));
        return;
    }

    gl.compileShader(fragShader);
    if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
        console.error("Error compiling fragment shader", gl.getShaderInfoLog(fragShader));
        return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Error linking program", gl.getProgramInfoLog(program));
        return;
    }
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
        console.rror("Error validating program", gl.getProgramInfoLog(program));
        return;
    }

    //create buffer
    var cubeVertices =
        [// X,   Y,   Z    R,   G,   B
            //Top
            1.0, 1.0, 1.0, 1.0, 0.0, 0.0, //0-3
           -1.0, 1.0, 1.0, 1.0, 0.0, 0.5,
            1.0, 1.0,-1.0, 0.0, 1.0, 0.5,
           -1.0, 1.0, -1.0, 0.5, 1.0, 0.0,
    
            //Left
           -1.0, 1.0, 1.0, 1.0, 0.0, 0.5, //4-7
           -1.0, 1.0, -1.0, 0.0, 0.5, 0.2,
           -1.0, -1.0, 1.0, 0.5, 0.1, 0.0,
           -1.0, -1.0, -1.0, 1.0, 0.0, 0.0,

            //Right
            1.0, 1.0, 1.0, 1.0, 0.0, 0.5, //8-11
            1.0, 1.0, -1.0, 0.0, 0.5, 0.2,
            1.0, -1.0, 1.0, 0.5, 0.1, 0.0,
            1.0, -1.0, -1.0, 1.0, 0.0, 0.0,

            //Bot
            1.0, -1.0, 1.0, 1.0, 0.0, 0.0, //12-15
           -1.0, -1.0, 1.0, 1.0, 0.0, 0.5,
            1.0, -1.0, -1.0, 0.0, 1.0, 0.5,
           -1.0, -1.0, -1.0, 0.5, 1.0, 0.0,

            //Front
            1.0, 1.0, 1.0, 0.8, 0.6, 0.4, //16-19
            1.0, -1.0, 1.0, 0.4, 0.6, 0.8,
            -1.0, 1.0, 1.0, 0.1, 0.3, 0.5,
            -1.0, -1.0, 1.0, 0.5, 0.3, 0.1,

            //Back
            1.0, 1.0, -1.0, 0.8, 0.6, 0.4, //20-23
            1.0, -1.0, -1.0, 0.4, 0.6, 0.8,
            -1.0, 1.0, -1.0, 0.1, 0.3, 0.5,
            -1.0, -1.0, -1.0, 0.5, 0.3, 0.1,
        ];

    var cubeIndices =
        [
            //Top
            0, 3, 2,
            0, 3, 1,

            //Left
            4, 7, 5,
            4, 7, 6,

            //Right
            8, 11, 10,
            8, 11, 9,

            //Bot
            12, 15, 14,
            12, 15, 13,

            //Front
            16, 19, 18,
            16, 19, 17,

            //Back
            20, 23, 22,
            20, 23, 21
        ];

    //setup buffers
    var cubeVertBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cubeVertices), gl.STATIC_DRAW);

    var cubeIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeIndices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
    gl.vertexAttribPointer(
        positionAttribLocation, //Attribute location
        3, //number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
        0//offset
        );

    gl.vertexAttribPointer(
        colorAttribLocation, //Attribute location
        3, //number of elements per attribute
        gl.FLOAT, //type of elements
        gl.FALSE,
        6 * Float32Array.BYTES_PER_ELEMENT, //size of individual vertex
        3 * Float32Array.BYTES_PER_ELEMENT //offset
        );

    gl.enableVertexAttribArray(positionAttribLocation);
    gl.enableVertexAttribArray(colorAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    var angle = 0;
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);

    var xRotationMatrix = new Float32Array(16);
    var yRotationMatrix = new Float32Array(16);

    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
        mat4.rotate(xRotationMatrix, identityMatrix, angle / 2, [1, 0, 0]);
        mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.6, 0.15, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

        requestAnimationFrame(loop);

    };
    requestAnimationFrame(loop);
   
};