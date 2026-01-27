#!/usr/bin/env node

// Script pour générer un secret NextAuth
const crypto = require('crypto');

const secret = crypto.randomBytes(32).toString('base64');

console.log('\n🔐 Secret NextAuth généré :\n');
console.log(secret);
console.log('\n📋 Copiez cette valeur et ajoutez-la dans Hostinger :');
console.log('Variable : NEXTAUTH_SECRET');
console.log('Valeur   :', secret);
console.log('\n');
