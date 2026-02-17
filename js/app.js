// AgentLeaderboards App
(function() {
    const STORAGE_KEY = 'agentleaderboards_comparisons';
    const MAX_FREE_COMPARISONS = 3;

    // Get today's comparison count
    function getComparisonsToday() {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        const today = new Date().toDateString();
        if (data.date !== today) {
            return 0;
        }
        return data.count || 0;
    }

    // Increment comparison count
    function incrementComparisons() {
        const today = new Date().toDateString();
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        if (data.date !== today) {
            data.date = today;
            data.count = 1;
        } else {
            data.count = (data.count || 0) + 1;
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data.count;
    }

    // Render leaderboard
    function renderLeaderboard(filter = 'all') {
        const tbody = document.getElementById('leaderboard-body');
        if (!tbody) return;

        const filtered = filter === 'all' 
            ? AGENTS 
            : AGENTS.filter(a => a.category === filter || a.category === 'all');

        const sorted = [...filtered].sort((a, b) => b.score - a.score);

        tbody.innerHTML = sorted.map((agent, idx) => `
            <tr class="border-b border-gray-700 hover:bg-gray-700/50 transition">
                <td class="px-6 py-4">
                    <span class="text-2xl font-bold ${idx === 0 ? 'text-yellow-400' : idx === 1 ? 'text-gray-300' : idx === 2 ? 'text-orange-400' : 'text-gray-500'}">
                        ${idx + 1}
                    </span>
                </td>
                <td class="px-6 py-4">
                    <div class="font-semibold">${agent.name}</div>
                    <div class="flex gap-1 mt-1">
                        ${agent.badges.map(b => `<span class="text-xs bg-purple-600 px-2 py-0.5 rounded">${b}</span>`).join('')}
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-400">${agent.provider}</td>
                <td class="px-6 py-4 text-center">
                    <span class="text-lg font-bold ${agent.score >= 90 ? 'text-green-400' : agent.score >= 85 ? 'text-yellow-400' : 'text-gray-400'}">
                        ${agent.score}
                    </span>
                </td>
                <td class="px-6 py-4 text-center text-gray-300">${agent.cost}</td>
                <td class="px-6 py-4 text-center">
                    <span class="px-2 py-1 rounded text-sm ${
                        agent.speed === 'Fastest' ? 'bg-green-600' :
                        agent.speed === 'Fast' ? 'bg-green-600/60' :
                        agent.speed === 'Medium' ? 'bg-yellow-600/60' : 'bg-red-600/60'
                    }">${agent.speed}</span>
                </td>
                <td class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center gap-1">
                        <i class="fas fa-star text-yellow-400"></i>
                        <span class="font-semibold">${agent.rating}</span>
                        <span class="text-gray-500 text-sm">(${agent.ratingCount})</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-center">
                    <button class="text-purple-400 hover:text-purple-300 transition" onclick="addToCompare(${agent.id})">
                        <i class="fas fa-plus-circle"></i> Compare
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Populate compare dropdowns
    function populateCompareDropdowns() {
        const select1 = document.getElementById('compare-agent-1');
        const select2 = document.getElementById('compare-agent-2');
        if (!select1 || !select2) return;

        const options = AGENTS.map(a => `<option value="${a.id}">${a.name} (${a.provider})</option>`).join('');
        select1.innerHTML = '<option value="">Select an agent...</option>' + options;
        select2.innerHTML = '<option value="">Select an agent...</option>' + options;

        select1.addEventListener('change', handleCompare);
        select2.addEventListener('change', handleCompare);
    }

    // Handle comparison
    function handleCompare() {
        const select1 = document.getElementById('compare-agent-1');
        const select2 = document.getElementById('compare-agent-2');
        const result = document.getElementById('comparison-result');
        const warning = document.getElementById('compare-limit-warning');

        if (!select1.value || !select2.value) {
            result.classList.add('hidden');
            return;
        }

        // Check comparison limit
        const comparisons = getComparisonsToday();
        if (comparisons >= MAX_FREE_COMPARISONS) {
            warning.classList.remove('hidden');
            result.classList.add('hidden');
            return;
        }

        warning.classList.add('hidden');
        incrementComparisons();

        const agent1 = AGENTS.find(a => a.id === parseInt(select1.value));
        const agent2 = AGENTS.find(a => a.id === parseInt(select2.value));

        result.classList.remove('hidden');
        result.innerHTML = `
            <h3 class="text-xl font-bold mb-6 text-center">Comparison Results</h3>
            <div class="grid grid-cols-3 gap-4 text-center">
                <div class="font-semibold text-lg">${agent1.name}</div>
                <div class="text-gray-400">vs</div>
                <div class="font-semibold text-lg">${agent2.name}</div>

                <div class="text-3xl font-bold ${agent1.score > agent2.score ? 'text-green-400' : 'text-gray-400'}">${agent1.score}</div>
                <div class="text-gray-500">Score</div>
                <div class="text-3xl font-bold ${agent2.score > agent1.score ? 'text-green-400' : 'text-gray-400'}">${agent2.score}</div>

                <div class="${parseFloat(agent1.cost.slice(1)) < parseFloat(agent2.cost.slice(1)) ? 'text-green-400' : ''}">${agent1.cost}</div>
                <div class="text-gray-500">Cost/1K</div>
                <div class="${parseFloat(agent2.cost.slice(1)) < parseFloat(agent1.cost.slice(1)) ? 'text-green-400' : ''}">${agent2.cost}</div>

                <div>${agent1.speed}</div>
                <div class="text-gray-500">Speed</div>
                <div>${agent2.speed}</div>

                <div class="flex items-center justify-center gap-1">
                    <i class="fas fa-star text-yellow-400"></i> ${agent1.rating}
                </div>
                <div class="text-gray-500">Rating</div>
                <div class="flex items-center justify-center gap-1">
                    <i class="fas fa-star text-yellow-400"></i> ${agent2.rating}
                </div>
            </div>
            <p class="text-center text-gray-400 text-sm mt-6">
                ${MAX_FREE_COMPARISONS - getComparisonsToday()} free comparisons remaining today
            </p>
        `;
    }

    // Category filter
    function setupCategoryFilter() {
        const filter = document.getElementById('category-filter');
        if (!filter) return;
        filter.addEventListener('change', (e) => renderLeaderboard(e.target.value));
    }

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
        renderLeaderboard();
        populateCompareDropdowns();
        setupCategoryFilter();
    });

    // Global function for inline onclick
    window.addToCompare = function(id) {
        const select1 = document.getElementById('compare-agent-1');
        const select2 = document.getElementById('compare-agent-2');
        if (!select1.value) {
            select1.value = id;
        } else if (!select2.value) {
            select2.value = id;
            handleCompare();
        }
        document.getElementById('compare').scrollIntoView({ behavior: 'smooth' });
    };
})();
