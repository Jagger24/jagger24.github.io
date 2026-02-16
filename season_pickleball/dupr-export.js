// DUPR Export functionality
// This file handles CSV export for DUPR integration

/**
 * Export session data to DUPR CSV format
 * @param {number} sessionId - The session ID to export
 * @param {Object} session - The session object
 * @param {Array} players - Array of all players
 * @param {Object} sessionSubs - Object containing subs for each session
 * @param {string} seasonName - The name of the season
 */
function exportSessionToDUPR(sessionId, session, players, sessionSubs, seasonName) {
    // Helper function to get player name by ID
    const getPlayerName = (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player ? player.name : `Player ${playerId + 1}`;
    };

    // Helper function to get player DuprId by ID
    const getPlayerDuprId = (playerId) => {
        const player = players.find(p => p.id === playerId);
        return player ? (player.duprId || '') : '';
    };

    // Helper function to get sub info for a player
    const getSubInfo = (playerId) => {
        if (!sessionSubs[sessionId]) return null;
        return sessionSubs[sessionId].find(s => s.subbingFor === playerId);
    };

    // Helper function to get display name and DuprId (sub takes precedence)
    const getPlayerInfo = (playerId) => {
        const sub = getSubInfo(playerId);
        if (sub) {
            return {
                name: sub.subName,
                duprId: sub.duprId || ''
            };
        }
        return {
            name: getPlayerName(playerId),
            duprId: getPlayerDuprId(playerId)
        };
    };

    // Format date to YYYY-MM-DD
    const formatDate = (dateString) => {
        if (!dateString) return '';
        
        // Try to parse the date string
        let date;
        if (dateString.includes(',')) {
            // Format like "January 1, 2024"
            date = new Date(dateString);
        } else {
            // Try other formats
            date = new Date(dateString);
        }
        
        if (isNaN(date.getTime())) {
            // If parsing fails, try to use current date or return empty
            return '';
        }
        
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        
        return `${year}-${month}-${day}`;
    };

    // Build CSV rows
    const csvRows = [];
    
    // Add header row
    csvRows.push([
        'matchType',
        'scoreType',
        'event',
        'date',
        'playerA1',
        'playerA1DuprId',
        'playerA2',
        'playerA2DuprId',
        'playerB1',
        'playerB1DuprId',
        'playerB2',
        'playerB2DuprId',
        'teamAGame1',
        'teamBGame1',
    ]);

    // Process each match
    session.matches.forEach(match => {
        const team1Info = [
            getPlayerInfo(match.team1[0]),
            getPlayerInfo(match.team1[1])
        ];
        const team2Info = [
            getPlayerInfo(match.team2[0]),
            getPlayerInfo(match.team2[1])
        ];

        const team1Score = match.team1Score || '';
        const team2Score = match.team2Score || '';

        // Add row for this match
        csvRows.push([
            'D', // matchType
            'SIDEOUT', // scoreType
            seasonName || '', // event
            formatDate(session.date), // date
            team1Info[0].name, // playerA1
            team1Info[0].duprId, // playerA1DuprId
            team1Info[1].name, // playerA2
            team1Info[1].duprId, // playerA2DuprId
            team2Info[0].name, // playerB1
            team2Info[0].duprId, // playerB1DuprId
            team2Info[1].name, // playerB2
            team2Info[1].duprId, // playerB2DuprId
            team1Score, // teamAGame1
            team2Score // teamBGame1
        ]);
    });

    // Convert to CSV string
    const csvContent = csvRows.map(row => {
        // Escape fields that contain commas, quotes, or newlines
        return row.map(field => {
            const fieldStr = String(field || '');
            if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
                return `"${fieldStr.replace(/"/g, '""')}"`;
            }
            return fieldStr;
        }).join(',');
    }).join('\n');

    // Create and download file
    const sessionDate = formatDate(session.date) || 'session';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `dupr-export-session-${sessionId}-${sessionDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
}
