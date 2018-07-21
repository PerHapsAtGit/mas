import room, { ROOM_TYPES } from './room';

describe('storage object room', () => {
    after(() => {
        room.grid = [[ROOM_TYPES.START_POINT]];
    });

    it('should return START_POINT', () => {
        expect(room.get(0, 0)).to.equal(ROOM_TYPES.START_POINT);
    });

    it('should return undefined for empty room', () => {
        expect(room.get(2, 3)).to.be.undefined;
    });

    it('should set room correctly', () => {
        room.set(2, 3, ROOM_TYPES.GOLD);
        expect(room.get(2, 3)).to.equal(ROOM_TYPES.GOLD);
    });
});