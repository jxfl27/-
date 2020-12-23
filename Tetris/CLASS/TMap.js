class TMap {
    constructor() {
        this.area = [];
        for (let x = 0; x < 23; x += 1) {
            let mid = [];
            for (let y = 0; y < 10; y += 1) {
                mid.push(false);
            }
            this.area.push(mid);
        }
    }

    /**
     * @returns {boolean[][]}
     * @param {BlockGroup} current_block_group
     */
    getRenderMap(current_block_group, current_position) {
        let temp = this.clone();
        temp.fixBlockGroup(current_block_group, current_position);
        let mid = [];
        for(let x = 0; x < 20; x += 1){
            mid.push(temp.area[x].map((x) => x));
        }
        return mid;
    }


    /**
     * @param {BlockGroup} block_group 
     * @param {number[]} current_position 
     * @returns {boolean}
     */
    isBlockGroupCollided(block_group, current_position) {
        for(let i = 0; i < 4; i += 1){
            for(let j = 0; j < 4; j += 1){
                if(block_group.area[i][j]){
                    let y = current_position[1] - i;
                    let x = current_position[0] + j;
                    let mid = [x, y];
                    if(!this.isPositionInMap(mid) || this.isPositionCollided(mid)){
                        return true;
                    }
                }
            }
        }
        return false;

    }

    eliminateCheck() {
        let temp_area = [];
        let row_counter = 0;
        while(row_counter < 23){
            let flag = false;
            for(let i = 0; i < 10; i += 1){
                if(!this.area[row_counter][i]){
                    flag = true;
                }
            }
            if(flag){
                temp_area.push(this.area[row_counter].map((x) => x));
            }
            row_counter += 1;
        }
        while(temp_area.length < 24){
            let temp_false_container = [];
            for(let k = 0; k < 10; k += 1){
                temp_false_container.push(false);
            }
            temp_area.push(temp_false_container);
        }
        this.area = temp_area;
        console.log("eliminate check");
    }

    /**
     * @returns {void}
     * @param {BlockGroup} block_group 
     * @param {number[]} current_position 
     */
    fixBlockGroup(block_group, current_position){
        let x = current_position[0];
        let y = current_position[1];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(block_group.area[i][j]){
                    this.area[y-i][x+j] = true;
                }
            }
        }
    }

    /**
     * @returns {boolean}
     * @param {BlockGroup} block_group 
     * @param {number[]} current_position 
     */
    isBlockGroupFixable(block_group, current_position){
        let x = current_position[0];
        let y = current_position[1];
        for(var i = 0; i < 4; i++){
            for(var j = 0; j < 4; j++){
                if(block_group.area[i][j]){
                    if(this.area[y-i][x+j]){
                        return true;
                    }
                }
            }
        }
        return false;
    }

    /**
     * @param {number[]} map_position
     * @returns {boolean}
     */
    isPositionInMap(map_position){
        return (map_position[0] < 10 && map_position[0] >= 0) && (map_position[1] < 24 && map_position[1] >= 0);
    }

    /**
     * @param {number[]} map_position
     * @returns {boolean}
     */
    isPositionCollided(map_position){
        if(!this.isPositionInMap(map_position)){ return true; }
        return this.area[map_position[1]][map_position[0]];
    }

    isGameOver(){
        for(let i = 0; i < 10; i += 1){
            if(this.area[19][i]){
                return true;
            }
        }
        return false;
    }
    
    /**
     * @returns {TMap}
     */
    clone(){
        let temp = new TMap();
        for(let i = 0; i < this.area.length; i += 1){
            temp.area[i] = this.area[i].map((x) => x);
        }
        return temp;
    }

    // Test Methods ---------------------------------------

    /**
     * @param {number[]} map_position
     */
    setMap(map_position){
        this.area[map_position[1]][map_position[0]] = true;
    }

    setLine(line_number){
        let mid = [];
        for(let i = 0; i < 10; i += 1){
            this.area[line_number] = mid;
        }
    }
}