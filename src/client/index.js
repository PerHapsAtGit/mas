import pkg from '../../package.json';
import game from './modules/game';

console.log(`\nWelcome to ${pkg.description}\n`);

game.getNextMove();