// Firebase configuration for AgentLeaderboards
// Get your config from Firebase Console: https://console.firebase.google.com

const firebaseConfig = {
    apiKey: "FIREBASE_API_KEY_PLACEHOLDER",
    authDomain: "agentleaderboards.firebaseapp.com",
    projectId: "agentleaderboards",
    storageBucket: "agentleaderboards.appspot.com",
    messagingSenderId: "PLACEHOLDER",
    appId: "PLACEHOLDER"
};

// Initialize Firebase (loaded from CDN in HTML)
let app, auth, db;

function initFirebase() {
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded');
        return false;
    }
    
    try {
        app = firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        return false;
    }
}

// Auth state observer
function onAuthStateChanged(callback) {
    if (!auth) {
        console.error('Firebase not initialized');
        return;
    }
    
    auth.onAuthStateChanged(callback);
}

// Sign up
async function signUp(email, password) {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Create user document
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            tier: 'free',
            comparisonsToday: 0,
            lastComparisonReset: new Date().toISOString().split('T')[0],
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            stripeCustomerId: null
        });
        
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Sign in
async function signIn(email, password) {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

// Sign out
async function signOut() {
    try {
        await auth.signOut();
    } catch (error) {
        throw error;
    }
}

// Get user data
async function getUserData(uid) {
    try {
        const doc = await db.collection('users').doc(uid).get();
        if (doc.exists) {
            return doc.data();
        }
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Check if user can compare (enforce free tier)
async function canUserCompare(uid) {
    try {
        const userData = await getUserData(uid);
        if (!userData) return false;
        
        // Premium users have unlimited
        if (userData.tier === 'premium') return true;
        
        // Check if we need to reset daily count
        const today = new Date().toISOString().split('T')[0];
        if (userData.lastComparisonReset !== today) {
            // Reset count
            await db.collection('users').doc(uid).update({
                comparisonsToday: 0,
                lastComparisonReset: today
            });
            return true;
        }
        
        // Check free tier limit
        return userData.comparisonsToday < 3;
    } catch (error) {
        console.error('Error checking comparison limit:', error);
        return false;
    }
}

// Record a comparison
async function recordComparison(uid, agent1Id, agent2Id) {
    try {
        const userData = await getUserData(uid);
        if (!userData) throw new Error('User not found');
        
        // Increment comparison count for free users
        if (userData.tier === 'free') {
            await db.collection('users').doc(uid).update({
                comparisonsToday: firebase.firestore.FieldValue.increment(1)
            });
        }
        
        // Save comparison history
        await db.collection('comparisons').add({
            userId: uid,
            agent1: agent1Id,
            agent2: agent2Id,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            tier: userData.tier
        });
        
        return true;
    } catch (error) {
        console.error('Error recording comparison:', error);
        throw error;
    }
}

// Get remaining comparisons for today
async function getRemainingComparisons(uid) {
    try {
        const userData = await getUserData(uid);
        if (!userData) return 0;
        
        if (userData.tier === 'premium') return 'Unlimited';
        
        const today = new Date().toISOString().split('T')[0];
        if (userData.lastComparisonReset !== today) {
            return 3;
        }
        
        return Math.max(0, 3 - userData.comparisonsToday);
    } catch (error) {
        console.error('Error getting remaining comparisons:', error);
        return 0;
    }
}

// Upgrade to premium (called after Stripe success)
async function upgradeToPremium(uid, stripeCustomerId, subscriptionId) {
    try {
        await db.collection('users').doc(uid).update({
            tier: 'premium',
            stripeCustomerId: stripeCustomerId,
            stripeSubscriptionId: subscriptionId,
            upgradedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error('Error upgrading to premium:', error);
        throw error;
    }
}
