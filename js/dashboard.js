// Dashboard logic for AgentLeaderboards

let currentUser = null;
let userData = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseReady = initFirebase();
    if (!firebaseReady) {
        alert('Firebase not configured. Redirecting to home...');
        window.location.href = 'index.html';
        return;
    }

    // Check auth state
    onAuthStateChanged(async (user) => {
        if (user) {
            currentUser = user;
            await loadDashboard();
        } else {
            // Not signed in, redirect to auth
            window.location.href = 'auth.html';
        }
    });

    // Sign out button
    document.getElementById('signout-btn').addEventListener('click', async () => {
        await signOut();
        window.location.href = 'index.html';
    });
});

async function loadDashboard() {
    // Show user email
    document.getElementById('user-email').textContent = currentUser.email;

    // Load user data
    userData = await getUserData(currentUser.uid);
    if (!userData) {
        alert('Error loading user data. Please try again.');
        return;
    }

    // Display tier
    const tierBadge = userData.tier === 'premium' ? 
        '<span class="text-yellow-400">✨ Premium</span>' : 
        '<span class="text-gray-400">Free</span>';
    document.getElementById('user-tier').innerHTML = tierBadge;

    // Display remaining comparisons
    const remaining = await getRemainingComparisons(currentUser.uid);
    document.getElementById('comparisons-remaining').textContent = remaining;

    // Show upgrade CTA for free users
    if (userData.tier === 'free') {
        document.getElementById('upgrade-cta').classList.remove('hidden');
    }

    // Load comparison history
    await loadComparisonHistory();

    // Load total comparisons count
    await loadTotalComparisons();
}

async function loadComparisonHistory() {
    try {
        const comparisons = await db.collection('comparisons')
            .where('userId', '==', currentUser.uid)
            .orderBy('timestamp', 'desc')
            .limit(10)
            .get();

        const historyDiv = document.getElementById('comparison-history');

        if (comparisons.empty) {
            historyDiv.innerHTML = '<p class="text-gray-400">No comparisons yet. <a href="index.html#compare" class="text-purple-400 hover:underline">Start comparing agents!</a></p>';
            return;
        }

        let html = '<div class="space-y-4">';
        comparisons.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate().toLocaleString() : 'Just now';
            
            html += `
                <div class="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
                    <div>
                        <p class="font-medium">${data.agent1} vs ${data.agent2}</p>
                        <p class="text-sm text-gray-400">${timestamp}</p>
                    </div>
                    <span class="text-xs px-3 py-1 rounded-full ${data.tier === 'premium' ? 'bg-yellow-900 text-yellow-300' : 'bg-gray-600 text-gray-300'}">
                        ${data.tier}
                    </span>
                </div>
            `;
        });
        html += '</div>';

        historyDiv.innerHTML = html;
    } catch (error) {
        console.error('Error loading comparison history:', error);
        document.getElementById('comparison-history').innerHTML = '<p class="text-red-400">Error loading history. Please refresh the page.</p>';
    }
}

async function loadTotalComparisons() {
    try {
        const comparisons = await db.collection('comparisons')
            .where('userId', '==', currentUser.uid)
            .get();

        document.getElementById('total-comparisons').textContent = comparisons.size;
    } catch (error) {
        console.error('Error loading total comparisons:', error);
        document.getElementById('total-comparisons').textContent = '0';
    }
}
