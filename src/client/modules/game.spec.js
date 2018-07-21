import game from './game';
import { ROOM_TYPES } from '../../common/room';

describe('game', () => {
    game.log = (msg) => msg;
    game.rl.question = () => {};

    describe('showStats()', () => {
        it('should return stats correctly', () => {
            const expected = `X: ${game.x}, Y:${game.y}, HP: ${game.HP}, SCORE: ${game.score}`;
            const result = game.showStats();

            expect(result).to.equal(expected);
        });
    });

    describe('confirmDirection(key)', () => {
        it('should go NORTH', (done) => {
            game.confirmDirection('w')
            .then(({newX, newY}) => {
                expect(newX).to.equal(game.x + 1);
                done();
            });
        });

        it('should go EAST', (done) => {
            game.confirmDirection('d')
            .then(({newX, newY}) => {
                expect(newY).to.equal(game.y + 1);
                done();
            });
        });

        it('should go SOUTH', (done) => {
            game.confirmDirection('s')
            .then(({newX, newY}) => {
                expect(newX).to.equal(game.x - 1);
                done();
            });
        });

        it('should go WEST', (done) => {
            game.confirmDirection('a')
            .then(({newX, newY}) => {
                expect(newY).to.equal(game.y - 1);
                done();
            });
        });

        it('should reject for invalid key', (done) => {
            game.confirmDirection('unknown')
            .then(
                null,
                (err) => {
                    expect(err).to.be.not.undefined;
                    done();
                }
            );
        });
    });

    describe('markAsCurrentRoom(newX, newY)', () => {
        it('should update x, y', () => {
            const newX = 198;
            const newY = 999;
            game.markAsCurrentRoom(newX, newY);
            expect({
                x: game.x,
                y: game.y
            }).to.deep.equal({
                x: newX,
                y: newY
            });
        });
    });

    describe('showRoomContent(str, newX, newY)', () => {
        it('should deduct HP if found monster', () => {
            const oldHP = game.HP;
            game.showRoomContent(ROOM_TYPES.MONSTER);
            expect(game.HP).to.equal(oldHP - 1);
        });

        it('should add score if found gold', () => {
            const oldScore = game.score;
            game.showRoomContent(ROOM_TYPES.GOLD);
            expect(game.score).to.equal(oldScore + 1);
        });

        it('should not update HP/score if error', () => {
            const oldStats = {
                HP: game.HP,
                score: game.score
            };
            game.showRoomContent('error');
            expect(oldStats).to.deep.equal({
                HP: game.HP,
                score: game.score
            });
        })
    });

    describe('resumeGame()', () => {
        it('should call gameOver is HP is 0', () => {
            const spy = sandbox.spy(game, 'gameOver');
            game.HP = 0;
            game.resumeGame();
            expect(spy.calledOnce).to.be.true;
        });

        it('should call getNextMove() if HP is greater than 0', () => {
            const spy = sandbox.spy(game, 'getNextMove');
            game.HP = 1;
            game.resumeGame();
            expect(spy.calledOnce).to.be.true;
        });
    });

    describe('enterNewRoom(newX, newY)', () => {
        it('should call showRoomContent() and resumeGame()', (done) => {
            const spy1 = sandbox.spy(game, 'showRoomContent');
            const spy2 = sandbox.spy(game, 'resumeGame');
            game.enterNewRoom(1, 2).then(() => {
                expect(spy1.calledOnce).to.be.true;
                expect(spy2.calledOnce).to.be.true;
                done();
            });
        });
    });
});