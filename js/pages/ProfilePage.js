import { fetchUsers } from '../api/usersApi.js';
import { UserProfile } from '../components/UserProfile.js';

export class ProfilePage {
    constructor(containerSelector) {
        this.container = document.querySelector(containerSelector);
        this.users = [];
        this.posts = [];
        this.onBack = null;
        this.onPostClick = null;
    }

    async init(userId, users, posts) {
        this.users = users;
        this.posts = posts;
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            this.container.innerHTML = '<p class="error">Пользователь не найден</p>';
            return;
        }

        const userPosts = this.posts.filter(p => p.userId === userId);
        
        const profile = new UserProfile(
            user,
            userPosts,
            () => this.onBack && this.onBack(),
            (postId) => this.onPostClick && this.onPostClick(postId)
        );
        
        this.container.innerHTML = '';
        this.container.appendChild(profile.render());
    }

    setBackHandler(handler) {
        this.onBack = handler;
    }

    setPostClickHandler(handler) {
        this.onPostClick = handler;
    }
}