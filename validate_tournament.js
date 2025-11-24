// Validate tournament structure for uniqueness
const structure = [
    [[[1, 2], [3, 4]], [[5, 6], [7, 8]], [[9, 10], [11, 12]]],
    [[[1, 3], [2, 5]], [[4, 7], [6, 9]], [[8, 11], [10, 12]]],
    [[[1, 4], [3, 6]], [[2, 8], [5, 10]], [[7, 12], [9, 11]]],
    [[[1, 5], [4, 6]], [[2, 9], [7, 11]], [[3, 12], [8, 10]]],
    [[[1, 6], [5, 8]], [[3, 10], [4, 11]], [[2, 12], [7, 9]]],
    [[[1, 7], [3, 5]], [[6, 11], [8, 12]], [[2, 10], [4, 9]]],
    [[[1, 8], [6, 7]], [[2, 11], [3, 9]], [[4, 12], [5, 10]]],
    [[[1, 9], [4, 7]], [[2, 6], [8, 11]], [[3, 8], [10, 12]]],
    [[[1, 10], [2, 4]], [[3, 7], [5, 9]], [[6, 12], [8, 11]]],
    [[[1, 11], [2, 3]], [[4, 8], [6, 10]], [[5, 12], [7, 9]]],
    [[[1, 12], [2, 7]], [[3, 8], [4, 9]], [[5, 11], [6, 10]]]
];

const pairs = new Set();
const duplicates = [];

structure.forEach((round, roundIdx) => {
    round.forEach(match => {
        match.forEach(team => {
            const key = `${Math.min(team[0], team[1])}-${Math.max(team[0], team[1])}`;
            if (pairs.has(key)) {
                duplicates.push({round: roundIdx + 1, team, key});
            }
            pairs.add(key);
        });
    });
});

console.log('Total unique pairs:', pairs.size);
console.log('Expected pairs:', 12 * 11 / 2);
console.log('Duplicates found:', duplicates);
if (duplicates.length > 0) {
    console.log('\nDuplicates:');
    duplicates.forEach(d => console.log(`Round ${d.round}: [${d.team.join(', ')}]`));
}

// Check what pairs each player has
const playerPairs = {};
for (let i = 1; i <= 12; i++) {
    playerPairs[i] = new Set();
}

structure.forEach(round => {
    round.forEach(match => {
        match.forEach(team => {
            playerPairs[team[0]].add(team[1]);
            playerPairs[team[1]].add(team[0]);
        });
    });
});

console.log('\nPlayer pair counts:');
for (let i = 1; i <= 12; i++) {
    console.log(`Player ${i}: ${playerPairs[i].size} partners (should be 11)`);
    if (playerPairs[i].size !== 11) {
        const missing = [];
        for (let j = 1; j <= 12; j++) {
            if (j !== i && !playerPairs[i].has(j)) {
                missing.push(j);
            }
        }
        console.log(`  Missing: ${missing.join(', ')}`);
    }
}

