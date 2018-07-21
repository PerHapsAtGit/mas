import pkg from '../../../package.json';
import { ROOM_TYPES } from '../../common/room';

/**
 * Validate if url params for x, y are valid.
 * @param {string} x - x value passed from url route
 * @param {string} y - y value passed from url route
 * @return {promise}
 */
export function validateRoom(x, y) {
    return new Promise((resolve, reject) => {
        const intX = Number(x);
        const intY = Number(y);

        if (!Number.isInteger(intX) || !Number.isInteger(intY)) {
            return reject('invalid number');
        }

        return resolve({intX, intY});
    });
}

/**
 * Generate value for a room based on gold rate.
 * The value generated will be stored in Room grid
 * 
 * This function is only called by server.
 * 
 * @param {number} x 
 * @param {number} y 
 * @param {number} goldRate - a float number 0.5 will mean a room has 50% to contain gold
 */
export function generateRoom(x, y, goldRate = pkg.goldRate) {
    const dice = Math.random();
    if (dice < goldRate) {
        return ROOM_TYPES.GOLD;
    }
    return ROOM_TYPES.MONSTER; 
}