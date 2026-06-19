import { fetchUsers, fetchComments } from '../api/usersApi.js';
import { seedPosts } from '../data/seedPosts.js';
import { PostCard } from '../components/PostCard.js';
import { CommentSection } from '../components/CommentSection.js';
import { CreatePostForm } from '../components/CreatePostForm.js';
import { generateId } from '../utils/helpers.js';

export class FeedPage {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.users = [];
        this.posts = [...seedPosts];
        this.filteredPosts = [...this.posts];
        this.currentSort = 'new';
        this.searchQuery = '';
        this.onProfileClick = null;
    }

    async init() {
    this.container.innerHTML = '<div class="loader">⏳ Загрузка...</div>';
    
    try {
        // Загружаем пользователей
        this.users = await fetchUsers();
        if (this.users.length === 0) {
            this.container.innerHTML = '<p class="error">Не удалось загрузить пользователей</p>';
            return;
        }

        // Загружаем комментарии для всех постов
        await this.loadAllComments();
        
        this.render();
    } catch (error) {
        console.error('Ошибка загрузки:', error);
        this.container.innerHTML = '<p class="error">Ошибка загрузки данных</p>';
    }
}

// Загрузка комментариев для всех постов
async loadAllComments() {
    // Создаём массив промисов для параллельной загрузки
    const commentPromises = this.posts.map(async (post) => {
        try {
            const apiComments = await fetchComments(post.id);
            // Добавляем загруженные комментарии к посту
            post.comments = apiComments.map(c => ({
                id: c.id,
                userId: Math.floor(Math.random() * 10) + 1,
                text: c.body,
                date: new Date().toISOString()
            }));
        } catch (error) {
            console.error(`Не удалось загрузить комментарии для поста ${post.id}:`, error);
            post.comments = [];
        }
    });

    // Ждём завершения всех загрузок
    await Promise.all(commentPromises);
}


    setProfileClickHandler(handler) {
        this.onProfileClick = handler;
    }

    render() {
        this.container.innerHTML = '';

        // Форма создания поста
        const createForm = new CreatePostForm(this.users, (userId, text, image) => {
    this.createPost(userId, text, image);
});
        this.container.appendChild(createForm.render());

        // Фильтры и сортировка
        const controls = document.createElement('div');
        controls.className = 'feed-controls';
        controls.innerHTML = `
            <input type="text" class="search-input" placeholder="🔍 Поиск по постам и авторам...">
            <div class="sort-controls">
                <button class="sort-btn ${this.currentSort === 'new' ? 'active' : ''}" data-sort="new">Новые</button>
                <button class="sort-btn ${this.currentSort === 'old' ? 'active' : ''}" data-sort="old">Старые</button>
            </div>
        `;
        this.container.appendChild(controls);

        // Лента постов
        const feed = document.createElement('div');
        feed.className = 'feed';
        this.container.appendChild(feed);

        this.applyFilters();
        this.attachEvents();
    }

    applyFilters() {
        const feed = this.container.querySelector('.feed');
        
        // Фильтрация
        this.filteredPosts = this.posts.filter(post => {
            const user = this.users.find(u => u.id === post.userId);
            const query = this.searchQuery.toLowerCase();
            
            const matchesSearch = !query || 
                post.text.toLowerCase().includes(query) ||
                (user && user.name.toLowerCase().includes(query));
            
            return matchesSearch;
        });

        // Сортировка
        this.filteredPosts.sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return this.currentSort === 'new' ? dateB - dateA : dateA - dateB;
        });

        // Рендеринг
        feed.innerHTML = '';
        if (this.filteredPosts.length === 0) {
            feed.innerHTML = '<p class="no-posts">Посты не найдены</p>';
            return;
        }

        this.filteredPosts.forEach(post => {
            const user = this.users.find(u => u.id === post.userId);
            if (user) {
                const postCard = new PostCard(
                    post, 
                    user, 
                    (postId) => this.toggleLike(postId),
                    (postId) => this.openComments(postId),
                    (userId) => this.openProfile(userId)
                );

       
                feed.appendChild(postCard.render());
            }
        });
    }

    attachEvents() {
        // Поиск
        const searchInput = this.container.querySelector('.search-input');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.applyFilters();
        });

        // Сортировка
        this.container.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentSort = e.target.dataset.sort;
                this.container.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.applyFilters();
            });
        });
    }

    createPost(userId, text, image = null) {
    const newPost = {
        id: generateId(),
        userId: userId,
        text: text,
        date: new Date().toISOString(),
        likes: 0,
        likedByMe: false,
        views: 0,
        image: image, 
        comments: []
    };
    this.posts.unshift(newPost);
    this.applyFilters();
}

    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likedByMe = !post.likedByMe;
            post.likes += post.likedByMe ? 1 : -1;
            this.applyFilters();
        }
    }

    async openComments(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    // Комментарии уже загружены, просто показываем
    const modal = new CommentSection(
        postId,
        post.comments,  // Используем уже загруженные комментарии
        this.users,
        (postId, text) => this.addComment(postId, text)
    );
    
    document.body.appendChild(modal.render());
}

    addComment(postId, text) {
        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                id: generateId(),
                userId: 1, // Текущий пользователь
                text: text,
                date: new Date().toISOString()
            });
            this.applyFilters();
        }
    }

    openProfile(userId) {
        if (this.onProfileClick) {
            this.onProfileClick(userId);
        }
    }
}