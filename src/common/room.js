/**
 * Room represents a 2 dimensional array for [x][y]
 * The array is empty, it is to be populated on demand by url requests.
 */
export class Room {
    constructor() {
        // Position 0,0 should not be considered for scouting
        this.grid = [[ROOM_TYPES.START_POINT]];
    }

    /**
     * Get room content, should be one of ROOM_TYPES
     * @param {number} x 
     * @param {number} y 
     * @return {string} - should be one of ROOM_TYPES
     */
    get(x, y) {
        return this.grid[x] && this.grid[x][y];
    }

    /**
     * Set value for a grid item.
     * @param {number} x 
     * @param {number} y 
     * @param {*} val - value to be set in grid.
     */
    set(x, y, val) {
        if(!this.grid[x]) {
            this.grid[x] = [];
        }
        this.grid[x][y] = val; 
    }
}

export const ROOM_TYPES = {
    'MONSTER': 'MONSTER',
    'GOLD': 'GOLD',
    'START_POINT': 'START_POINT',
    'CLEARED': 'CLEARED',
};

const room = new Room();
export default room;