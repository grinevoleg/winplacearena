// API Client для работы с FastAPI бэкендом
class ApiClient {
    constructor(baseUrl = '') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({ detail: response.statusText }));
                throw new Error(error.detail || `HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            console.error(`API Error: ${url}`, error);
            throw error;
        }
    }

    // Challenges
    async getChallenges(userId, filterType) {
        const params = new URLSearchParams();
        if (userId) params.append('user_id', userId);
        if (filterType) params.append('filter_type', filterType);
        return this.request(`/api/challenges/?${params.toString()}`);
    }

    async getGlobalChallenges(userId) {
        const params = new URLSearchParams();
        if (userId) params.append('user_id', userId);
        return this.request(`/api/challenges/global?${params.toString()}`);
    }

    async getChallenge(challengeId) {
        return this.request(`/api/challenges/${challengeId}`);
    }

    async createChallenge(challenge) {
        return this.request('/api/challenges/', {
            method: 'POST',
            body: JSON.stringify({
                title: challenge.title,
                description: challenge.description,
                difficulty: challenge.difficulty,
                stars: challenge.stars,
                deadline: challenge.deadline,
                created_by: challenge.createdBy,
                is_ai: challenge.isAI || false,
                is_global: challenge.isGlobal || false,
            }),
        });
    }

    async assignChallenge(challengeId, userId) {
        return this.request(`/api/challenges/${challengeId}/assign?user_id=${userId}`, {
            method: 'POST',
        });
    }

    async toggleChallenge(challengeId, userId) {
        return this.request(`/api/challenges/${challengeId}/toggle?user_id=${userId}`, {
            method: 'PUT',
        });
    }

    // Users
    async getUser(userId) {
        return this.request(`/api/users/${userId}`);
    }

    async createUser(user) {
        return this.request('/api/users/', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }

    async updateUser(userId, name) {
        const params = new URLSearchParams();
        if (name) params.append('name', name);
        return this.request(`/api/users/${userId}?${params.toString()}`, {
            method: 'PUT',
        });
    }

    // Leaderboard
    async getLeaderboard() {
        return this.request('/api/leaderboard/');
    }

    // AI
    async generateChallenge(request = {}) {
        return this.request('/api/ai/generate-challenge', {
            method: 'POST',
            body: JSON.stringify(request),
        });
    }
}

// Создаем глобальный экземпляр API клиента
const api = new ApiClient();

