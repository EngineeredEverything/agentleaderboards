// Score recalculation script
// Run: node scripts/recalc-scores.js

const fs = require('fs');

const WEIGHTS = {
    'GPQA Diamond':         1.5,
    'SWE-bench Verified':   1.5,
    'MATH Level 5':         1.0,
    'SimpleBench':          1.0,
    "Humanity's Last Exam": 1.0,
    'METR Time Horizons':   0.8,
    'Terminal-Bench 2.0':   1.0,
    'Aider Polyglot':       1.0,
    'FrontierMath':         1.2,
    'BALROG':               0.8,
    'Fiction.liveBench':    0.6,
    'OTIS Mock AIME':       0.8,
    'GSO':                  0.8,
    'DeepResearchBench':    0.8,
    'AIME 2025':            0.8,
    'HMMT 2025':            0.8,
    'BrowseComp':           0.8,
    'Factorio Learning':    0.5,
    'VPCT':                 0.6,
    // Skipped (non-comparable scales):
    // 'GeoBench': 0,
    // 'WebDev Arena': 0,
};

function normalize(name, raw) {
    if (name === "Humanity's Last Exam") return Math.min(100, raw * 2.5);
    if (name === 'METR Time Horizons')   return Math.min(100, raw / 300 * 100);
    return Math.min(100, Math.max(0, raw));
}

function calculateScore(agent) {
    const benchmarks = agent.benchmarks || {};
    let weightedSum = 0;
    let totalWeight = 0;
    let benchCount = 0;

    for (const [name, raw] of Object.entries(benchmarks)) {
        const weight = WEIGHTS[name];
        if (!weight) continue; // skip unknown or zero-weight benchmarks
        const norm = normalize(name, raw);
        weightedSum += norm * weight;
        totalWeight += weight;
        benchCount++;
    }

    if (totalWeight === 0) return 70.0; // no usable benchmarks — return baseline

    const rawAvg = weightedSum / totalWeight;
    const confidenceFactor = Math.min(1.0, benchCount / 4);
    const finalScore = rawAvg * confidenceFactor + 70 * (1 - confidenceFactor);
    return Math.round(finalScore * 10) / 10;
}

// Read agents.js, parse, recalculate, write back
const src = fs.readFileSync(__dirname + '/../data/agents.js', 'utf8');
eval(src.replace('const AGENTS', 'global.AGENTS').replace('const CATEGORIES', 'global.CATEGORIES').replace('const BENCHMARKS', 'global.BENCHMARKS'));

console.log('\nScore recalculation:\n');
console.log('Model'.padEnd(30), 'Old'.padEnd(8), 'New'.padEnd(8), 'Value(pts/$)');
console.log('-'.repeat(70));

global.AGENTS.forEach(agent => {
    const oldScore = agent.score;
    const newScore = calculateScore(agent);
    const valueScore = agent.priceInput > 0 ? Math.round(newScore / agent.priceInput * 10) / 10 : null;
    agent.score = newScore;
    agent.valueScore = valueScore;
    console.log(
        agent.name.padEnd(30),
        String(oldScore).padEnd(8),
        String(newScore).padEnd(8),
        valueScore !== null ? valueScore : 'N/A'
    );
});

// Sort by score desc for clean file order
global.AGENTS.sort((a, b) => b.score - a.score);

// Rebuild the JS file content
const agentsJson = JSON.stringify(global.AGENTS, null, 4)
    .replace(/"([^"]+)":/g, '$1:')   // unquote keys for JS style
    .replace(/"/g, "'");              // single quotes

// Instead of serialising as JS object (fragile), write as clean JSON assigned to const
const newSrc = `// Real AI Agent Data for AgentLeaderboards
// Source: LM Council Benchmarks + LLM Stats + Community Benchmarks
// Scores derived from weighted benchmark averages — see /about.html for methodology
// Last updated: ${new Date().toISOString().split('T')[0]}

const AGENTS = ${JSON.stringify(global.AGENTS, null, 4)};

` + src.split('\n').slice(src.split('\n').findIndex(l => l.startsWith('// Category metadata'))).join('\n');

fs.writeFileSync(__dirname + '/../data/agents.js', newSrc);
console.log('\n✅ data/agents.js updated');
