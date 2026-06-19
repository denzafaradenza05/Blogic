import { formatDate, escapeHtml } from '../utils/helpers.js';

export class UserProfile {
    constructor(user, posts, onBack, onPostClick) {
        this.user = user;
        this.posts = posts;
        this.onBack = onBack;
        this.onPostClick = onPostClick;
    }

    render() {
        const container = document.createElement('div');
        container.className = 'user-profile';

        const postsHTML = this.posts.map(post => `
            <div class="profile-post" data-post-id="${post.id}">
                <p class="profile-post-text">${escapeHtml(post.text)}</p>
                
                ${post.image ? `
                    <div class="profile-post-image-container">
                        <img src="${post.image}" 
                             alt="Фото к посту" 
                             class="profile-post-image"
                             loading="lazy"
                             onerror="this.parentElement.style.display='none'">
                    </div>
                ` : ''}
                
                <div class="profile-post-meta">
                    <span>♥ ${post.likes}</span>
                    <span>💬 ${post.comments.length}</span>
                    <span>👁️ ${post.views || 0}</span>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
        `).join('');

        container.innerHTML = `
            <div class="profile-top-bar">
                <button class="back-btn">← Назад к ленте</button>
            </div>
            <div class="profile-header">
                <img src="https://i.pravatar.cc/150?u=${this.user.email}" 
                     alt="${this.user.name}" 
                     class="profile-avatar">
                <div class="profile-info">
                    <h1 class="profile-name">${escapeHtml(this.user.name)}</h1>
                    <div class="profile-username">@${escapeHtml(this.user.username.toLowerCase())}</div>
                    <div class="profile-details">
                        <p>📧 ${escapeHtml(this.user.email)}</p>
                        <p>🏙️ ${escapeHtml(this.user.address.city)}</p>
                    </div>
                </div>
            </div>
            <div class="profile-posts">
                <h2>Посты пользователя</h2>
                ${postsHTML || '<p class="no-posts">У пользователя пока нет постов</p>'}
            </div>
        `;

        container.querySelector('.back-btn').addEventListener('click', () => {
            this.onBack();
        });

        container.querySelectorAll('.profile-post').forEach(postEl => {
            postEl.addEventListener('click', () => {
                this.onPostClick(parseInt(postEl.dataset.postId));
            });
        });

        return container;
    }
}