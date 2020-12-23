class BlockGroup {
    /**
     * 
     * @param {number} type 
     * @param {number} rotate_angle 
     * @param {TMap} map 
     * @param {Array<number>} current_position
     */
    constructor(type, rotate_angle, map, current_position) {
        // rotate_angle: 0-3
        // type: 0-6
        this.type = type;
        this.rotate_angle = rotate_angle;
        this.map = map;
        this.current_position = current_position.map((x) => x);

        let mid = [false, false, false, false];
        this.area = [
            mid.map((x) => x),
            mid.map((x) => x),
            mid.map((x) => x),
            mid.map((x) => x),
        ]
        switch (type) {
            case 0:
                this.area[1] = [true, true, true, true];
                break;
            case 1:
                this.area[1] = [false, true, false, false];
                this.area[2] = [false, true, true, true];
                break;
            case 2:
                this.area[1] = [false, false, true, false];
                this.area[2] = [true, true, true, false];
                break;
            case 3:
                this.area[1] = [false, true, true, false];
                this.area[2] = [false, true, true, false];
                break;
            case 4:
                this.area[1] = [false, true, true, false];
                this.area[2] = [true, true, false, false];
                break;
            case 5:
                this.area[1] = [false, true, false, false];
                this.area[2] = [true, true, true, false];
                break;
            case 6:
                this.area[1] = [false, true, true, false];
                this.area[2] = [false, false, true, true];
                break;
            default:
                break;
        }
    }
    
    tryDrop(){
        this.current_position = [this.current_position[0], this.current_position[1] - 1];
    }

    tryRightRotate() {
        let temp = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let k = 3 - j;
                if (!temp[k]) {
                    temp[k] = [];
                }
                temp[k][i] = this.area[i][j];
            }
        }
        if(this.rotate_angle == 3){
            this.rotate_angle = 0;
        }else{
            this.rotate_angle += 1;
        }
        this.area = temp;
    }

    tryLeftShift(){
        this.current_position = [this.current_position[0]-1, this.current_position[1]];
    }

    tryRightShift(){
        this.current_position = [this.current_position[0]+1, this.current_position[1]];
    }

    leftShift(){
        let temp = this.clone();
        temp.tryLeftShift();
        if(this.map.isBlockGroupCollided(temp, temp.current_position)){
            return false;
        }
        this.copy(temp);
        return true;
    }

    rightShift(){
        let temp = this.clone();
        temp.tryRightShift();
        if(this.map.isBlockGroupCollided(temp, temp.current_position)){
            return false;
        }
        this.copy(temp);
        return true;
    }



    drop(){
        let temp = this.clone();
        temp.tryDrop();
        if(this.map.isBlockGroupCollided(temp, temp.current_position)){
            return false;
        }
        this.copy(temp);
        return true;
    }

    rightRotate(){
        let temp = this.clone();
        temp.tryRightRotate();
        if(this.map.isBlockGroupCollided(temp, temp.current_position)){
            return;
        }
        this.copy(temp);
    }

    leftRotate(){
        let temp = this.clone();
        temp.tryRightRotate();
        temp.tryRightRotate();
        temp.tryRightRotate();
        if(this.map.isBlockGroupCollided(temp, this.current_position)){
            return;
        }
        this.copy(temp);
    }

    /**
     * @returns {BlockGroup}
     * @param {Map} map 
     */
    static getRandomBlockGroup(map, current_position) {
        let rotate_angle = parseInt(Math.random() * 3);
        let type = parseInt(Math.random() * 6);
        return new BlockGroup(type, rotate_angle, map, current_position);
    }

    clone(){
        let temp = [];
        this.area.forEach((x) => temp.push(x.map((x) => x)));
        let mid = new BlockGroup(this.type, this.rotate_angle, this.map, this.current_position.map((x) => x));
        mid.area = temp;
        return mid;
    }

    /**
     * 
     * @param {BlockGroup} temp 
     */
    copy(temp){
        this.type = temp.type;
        this.rotate_angle = temp.rotate_angle;
        this.map = temp.map;
        this.current_position = temp.current_position;
        this.area = temp.area;
    }
}