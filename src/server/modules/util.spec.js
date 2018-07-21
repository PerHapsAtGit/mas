import { validateRoom, generateRoom } from "./util";
import { ROOM_TYPES } from "../../common/room";

describe('validateRoom(x, y)', () => {
    it('should return valid integers', (done) => {
        const x = '1';
        const y = '2';
        const expected = {
            intX: Number(x),
            intY: Number(y),
        };

        validateRoom(x, y).then((result) => {
            expect(result).to.deep.equal(expected);
            done();
        });
    });

    it('should reject invalid number', (done) => {
        validateRoom(1.2, 3).then(
            null,
            (err) => {
                expect(err).to.be.not.undefined;
                done();
            }
        );
    });

    it('should reject undefined', (done) => {
        validateRoom(undefined, 2).then(
            null,
            (err) => {
                expect(err).to.be.not.undefined;
                done();
            }
        )
    })
});

describe('generateRoom(x, y, goldRate)', () => {
    it('should return gold', () => {
        const goldRate = 0.5;
        sandbox.stub(Math, 'random').returns(0.4);

        const result = generateRoom(1, 1, goldRate);
        expect(result).to.equal(ROOM_TYPES.GOLD);
    });

    it('should return monster', () => {
        const goldRate = 0.5;
        sandbox.stub(Math, 'random').returns(0.6);

        const result = generateRoom(1, 1, goldRate);
        expect(result).to.equal(ROOM_TYPES.MONSTER);
    });
});