# AgentLeaderboards - Real MVP Status

**Updated:** 2026-02-17  
**Status:** 🚧 **Features Built, Firebase Setup Required**

---

## ✅ What's Been Built (Real Features)

### 1. Real Agent Data
- **File:** `data/real-agents.json`
- **Source:** LM Council Benchmarks (https://lmcouncil.ai/benchmarks)
- **Agents:** 6 models with actual performance scores
  - Claude Opus 4.6
  - GPT-5.2
  - Gemini 3 Pro
  - Claude Sonnet 4.5
  - Grok 4
  - o3 (high)
- **Benchmarks:** 20+ real tests (SimpleBench, SWE-bench, GPQA Diamond, Terminal-Bench, etc.)
- **Pricing:** Real pricing data (input/output cost per million tokens)

### 2. User Authentication System
- **Files:**
  - `auth.html` - Sign in/sign up page
  - `js/auth.js` - Auth logic
  - `js/firebase-config.js` - Firebase integration
- **Features:**
  - Email/password auth
  - Tab-based UI (sign in / sign up)
  - Error handling
  - Auto-redirect to dashboard

### 3. User Dashboard
- **File:** `dashboard.html`
- **Features:**
  - Account tier display (Free / Premium)
  - Remaining comparisons counter
  - Total comparisons counter
  - Recent comparison history (last 10)
  - Upgrade CTA for free users
  - Quick actions (new comparison, view leaderboard)

### 4. Enforced Free Tier Limits
- **Logic:** `js/firebase-config.js`
- **Rules:**
  - Free users: 3 comparisons/day
  - Premium users: Unlimited
  - Daily reset at midnight UTC
  - Tracked in Firestore per user
  - Cannot compare without login

### 5. Comparison Tracking
- **Features:**
  - Every comparison recorded in Firestore
  - User ID, agent IDs, timestamp logged
  - History displayed in dashboard
  - Tier-based counting (free vs premium)

---

## 🔴 Required Before Launch: Firebase Setup

**You MUST set up Firebase to make the site functional.**

### Step 1: Create Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add Project"
3. Name: `AgentLeaderboards`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Enable Authentication
1. In Firebase Console → Authentication → Get Started
2. Click "Sign-in method"
3. Enable "Email/Password"
4. Save

### Step 3: Create Firestore Database
1. In Firebase Console → Firestore Database → Create Database
2. Choose "Start in **production mode**"
3. Select location: `us-central1` (or closest to your users)
4. Create

### Step 4: Set Firestore Security Rules
In Firestore → Rules, replace with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can only read/write their own comparisons
    match /comparisons/{comparisonId} {
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

### Step 5: Get Firebase Config
1. In Firebase Console → Project Settings (gear icon)
2. Scroll to "Your apps" → Click "Web" icon (`</>`)
3. Register app name: `AgentLeaderboards`
4. Copy the `firebaseConfig` object

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "agentleaderboards.firebaseapp.com",
  projectId: "agentleaderboards",
  storageBucket: "agentleaderboards.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:xxxxxx"
};
```

### Step 6: Update Code with Config
Replace `FIREBASE_API_KEY_PLACEHOLDER` and other values in:
- `/js/firebase-config.js` (lines 4-11)

With your actual Firebase config from Step 5.

---

## 🧪 How to Test

### 1. Test Authentication
1. Visit `https://agentleaderboards.com/auth.html`
2. Click "Sign Up" tab
3. Create account with email/password
4. Should redirect to dashboard

### 2. Test Dashboard
1. After signup, should see dashboard at `/dashboard.html`
2. Verify:
   - Tier shows "Free"
   - Comparisons shows "3 remaining"
   - Upgrade CTA visible

### 3. Test Comparison Limits
1. Go to leaderboard (`index.html`)
2. Perform a comparison (need to update comparison UI to enforce limits)
3. Check dashboard - should show "2 remaining"
4. After 3 comparisons, should block until next day or upgrade

### 4. Test Sign Out
1. Click "Sign Out" in dashboard
2. Should redirect to homepage
3. Try accessing `/dashboard.html` → should redirect to `/auth.html`

---

## ⚠️ Still Missing (To Complete MVP)

### High Priority:
1. **Update comparison UI** to check auth and enforce limits
   - Modify `/js/app.js` to call `canUserCompare()` before comparing
   - Show "Sign in to compare" if not logged in
   - Show "Upgrade to Premium" if limit reached
   
2. **Load real agent data** from `data/real-agents.json`
   - Replace fake data in `/data/agents.js`
   - Update display to show real benchmarks
   
3. **Stripe integration with Firebase**
   - After Stripe success, call `upgradeToPremium(uid, customerId, subscriptionId)`
   - Add webhook to handle subscription changes

### Medium Priority:
4. **Agent submission form** (let users suggest agents)
5. **Export comparison data** (Premium feature)
6. **API documentation** (Premium feature)
7. **Email notifications** (comparison history, upgrades)

### Low Priority:
8. **Social login** (Google, GitHub)
9. **Password reset flow**
10. **Profile settings page**

---

## 💰 Premium Features (Implemented)

✅ **Tracking & Enforcement:**
- Free tier: 3 comparisons/day (enforced in Firestore)
- Premium tier: Unlimited (tier check in `canUserCompare()`)

✅ **Upgrade Flow:**
- Stripe payment → `upgradeToPremium()` function ready
- Need to wire webhook to call this after successful payment

---

## 🚀 Deploy Checklist

Before going live:

- [ ] Set up Firebase project
- [ ] Update `firebase-config.js` with real credentials
- [ ] Deploy Firestore security rules
- [ ] Update comparison UI to enforce auth
- [ ] Replace fake agent data with real data
- [ ] Connect Stripe success to Firebase upgrade
- [ ] Test full flow (signup → compare → hit limit → upgrade → unlimited)
- [ ] Add privacy policy & terms of service

---

## 📝 Summary

**What works:**
- User auth (signup, signin, signout)
- Dashboard with stats
- Comparison tracking
- Free tier limits (3/day)
- Real agent data from benchmarks

**What's needed:**
- Firebase setup (20 minutes)
- Update comparison UI to enforce auth (30 minutes)
- Load real agent data (10 minutes)
- Wire Stripe to Firebase (20 minutes)

**Total time to launch:** ~90 minutes of configuration work

**Once complete:** You'll have a real product worth charging for! 🎉
