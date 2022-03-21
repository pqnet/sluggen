// @ts-check
/** @type { Record<string, { family: string, favor: Record<string,number>}> } */
const families = {
    vowels: { family: 'aeju', favor: { consonnants: 0.3, vowels: 0.05 } },
    consonnants: { family: 'bcdfghkmnpqrstvwxyz', favor: { vowels: 0.2, consonnants: 0.1 } },
    numbers: { family: '123456789', favor: { numbers: 0.2 } }
};

/** 
 * @template T
 * @arg {Array<[T,number]>} input
 * @return {Array<[T,number]>}
 **/
function cumProb(input, normalize = false) {
    /** @type {Array<[T,number]>} */
    const result = [];
    let acc = 0;
    for (const [v, p] of input) {
        acc += p;
        result.push([v, acc]);
    }
    if (normalize) {
        return result.map(([v, p]) => [v, p / result[result.length - 1][1]]);
    }
    return result;
}
/** @argument {string} prev */
/** @returns {string} */
function nextFromFamilies(prev) {
    const [, oldFamily] = Object.entries(families).find(([, { family }]) => family.includes(prev));
    const nextFamilyRnd = Math.random();
    const familyMemberRnd = Math.random();

    const nextFamilyEntry = cumProb(Object.entries(oldFamily.favor))
        .find(([, f]) => f > nextFamilyRnd)

    if (nextFamilyEntry) {
        const nextFamily = families[nextFamilyEntry[0]].family;
        return nextFamily[Math.floor(familyMemberRnd * nextFamily.length)];
    } else {
        const [nextFamily] = cumProb(Object.entries(families).map(([n,v])=> [v.family,v.family.length]), true).find(([, f]) => f > nextFamilyRnd);
        return nextFamily[Math.floor(familyMemberRnd * nextFamily.length)];
    }
}

const letters = 'abcdefghjkmnpqrstuvwxyz';
const numbers = '123456789';
// 23 + 9 = 32
const pl = 23 / 32;
const pn = 9 / 32;
const pstay = 40 / 100;
const pll = pstay + (1 - pstay) * pl;
// const pln = 1 - pll;
const pnn = pstay + (1 - pstay) * pn;
const pnl = 1 - pnn;
/** @argument {string} prev */
/** @returns {string} */
function next(prev) {
    const nextFamilyRnd = Math.random();
    const familyMemberRnd = Math.random();
    const letterThresh = letters.includes(prev) ? pll : pnl;
    if (nextFamilyRnd < letterThresh) {
        return letters[Math.floor(familyMemberRnd * letters.length)];
    } else {
        return letters[Math.floor(familyMemberRnd * letters.length)];
    }
}
const process = require('process');

const wordLength = process.argv[2] || 8;
const wordCount = process.argv[3] || 5;
console.log(wordLength, wordCount);

function genWord() {
    // encourage starting with letters because keyboard is naturally in letter mode
    let lastLetter = 'a';
    /** @type {string[]} */
    const resultArray = [];
    for (let i = 0; i < wordLength; i++) {
        lastLetter = nextFromFamilies(lastLetter);
        resultArray.push(lastLetter);
    }
    return resultArray.join('');
}

for (let i = 1; i < wordCount; i++) {
    console.log(genWord());
}