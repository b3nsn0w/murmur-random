// Gary Court's code, with minimal modifications so that it works on a uint32array instead of a string

/* eslint-disable */

/**
 * JS Implementation of MurmurHash3 (r136) (as of May 20, 2011) (modified at Nov 26, 2018)
 * 
 * @author <a href="mailto:gary.court@gmail.com">Gary Court</a>
 * @see http://github.com/garycourt/murmurhash-js
 * @author <a href="mailto:aappleby@gmail.com">Austin Appleby</a>
 * @see http://sites.google.com/site/murmurhash/
 * 
 * @param {Uint32Array} key
 * @param {number} seed Positive integer only
 * @return {number} 32-bit positive integer hash 
 */

function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
  
  // unnecessary, (actual) key length is always divisible by 4
  // remainder = key.length & 3; // key.length % 4
  remainder = 0
	bytes = key.length // - remainder; // not actually bytes btw
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;

	while (i < bytes) {
    // because I first thought uint8array would be a good idea, but if we're converting from float32array, it's unnecessary
	  // 	k1 = 
	  // 	  (key[i]) |
	  // 	  (key[++i] << 8) |
	  // 	  (key[++i] << 16) |
	  // 	  (key[++i] << 24);
    // ++i;
    k1 = key[i++]
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
  
  // unnecessary, remaninder would be always 0
	// switch (remainder) {
	// 	case 3: k1 ^= key[i + 2] << 16;
	// 	case 2: k1 ^= key[i + 1] << 8;
	// 	case 1: k1 ^= key[i];
		
	// 	k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
	// 	k1 = (k1 << 15) | (k1 >>> 17);
	// 	k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
	// 	h1 ^= k1;
	// }
	
	h1 ^= key.length * 4; // because we were cheating with uint32array all the way through

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

/* eslint-enable */

// and now the custom wrapper stuff around it

const MAX_INT = Math.pow(2, 32)

/**
 * Deterministic Math.random() replacement with Murmur3
 *
 * @param {number[]} numbers hash input, same values will return the same result
 * @param {boolean} raw if true, the result will be the raw 32-bit integer
 * @returns {number} between 0 and 1
 */

module.exports = function murmur (numbers, raw = false) {
  const converted = new Uint32Array(new Float32Array(numbers).buffer)
  const result = murmurhash3_32_gc(converted)
  return raw ? result : result / MAX_INT
}
