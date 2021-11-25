/*
    assemblyscript cubehash implementation
    public domain. written in 2021 by parabirb
*/
/*
    you might think that it's a bad idea for me to just disable checking entirely.
    it probably is. HOWEVER, webstorm won't stop being a bitch so this gets it to shut up
*/
// @ts-nocheck

// rotate left
function ROTL(a: u32, b: u8): u32 {
    return (a << b) | (a >>> (32 - b));
}

/*
    this is the cubehash round function.
    unchecked accesses are done because the accesses don't really need checking?
    this code is powered on fairy dust like i swear to god what the actual FUCK
    += and ^= don't work on uint32arrays??? and i have no idea why???
    either way it works so that's what matters
*/
function round(state: Uint32Array): void {
    // why type the same declaration over and over again
    let i: u8 = 0;
    // add 0jklm into 1jklm for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i + 16] = state[i] + state[i + 16]);
    }
    // rotate 0jklm upwards by 7 bits for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i] = ROTL(state[i], 7));
    }
    // swap 00klm with 01klm for each k, l, m
    for (i = 0; i < 8; i++) {
        let tmp: u32 = unchecked(state[i]);
        unchecked(state[i] = state[i + 8]);
        unchecked(state[i + 8] = tmp);
    }
    // xor 1jklm into 0jklm for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i] = state[i] ^ state[i + 16]);
    }
    // swap 1jk0m with 1jk1m for each j, k, m
    for (i = 0; i < 8; i++) {
        // bit manipulation for 1jk0m
        let jk0m: u8 = (((i << 1) & 12) | (i & 1)) + 16;
        let tmp: u32 = unchecked(state[jk0m]);
        unchecked(state[jk0m] = state[jk0m + 2]);
        unchecked(state[jk0m + 2] = tmp);
    }
    // add 0jklm into 1jklm for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i + 16] = state[i + 16] + state[i]);
    }
    // rotate 0jklm upwards by 11 bits for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i] = ROTL(state[i], 11));
    }
    // swap 0j0lm with 0j1lm for each j, l, m
    for (i = 0; i < 8; i++) {
        // bit manipulation
        let j0lm: u8 = ((i & 4) << 1) | (i & 3);
        let tmp: u32 = unchecked(state[j0lm]);
        unchecked(state[j0lm] = state[j0lm + 4]);
        unchecked(state[j0lm + 4] = tmp);
    }
    // xor 1jklm into 0jklm for each j, k, l, m
    for (i = 0; i < 16; i++) {
        unchecked(state[i] = state[i] ^ state[i + 16]);
    }
    // swap 1jkl0 with 1jkl1 for each j, k, l
    for (i = 0; i < 8; i++) {
        // bit manipulation
        let jkl0: u8 = (i << 1) + 16;
        let tmp: u32 = unchecked(state[jkl0]);
        unchecked(state[jkl0] = state[jkl0 + 1]);
        unchecked(state[jkl0 + 1] = tmp);
    }
}

/*
    here's the actual hash implementation
*/
export function hash(m: Uint8Array, i: u32, r: u32, b: u32, f: u32, h: u32): Uint8Array {
    // we want a u8 array of proper girth
    let message: Uint8Array = m.length % b !== 0 ? new Uint8Array((m.length / b) * b) : new Uint8Array(m.length + b);
    // counters for our various loops
    let j: u32 = 0;
    let k: u32 = 0;
    // insert message
    for (j = 0; j < u32(m.length); j++) {
        unchecked(message[j] = m[j]);
    }
    // pad
    unchecked(message[m.length] = 128);
    // initialize our state
    let state: Uint32Array = new Uint32Array(32);
    unchecked(state[0] = h / 8);
    unchecked(state[1] = b);
    unchecked(state[2] = r);
    // put our state through i iterations
    for (j = 0; j < i; j++) {
        round(state);
    }
    // create a uint8array from our state for easy xoring
    let uint8State: Uint8Array = Uint8Array.wrap(state.buffer);
    // for each input block
    let inputBlocks: u32 = message.length / b;
    for (j = 0; j < inputBlocks; j++) {
        // for each byte in the input block
        let jTimesB: u32 = j * b;
        for (k = 0; k < b; k++) {
            // xor the state with the byte
            unchecked(uint8State[k] = uint8State[k] ^ message[jTimesB + k]);
        }
        // transform the state through r rounds
        for (k = 0; k < r; k++) {
            round(state);
        }
    }
    // xor 1 into the last state word
    unchecked(state[31] = state[31] ^ 1);
    // transform the state through f rounds
    for (j = 0; j < f; j++) {
        round(state);
    }
    // return the first h / 8 bytes of the state
    return uint8State.slice(0, h / 8);
}

export const Uint8Array_ID = idof<Uint8Array>();