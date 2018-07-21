import { getRoomInfo } from './serverApi';

describe('getRoomInfo()', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('should return text responses', (done) => {
        const x = 1;
        const y = 2;
        const sample = 'sample';
        fetchMock.get('*', sample);

        getRoomInfo(x, y, global.fetch).then((text) => {
            expect(text).to.equal(sample);
            done();
        });
    });
});