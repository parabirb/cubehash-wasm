# cubehash-wasm
## DISCLAIMER
THIS LIBRARY IS MEANT AS A REFERENCE IMPLEMENTATION. A *REFERENCE IMPLEMENTATION*. I AM NOT AN EXPERIENCED CRYPTOGRAPHER AND I CANNOT GUARANTEE THAT THIS LIBRARY IS SECURE. **DO NOT USE THIS FOR ANYTHING IMPORTANT! YOU HAVE BEEN WARNED.**

## introduction
this library is a port of my [js cubehash library](https://github.com/parabirb/cubehash) to assemblyscript. i believed that it would provide for higher optimization (which i was wrong about). this took hours of work, and frankly, i regret it deeply. it runs 3 times slower than the pure JS version on 1MB arrays, and cannot run at all on 500MB arrays. if you understand this and are still curious, feel free to read the below.

## installation
browser:
* there is NO support for the browser. you will have to hack your own wrapper around the .wasm file. if you want to build the WASM file, here are some things you should know:
    * you should 100% read the assemblyscript docs before you go into this
    * the exports are as follows:
```typescript
export function hash(m: Uint8Array, i: u32, r: u32, b: u32, f: u32, h: u32): Uint8Array // this is the hash function's signature.
export const Uint8Array_ID = idof<Uint8Array>(); // you need this if you want to hash anything!
```
* the wasm file is available in the git repo for your convenience.

node:
* `npm i --save cubehash-wasm` will install cubehash-wasm for you.

## usage
the `module.exports` of this library is an **async** function aptly called `load`. when `load` is called, it will load in the wasm library and then return a class called `CubeHash`. its methods are provided below for reference.

* `constructor()` - sets the parameters for CubeHash512, or CubeHash16+16/32+32-512, and precomputes the initialization vector. this is a sane default and no further configuration is required after creating the object.
* `constructor(Number i, Number r, Number b, Number f, Number h)` - sets the parameters for CubeHashi+r/b+f-h. **NOTE THAT NO INPUT CHECKING IS DONE ON THE PARAMETERS AND YOU SHOULD VERIFY THAT THEY ARE CORRECT YOURSELF. ALSO, UNLIKE THE JS IMPLEMENTATION, THE INITIALIZATION VECTOR IS NOT PRECOMPUTED.** i should be a member of the set {1,2,3,...}, r should be a member of the set {1,2,3,...}, b should be a member of the set {1,2,3,...,128}, f should be a member of the set {1,2,3,...}, and h should be a member of the set {8,16,24,...,512}.
* `Uint8Array hash(Uint8Array m)` - returns the hash for `m` with the parameters specified in the constructor.
* `Uint8Array mac(Uint8Array message, Uint8Array key)` - returns the CubeMAC with key `key` and message `message` with the parameters specified in the constructor. the key must be 512 bits (64 bytes). for more information, [click here](https://cubehash.cr.yp.to/submission2/tweak2.pdf).

in other words, the class provides the exact same interface as the pure-JS CubeHash implementation.

reference usage:
```JS
async function main() {
    // require cubehash
    const CubeHash = await (require("cubehash-wasm"))();
    // create a new cubehash object. cubehash512 by default.
    const cubehash512 = new CubeHash();

    // create a message uint8array
    let message = new Uint8Array(Buffer.from("cubehash"));
    // compute our hash
    let rawHash = cubehash512.hash(message);
    // log our hash as base64
    console.log(Buffer.from(rawHash).toString("base64"));
}
main();
```

## testing
first, make sure any dependencies are installed with `npm i`. then, run `npm test` to run the test suite (this will also compile the WASM). the test suite includes a speedtest and verifies the output based on certain test vectors ([found here](https://en.wikipedia.org/wiki/CubeHash)).

## code
you honestly shouldn't be implementing cubehash in assemblyscript (the performance gets *worse*), but if you want to, there are some comments around in the code. i recommend using my js implementation (linked in the introduction) for reference instead.