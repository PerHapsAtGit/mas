import chai from 'chai';
import sinon from 'sinon';
import fetch from 'node-fetch';
import fetchMock  from 'fetch-mock';

global.expect = chai.expect;
global.sinon = sinon;
global.sandbox = sinon.createSandbox();
global.fetch = fetch;
global.fetchMock = fetchMock;

afterEach(() => {
    sandbox.restore();
});