/*
    import our wasm into node
*/
const fs = require("fs");
const path = require("path");
const buffer = fs.readFileSync(path.join(__dirname, "cubehash.wasm"));
const loader = require("@assemblyscript/loader");

module.exports = async function load() {
    // get the exports
    const { exports } = await loader.instantiate(buffer);
    // cubehash class
    class CubeHash {
        // constructor
        constructor(i = 16, r = 16, b = 32, f = 32, h = 512) {
            this.i = i;
            this.r = r;
            this.b = b;
            this.f = f;
            this.h = h;
        }
        // hash
        hash(m) {
            const msgPtr = exports.__newArray(exports.Uint8Array_ID, [...m]);
            return new Uint8Array(exports.__getArray(exports.hash(msgPtr, this.i, this.r, this.b, this.f, this.h)));
        }
        // cubemac implementation (see https://cubehash.cr.yp.to/submission2/tweak2.pdf)
        mac(message, key) {
            // our key is 64 bytes
            if (key.length !== 64) {
                throw new Error("Key length must be 64 bytes (512 bits).");
            }
            // we just concat the key and message then hash it
            return this.hash(new Uint8Array([...key, ...message]));
        }
    }
    // return cubehash
    return CubeHash;
};