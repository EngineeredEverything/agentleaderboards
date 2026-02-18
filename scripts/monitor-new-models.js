#!/usr/bin/env node

/**
 * AgentLeaderboards - New Model Monitor
 * 
 * Automatically checks for new AI model releases and benchmark data from:
 * - Hugging Face Open LLM Leaderboard
 * - LM Council Benchmarks
 * - arXiv preprints
 * - AI lab announcements (Anthropic, OpenAI, Google, etc.)
 * 
 * Usage:
 * - node monitor-new-models.js              # Check for new models
 * - node monitor-new-models.js --notify     # Send notification if new models found
 * - node monitor-new-models.js --auto-add   # Automatically add to leaderboard
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuration
const SOURCES = {
    huggingface: 'https://huggingface.co/api/models?sort=trending&limit=50&filter=text-generation',
    lmcouncil: 'https://lmcouncil.ai/benchmarks',
    arxiv: 'https://export.arxiv.org/api/query?search_query=cat:cs.CL+AND+ti:llm&sortBy=submittedDate&sortOrder=descending&max_results=20',
};

// Known model families to watch
const WATCHED_PROVIDERS = [
    'openai',
    'anthropic',
    'google',
    'meta',
    'mistral',
    'cohere',
    'xai',
    'moonshotai',
    'deepseek',
    'alibaba',
    'huggingface'
];

// Benchmark keywords to look for in papers/releases
const BENCHMARK_KEYWORDS = [
    'gpqa',
    'swe-bench',
    'mmlu',
    'humaneval',
    'math',
    'aime',
    'bbh',
    'ifeval',
    'terminal-bench',
    'lm council',
    'open llm leaderboard'
];

// Load existing models from agents.js
function loadExistingModels() {
    const agentsPath = path.join(__dirname, '../data/agents.js');
    const content = fs.readFileSync(agentsPath, 'utf8');
    
    // Extract model IDs using regex
    const idMatches = content.matchAll(/id: "([^"]+)"/g);
    const existingIds = new Set(Array.from(idMatches, m => m[1]));
    
    console.log(`📊 Loaded ${existingIds.size} existing models`);
    return existingIds;
}

// Fetch from Hugging Face API
async function checkHuggingFace() {
    return new Promise((resolve) => {
        https.get(SOURCES.huggingface, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const models = JSON.parse(data);
                    // Handle both array and paginated response
                    const modelList = Array.isArray(models) ? models : (models.data || []);
                    const newModels = modelList
                        .filter(m => m.modelId && m.downloads > 1000)
                        .map(m => ({
                            id: m.modelId.toLowerCase().replace(/\//g, '-'),
                            name: m.modelId,
                            source: 'huggingface',
                            downloads: m.downloads,
                            likes: m.likes,
                            url: `https://huggingface.co/${m.modelId}`
                        }));
                    resolve(newModels);
                } catch (e) {
                    console.error('❌ HuggingFace API error:', e.message);
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

// Check arXiv for new LLM papers
async function checkArxiv() {
    return new Promise((resolve) => {
        https.get(SOURCES.arxiv, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const papers = [];
                const entries = data.match(/<entry>[\s\S]*?<\/entry>/g) || [];
                
                entries.forEach(entry => {
                    const title = entry.match(/<title>(.*?)<\/title>/)?.[1];
                    const published = entry.match(/<published>(.*?)<\/published>/)?.[1];
                    const id = entry.match(/<id>(.*?)<\/id>/)?.[1];
                    
                    if (title && published) {
                        papers.push({
                            title: title.replace(/\n/g, ' ').trim(),
                            date: new Date(published),
                            url: id,
                            source: 'arxiv'
                        });
                    }
                });
                
                resolve(papers);
            });
        }).on('error', () => resolve([]));
    });
}

// Simple web scraper for LM Council (fallback if no API)
async function checkLMCouncil() {
    // TODO: Implement scraping or check for RSS/API
    // For now, return empty array
    return [];
}

// Analyze if a model has benchmark data
function hasBenchmarkData(modelInfo) {
    if (!modelInfo) return false;
    
    const text = JSON.stringify(modelInfo).toLowerCase();
    return BENCHMARK_KEYWORDS.some(keyword => text.includes(keyword));
}

// Generate model entry for agents.js
function generateModelEntry(modelData) {
    // Template for new model (to be filled manually or via API)
    return `    {
        id: "${modelData.id}",
        name: "${modelData.name}",
        provider: "UNKNOWN",
        category: "all",
        score: 0, // TODO: Calculate from benchmarks
        benchmarks: {
            // TODO: Add benchmark scores
        },
        pricing: "UNKNOWN",
        priceInput: 0,
        priceOutput: 0,
        speed: "Medium",
        context: "UNKNOWN",
        rating: 4.0,
        ratingCount: 0,
        badges: ["New Release"],
        description: "Recently released model - benchmarks pending",
        released: "${new Date().toISOString().split('T')[0].slice(0, 7)}",
        source: "${modelData.url || 'UNKNOWN'}"
    },`;
}

// Main monitoring function
async function monitorNewModels() {
    console.log('🔍 AgentLeaderboards - New Model Monitor');
    console.log('=========================================\n');
    
    const existingModels = loadExistingModels();
    const newFindings = [];
    
    // Check Hugging Face
    console.log('🤗 Checking Hugging Face...');
    const hfModels = await checkHuggingFace();
    const hfNew = hfModels.filter(m => !existingModels.has(m.id));
    
    if (hfNew.length > 0) {
        console.log(`   ✅ Found ${hfNew.length} new models on Hugging Face`);
        hfNew.slice(0, 5).forEach(m => {
            console.log(`      - ${m.name} (${m.downloads.toLocaleString()} downloads)`);
        });
        newFindings.push(...hfNew);
    } else {
        console.log('   ℹ️  No new trending models');
    }
    
    // Check arXiv
    console.log('\n📄 Checking arXiv papers...');
    const papers = await checkArxiv();
    const recentPapers = papers.filter(p => {
        const daysSince = (Date.now() - p.date.getTime()) / (1000 * 60 * 60 * 24);
        return daysSince < 7; // Last 7 days
    });
    
    if (recentPapers.length > 0) {
        console.log(`   ✅ Found ${recentPapers.length} recent LLM papers`);
        recentPapers.slice(0, 3).forEach(p => {
            console.log(`      - ${p.title.substring(0, 80)}...`);
        });
    } else {
        console.log('   ℹ️  No new papers in last 7 days');
    }
    
    // Summary
    console.log('\n📊 Summary:');
    console.log(`   - Total existing models: ${existingModels.size}`);
    console.log(`   - New models found: ${newFindings.length}`);
    console.log(`   - Recent papers: ${recentPapers.length}`);
    
    // Save report
    const report = {
        timestamp: new Date().toISOString(),
        existingCount: existingModels.size,
        newModels: newFindings,
        recentPapers: recentPapers,
        withBenchmarks: newFindings.filter(hasBenchmarkData).length
    };
    
    const reportPath = path.join(__dirname, '../data/new-models-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n💾 Report saved to: ${reportPath}`);
    
    // Check for notable new models
    const notable = newFindings.filter(m => 
        WATCHED_PROVIDERS.some(p => m.id.includes(p)) || 
        m.downloads > 50000
    );
    
    if (notable.length > 0) {
        console.log('\n🚨 NOTABLE NEW MODELS:');
        notable.forEach(m => {
            console.log(`   ⭐ ${m.name}`);
            console.log(`      Source: ${m.source}`);
            console.log(`      URL: ${m.url}`);
            if (m.downloads) console.log(`      Downloads: ${m.downloads.toLocaleString()}`);
        });
        
        // Auto-add notable models
        await processNewModels(notable);
    }
    
    return report;
}

// Auto-add integration
const AUTO_ADD_ENABLED = process.env.AUTO_ADD_MODELS !== 'false';

async function processNewModels(newModels) {
    if (!AUTO_ADD_ENABLED) {
        console.log('\n⚠️  Auto-add is disabled. Set AUTO_ADD_MODELS=true to enable.');
        return;
    }
    
    if (newModels.length === 0) {
        console.log('\nℹ️  No new models to process.');
        return;
    }
    
    console.log('\n🤖 AUTO-ADD MODE ENABLED');
    console.log('Processing new models automatically...\n');
    
    // Import auto-add module
    const { autoAddModel } = require('./auto-add-model.js');
    
    for (const model of newModels) {
        try {
            console.log(`\n${'='.repeat(60)}`);
            await autoAddModel(model.id, model);
            console.log(`${'='.repeat(60)}\n`);
        } catch (error) {
            console.error(`❌ Failed to auto-add ${model.id}:`, error.message);
        }
    }
}

// CLI interface
if (require.main === module) {
    monitorNewModels()
        .then(() => {
            console.log('\n✅ Monitoring complete');
            process.exit(0);
        })
        .catch(err => {
            console.error('\n❌ Error:', err);
            process.exit(1);
        });
}

module.exports = { monitorNewModels, loadExistingModels, processNewModels };
