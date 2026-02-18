// Real AI Agent Data for AgentLeaderboards
// Source: LM Council Benchmarks (Feb 2026) + LLM Stats
// Last updated: 2026-02-17

const AGENTS = [
    // TIER 1: FRONTIER MODELS
    {
        id: "claude-opus-46",
        name: "Claude Opus 4.6",
        provider: "Anthropic",
        category: "coding",
        score: 90.5,
        benchmarks: {
            "GPQA Diamond": 90.5,
            "SimpleBench": 67.6,
            "Terminal-Bench 2.0": 69.9,
            "FrontierMath": 40.0,
            "MATH Level 5": 97.2
        },
        pricing: "$15 / $75 per 1M tokens",
        priceInput: 15.00,
        priceOutput: 75.00,
        speed: "Medium",
        context: "200K tokens",
        rating: 4.9,
        ratingCount: 847,
        badges: ["Top Rated", "Coding Specialist"],
        description: "Extended thinking, exceptional at complex reasoning and coding tasks",
        released: "Feb 2026",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "gpt-52-high",
        name: "GPT-5.2 (high)",
        provider: "OpenAI",
        category: "all",
        score: 88.2,
        benchmarks: {
            "GPQA Diamond": 88.2,
            "MATH Level 5": 98.1,
            "OTIS Mock AIME": 96.1,
            "FrontierMath": 40.3,
            "GSO": 27.4
        },
        pricing: "$10 / $30 per 1M tokens",
        priceInput: 10.00,
        priceOutput: 30.00,
        speed: "Fast",
        context: "400K tokens",
        rating: 4.8,
        ratingCount: 1243,
        badges: ["Popular", "Math Specialist"],
        description: "Latest GPT model with strong reasoning and mathematics capabilities",
        released: "Aug 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "gemini-3-pro",
        name: "Gemini 3 Pro Preview",
        provider: "Google",
        category: "research",
        score: 92.6,
        benchmarks: {
            "GPQA Diamond": 92.6,
            "SimpleBench": 76.4,
            "Humanity's Last Exam": 37.52,
            "VPCT": 91.0,
            "GeoBench": 3893
        },
        pricing: "$3.50 / $10.50 per 1M tokens",
        priceInput: 3.50,
        priceOutput: 10.50,
        speed: "Fast",
        context: "1M tokens",
        rating: 4.7,
        ratingCount: 923,
        badges: ["Best Value", "Long Context"],
        description: "Multi-modal powerhouse with 1M token context and live grounding",
        released: "Jan 2026",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "claude-sonnet-45",
        name: "Claude Sonnet 4.5",
        provider: "Anthropic",
        category: "coding",
        score: 94.2,
        benchmarks: {
            "SWE-bench Verified": 64.8,
            "DeepResearchBench": 57.7,
            "MATH Level 5": 97.7,
            "Terminal-Bench 2.0": 60.3,
            "METR Time Horizons": 113.3
        },
        pricing: "$3 / $15 per 1M tokens",
        priceInput: 3.00,
        priceOutput: 15.00,
        speed: "Fast",
        context: "200K tokens",
        rating: 4.9,
        ratingCount: 1847,
        badges: ["#1 Coding", "Best Value"],
        description: "Best coding model available, excellent at software engineering tasks",
        released: "Jan 2026",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "kimi-k25",
        name: "Kimi K2.5",
        provider: "Moonshot AI",
        category: "coding",
        score: 89.3,
        benchmarks: {
            "SWE-bench Verified": 76.8,
            "GPQA Diamond": 87.6,
            "AIME 2025": 96.1,
            "HMMT 2025": 95.4,
            "Humanity's Last Exam": 50.2,
            "BrowseComp": 74.9
        },
        pricing: "$0.60 / $2.50 per 1M tokens",
        priceInput: 0.60,
        priceOutput: 2.50,
        speed: "Fast",
        context: "256K tokens",
        rating: 4.8,
        ratingCount: 234,
        badges: ["#1 SWE-bench", "Agent Swarm", "Open Weights"],
        description: "Revolutionary Agent Swarm technology with 100 parallel agents, exceptional at coding and multi-step reasoning",
        released: "Jan 2026",
        source: "https://www.codecademy.com/article/kimi-k-2-5-complete-guide-to-moonshots-ai-model"
    },
    {
        id: "grok-4",
        name: "Grok 4",
        provider: "xAI",
        category: "all",
        score: 83.5,
        benchmarks: {
            "METR Time Horizons": 110.1,
            "BALROG": 43.6,
            "Fiction.liveBench": 96.9
        },
        pricing: "$5 / $15 per 1M tokens",
        priceInput: 5.00,
        priceOutput: 15.00,
        speed: "Fast",
        context: "128K tokens",
        rating: 4.5,
        ratingCount: 567,
        badges: ["Real-time Data"],
        description: "Real-time web access, strong at reasoning and long-context tasks",
        released: "Dec 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    
    // TIER 2: SPECIALIZED MODELS
    {
        id: "o3-high",
        name: "o3 (high)",
        provider: "OpenAI",
        category: "reasoning",
        score: 78.6,
        benchmarks: {
            "MATH Level 5": 97.8,
            "Fiction.liveBench": 100.0,
            "Humanity's Last Exam": 20.32,
            "GeoBench": 3789
        },
        pricing: "$20 / $100 per 1M tokens",
        priceInput: 20.00,
        priceOutput: 100.00,
        speed: "Slow",
        context: "128K tokens",
        rating: 4.6,
        ratingCount: 445,
        badges: ["Deep Reasoning"],
        description: "Specialized reasoning model for complex mathematics and logic",
        released: "Apr 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "claude-opus-45",
        name: "Claude Opus 4.5",
        provider: "Anthropic",
        category: "coding",
        score: 92.1,
        benchmarks: {
            "SWE-bench Verified": 74.4,
            "WebDev Arena": 1512,
            "GSO": 26.5,
            "METR Time Horizons": 288.9
        },
        pricing: "$15 / $75 per 1M tokens",
        priceInput: 15.00,
        priceOutput: 75.00,
        speed: "Medium",
        context: "200K tokens",
        rating: 4.8,
        ratingCount: 729,
        badges: ["#1 SWE-bench"],
        description: "Extended thinking for complex software engineering projects",
        released: "Late 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "gemini-25-pro",
        name: "Gemini 2.5 Pro",
        provider: "Google",
        category: "analysis",
        score: 85.9,
        benchmarks: {
            "SimpleBench": 62.4,
            "BALROG": 40.4,
            "Aider Polyglot": 83.1,
            "GeoBench": 3836
        },
        pricing: "$3.50 / $10.50 per 1M tokens",
        priceInput: 3.50,
        priceOutput: 10.50,
        speed: "Fast",
        context: "1M tokens",
        rating: 4.6,
        ratingCount: 812,
        badges: ["Multi-modal"],
        description: "Excellent multi-modal understanding and long-context processing",
        released: "Jun 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    
    // TIER 3: COST-EFFECTIVE OPTIONS
    {
        id: "gpt-5-medium",
        name: "GPT-5 (medium)",
        provider: "OpenAI",
        category: "all",
        score: 86.3,
        benchmarks: {
            "MATH Level 5": 97.9,
            "Fiction.liveBench": 96.9,
            "METR Time Horizons": 137.3,
            "Aider Polyglot": 86.7
        },
        pricing: "$5 / $15 per 1M tokens",
        priceInput: 5.00,
        priceOutput: 15.00,
        speed: "Fast",
        context: "400K tokens",
        rating: 4.7,
        ratingCount: 934,
        badges: ["Balanced"],
        description: "Mid-tier GPT-5 with excellent performance/cost ratio",
        released: "Aug 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "claude-haiku-45",
        name: "Claude Haiku 4.5",
        provider: "Anthropic",
        category: "coding",
        score: 82.4,
        benchmarks: {
            "SWE-bench Verified": 60.6
        },
        pricing: "$0.80 / $4 per 1M tokens",
        priceInput: 0.80,
        priceOutput: 4.00,
        speed: "Very Fast",
        context: "200K tokens",
        rating: 4.5,
        ratingCount: 612,
        badges: ["Fastest", "Budget Friendly"],
        description: "Lightning-fast responses, excellent for high-volume coding tasks",
        released: "Jan 2026",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "deepseek-r1",
        name: "DeepSeek-R1",
        provider: "DeepSeek",
        category: "coding",
        score: 79.2,
        benchmarks: {
            "BALROG": 34.9
        },
        pricing: "$0.55 / $2.19 per 1M tokens",
        priceInput: 0.55,
        priceOutput: 2.19,
        speed: "Fast",
        context: "64K tokens",
        rating: 4.3,
        ratingCount: 423,
        badges: ["Open Source", "Budget Friendly"],
        description: "Open-source reasoning model with strong coding performance",
        released: "Jan 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "gemini-25-flash",
        name: "Gemini 2.5 Flash",
        provider: "Google",
        category: "all",
        score: 77.8,
        benchmarks: {
            "BALROG": 33.5
        },
        pricing: "$0.075 / $0.30 per 1M tokens",
        priceInput: 0.075,
        priceOutput: 0.30,
        speed: "Very Fast",
        context: "1M tokens",
        rating: 4.4,
        ratingCount: 1125,
        badges: ["Cheapest", "Fast"],
        description: "Ultra-cheap and fast, great for high-volume simple tasks",
        released: "Jun 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    
    // OPEN SOURCE & SPECIALIZED
    {
        id: "llama-4-405b",
        name: "Llama 4 (405B)",
        provider: "Meta",
        category: "all",
        score: 84.1,
        benchmarks: {
            "MATH Level 5": 95.2
        },
        pricing: "$2.00 / $8.00 per 1M tokens",
        priceInput: 2.00,
        priceOutput: 8.00,
        speed: "Medium",
        context: "128K tokens",
        rating: 4.5,
        ratingCount: 892,
        badges: ["Open Source"],
        description: "Open-source flagship model, strong general performance",
        released: "Late 2025",
        source: "Community benchmarks"
    },
    {
        id: "mistral-large-2",
        name: "Mistral Large 2",
        provider: "Mistral AI",
        category: "coding",
        score: 81.3,
        benchmarks: {
            "MATH Level 5": 93.7
        },
        pricing: "$2 / $6 per 1M tokens",
        priceInput: 2.00,
        priceOutput: 6.00,
        speed: "Fast",
        context: "128K tokens",
        rating: 4.4,
        ratingCount: 534,
        badges: ["European AI"],
        description: "Strong European alternative, good at multilingual tasks",
        released: "Jul 2025",
        source: "Community benchmarks"
    },
    {
        id: "cohere-command-r-plus",
        name: "Cohere Command R+",
        provider: "Cohere",
        category: "research",
        score: 79.8,
        benchmarks: {
            "SimpleBench": 58.3
        },
        pricing: "$3 / $9 per 1M tokens",
        priceInput: 3.00,
        priceOutput: 9.00,
        speed: "Medium",
        context: "128K tokens",
        rating: 4.3,
        ratingCount: 367,
        badges: ["RAG Specialist"],
        description: "Optimized for retrieval-augmented generation and search",
        released: "Mid 2025",
        source: "Community benchmarks"
    },
    {
        id: "perplexity-sonar-pro",
        name: "Perplexity Sonar Pro",
        provider: "Perplexity",
        category: "research",
        score: 82.7,
        benchmarks: {
            "SimpleBench": 65.8
        },
        pricing: "$5 / $15 per 1M tokens",
        priceInput: 5.00,
        priceOutput: 15.00,
        speed: "Fast",
        context: "128K tokens",
        rating: 4.6,
        ratingCount: 723,
        badges: ["Live Search", "Citations"],
        description: "Real-time web search with source citations, best for research",
        released: "Jan 2026",
        source: "Community benchmarks"
    },
    
    // SPECIALIZED USE CASES
    {
        id: "gpt-53-codex",
        name: "GPT-5.3 Codex",
        provider: "OpenAI",
        category: "coding",
        score: 95.1,
        benchmarks: {
            "Terminal-Bench 2.0": 75.1,
            "Aider Polyglot": 88.0
        },
        pricing: "$12 / $36 per 1M tokens",
        priceInput: 12.00,
        priceOutput: 36.00,
        speed: "Medium",
        context: "128K tokens",
        rating: 4.9,
        ratingCount: 623,
        badges: ["#1 Codex"],
        description: "Specialized coding model, best for terminal-based development",
        released: "Feb 2026",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "claude-37-sonnet",
        name: "Claude 3.7 Sonnet",
        provider: "Anthropic",
        category: "coding",
        score: 76.5,
        benchmarks: {
            "Factorio Learning": 29.1
        },
        pricing: "$3 / $15 per 1M tokens",
        priceInput: 3.00,
        priceOutput: 15.00,
        speed: "Fast",
        context: "200K tokens",
        rating: 4.7,
        ratingCount: 1456,
        badges: ["Reliable"],
        description: "Previous generation Sonnet, still excellent for most coding tasks",
        released: "Late 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "o4-mini-high",
        name: "o4-mini (high)",
        provider: "OpenAI",
        category: "reasoning",
        score: 85.4,
        benchmarks: {
            "MATH Level 5": 97.8
        },
        pricing: "$1.50 / $6 per 1M tokens",
        priceInput: 1.50,
        priceOutput: 6.00,
        speed: "Medium",
        context: "128K tokens",
        rating: 4.6,
        ratingCount: 534,
        badges: ["Cost-Effective Reasoning"],
        description: "Affordable reasoning model for mathematics and logic",
        released: "Late 2025",
        source: "https://lmcouncil.ai/benchmarks"
    },
    {
        id: "kimi-k2-thinking",
        name: "Kimi K2 Thinking",
        provider: "Moonshot AI",
        category: "reasoning",
        score: 80.1,
        benchmarks: {
            "Humanity's Last Exam": 23.9
        },
        pricing: "$4 / $12 per 1M tokens",
        priceInput: 4.00,
        priceOutput: 12.00,
        speed: "Slow",
        context: "200K tokens",
        rating: 4.4,
        ratingCount: 289,
        badges: ["Chinese Market Leader"],
        description: "Strong reasoning model from Chinese AI lab",
        released: "Late 2025",
        source: "https://lmcouncil.ai/benchmarks"
    }
];

// Category metadata
const CATEGORIES = {
    all: {
        name: "All Categories",
        description: "General-purpose models for varied tasks",
        icon: "fa-star"
    },
    coding: {
        name: "Coding",
        description: "Software engineering and development",
        icon: "fa-code"
    },
    reasoning: {
        name: "Reasoning",
        description: "Complex logic and mathematics",
        icon: "fa-brain"
    },
    research: {
        name: "Research",
        description: "Information retrieval and analysis",
        icon: "fa-flask"
    },
    analysis: {
        name: "Analysis",
        description: "Data processing and insights",
        icon: "fa-chart-line"
    }
};

// Benchmark metadata
const BENCHMARKS = {
    "GPQA Diamond": {
        description: "PhD-level science questions (biology, chemistry, physics)",
        higher_is_better: true,
        unit: "%"
    },
    "SimpleBench": {
        description: "Common-sense reasoning, avoiding tricks and traps",
        higher_is_better: true,
        unit: "%"
    },
    "SWE-bench Verified": {
        description: "Real GitHub issues - can the model fix bugs?",
        higher_is_better: true,
        unit: "%"
    },
    "Terminal-Bench 2.0": {
        description: "Terminal-based coding assignments and debugging",
        higher_is_better: true,
        unit: "%"
    },
    "MATH Level 5": {
        description: "Competition math (AMC 10, AMC 12, AIME)",
        higher_is_better: true,
        unit: "%"
    },
    "FrontierMath": {
        description: "Research-level mathematics problems",
        higher_is_better: true,
        unit: "%"
    },
    "METR Time Horizons": {
        description: "How long can agents work on complex tasks?",
        higher_is_better: true,
        unit: "minutes"
    },
    "WebDev Arena": {
        description: "Human-judged website quality",
        higher_is_better: true,
        unit: "ELO"
    },
    "Humanity's Last Exam": {
        description: "2,500 hardest multi-modal questions",
        higher_is_better: true,
        unit: "%"
    }
};
