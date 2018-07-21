import express from 'express';
import pkg from '../../package.json';
import room, { ROOM_TYPES } from '../common/room';
import { validateRoom, generateRoom } from './modules/util';

export const app = express();

app.get('/', (req, res) => res.send('Monster Rooms API Is Running'));

/**
 * This server starts with an empty grid.
 * It will fill in this grid on demand.
 */
app.get('/room/:x/:y', (req, res, next) => {
    validateRoom(req.params.x, req.params.y).then(
        ({intX, intY}) => {
            const roomContent = room.get(intX, intY);
            if (roomContent === ROOM_TYPES.GOLD || roomContent === ROOM_TYPES.MONSTER) {
                // room content already exists, send back text
                res.send(roomContent);
            } else {
                // room is empty, generate content on demand, send back text
                const newContent = generateRoom(intX, intY);
                room.set(intX, intY, newContent);
                res.send(newContent);
            }
        },
        // Invalid values for x, y
        () => {
            res.status(400);
            next();
        }
    );
});

export const server = app.listen(pkg.serverPort, () => console.log(`Monster Rooms API Is Listening at http://localhost:${pkg.serverPort}`));