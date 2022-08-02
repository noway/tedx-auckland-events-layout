const p = 65521; // largest prime that fits into 0xFFFF
const G = 31161; // p * 0.4756

function curve(x: number) {
  return Math.sqrt(x ** 3 + 7);
}

function prng(seq: number, seed: number) {
  const d = (seed << 8) | seq;
  return curve(G * d) % p;
}

export function random(seq: number, seed: number) {
  return prng(seq, seed) / p;
}