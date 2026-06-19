import { FeedPage } from './pages/FeedPage.js';
import { ProfilePage } from './pages/ProfilePage.js';

class App {
    constructor() {
        this.container = document.getElementById('app');
        this.feedPage = new FeedPage('#app');
        this.profilePage = new ProfilePage('#app');
        this.currentView = 'feed';
    }

    async init() {
        // Рендерим шапку
        this.renderHeader();
        
        // Инициализируем ленту
        await this.feedPage.init();
        
        // Настраиваем навигацию
        this.feedPage.setProfileClickHandler((userId) => {
            this.showProfile(userId);
        });
        
        this.profilePage.setBackHandler(() => {
            this.showFeed();
        });
    }

    renderHeader() {
    const header = document.getElementById('header');
    header.innerHTML = `
        <nav class="main-nav">
            <div class="nav-brand">📝 Blogic</div>
        </nav>
    `;
}

    showFeed() {
        this.currentView = 'feed';
        this.container.innerHTML = '';
        this.feedPage = new FeedPage('#app');
        this.feedPage.init();
        this.feedPage.setProfileClickHandler((userId) => {
            this.showProfile(userId);
        });
        
    }

    async showProfile(userId) {
        this.currentView = 'profile';
        this.container.innerHTML = '';
        this.profilePage = new ProfilePage('#app');
        await this.profilePage.init(userId, this.feedPage.users, this.feedPage.posts);
        this.profilePage.setBackHandler(() => {
            this.showFeed();
        });
        
    }
}

// Запуск приложения
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});