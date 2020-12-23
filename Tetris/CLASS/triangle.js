
var gl;
var points;
var rects;
var map;
var render_map;

window.onload = function init() {
    var canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }


    points = flatten(coordinateTransform([1, 1]));

    //  Configure WebGL

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    //  Load shaders and initialize attribute buffers

    var program = initShaders(gl, "vertex-shader.glsl", "fragment-shader.glsl");
    gl.useProgram(program);

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    render();
};


function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 20);
}




function initMap() {
    map = [];
    for (let x = 0; x < 23; x += 1) {
        let mid = [];
        for (let y = 0; y < 10; y += 1) {
            mid.push(false);
        }
        map.push(mid);
    }
}

function collisionCheck(block_group_coordinates) {
    //检测是否存在碰撞
    // block_group_coordinates: [[x1, y1],...]
    for (let i = 0; i < block_group_coordinates.length; i += 1) {
        let x = block_group_coordinates[i][0] - 1;
        let y = block_group_coordinates[i][1] - 1;
        if (map[y][x]) {
            return true;
        }
    }
    return false;
}

function eliminateCheck() {
    //检测是否存在可消去行
    //若存在则消去
    for (let i = 0; i < map.length; i += 1) {
        let mid = map[i];
        let eliminate = true;
        for (let j = 0; j < mid.length; j += 1) {
            if (!mid[j]) {
                eliminate = false;
            }
        }
        if (eliminate) {
            for (let p = i; p < map.length; p += 1) {
                if (p === map.length - 1) {
                    let empty_line = [];
                    for (l = 0; l < 10; l += 1) {
                        empty_line.push(false);
                    }
                    map[p] = empty_line;
                }else{
                    map[p] = map[p+1].map((x) => x);
                }
            }
            i -= 1;
        }
    }
}

function topCheck(){
    //检测是否触顶
    let top = map[19];
    for(let x = 0; x < 9; x += 1){
        if(top[x]){
            return true;
        }
    }
    return false;
}

function test(){
    initMap();
    for(let k = 0;k < 6;k += 1){
        setEliminateLine(k);
    }
    map;
    eliminateCheck();
}

function setEliminateLine(line_number) {
    let empty_line = [];
    for (l = 0; l < 10; l += 1) {
        empty_line.push(true);
    }
    map[line_number] = empty_line;

}







function coordinateTransform(standard_coordinate) {
    //10×20 canvas
    //standard_coordinate: [x, y] x: 1-10, y: 1-20
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



class BlockGroup {

    static generate(){
        let rotate_angle = parseInt(Math.random() * 3);
        let type = parseInt(Math.random() * 6);
        let center_block;
        let result;
        while(true){
            center_block = [parseInt(Math.random() * 10 + 1), parseInt(Math.random() * 3 + 21)];
            result = BlockGroup(center_block, type, rotate_angle);
            if(!result.overflowCheck()){ break; }
        }
        return result;
    }

    constructor(center_block, type, rotate_angle) {
        self.center_block = center_block;
        self.type = type;
        self.rotate_angle = rotate_angle;
        self.blocks = [];
        let x = center_block[0];
        let y = center_block[1];
        switch (type) {
            case 0:
                blocks.push([x-1, y]);
                blocks.push([x, y]);
                blocks.push([x+1, y]);
                blocks.push([x+2, y]);
                break;
            case 1:
                blocks.push([x, y+1]);
                blocks.push([x, y]);
                blocks.push([x+1, y]);
                blocks.push([x+2, y]);
                break;
            case 2:
                blocks.push([x, y+1]);
                blocks.push([x, y]);
                blocks.push([x-1, y]);
                blocks.push([x-2, y]);
                break;
            case 3:
                blocks.push([x, y]);
                blocks.push([x+1, y]);
                blocks.push([x+1, y-1]);
                blocks.push([x, y-1]);
                break;
            case 4:
                blocks.push([x, y]);
                blocks.push([x+1, y]);
                blocks.push([x, y-1]);
                blocks.push([x-1, y-1]);
                break;
            case 5:
                blocks.push([x, y]);
                blocks.push([x, y+1]);
                blocks.push([x-1, y]);
                blocks.push([x+1, y]);
                break;
            case 6:
                blocks.push([x, y]);
                blocks.push([x-1, y]);
                blocks.push([x, y-1]);
                blocks.push([x+1, y-1]);
                break;
            default:
                alert("Block Group Type Error!");
        }
        self.rotate()

        // center_block: used as rotating point -> [x, y]
        // type: 0-6
        // rotate_angle: 0-3 -> 0 - 270
    }

    overflowCheck(){
        //检查生成的方块组是否在缓冲区内
        for(let i = 0; i < self.points.length; i += 1){
            let block = self.blocks[i];
            if(block[0] <= 0 || block[0] >= 11 || block[1] >= 24 || block <= 20){
                return true;
            }
        }
        return false;
    }

    drop() {
        self.center_block = [self.center_block[0], self.center_block[1] - 1];
        collision_check();
    }

    left_shift() {

    }
    right_shift() {

    }

    init_rotate(){

    }

    rotate() {
        for(let i = 0; i < self.blocks.length; i += 1){
            let x0 = self.blocks[i][0];
            let y0 = self.blocks[i][1];
            self.blocks[i][0] = -y0;
            self.blocks[i][1] = x0;
        }
    }
}