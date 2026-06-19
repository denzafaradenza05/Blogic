export class CreatePostForm {
    constructor(users, onCreatePost) {
        this.users = users;
        this.onCreatePost = onCreatePost;
        this.selectedImage = null;
        this.imagePreview = null;
    }

    render() {
        const form = document.createElement('form');
        form.className = 'create-post-form';

        const userOptions = this.users.map(user => 
            `<option value="${user.id}">${user.name} (@${user.username.toLowerCase()})</option>`
        ).join('');

        form.innerHTML = `
            <h3 class="form-title">Создать пост</h3>
            <div class="form-group">
                <label for="postAuthor">Автор</label>
                <select id="postAuthor" class="form-select" required>
                    <option value="">Выберите автора...</option>
                    ${userOptions}
                </select>
            </div>
            <div class="form-group">
                <label for="postText">Текст поста</label>
                <textarea id="postText" 
                          class="form-textarea" 
                          placeholder="О чём думаете?" 
                          maxlength="280" 
                          required></textarea>
                <div class="form-footer">
                    <span class="char-counter">0/280</span>
                    <button type="submit" class="submit-btn" disabled>Опубликовать</button>
                </div>
            </div>
            
            <!-- Добавление фото -->
            <div class="form-group">
                <label class="file-upload-label">
                    <input type="file" id="postImage" class="file-input" accept="image/*">
                    <span class="file-upload-btn">📷 Прикрепить фото</span>
                </label>
                <div class="image-preview-container" id="imagePreviewContainer" style="display: none;">
                    <img id="imagePreview" class="image-preview" alt="Превью">
                    <button type="button" class="remove-image-btn" id="removeImageBtn">&times;</button>
                </div>
                <div class="file-error" id="fileError"></div>
            </div>
        `;

        const textarea = form.querySelector('#postText');
        const counter = form.querySelector('.char-counter');
        const submitBtn = form.querySelector('.submit-btn');
        const authorSelect = form.querySelector('#postAuthor');
        const fileInput = form.querySelector('#postImage');
        const previewContainer = form.querySelector('#imagePreviewContainer');
        const previewImg = form.querySelector('#imagePreview');
        const removeBtn = form.querySelector('#removeImageBtn');
        const fileError = form.querySelector('#fileError');

        const validate = () => {
            const text = textarea.value.trim();
            const author = authorSelect.value;
            counter.textContent = `${textarea.value.length}/280`;
            
            const isValid = text.length > 0 && text.length <= 280 && author;
            submitBtn.disabled = !isValid;
        };

        // Обработка выбора файла
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            fileError.textContent = '';
            
            if (!file) return;
            
            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                fileError.textContent = '❌ Пожалуйста, выберите изображение';
                fileInput.value = '';
                return;
            }
            
            // Проверка размера (макс 5MB)
            if (file.size > 5 * 1024 * 1024) {
                fileError.textContent = '❌ Файл слишком большой (макс. 5MB)';
                fileInput.value = '';
                return;
            }
            
            // Создание превью
            const reader = new FileReader();
            reader.onload = (event) => {
                this.selectedImage = event.target.result;
                previewImg.src = this.selectedImage;
                previewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });

        // Удаление фото
        removeBtn.addEventListener('click', () => {
            this.selectedImage = null;
            this.imagePreview = null;
            fileInput.value = '';
            previewContainer.style.display = 'none';
            previewImg.src = '';
        });

        textarea.addEventListener('input', validate);
        authorSelect.addEventListener('change', validate);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userId = parseInt(authorSelect.value);
            const text = textarea.value.trim();
            
            if (text && userId) {
                this.onCreatePost(userId, text, this.selectedImage);
                form.reset();
                counter.textContent = '0/280';
                submitBtn.disabled = true;
                previewContainer.style.display = 'none';
                previewImg.src = '';
                this.selectedImage = null;
            }
        });

        return form;
    }
}