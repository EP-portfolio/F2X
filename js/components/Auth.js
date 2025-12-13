import { authAPI } from '../services/api.js';

let authState = {
  mode: 'login', // 'login' | 'register'
  email: '',
  password: '',
  parentEmail: '',
  language: 'fr',
  error: '',
  isLoading: false
};

export function renderAuth(language) {
  const t = language === 'fr' ? {
    title: "Stat'Master",
    loginTitle: "Connexion",
    registerTitle: "Inscription",
    email: "Email",
    password: "Mot de passe",
    parentEmail: "Email parent (optionnel)",
    language: "Langue",
    login: "Se connecter",
    register: "S'inscrire",
    switchToRegister: "Pas encore de compte ? S'inscrire",
    switchToLogin: "Déjà un compte ? Se connecter",
    error: "Erreur",
    loading: "Chargement..."
  } : {
    title: "Stat'Master",
    loginTitle: "Login",
    registerTitle: "Sign Up",
    email: "Email",
    password: "Password",
    parentEmail: "Parent Email (optional)",
    language: "Language",
    login: "Login",
    register: "Sign Up",
    switchToRegister: "Don't have an account? Sign Up",
    switchToLogin: "Already have an account? Login",
    error: "Error",
    loading: "Loading..."
  };

  return `
    <div class="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-violet-100 to-fuchsia-100">
      <div class="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl max-w-md w-full p-10 border border-white">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-2">${t.title}</h1>
          <h2 class="text-2xl font-bold text-gray-700">${authState.mode === 'login' ? t.loginTitle : t.registerTitle}</h2>
        </div>

        ${authState.error ? `
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            ${authState.error}
          </div>
        ` : ''}

        <form onsubmit="event.preventDefault(); window.handleAuthSubmit();" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">${t.email}</label>
            <input
              type="email"
              value="${authState.email}"
              oninput="window.updateAuthField('email', this.value)"
              required
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              placeholder="eleve@example.com"
            />
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-2">${t.password}</label>
            <input
              type="password"
              value="${authState.password}"
              oninput="window.updateAuthField('password', this.value)"
              required
              minlength="6"
              class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          ${authState.mode === 'register' ? `
            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">${t.parentEmail}</label>
              <input
                type="email"
                value="${authState.parentEmail}"
                oninput="window.updateAuthField('parentEmail', this.value)"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
                placeholder="parent@example.com"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 mb-2">${t.language}</label>
              <select
                value="${authState.language}"
                onchange="window.updateAuthField('language', this.value)"
                class="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all"
              >
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
            </div>
          ` : ''}

          <button
            type="submit"
            disabled="${authState.isLoading}"
            class="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-bold py-4 rounded-xl hover:from-violet-700 hover:to-fuchsia-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ${authState.isLoading ? t.loading : (authState.mode === 'login' ? t.login : t.register)}
          </button>
        </form>

        <div class="mt-6 text-center">
          <button
            onclick="window.switchAuthMode()"
            class="text-violet-600 hover:text-violet-700 font-medium text-sm"
          >
            ${authState.mode === 'login' ? t.switchToRegister : t.switchToLogin}
          </button>
        </div>
      </div>
    </div>
  `;
}

window.updateAuthField = (field, value) => {
  authState[field] = value;
  authState.error = '';
  if (window.render) window.render();
};

window.switchAuthMode = () => {
  authState.mode = authState.mode === 'login' ? 'register' : 'login';
  authState.error = '';
  if (window.render) window.render();
};

window.handleAuthSubmit = async () => {
  if (authState.isLoading) return;

  authState.isLoading = true;
  authState.error = '';
  if (window.render) window.render();

  try {
    let data;
    if (authState.mode === 'login') {
      data = await authAPI.login(authState.email, authState.password);
    } else {
      data = await authAPI.register(
        authState.email,
        authState.password,
        authState.parentEmail || undefined,
        authState.language
      );
    }

    // Update app state with user info
    if (window.appState) {
      window.appState.setState({
        language: data.user.language || authState.language,
        user: data.user,
        isAuthenticated: true
      });
    }

    // Navigate to home
    if (window.navigateTo) {
      window.navigateTo('HOME');
    }
  } catch (error) {
    authState.error = error.message || 'Une erreur est survenue';
    console.error('Auth error:', error);
  } finally {
    authState.isLoading = false;
    if (window.render) window.render();
  }
};

export function initAuth() {
  // Check if user is already authenticated
  if (authAPI.isAuthenticated() && window.appState) {
    const state = window.appState.getState();
    if (state.isAuthenticated) {
      return; // Already authenticated
    }
  }
}

