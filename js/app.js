// AgentLeaderboards - Main App Logic

let filteredAgents = [...AGENTS];
let currentSort = 'score';
let currentCategory = 'all';
let currentTab = 'capability'; // 'capability' | 'value'

function switchTab(tab) {
    currentTab = tab;

    // Update tab button styles
    document.querySelectorAll('.tab-btn').forEach(b => {
        b.classList.remove('bg-purple-600', 'text-white', 'shadow-lg');
        b.classList.add('bg-gray-700', 'text-gray-300');
    });
    const active = document.getElementById('tab-' + tab);
    if (active) {
        active.classList.remove('bg-gray-700', 'text-gray-300');
        active.classList.add('bg-purple-600', 'text-white', 'shadow-lg');
    }

    // Show/hide descriptions
    document.getElementById('tab-desc-capability').classList.toggle('hidden', tab !== 'capability');
    document.getElementById('tab-desc-value').classList.toggle('hidden', tab !== 'value');

    // Adjust sort dropdown default
    const sortSel = document.getElementById('sort-by');
    if (tab === 'value') {
        currentSort = 'value';
        sortSel.value = 'score'; // keep dropdown unchanged but override sort
    } else {
        currentSort = 'score';
        sortSel.value = 'score';
    }

    filterAndRender();
}

document.addEventListener('DOMContentLoaded', function() {
    // Update agent count
    document.getElementById('agent-count').textContent = AGENTS.length;
    
    // Sort by score on initial load
    filteredAgents.sort((a, b) => b.score - a.score);
    
    // Initial render
    renderAgents();
    
    // Event listeners
    document.getElementById('category-filter').addEventListener('change', (e) => {
        currentCategory = e.target.value;
        filterAndRender();
    });
    
    document.getElementById('sort-by').addEventListener('change', (e) => {
        currentSort = e.target.value;
        filterAndRender();
    });
    
    document.getElementById('search').addEventListener('input', (e) => {
        filterAndRender();
    });
});

function filterAndRender() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    
    // Filter by category
    filteredAgents = AGENTS.filter(agent => {
        if (currentCategory !== 'all' && agent.category !== currentCategory) {
            return false;
        }
        
        // Filter by search
        if (searchTerm) {
            const searchable = `${agent.name} ${agent.provider} ${agent.description}`.toLowerCase();
            if (!searchable.includes(searchTerm)) {
                return false;
            }
        }
        
        return true;
    });
    
    // Sort
    const effectiveSort = currentTab === 'value' ? 'value' : currentSort;
    filteredAgents.sort((a, b) => {
        switch (effectiveSort) {
            case 'value':
                return (b.valueScore || 0) - (a.valueScore || 0);
            case 'score':
                return b.score - a.score;
            case 'price':
                return a.priceInput - b.priceInput;
            case 'rating':
                return b.rating - a.rating;
            case 'speed':
                const speedOrder = { 'Very Fast': 0, 'Fast': 1, 'Medium': 2, 'Slow': 3 };
                return speedOrder[a.speed] - speedOrder[b.speed];
            default:
                return 0;
        }
    });
    
    renderAgents();
}

