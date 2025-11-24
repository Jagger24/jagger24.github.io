// Script to generate a valid tournament structure for 12 players
// Each player must play with each other player exactly once

function generateTournamentStructure12() {
    const players = 12;
    const rounds = players - 1; // 11 rounds
    const teamsPerRound = players / 2; // 6 teams per round
    
    // Track which pairs have been used
    const usedPairs = new Set();
    const structure = [];
    
    // Generate all possible pairs
    const allPairs = [];
    for (let i = 1; i <= players; i++) {
        for (let j = i + 1; j <= players; j++) {
            allPairs.push([i, j]);
        }
    }
    
    // Shuffle pairs for randomness
    const shuffled = [...allPairs].sort(() => Math.random() - 0.5);
    
    // Try to build rounds
    for (let round = 0; round < rounds; round++) {
        const roundTeams = [];
        const usedInRound = new Set();
        const roundPairs = [];
        
        // Try to find 6 teams that don't share players
        for (const pair of shuffled) {
            if (usedInRound.has(pair[0]) || usedInRound.has(pair[1])) continue;
            
            const pairKey = `${Math.min(pair[0], pair[1])}-${Math.max(pair[0], pair[1])}`;
            if (usedPairs.has(pairKey)) continue;
            
            roundPairs.push(pair);
            usedInRound.add(pair[0]);
            usedInRound.add(pair[1]);
            usedPairs.add(pairKey);
            
            if (roundPairs.length === teamsPerRound) break;
        }
        
        if (roundPairs.length !== teamsPerRound) {
            console.error(`Failed to generate round ${round + 1}`);
            return null;
        }
        
        // Pair teams into matches (3 matches per round)
        const matches = [];
        for (let i = 0; i < teamsPerRound; i += 2) {
            matches.push([roundPairs[i], roundPairs[i + 1]]);
        }
        
        structure.push(matches);
    }
    
    return structure;
}

// Try multiple times to get a valid structure
let structure = null;
for (let attempt = 0; attempt < 100; attempt++) {
    structure = generateTournamentStructure12();
    if (structure) {
        console.log('Valid structure found!');
        break;
    }
}

if (structure) {
    console.log(JSON.stringify(structure, null, 2));
} else {
    console.log('Failed to generate valid structure');
}

