/*
    cubehash test suite
*/

(async () => {
    const util = require("./util");
    const crypto = require("crypto");
    const CubeHash = await (require("."))();
    const {performance} = require("perf_hooks");
    const cubeHash512 = new CubeHash();
    const testVectorCubeHash = new CubeHash(80, 8, 1, 80, 512);

    // test vectors from Wikipedia
    console.log(`CubeHash tests.
Test vectors taken from this Wikipedia article: https://en.wikipedia.org/wiki/CubeHash
For verification, CubeHash80+8/1+80-512 is used.
For speed testing, CubeHash512 (CubeHash 16+16/32+32-512) is used.`);

    // verify test vectors
    console.log("Verifying test vectors...");
    // first, we'll test the hashes
    let hash1 = util.encodeHex(testVectorCubeHash.hash(util.decodeUTF8("")));
    console.log(`hash("") correct? (should be yes) ${hash1 === "90bc3f2948f7374065a811f1e47a208a53b1a2f3be1c0072759ed49c9c6c7f28f26eb30d5b0658c563077d599da23f97df0c2c0ac6cce734ffe87b2e76ff7294" ? "yes" : "no"}`);
    let hash2 = util.encodeHex(testVectorCubeHash.hash(util.decodeUTF8("The quick brown fox jumps over the lazy dog")));
    console.log(`hash("The quick brown fox jumps over the lazy dog") correct? (should be yes) ${hash2 === "ca942b088ed9103726af1fa87b4deb59e50cf3b5c6dcfbcebf5bba22fb39a6be9936c87bfdd7c52fc5e71700993958fa4e7b5e6e2a3672122475c40f9ec816ba" ? "yes" : "no"}`);

    // speedtest
    console.log("Testing speed (1MB)...");
    let message = new Uint8Array(crypto.randomBytes(1000000));
    let cubeHashPerformance = 0;
    let nativePerformance = 0;
    for (let i = 0; i < 10; i++) {
        let x = performance.now();
        let _ = cubeHash512.hash(message);
        let y = performance.now();
        cubeHashPerformance += (y - x);
    }
    for (let i = 0; i < 10; i++) {
        let hashObject = crypto.createHash("sha512");
        let x = performance.now();
        let _ = hashObject.update(message).digest();
        let y = performance.now();
        nativePerformance += (y - x);
    }
    console.log(`Native crypto performance (SHA-512, averaged over 10 iterations) - ${Math.round(nativePerformance * 10) / 100}ms
cubehash performance (CubeHash512, averaged over 10 iterations) - ${Math.round(cubeHashPerformance * 10) / 100}ms`);
})();