function renderAgents() {
    const container = document.getElementById('agents-list');
    
    if (filteredAgents.length === 0) {
        container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-search text-6xl text-gray-600 mb-4"></i>
                <p class="text-xl text-gray-400">No agents found matching your criteria</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    filteredAgents.forEach((agent, index) => {
        html += renderAgentCard(agent, index + 1);
    });
    
    container.innerHTML = html;
}

function renderAgentCard(agent, rank) {
    // Get benchmark entries
    const benchmarkHTML = Object.entries(agent.benchmarks || {})
        .slice(0, 5) // Show top 5 benchmarks
        .map(([name, score]) => `
            <div class="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                <span class="text-sm text-gray-400">${name}</span>
                <span class="text-sm font-semibold text-white">${score}${typeof score === 'number' && score < 100 ? '%' : ''}</span>
            </div>
        `).join('');
    
    // Badges
    const badgesHTML = agent.badges.map(badge => {
        const colors = {
            'Top Rated': 'bg-yellow-900 text-yellow-300',
            'Best Value': 'bg-green-900 text-green-300',
            'Coding Specialist': 'bg-blue-900 text-blue-300',
            '#1 Coding': 'bg-purple-900 text-purple-300',
            '#1 SWE-bench': 'bg-purple-900 text-purple-300',
            '#1 Codex': 'bg-purple-900 text-purple-300',
            'Popular': 'bg-orange-900 text-orange-300',
            'Budget Friendly': 'bg-green-900 text-green-300',
            'Fastest': 'bg-blue-900 text-blue-300',
            'Open Source': 'bg-gray-700 text-gray-300',
            'Real-time Data': 'bg-red-900 text-red-300',
            'Deep Reasoning': 'bg-indigo-900 text-indigo-300',
            'Long Context': 'bg-teal-900 text-teal-300',
            'Multi-modal': 'bg-pink-900 text-pink-300'
        };
        const colorClass = colors[badge] || 'bg-gray-700 text-gray-300';
        return `<span class="badge ${colorClass}">${badge}</span>`;
    }).join('');
    
    // Speed indicator
    const speedColors = {
        'Very Fast': 'text-green-400',
        'Fast': 'text-blue-400',
        'Medium': 'text-yellow-400',
        'Slow': 'text-red-400'
    };
    
    // Rating stars
    const fullStars = Math.floor(agent.rating);
    const hasHalfStar = agent.rating % 1 >= 0.5;
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star text-yellow-400"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt text-yellow-400"></i>';
    }
    const emptyStars = 5 - Math.ceil(agent.rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star text-gray-600"></i>';
    }
    
    const isValueMode = currentTab === 'value';
    const cardBorder = isValueMode ? 'border-2 border-green-500' : '';
    const scoreBadge = isValueMode && agent.valueScore
        ? `<div class="text-3xl font-bold text-green-400 mb-1">${agent.valueScore}</div>
           <div class="text-sm text-gray-400">pts per $</div>
           <div class="text-lg font-semibold text-purple-400 mt-1">${agent.score}</div>
           <div class="text-xs text-gray-500">capability</div>`
        : `<div class="text-3xl font-bold text-purple-400 mb-1">${agent.score}</div>
           <div class="text-sm text-gray-400">Capability Score</div>`;

    return `
        <div class="bg-gray-800 rounded-2xl p-6 hover-scale ${cardBorder}">
            <!-- Header -->
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-start gap-4 flex-1">
                    <div class="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold ${isValueMode ? 'text-green-400' : 'text-purple-400'}">
                        #${rank}
                    </div>
                    <div class="flex-1">
                        <h3 class="text-2xl font-bold mb-1">${agent.name}</h3>
                        <p class="text-gray-400 mb-2">${agent.provider} • ${agent.released}</p>
                        <div class="mb-2">${badgesHTML}</div>
                        <p class="text-gray-300 text-sm">${agent.description}</p>
                    </div>
                </div>
                <div class="text-right">
                    ${scoreBadge}
                </div>
            </div>
            
            <!-- Stats Grid -->
            <div class="grid md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-700 rounded-lg">
                <div>
                    <div class="text-xs text-gray-400 mb-1">Pricing</div>
                    <div class="font-semibold text-sm">${agent.pricing}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Speed</div>
                    <div class="font-semibold text-sm ${speedColors[agent.speed] || 'text-white'}">${agent.speed}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">Context</div>
                    <div class="font-semibold text-sm">${agent.context}</div>
                </div>
                <div>
                    <div class="text-xs text-gray-400 mb-1">User Rating</div>
                    <div class="flex items-center gap-2">
                        <div class="text-sm">${starsHTML}</div>
                        <span class="text-xs text-gray-400">(${agent.ratingCount.toLocaleString()})</span>
                    </div>
                </div>
            </div>
            
            <!-- Benchmarks -->
            ${benchmarkHTML ? `
            <div class="mt-4">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-sm text-gray-300">Key Benchmarks</h4>
                    <a href="${agent.source}" target="_blank" class="text-xs text-purple-400 hover:underline">
                        <i class="fas fa-external-link-alt mr-1"></i>Source
                    </a>
                </div>
                <div class="bg-gray-700 rounded-lg p-4">
                    ${benchmarkHTML}
                </div>
            </div>
            ` : ''}
            
            <!-- Actions -->
            <div class="mt-4 flex gap-3">
                <button onclick="viewDetails('${agent.id}')" 
                        class="flex-1 bg-purple-600 hover:bg-purple-500 px-4 py-3 rounded-lg font-semibold transition">
                    View Details
                </button>
                <button onclick="startComparison('${agent.id}')" 
                        class="flex-1 bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-lg font-semibold transition">
                    <i class="fas fa-balance-scale mr-2"></i>Compare
                </button>
            </div>
        </div>
    `;
}

