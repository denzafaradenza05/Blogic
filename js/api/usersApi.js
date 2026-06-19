// Загрузка пользователей с внешнего API
export const fetchUsers = async () => {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error('Ошибка сети');
        return await response.json();
    } catch (error) {
        console.error('Не удалось загрузить пользователей:', error);
        return [];
    }
};

// Загрузка комментариев для поста
export const fetchComments = async (postId) => {
    try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        if (!response.ok) throw new Error('Ошибка сети');
        return await response.json();
    } catch (error) {
        console.error('Не удалось загрузить комментарии:', error);
        return [];
    }
};