var gl;
var vertices = [];
var game = new Tetris();
var pausing = true;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }


    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
	
	//设置方块间隔
    setInterval(run, 256);
    bindKeys();

    rerender();
};


function rerender(){
    vertices = [];
    renderMap(game);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
}

function renderEmpty(){
    gl.clear(gl.COLOR_BUFFER_BIT);
}

/**
 * @param {number[]} standard_coordinate [x,y]
 */
function coordinateTransform(standard_coordinate) {
    //10×20 canvas
    //transform standard coordinate to a rect points group

    let dx = (standard_coordinate[0] - 1) * 0.2;
    let dy = (standard_coordinate[1] - 1) * 0.1;
    let result = [];
    result.push(vec2(-1 + dx, -1 + dy));
    result.push(vec2(-0.8 + dx, -1 + dy));
    result.push(vec2(-1 + dx, -0.9 + dy));
    result.push(vec2(-0.8 + dx, -1 + dy));
    result.push(vec2(-1 + dx, -0.9 + dy));
    result.push(vec2(-0.8 + dx, -0.9 + dy));
    return result;
}

/**
 * 
 * @param {Tetris} tetris 
 */
function renderMap(tetris){
    let map = tetris.getRenderMap();
    for(let i = 0; i < map.length; i += 1){
        for(let j = 0; j < map[i].length; j += 1){
            if(map[i][j]){
                let mid = coordinateTransform([j+1, i+1]);
                mid.forEach(x => {
                    vertices.push(x);
                });
            }
        }
    }
}


function bindKeys(){
    document.onkeydown = function(event){
        
        if(event.key == "a"){
            game.leftShift();
        }
        if(event.key == "d"){
            game.rightShift();
        }
        if(event.key == "w"){
            game.leftRotate();
        }
        if(event.key == "s"){
            game.rightRotate();
        }
        if(event.key == "p"){
            pausing = !pausing;
        }
    }
}

function run(){
    if(!pausing){
        if(game.nextTick()){
            game = new Tetris();
        }
        rerender();
    }
}