function viewDetails(agentId) {
    const agent = AGENTS.find(a => a.id === agentId);
    if (!agent) return;
    
    // Create modal with full details
    const benchmarksList = Object.entries(agent.benchmarks || {})
        .map(([name, score]) => `
            <tr class="border-b border-gray-700">
                <td class="py-3 pr-4 text-gray-300">${name}</td>
                <td class="py-3 text-right font-semibold">${score}${typeof score === 'number' && score < 100 ? '%' : ''}</td>
                <td class="py-3 pl-4 text-gray-400 text-sm">${BENCHMARKS[name]?.description || ''}</td>
            </tr>
        `).join('');
    
    const modal = `
        <div id="agent-modal" class="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-6" onclick="closeModal(event)">
            <div class="bg-gray-800 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">${agent.name}</h2>
                        <p class="text-gray-400">${agent.provider} • ${agent.released}</p>
                    </div>
                    <button onclick="closeModal()" class="text-gray-400 hover:text-white text-2xl">×</button>
                </div>
                
                <div class="mb-6">
                    <h3 class="font-bold mb-2">Description</h3>
                    <p class="text-gray-300">${agent.description}</p>
                </div>
                
                <div class="grid md:grid-cols-2 gap-6 mb-6">
                    <div class="bg-gray-700 rounded-lg p-4">
                        <h3 class="font-bold mb-3">Specifications</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between"><span class="text-gray-400">Overall Score</span><span class="font-semibold">${agent.score}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Pricing</span><span class="font-semibold">${agent.pricing}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Speed</span><span class="font-semibold">${agent.speed}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Context Window</span><span class="font-semibold">${agent.context}</span></div>
                            <div class="flex justify-between"><span class="text-gray-400">Category</span><span class="font-semibold capitalize">${agent.category}</span></div>
                        </div>
                    </div>
                    
                    <div class="bg-gray-700 rounded-lg p-4">
                        <h3 class="font-bold mb-3">Community Rating</h3>
                        <div class="text-center">
                            <div class="text-5xl font-bold text-purple-400 mb-2">${agent.rating}</div>
                            <div class="text-sm text-gray-400 mb-2">out of 5.0</div>
                            <div class="text-sm text-gray-400">${agent.ratingCount.toLocaleString()} ratings</div>
                        </div>
                    </div>
                </div>
                
                ${benchmarksList ? `
                <div class="mb-6">
                    <h3 class="font-bold mb-3">Full Benchmark Results</h3>
                    <div class="bg-gray-700 rounded-lg p-4 overflow-x-auto">
                        <table class="w-full text-sm">
                            <thead>
                                <tr class="border-b border-gray-600">
                                    <th class="text-left py-2 pr-4 text-gray-400">Benchmark</th>
                                    <th class="text-right py-2 text-gray-400">Score</th>
                                    <th class="text-left py-2 pl-4 text-gray-400">Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${benchmarksList}
                            </tbody>
                        </table>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">
                        <i class="fas fa-external-link-alt mr-1"></i>
                        <a href="${agent.source}" target="_blank" class="hover:underline">View source data</a>
                    </p>
                </div>
                ` : ''}
                
                <div class="flex gap-3">
                    <button onclick="startComparison('${agent.id}')" 
                            class="flex-1 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-lg font-semibold transition">
                        <i class="fas fa-balance-scale mr-2"></i>Compare with Another
                    </button>
                    <button onclick="closeModal()" 
                            class="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition">
                        Close
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modal);
}

function closeModal(event) {
    if (!event || event.target.id === 'agent-modal') {
        const modal = document.getElementById('agent-modal');
        if (modal) modal.remove();
    }
}

function startComparison(agentId) {
    window.location.href = 'compare.html?agent=' + encodeURIComponent(agentId);
}
