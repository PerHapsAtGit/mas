import request from 'supertest';
import { app, server } from './index';
import { ROOM_TYPES } from '../common/room';

describe('app', () => {
    after(() => {
        server.close();
    });

    it('should send back a text from ROOM_TYPES', (done) => {
        request(app)
        .get('/room/1/1')
        .expect('Content-Type', /text\/html/)
        .expect(200, function(err, res) {
            if (err) { return done(err); }

            const result = res.text;
            expect(Object.values(ROOM_TYPES)).to.include(result);
            done();
        });
    });

    it('should handle invalid rooms', (done) => {
        request(app)
        .get('/room/1/a')
        .expect(400, function(err, res) {
            done();
        });
    });
});