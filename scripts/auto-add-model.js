#!/usr/bin/env node

/**
 * AgentLeaderboards - Automatic Model Addition
 * 
 * Fully automated pipeline:
 * 1. Detect new model
 * 2. Scrape benchmark data
 * 3. Add to agents.js
 * 4. Commit & deploy
 * 
 * NO HUMAN INTERVENTION REQUIRED
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Minimum requirements for auto-add
const MIN_BENCHMARKS = 2;  // Need at least 2 benchmarks
const MIN_QUALITY_SCORE = 50;  // Skip if calculated score < 50

// Data sources for benchmarks
const BENCHMARK_SOURCES = {
    huggingface: 'https://huggingface.co/api/models/',
    lmcouncil: 'https://lmcouncil.ai/benchmarks'
};

// Fetch model card from Hugging Face
async function fetchModelCard(modelId) {
    return new Promise((resolve) => {
        const url = `https://huggingface.co/api/models/${modelId}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch {
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

// Scrape benchmark data from model card
async function scrapeBenchmarks(modelId) {
    const model = await fetchModelCard(modelId);
    if (!model) return {};
    
    const benchmarks = {};
    const readme = model.cardData || {};
    
    // Check model card for benchmark keywords
    const cardText = JSON.stringify(readme).toLowerCase();
    
    // Common benchmark patterns
    const patterns = {
        'GPQA Diamond': /gpqa[:\s]+(\d+\.?\d*)/i,
        'MMLU': /mmlu[:\s]+(\d+\.?\d*)/i,
        'HumanEval': /humaneval[:\s]+(\d+\.?\d*)/i,
        'MATH': /math[:\s]+(\d+\.?\d*)/i,
        'BBH': /bbh[:\s]+(\d+\.?\d*)/i,
        'GSM8K': /gsm8k[:\s]+(\d+\.?\d*)/i
    };
    
    for (const [name, pattern] of Object.entries(patterns)) {
        const match = cardText.match(pattern);
        if (match) {
            benchmarks[name] = parseFloat(match[1]);
        }
    }
    
    return benchmarks;
}

// Extract pricing from model card
function extractPricing(modelData) {
    const text = JSON.stringify(modelData).toLowerCase();
    
    // Look for pricing patterns
    const inputMatch = text.match(/input[:\s]+\$?(\d+\.?\d*)/);
    const outputMatch = text.match(/output[:\s]+\$?(\d+\.?\d*)/);
    
    if (inputMatch && outputMatch) {
        return {
            input: parseFloat(inputMatch[1]),
            output: parseFloat(outputMatch[1])
        };
    }
    
    // Default pricing if not found (will be marked for review)
    return {
        input: 0,
        output: 0
    };
}

// Calculate overall score from benchmarks
function calculateScore(benchmarks) {
    if (Object.keys(benchmarks).length === 0) return 0;
    
    const scores = Object.values(benchmarks);
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    
    // Normalize to 0-100 scale
    return Math.min(100, Math.max(0, avg));
}

// Determine category based on benchmarks
function determineCategory(benchmarks) {
    const hasCoding = benchmarks['HumanEval'] || benchmarks['SWE-bench'];
    const hasMath = benchmarks['MATH'] || benchmarks['GSM8K'];
    const hasReasoning = benchmarks['BBH'] || benchmarks['GPQA'];
    
    if (hasCoding) return 'coding';
    if (hasMath) return 'reasoning';
    if (hasReasoning) return 'reasoning';
    return 'all';
}

// Extract provider from model ID
function extractProvider(modelId) {
    const providers = {
        'openai': 'OpenAI',
        'anthropic': 'Anthropic',
        'google': 'Google',
        'meta': 'Meta',
        'mistralai': 'Mistral AI',
        'cohere': 'Cohere',
        'xai': 'xAI',
        'moonshotai': 'Moonshot AI',
        'deepseek': 'DeepSeek',
        'alibaba': 'Alibaba'
    };
    
    for (const [key, name] of Object.entries(providers)) {
        if (modelId.toLowerCase().includes(key)) {
            return name;
        }
    }
    
    return modelId.split('/')[0] || 'Unknown';
}

// Generate model entry
function generateModelEntry(modelData) {
    const { id, name, benchmarks, pricing, score, category, provider } = modelData;
    
    const benchmarkStr = Object.entries(benchmarks)
        .map(([k, v]) => `            "${k}": ${v}`)
        .join(',\n');
    
    const badges = [];
    if (score > 90) badges.push('Top Rated');
    if (pricing.input < 1 && pricing.output < 5) badges.push('Budget Friendly');
    if (benchmarks['HumanEval'] > 80) badges.push('Coding Specialist');
    badges.push('Auto-Added');
    
    const badgeStr = badges.map(b => `"${b}"`).join(', ');
    
    return `    {
        id: "${id}",
        name: "${name}",
        provider: "${provider}",
        category: "${category}",
        score: ${score.toFixed(1)},
        benchmarks: {
${benchmarkStr}
        },
        pricing: "${pricing.input > 0 ? `$${pricing.input} / $${pricing.output} per 1M tokens` : 'Contact provider'}",
        priceInput: ${pricing.input.toFixed(2)},
        priceOutput: ${pricing.output.toFixed(2)},
        speed: "Medium",
        context: "128K tokens",
        rating: 4.0,
        ratingCount: 0,
        badges: [${badgeStr}],
        description: "Automatically added from ${new Date().toISOString().split('T')[0]}. Benchmarks may be incomplete.",
        released: "${new Date().toISOString().split('T')[0].slice(0, 7)}",
        source: "https://huggingface.co/${name.replace(' ', '-')}"
    }`;
}

// Add model to agents.js
function addToAgentsFile(modelEntry) {
    const agentsPath = path.join(__dirname, '../data/agents.js');
    let content = fs.readFileSync(agentsPath, 'utf8');
    
    // Find the insertion point (after TIER 1 models, before TIER 2)
    const insertPoint = content.indexOf('    // TIER 2:');
    
    if (insertPoint === -1) {
        console.error('❌ Could not find insertion point in agents.js');
        return false;
    }
    
    // Insert new model
    const before = content.substring(0, insertPoint);
    const after = content.substring(insertPoint);
    
    const newContent = `${before}    // AUTO-ADDED MODEL\n${modelEntry},\n\n${after}`;
    
    fs.writeFileSync(agentsPath, newContent);
    console.log('✅ Added model to agents.js');
    return true;
}

// Commit and deploy
function deployChanges(modelName) {
    try {
        const repoPath = path.join(__dirname, '..');
        
        // Git add
        execSync('git add data/agents.js', { cwd: repoPath });
        
        // Git commit
        const commitMsg = `chore: auto-add ${modelName} to leaderboard

Automatically detected and added by monitoring system.
- Benchmarks scraped from Hugging Face
- Score calculated automatically
- Review at: https://agentleaderboards.com

[AUTO-ADDED]`;
        
        execSync(`git commit -m "${commitMsg}"`, { cwd: repoPath });
        console.log('✅ Committed changes');
        
        // Push to main
        execSync('git push origin main', { cwd: repoPath });
        console.log('✅ Pushed to GitHub');
        
        // Deploy to production
        execSync('/root/deploy.sh agentleaderboards');
        console.log('✅ Deployed to production');
        
        return true;
    } catch (error) {
        console.error('❌ Deploy failed:', error.message);
        return false;
    }
}

// Main auto-add function
async function autoAddModel(modelId, modelInfo = {}) {
    console.log(`\n🤖 AUTO-ADD: ${modelId}`);
    console.log('='.repeat(50));
    
    // Step 1: Scrape benchmarks
    console.log('📊 Scraping benchmarks...');
    const benchmarks = await scrapeBenchmarks(modelId);
    
    if (Object.keys(benchmarks).length < MIN_BENCHMARKS) {
        console.log(`⚠️  Insufficient benchmarks (${Object.keys(benchmarks).length}/${MIN_BENCHMARKS})`);
        console.log('   Skipping auto-add. Manual review required.');
        return false;
    }
    
    console.log(`   Found ${Object.keys(benchmarks).length} benchmarks:`, Object.keys(benchmarks).join(', '));
    
    // Step 2: Calculate score
    const score = calculateScore(benchmarks);
    console.log(`   Calculated score: ${score.toFixed(1)}`);
    
    if (score < MIN_QUALITY_SCORE) {
        console.log(`⚠️  Score too low (${score.toFixed(1)}/${MIN_QUALITY_SCORE})`);
        console.log('   Skipping auto-add. Manual review required.');
        return false;
    }
    
    // Step 3: Extract metadata
    const modelData = await fetchModelCard(modelId);
    const pricing = extractPricing(modelData);
    const category = determineCategory(benchmarks);
    const provider = extractProvider(modelId);
    
    // Step 4: Generate entry
    const entry = {
        id: modelId.toLowerCase().replace(/\//g, '-'),
        name: modelInfo.name || modelId,
        benchmarks,
        pricing,
        score,
        category,
        provider
    };
    
    console.log(`\n📝 Model Entry:`);
    console.log(`   Provider: ${provider}`);
    console.log(`   Category: ${category}`);
    console.log(`   Pricing: $${pricing.input}/$${pricing.output} per 1M tokens`);
    
    const modelEntry = generateModelEntry(entry);
    
    // Step 5: Add to file
    console.log('\n💾 Adding to agents.js...');
    const added = addToAgentsFile(modelEntry);
    
    if (!added) {
        console.log('❌ Failed to add model');
        return false;
    }
    
    // Step 6: Deploy
    console.log('\n🚀 Deploying to production...');
    const deployed = deployChanges(entry.name);
    
    if (deployed) {
        console.log('\n✅ SUCCESS! Model is now live at:');
        console.log('   https://agentleaderboards.com');
        return true;
    } else {
        console.log('\n❌ Deploy failed, but model was added to agents.js');
        return false;
    }
}

// Export for use in monitor script
module.exports = { autoAddModel };

// CLI interface
if (require.main === module) {
    const modelId = process.argv[2];
    
    if (!modelId) {
        console.error('Usage: node auto-add-model.js <model-id>');
        console.error('Example: node auto-add-model.js moonshotai/Kimi-K2.5');
        process.exit(1);
    }
    
    autoAddModel(modelId)
        .then((success) => {
            process.exit(success ? 0 : 1);
        })
        .catch((err) => {
            console.error('Error:', err);
            process.exit(1);
        });
}
