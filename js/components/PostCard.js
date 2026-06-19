import { formatDate, escapeHtml } from '../utils/helpers.js';

export class PostCard {
    constructor(post, user, onLike, onComment, onUserClick) {
        this.post = post;
        this.user = user;
        this.onLike = onLike;
        this.onComment = onComment;
        this.onUserClick = onUserClick;
    }

    render() {
        const article = document.createElement('article');
        article.className = 'post-card';
        article.dataset.postId = this.post.id;

        article.innerHTML = `
            <div class="post-header">
                <div class="post-author" data-user-id="${this.user.id}">
                    <img src="https://i.pravatar.cc/150?u=${this.user.email}" 
                         alt="${this.user.name}" 
                         class="post-avatar">
                    <div class="post-author-info">
                        <div class="post-author-name">${escapeHtml(this.user.name)}</div>
                        <div class="post-author-username">@${escapeHtml(this.user.username.toLowerCase())}</div>
                    </div>
                </div>
                <div class="post-date">${formatDate(this.post.date)}</div>
            </div>
            
            ${this.post.image ? `
                <div class="post-image-container">
                    <img src="${this.post.image}" 
                         alt="Фото к посту" 
                         class="post-image"
                         loading="lazy">
                </div>
            ` : ''}
            
            <div class="post-content">
                <p class="post-text">${escapeHtml(this.post.text)}</p>
            </div>
            
            <div class="post-actions">
                <button class="post-action-btn like-btn ${this.post.likedByMe ? 'liked' : ''}" 
                        data-post-id="${this.post.id}">
                    <span class="heart-icon">♥</span>
                    <span class="like-count">${this.post.likes}</span>
                </button>
                <button class="post-action-btn comment-btn" 
                        data-post-id="${this.post.id}">
                    💬 <span class="comment-count">${this.post.comments.length}</span>
                </button>
                <div class="post-action-btn views-count">
                    👁️ <span>${this.post.views || 0}</span>
                </div>
            </div>
        `;

        // Увеличиваем счетчик просмотров при создании карточки
        if (this.post.views !== undefined) {
            this.post.views++;
        }

        // Обработчики событий
        article.querySelector('.post-author').addEventListener('click', () => {
            this.onUserClick(this.user.id);
        });

        article.querySelector('.like-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.onLike(this.post.id);
        });

        article.querySelector('.comment-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            this.onComment(this.post.id);
        });

        return article;
    }
}