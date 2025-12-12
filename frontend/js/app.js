// Главное приложение
class App {
    constructor() {
        this.currentUserId = this.getOrCreateUserId();
        this.currentTab = 'home';
        this.currentFilter = 'all';
        this.challenges = [];
        this.globalChallenges = [];
        this.profile = null;
        this.leaderboard = [];
        
        this.init();
    }

    getOrCreateUserId() {
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now();
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    async init() {
        await this.loadProfile();
        this.setupEventListeners();
        this.loadTab(this.currentTab);
    }

    async loadProfile() {
        try {
            this.profile = await api.getUser(this.currentUserId);
            this.updateStarsBadge();
        } catch (error) {
            // Создаем пользователя, если его нет
            try {
                this.profile = await api.createUser({
                    id: this.currentUserId,
                    name: `User ${this.currentUserId.slice(-4)}`
                });
                this.updateStarsBadge();
            } catch (err) {
                console.error('Failed to create user:', err);
            }
        }
    }

    updateStarsBadge() {
        const badge = document.getElementById('starsBadge');
        if (badge && this.profile) {
            badge.textContent = `${this.profile.total_stars || 0} ⭐`;
        }
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                this.switchTab(tab);
            });
        });

        // Filter tabs
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.switchFilter(filter);
            });
        });

        // Bottom nav
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const nav = btn.dataset.nav;
                if (nav === 'create') {
                    this.showCreateModal();
                } else {
                    this.switchTab(nav);
                }
            });
        });

        // Create challenge form
        document.getElementById('createChallengeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCreateChallenge();
        });

        // Modal close buttons
        document.getElementById('closeCreateModal').addEventListener('click', () => {
            this.hideCreateModal();
        });

        // QR Scanner
        document.getElementById('qrScannerBtn').addEventListener('click', () => {
            alert('QR Scanner будет реализован позже');
        });
    }

    switchTab(tab) {
        this.currentTab = tab;
        
        // Update UI
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `${tab}Tab`);
        });

        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.nav === tab);
        });

        // Show/hide filter tabs
        const filterTabs = document.getElementById('filterTabs');
        filterTabs.style.display = tab === 'home' ? 'flex' : 'none';

        this.loadTab(tab);
    }

    switchFilter(filter) {
        this.currentFilter = filter;
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });

        if (this.currentTab === 'home') {
            this.loadChallenges();
        }
    }

    async loadTab(tab) {
        switch(tab) {
            case 'home':
                await this.loadChallenges();
                break;
            case 'arena':
                await this.loadArena();
                break;
            case 'profile':
                await this.loadProfileView();
                break;
        }
    }

    async loadChallenges() {
        const container = document.getElementById('challengesList');
        container.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const filterType = this.currentFilter === 'all' ? undefined : this.currentFilter;
            this.challenges = await api.getChallenges(this.currentUserId, filterType);
            this.renderChallenges();
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading challenges: ${error.message}</div>`;
        }
    }

    renderChallenges() {
        const container = document.getElementById('challengesList');
        
        if (this.challenges.length === 0) {
            container.innerHTML = '<div class="loading">No challenges yet. Create your first one!</div>';
            return;
        }

        container.innerHTML = this.challenges.map(challenge => `
            <div class="challenge-card ${challenge.completed ? 'completed' : ''}">
                <div class="challenge-header">
                    <div>
                        <div class="challenge-title">${this.escapeHtml(challenge.title)}</div>
                        <div class="challenge-description">${this.escapeHtml(challenge.description)}</div>
                    </div>
                </div>
                <div class="challenge-meta">
                    <span class="difficulty-badge difficulty-${challenge.difficulty}">
                        ${challenge.difficulty}
                    </span>
                    <span class="stars">${challenge.stars} ⭐</span>
                    <button class="challenge-toggle ${challenge.completed ? 'completed' : ''}" 
                            onclick="app.toggleChallenge('${challenge.id}')">
                        ${challenge.completed ? '✓ Done' : 'Mark Done'}
                    </button>
                </div>
            </div>
        `).join('');
    }

    async toggleChallenge(challengeId) {
        try {
            const result = await api.toggleChallenge(challengeId, this.currentUserId);
            this.profile = {
                ...this.profile,
                completed_challenges: result.user_stats.completed_challenges,
                total_stars: result.user_stats.total_stars,
                can_publish: result.user_stats.can_publish
            };
            this.updateStarsBadge();
            await this.loadChallenges();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    }

    async loadArena() {
        const container = document.getElementById('arenaContent');
        container.innerHTML = '<div class="loading">Loading...</div>';

        try {
            const [globalChallenges, leaderboard] = await Promise.all([
                api.getGlobalChallenges(this.currentUserId),
                api.getLeaderboard()
            ]);
            
            this.globalChallenges = globalChallenges;
            this.leaderboard = leaderboard;
            this.renderArena();
        } catch (error) {
            container.innerHTML = `<div class="error">Error loading arena: ${error.message}</div>`;
        }
    }

    renderArena() {
        const container = document.getElementById('arenaContent');
        
        let html = '<h2 style="margin-bottom: 20px;">Global Challenges</h2>';
        
        if (this.globalChallenges.length === 0) {
            html += '<div class="loading">No global challenges yet</div>';
        } else {
            html += this.globalChallenges.map(challenge => `
                <div class="global-challenge-card">
                    <div class="global-challenge-header">
                        <div>
                            <div class="challenge-title">${this.escapeHtml(challenge.title)}</div>
                            <div class="challenge-description">${this.escapeHtml(challenge.description)}</div>
                        </div>
                        <button class="challenge-toggle ${challenge.completed ? 'completed' : ''}" 
                                onclick="app.toggleChallenge('${challenge.id}')">
                            ${challenge.completed ? '✓ Done' : 'Join'}
                        </button>
                    </div>
                    <div class="challenge-meta">
                        <span class="difficulty-badge difficulty-${challenge.difficulty}">
                            ${challenge.difficulty}
                        </span>
                        <span class="stars">${challenge.stars} ⭐</span>
                    </div>
                    <div class="global-stats">
                        <span>👥 ${challenge.participants_count || 0} participants</span>
                        <span>✅ ${challenge.completed_count || 0} completed</span>
                    </div>
                </div>
            `).join('');
        }

        html += '<h2 style="margin: 40px 0 20px;">Leaderboard</h2>';
        html += '<div class="leaderboard-list">';
        
        if (this.leaderboard.length === 0) {
            html += '<div class="loading">No leaderboard data yet</div>';
        } else {
            html += this.leaderboard.map(entry => `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">#${entry.rank}</div>
                    <div class="leaderboard-name">${this.escapeHtml(entry.name)}</div>
                    <div class="leaderboard-stats">${entry.completed_count} challenges</div>
                </div>
            `).join('');
        }
        
        html += '</div>';
        container.innerHTML = html;
    }

    async loadProfileView() {
        const container = document.getElementById('profileContent');
        
        if (!this.profile) {
            await this.loadProfile();
        }

        container.innerHTML = `
            <h2>Profile</h2>
            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-value">${this.profile.completed_challenges || 0}</div>
                    <div class="stat-label">Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${this.profile.total_stars || 0}</div>
                    <div class="stat-label">Stars</div>
                </div>
            </div>
            <div style="margin-top: 20px;">
                <p><strong>User ID:</strong> ${this.currentUserId}</p>
                <p><strong>Name:</strong> ${this.profile.name || 'Unknown'}</p>
            </div>
        `;
    }

    showCreateModal() {
        document.getElementById('createModal').classList.add('active');
    }

    hideCreateModal() {
        document.getElementById('createModal').classList.remove('active');
        document.getElementById('createChallengeForm').reset();
    }

    async handleCreateChallenge() {
        const title = document.getElementById('challengeTitle').value;
        const description = document.getElementById('challengeDescription').value;
        const difficulty = document.getElementById('challengeDifficulty').value;
        const stars = parseInt(document.getElementById('challengeStars').value);
        const deadline = document.getElementById('challengeDeadline').value;

        try {
            await api.createChallenge({
                title,
                description,
                difficulty,
                stars,
                deadline,
                createdBy: this.currentUserId
            });
            
            this.hideCreateModal();
            await this.loadChallenges();
            alert('Challenge created successfully!');
        } catch (error) {
            alert(`Error creating challenge: ${error.message}`);
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Инициализация приложения
const app = new App();

