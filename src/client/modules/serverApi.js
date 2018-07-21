import fetch from 'node-fetch';
import pkg from '../../../package.json';

/**
 * Call server API to find out what a room contains
 * @param {number} x
 * @param {number} y 
 * @param {object} xhrFetch - Lib for xhr request
 */
export function getRoomInfo(x, y, xhrFetch = fetch) {
    return xhrFetch(`${pkg.serverEndpoint}/room/${x}/${y}`)
        .then((res) => res.text())
        .catch(() => 'error');
}