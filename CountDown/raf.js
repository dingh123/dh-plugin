/**
 * requestAnimationFrame polyfill
 */

// import { isServer } from '..';

let prev = Date.now();

/* istanbul ignore next */
function fallback(fn) {
    const curr = Date.now();
    const ms = Math.max(0, 16 - (curr - prev));
    const id = setTimeout(fn, ms);
    prev = curr + ms;
    return id;
}

/* istanbul ignore next */
// const root = (isServer ? global : window) as Window;

/* istanbul ignore next */
const iRaf = requestAnimationFrame || fallback;

/* istanbul ignore next */
const iCancel = cancelAnimationFrame || clearTimeout;

export function raf(fn) {
    return iRaf.call(this, fn);
}

// double raf for animation
export function doubleRaf(fn) {
    raf(() => {
        raf(fn);
    });
}

export function cancelRaf(id) {
    iCancel.call(this, id);
}
