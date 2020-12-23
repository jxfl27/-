class Tetris{
    constructor(){
        this.map = new TMap();
        this.current_position = [3, 23];
        this.current_block_group = BlockGroup.getRandomBlockGroup(this.map, this.current_position);
        this.next_block_group = BlockGroup.getRandomBlockGroup(this.map, this.current_position);
        this.bindKeys();
    }
    drop(){
        if(this.current_block_group.drop()){
            this.current_position[1] -= 1;
            return true;
        }
        return false;
    }
    leftShift(){
        if(this.current_block_group.leftShift()){
            this.current_position[0] -= 1;
            return true;
        }
        return false;
    }
    rightShift(){
        if(this.current_block_group.rightShift()){
            this.current_position[0] += 1;
            return true;
        }
        return false;
    }
    leftRotate(){
        return this.current_block_group.leftRotate();
    }
    rightRotate(){
        return this.current_block_group.rightRotate();
    }


    nextTick(){
        if(this.drop()){

        }else{
            this.map.fixBlockGroup(this.current_block_group, this.current_position);
            this.map.eliminateCheck();
            if(this.map.isGameOver()){
                alert("Game Over");
                return true;
            }
            this.current_position = [3, 23];
            this.current_block_group = BlockGroup.getRandomBlockGroup(this.map, [3, 23]);
        }
        return false;
    }

    /**
     * @returns {boolean[][]}
     */
    getRenderMap(){
        return this.map.getRenderMap(this.current_block_group, this.current_position);
    }

    reset(){
        this.map = new TMap();
        this.current_block_group = BlockGroup.getRandomBlockGroup(this.map);
        this.next_block_group = BlockGroup.getRandomBlockGroup(this.map);
        this.current_position = [3, 23];
    }

    // Test Methods ---------------------------------------
    
    /**
     * @param {number[]} map_position
     */
    setMap(map_position){
        this.map.setMap(map_position);
    }

    bindKeys(){
        
    }
}
