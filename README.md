# cubehash
## DISCLAIMER
THIS LIBRARY IS MEANT AS A REFERENCE IMPLEMENTATION. A *REFERENCE IMPLEMENTATION*. I AM NOT AN EXPERIENCED CRYPTOGRAPHER AND I CANNOT GUARANTEE THAT THIS LIBRARY IS SECURE. **DO NOT USE THIS FOR ANYTHING IMPORTANT! YOU HAVE BEEN WARNED.** also this library is an affront to god. if you're in a situation where you can use JS instead of WASM, i would recommend implementing cubehash in JS instead.

## introduction
this library is a port of my [JS CubeHash library](https://github.com/parabirb/cubehash) to AssemblyScript to allow for higher performance and optimization. this took hours of work, and frankly, i regret it deeply. it runs 3 times slower than the pure JS version on 1MB arrays, and cannot run at all on 500MB arrays.

## installation
