// Auth UI logic for AgentLeaderboards

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    const firebaseReady = initFirebase();
    if (!firebaseReady) {
        showError('signin', 'Firebase not configured. Please contact support.');
        return;
    }

    // Tab switching
    const signinTab = document.getElementById('signin-tab');
    const signupTab = document.getElementById('signup-tab');
    const signinFormDiv = document.getElementById('signin-form');
    const signupFormDiv = document.getElementById('signup-form');

    signinTab.addEventListener('click', () => {
        signinTab.classList.add('bg-purple-600');
        signinTab.classList.remove('bg-gray-700');
        signupTab.classList.add('bg-gray-700');
        signupTab.classList.remove('bg-purple-600');
        signinFormDiv.classList.remove('hidden');
        signupFormDiv.classList.add('hidden');
    });

    signupTab.addEventListener('click', () => {
        signupTab.classList.add('bg-purple-600');
        signupTab.classList.remove('bg-gray-700');
        signinTab.classList.add('bg-gray-700');
        signinTab.classList.remove('bg-purple-600');
        signupFormDiv.classList.remove('hidden');
        signinFormDiv.classList.add('hidden');
    });

    // Sign In Form
    document.getElementById('signin-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signin-email').value;
        const password = document.getElementById('signin-password').value;
        
        hideMessages('signin');
        
        try {
            await signIn(email, password);
            showSuccess('signin', 'Signed in successfully! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError('signin', getErrorMessage(error));
        }
    });

    // Sign Up Form
    document.getElementById('signup-form-element').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-password-confirm').value;
        
        hideMessages('signup');
        
        // Validate password match
        if (password !== confirmPassword) {
            showError('signup', 'Passwords do not match');
            return;
        }
        
        try {
            await signUp(email, password);
            showSuccess('signup', 'Account created! Redirecting...');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } catch (error) {
            showError('signup', getErrorMessage(error));
        }
    });
});

function showError(form, message) {
    const errorDiv = document.getElementById(`${form}-error`);
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
}

function showSuccess(form, message) {
    const successDiv = document.getElementById(`${form}-success`);
    successDiv.textContent = message;
    successDiv.classList.remove('hidden');
}

function hideMessages(form) {
    const errorDiv = document.getElementById(`${form}-error`);
    const successDiv = document.getElementById(`${form}-success`);
    errorDiv.classList.add('hidden');
    successDiv.classList.add('hidden');
}

function getErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Try signing in instead.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password must be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
}
