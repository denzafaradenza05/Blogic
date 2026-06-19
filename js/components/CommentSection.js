import { formatDate, escapeHtml } from '../utils/helpers.js';

export class CommentSection {
    constructor(postId, comments, users, onAddComment) {
        this.postId = postId;
        this.comments = comments;
        this.users = users;
        this.onAddComment = onAddComment;
        this.modalElement = null;
    }

    // Метод закрытия модалки
    close() {
        if (this.modalElement) {
            this.modalElement.remove();
        }
    }

    render() {
        this.modalElement = document.createElement('div');
        this.modalElement.className = 'modal modal--active';

        const commentsHTML = this.comments.map(comment => {
            const author = this.users.find(u => u.id === comment.userId) || {
                name: 'Неизвестный',
                username: 'unknown',
                email: ''
            };
            return `
                <div class="comment-item">
                    <img src="https://i.pravatar.cc/150?u=${author.email}"
                         alt="${author.name}"
                         class="comment-avatar">
                    <div class="comment-content">
                        <div class="comment-author">${escapeHtml(author.name)}</div>
                        <div class="comment-text">${escapeHtml(comment.text)}</div>
                        <div class="comment-date">${formatDate(comment.date)}</div>
                    </div>
                </div>
            `;
        }).join('');

        this.modalElement.innerHTML = `
            <div class="modal__content">
                <button class="modal__close" type="button">&times;</button>
                <h2 class="modal__title">Комментарии</h2>
                <div class="comments-list">
                    ${commentsHTML || '<p class="no-comments">Пока нет комментариев. Будьте первым!</p>'}
                </div>
                <form class="comment-form">
                    <textarea class="comment-input"
                              placeholder="Напишите комментарий..."
                              maxlength="280"
                              required></textarea>
                    <div class="comment-form-footer">
                        <span class="char-counter">0/280</span>
                        <button type="submit" class="comment-submit-btn">Отправить</button>
                    </div>
                </form>
            </div>
        `;

        // ✅ Крестик закрытия
        this.modalElement.querySelector('.modal__close').addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        });

        // Закрытие по клику на фон
        this.modalElement.addEventListener('click', (e) => {
            if (e.target === this.modalElement) {
                this.close();
            }
        });

        // Счётчик символов
        const textarea = this.modalElement.querySelector('.comment-input');
        const counter = this.modalElement.querySelector('.char-counter');
        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length}/280`;
        });

        // ✅ Отправка формы
        this.modalElement.querySelector('.comment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const text = textarea.value.trim();
            if (text) {
                this.onAddComment(this.postId, text);
                this.close();
            }
        });

        return this.modalElement;
    }
}