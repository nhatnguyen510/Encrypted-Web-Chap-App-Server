import { createDiffieHellman, DiffieHellman, randomBytes } from "crypto";
import dotenv from "dotenv";

dotenv.config();

const salt = randomBytes(16);
console.log(salt.toString("hex").length);

const p = process.env.PRIME;
const g = process.env.GENERATOR;

const server = createDiffieHellman(p, g);

// Generate Alice's key pair
const alice = createDiffieHellman(server.getPrime(), server.getGenerator());
const alicePublicKey = alice.generateKeys();

// Generate Bob's key pair
const bob = createDiffieHellman(server.getPrime(), server.getGenerator());
const bobPublicKey = bob.generateKeys();

// Generate Bob's key pair
const abc = createDiffieHellman(server.getPrime(), server.getGenerator());
const abcPublicKey = abc.generateKeys();

// Generate Bob's key pair
const def = createDiffieHellman(server.getPrime(), server.getGenerator());
const defPublicKey = def.generateKeys();

// How to save bob instance?
const bob2 = createDiffieHellman(bob.getPrime(), bob.getGenerator());
bob2.setPrivateKey(bob.getPrivateKey());
bob2.setPublicKey(bob.getPublicKey());
const bob2PublicKey = bob2.getPublicKey();

const aliceSecret = alice.computeSecret(bobPublicKey);
const bobSecret = bob.computeSecret(alicePublicKey);

const alice2Secret = alice.computeSecret(bob2PublicKey);
const bob2Secret = bob2.computeSecret(alicePublicKey);

const abcSecret = abc.computeSecret(defPublicKey);
const defSecret = def.computeSecret(abcPublicKey);

console.log({
  aliceSecret: aliceSecret.toString("hex").length,
  bobSecret: bobSecret.toString("hex"),
  alice2Secret: alice2Secret.toString("hex"),
  bob2Secret: bob2Secret.toString("hex"),
  abcSecret: abcSecret.toString("hex"),
  defSecret: defSecret.toString("hex"),
});
