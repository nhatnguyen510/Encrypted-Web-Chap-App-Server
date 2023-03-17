import { createDiffieHellman } from "crypto";

const server = createDiffieHellman(128);

// Generate Alice's key pair
const alice = createDiffieHellman(server.getPrime(), server.getGenerator());
const alicePublicKey = alice.generateKeys();

// Generate Bob's key pair
const bob = createDiffieHellman(server.getPrime(), server.getGenerator());
const bobPublicKey = bob.generateKeys();

const nhat = createDiffieHellman(server.getPrime(), server.getGenerator());
const nhatPublicKey = nhat.generateKeys();

// Alice computes the shared secret using Bob's public key
const aliceSecret = alice.computeSecret(bobPublicKey);

const nhatSecret = nhat.computeSecret(alicePublicKey);

const alice2Secret = alice.computeSecret(nhatPublicKey);

// Bob computes the shared secret using Alice's public key
const bobSecret = bob.computeSecret(alicePublicKey);

console.log({
  bobSecret: bobSecret.toString("hex"),
  aliceSecret: aliceSecret.toString("hex"),
  nhatSecret: nhatSecret.toString("hex"),
  alice2Secret: alice2Secret.toString("hex"),
}); // true
