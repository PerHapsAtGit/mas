import readline from 'readline';
import room, { ROOM_TYPES } from '../../common/room';
import { getRoomInfo } from './serverApi';

/**
 * Game is responsible for calculating stats such as X, Y, HP and score.
 */
export class Game {
    constructor(hp = 5) {
        this.HP = hp;
        this.x = this.y = this.score = 0;

        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.log = console.log;
    }

    /**
     * Add extra line after console.log
     */
    logLine() {
        this.log.apply(console, arguments);
        this.log('\n');
    }

    /**
     * Show game stats to console.
     */
    showStats() {
        return this.log(`X: ${this.x}, Y:${this.y}, HP: ${this.HP}, SCORE: ${this.score}`);
    }

    /**
     * Confirm user keyboard input.
     * We only accept 'w', 's', 'a', 'd'
     * @param {string} key - input string from console
     * @return {promise}
     */
    confirmDirection(key) {
        return new Promise((resolve, reject) => {
            switch(key.toUpperCase()) {
                case 'W': {
                    this.log('NORTH');
                    return resolve({
                        newX: this.x + 1, 
                        newY: this.y
                    });
                }
                case 'D': {
                    this.log('EAST');
                    return resolve({
                        newX: this.x,
                        newY: this.y + 1
                    });
                }
                case 'S': {
                    this.log('SOUTH');
                    return resolve({
                        newX: this.x - 1,
                        newY: this.y
                    });
                }
                case 'A': {
                    this.log('WEST');
                    return resolve({
                        newX: this.x,
                        newY: this.y - 1
                    });
                }
                
                default: {
                    const msg = 'Unknown input. Try again.';
                    this.log(msg);
                    return reject(msg);
                }
            }
        });
    }

    /**
     * Prompt console to get user input for direction.
     */
    askForDirection() {
        this.rl.question(`Direction:`, (key) => {
            this.confirmDirection(key).then(
                // Go to the next room
                ({newX, newY}) => {
                    if (room.get(newX, newY)) {
                        this.markAsCurrentRoom(newX, newY);
                        this.logLine(`You've been to this room.\n`);
                        this.getNextMove();
                    } else {
                        this.enterNewRoom(newX, newY);
                    }
                },
                // Invalid input, ask again.
                () => this.askForDirection()
            );
        });
    }

    /**
     * Mark room as cleared, so next time when user comes back, we don't call backend API as it's an empty room
     *
     * Set game's current room coordinates with new X and Y
     * 
     * @param {number} newX - new value for X
     * @param {number} newY - new value for Y
     */
    markAsCurrentRoom(newX, newY) {
        room.set(newX, newY, ROOM_TYPES.CLEARED);
        this.x = newX;
        this.y = newY;
    }

    /**
     * Handle server response text for a new room.
     * @param {string} str - Server API response text. Should be one of ROOM_TYPES
     * @param {number} newX - new value for X
     * @param {number} newY - new value for Y
     */
    showRoomContent(str, newX, newY) {
        switch (str.toUpperCase()) {
            case ROOM_TYPES.MONSTER: {
                this.HP--;
                this.markAsCurrentRoom(newX, newY);
                this.logLine('Found !!!MONSTER!!!');
                break;
            }
            case ROOM_TYPES.GOLD: {
                this.score++;
                this.markAsCurrentRoom(newX, newY);
                this.logLine('Found $GOLD$');
                break;
            }
            default: {
                this.logLine('Server Response Error. Try again.');
                break;
            }
        }
    }

    /**
     * Game over. Print user score.
     */
    gameOver() {
        this.showStats();
        this.log('Game Over.');
        this.logLine(`Your score is ${this.score}`);
        this.rl.close();
    }

    /**
     * After handling server text response, we try to resume game.
     */
    resumeGame() {
        if (this.HP <= 0) {
            this.gameOver();
        } else {
            this.getNextMove();
        }
    }

    /**
     * Call backend API for the new room, and try resume game.
     * @param {number} newX - new value for X
     * @param {number} newY - new value for Y
     */
    enterNewRoom(newX, newY) {
        return getRoomInfo(newX, newY)
            .then((str) => {
                this.showRoomContent(str, newX, newY);
            })
            .then(() => {
                this.resumeGame();
            });
    }

    /**
     * Print user stats, and ask to get a direction input.
     */
    getNextMove() {
        this.showStats();
        this.askForDirection();
    }
}

const game = new Game();
export default game;