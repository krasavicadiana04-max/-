document.addEventListener('DOMContentLoaded', function () {

    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;

    const galleryItems = document.querySelectorAll('.gallery-item');
    const totalImages = galleryItems.length;

    const statsContainer = document.createElement('div');
    statsContainer.className = 'gallery-stats';
    statsContainer.style.cssText = `
        margin-top: 30px;
        padding: 15px 20px;
        background: linear-gradient(135deg, #f5e6e8 0%, #e8d5d8 100%);
        border-radius: 15px;
        text-align: center;
        font-size: 1.1rem;
        font-weight: bold;
        color: #5e445e;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    `;
    statsContainer.innerHTML = `Количество кадров цветущих мгновений: ${totalImages}`;

    const navigation = document.querySelector('.navigation');
    if (navigation) {
        galleryGrid.parentNode.insertBefore(statsContainer, navigation);
    } else {
        galleryGrid.parentNode.appendChild(statsContainer);
    }

    const likesCount = new Array(totalImages).fill(0);

    galleryItems.forEach((item, index) => {

        const infoBlock = item.querySelector('.info');
        if (!infoBlock) return;

        const titleElement = infoBlock.querySelector('h3');
        if (!titleElement) return;

        const titleWrapper = document.createElement('div');
        titleWrapper.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            width: 100%;
        `;

        const parentOfTitle = titleElement.parentNode;
        titleWrapper.appendChild(titleElement.cloneNode(true));

        parentOfTitle.replaceChild(titleWrapper, titleElement);

        const newTitle = titleWrapper.querySelector('h3');

        const likeContainer = document.createElement('div');
        likeContainer.style.cssText = `
            display: flex;
            align-items: center;
            gap: 5px;
            white-space: nowrap;
        `;

        // Кнопка лайка
        const likeButton = document.createElement('button');
        likeButton.innerHTML = '💗';
        likeButton.style.cssText = `
            background: none;
            border: none;
            font-size: 1.2rem;
            cursor: pointer;
            transition: transform 0.2s ease;
            padding: 0 5px;
        `;

        // Счётчик лайков
        const likeCounter = document.createElement('span');
        likeCounter.textContent = '0';
        likeCounter.style.cssText = `
            font-size: 0.9rem;
            font-weight: bold;
            color: #c97b84;
            min-width: 20px;
            text-align: center;
        `;

        likeContainer.appendChild(likeButton);
        likeContainer.appendChild(likeCounter);
        titleWrapper.appendChild(likeContainer);

        let isLiked = false;
        likeButton.addEventListener('click', function (e) {
            e.stopPropagation();
            if (!isLiked) {
                likesCount[index]++;
                likeCounter.textContent = likesCount[index];
                likeButton.style.transform = 'scale(1.2)';
                likeButton.style.opacity = '0.8';
                isLiked = true;

                setTimeout(() => {
                    likeButton.style.transform = 'scale(1)';
                }, 200);
            } else {
                likesCount[index]--;
                likeCounter.textContent = likesCount[index];
                likeButton.style.transform = 'scale(0.9)';
                likeButton.style.opacity = '1';
                isLiked = false;

                setTimeout(() => {
                    likeButton.style.transform = 'scale(1)';
                }, 200);
            }
        });

        likeButton.addEventListener('mouseenter', function () {
            this.style.transform = 'scale(1.1)';
        });

        likeButton.addEventListener('mouseleave', function () {
            if (!isLiked) {
                this.style.transform = 'scale(1)';
            }
        });
    });

    const totalLikesContainer = document.createElement('div');
    totalLikesContainer.className = 'total-likes-stats';
    totalLikesContainer.style.cssText = `
        margin-top: 15px;
        padding: 10px 20px;
        background: #fff0f0;
        border-radius: 25px;
        text-align: center;
        font-size: 0.95rem;
        color: #a0525a;
        border: 1px solid #f0c0c0;
    `;
    totalLikesContainer.innerHTML = `💗 Всего лайков: 0`;

    if (statsContainer.parentNode) {
        statsContainer.insertAdjacentElement('afterend', totalLikesContainer);
    }

    function updateTotalLikes() {
        const total = likesCount.reduce((sum, count) => sum + count, 0);
        totalLikesContainer.innerHTML = `💗 Всего лайков: ${total}`;

        totalLikesContainer.style.transform = 'scale(1.02)';
        setTimeout(() => {
            totalLikesContainer.style.transform = 'scale(1)';
        }, 200);
    }


    const originalPush = likesCount.push;
    const likeUpdateInterval = setInterval(() => {
        updateTotalLikes();
    }, 100);

    const allLikeButtons = document.querySelectorAll('.gallery-item button');
    const originalClickHandler = {};

    allLikeButtons.forEach((button, idx) => {
        const newButton = button.cloneNode(true);
        if (button.parentNode) {
            button.parentNode.replaceChild(newButton, button);

            const counter = newButton.nextElementSibling;
            let itemLiked = false;
            let itemIndex = idx;

            const actualItem = newButton.closest('.gallery-item');
            const actualIndex = Array.from(galleryItems).indexOf(actualItem);

            newButton.addEventListener('click', function (e) {
                e.stopPropagation();
                if (!itemLiked) {
                    likesCount[actualIndex]++;
                    counter.textContent = likesCount[actualIndex];
                    newButton.style.transform = 'scale(1.2)';
                    itemLiked = true;
                    setTimeout(() => {
                        newButton.style.transform = 'scale(1)';
                    }, 200);
                } else {
                    likesCount[actualIndex]--;
                    counter.textContent = likesCount[actualIndex];
                    newButton.style.transform = 'scale(0.9)';
                    itemLiked = false;
                    setTimeout(() => {
                        newButton.style.transform = 'scale(1)';
                    }, 200);
                }
                updateTotalLikes();
            });

            newButton.addEventListener('mouseenter', function () {
                if (!itemLiked) this.style.transform = 'scale(1.1)';
            });

            newButton.addEventListener('mouseleave', function () {
                if (!itemLiked) this.style.transform = 'scale(1)';
            });
        }
    });

    clearInterval(likeUpdateInterval);
    updateTotalLikes();

    let displayedCount = 0;
    const statsElement = statsContainer;
    const targetCount = totalImages;

    function animateCounter() {
        if (displayedCount < targetCount) {
            displayedCount++;
            statsElement.innerHTML = ` Количество кадров цветущих мгновений: ${displayedCount}`;
            setTimeout(animateCounter, 50);
        }
    }
    animateCounter();

    const style = document.createElement('style');
    style.textContent = `
        @media (max-width: 600px) {
            .gallery-item .info div {
                flex-wrap: wrap;
                justify-content: center !important;
            }
            .gallery-item button {
                font-size: 1rem !important;
            }
        }
        
        .gallery-item .info div {
            transition: all 0.2s ease;
        }
    `;
    document.head.appendChild(style);
});



(function () {

    const descriptions = {
        // Розы
        "Розы": "Розы — это страсть, энергия и восторг в каждом лепестке. Насыщенный цвет притягивает взгляд и дарит ощущение праздника. Эти розы говорят громче слов: они символизируют восхищение, благодарность и искреннюю радость. Пышные бутоны с бархатистыми лепестками создают настроение уверенности и счастья. Идеальный выбор, чтобы выразить яркие эмоции и сделать незабываемый подарок.",

        "Нежный букет розовых роз": "Нежная композиция розовых роз, которая создаёт уют и тепло. Сочетание нежных лепестков персиковых и кремовых оттенков переливается на свету, напоминая утреннюю зарю. Этот букет словно соткан из мягких облаков и первых весенних лучей.",

        // Пионы
        "Пионы": "Пионы — короли весеннего сада! Нежная композиция розовых пионов, которая создаёт уют и тепло. Сочетание нежных лепестков с медовым ароматом наполняет пространство атмосферой праздника. Каждый цветок — как пушистое облачко, в котором хочется утонуть.",

        // Гипсофилы
        "Гипсофилы": "Невесомая вуаль из гипсофил создаёт эффект парящих облаков. Нежная композиция из воздушных белых соцветий дарит лёгкость и романтику, словно усыпая букет бриллиантовой пыльцой. Символ невинности и бесконечной нежности.",

        // Тюльпаны
        "Тюльпаны": "Тюльпаны — это улыбка весны в каждом лепестке. Нежная композиция создаёт уют и тепло, пробуждая приятные воспоминания. Сочетание пастельных оттенков напоминает о первых тёплых днях, когда природа только просыпается.",

        // Альстромерия
        "Альстромерия": "Альстромерия — лёгкие бабочки, похожие на миниатюрные орхидеи. Нежная композиция из этих экзотических цветов создаёт уют и тепло. Узоры на лепестках напоминают крылья тропических бабочек, символизируя дружбу и преданность.",

        // Хризантемы
        "Хризантемы": "Пушистое великолепие хризантем завораживает с первого взгляда. Нежная композиция создаёт уют и тепло даже в пасмурный день. Пышные шапки цветов словно сотканы из солнечных лучей, символизируя долголетие и радость.",

        // Ранункулюсы
        "Ранункулюсы (лютики)": "Ранункулюсовая мечта — это многослойное чудо природы. Нежная композиция из лютиков создаёт уют и тепло. Плотные лепестки, сложенные в идеальные розетки, выглядят как произведение искусства.",

        // Фрезии
        "Фрезии": "Фрезии — хрупкое изящество с пьянящим ароматом. Нежная композиция наполняет комнату сладкими нотами. Воронковидные цветки напоминают танцующих фей, символизируя доверие и безоговорочную любовь.",

        // Гортензии
        "Гортензии": "Шапки акварельного тумана — это гортензии во всей красе. Нежная композиция из воздушных цветов создаёт уют и тепло. Переливы от розового до лавандового напоминают закатное небо.",

        // Розы пионовидные
        "Розы пионовидные": "Многослойная нежность пионовидных роз завораживает. Нежная композиция создаёт уют и тепло. Плотные бутоны напоминают старинные кружева, сочетая элегантность роз и пышность пионов.",

        // Георгины
        "Георгины": "Графичная роскошь георгинов притягивает взгляд. Нежная композиция создаёт уют и тепло. Симметричные лепестки образуют безупречные геометрические формы, созданные самой природой.",

        // Лилии
        "Лилии": "Белая нежность лилий наполняет пространство чистотой и светом. Нежная композиция из царственных цветов создаёт уют и тепло. Крупные лепестки с изящными тычинками выглядят величественно и благородно.",

        // Орхидеи
        "Орхидеи": "Нежный букет орхидей — воплощение экзотической красоты. Нежная композиция переносит в тропический рай. Восковые лепестки изящной формы символизируют утончённость и любовь к прекрасному.",

        // Общие описания для букетов
        "Нежный букет": "Нежный букет — воплощение романтики и весенней свежести. Лепестки, словно окутанные утренней дымкой, переливаются пастельными оттенками.Цветы напоминают прикосновение шёлка, а тонкий аромат окутывает лёгкой дымкой счастья. Этот букет дарит ощущение безмятежности, умиротворения и чистой радости. Идеальный подарок для тех, кто ценит изящество и хочет выразить самые тёплые чувства.",

        "Невесомый букет": "Невесомый букет — словно облачко из лепестков. Нежная композиция создаёт уют и тепло. Воздушные цветы с тонкими стеблями выглядят как кружево, сплетённое феями.",

        "Акварельный букет": "Акварельный букет — это живопись в мире цветов. Нежная композиция с плавными переходами оттенков создаёт уют и тепло. Любовь с первого лепестка — это точно про этот букет!",

        "Лавандовый туман": "Лавандовый туман — фиалковый шёпот в мире флоры. Нежная композиция из фиолетовых цветов создаёт уют и тепло. Холодные оттенки с тёплым ароматом успокаивают и расслабляют.",

        "Поцелуй весны": "Поцелуй весны — признание в любви языком цветов. Нежная композиция создаёт уют и тепло. Сочетание первоцветов с зеленью символизирует новое начало и свежесть.",

        "Тихая роскошь": "Тихая роскошь для истинных ценителей прекрасного. Нежная композиция благородных цветов создаёт уют и тепло. Благородные оттенки завораживают глубиной и изяществом.",

        "Застывшая нежность": "Застывшая нежность — мгновение красоты, остановленное в букете. Нежная композиция создаёт уют и тепло. Пастельные тона с плотными бутонами выглядят как драгоценность."
    };

    function getDescriptionFromCard(cardElement) {

        const titleElement = cardElement.querySelector('.info h3');
        let key = titleElement ? titleElement.textContent.trim() : '';

        if (!key) {
            const img = cardElement.querySelector('img');
            if (img && img.alt && img.alt !== "Цветошки" && img.alt !== "Букет") {
                key = img.alt;
            }
        }

        if (descriptions[key]) {
            return descriptions[key];
        }

        for (const [descKey, descValue] of Object.entries(descriptions)) {
            if (key.toLowerCase().includes(descKey.toLowerCase()) ||
                descKey.toLowerCase().includes(key.toLowerCase())) {
                return descValue;
            }
        }

        return `Нежная композиция из прекрасных цветов создаёт уют и тепло. Сочетание нежных оттенков и изящных форм напоминает о самых счастливых моментах жизни. Каждый цветок в этом букете — маленькое чудо.`;
    }

    function getImageFromCard(cardElement) {
        const img = cardElement.querySelector('img');
        return img ? img.src : '';
    }

    function getTitleFromCard(cardElement) {
        const titleElement = cardElement.querySelector('.info h3');
        if (titleElement && titleElement.textContent.trim()) {
            return titleElement.textContent.trim();
        }
        const img = cardElement.querySelector('img');
        return img && img.alt ? img.alt : 'Красота природы';
    }

    function createModal() {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        const modalContainer = document.createElement('div');
        modalContainer.className = 'modal-container';

        const modalImg = document.createElement('img');
        modalImg.className = 'modal-img';
        modalImg.alt = '';

        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';

        const title = document.createElement('h3');
        title.id = 'modal-title';

        const description = document.createElement('div');
        description.className = 'modal-description';
        description.id = 'modal-description';

        modalContent.appendChild(title);
        modalContent.appendChild(description);

        modalContainer.appendChild(modalImg);
        modalContainer.appendChild(modalContent);
        overlay.appendChild(modalContainer);

        document.body.appendChild(overlay);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('active')) {
                overlay.classList.remove('active');
            }
        });

        return { overlay, modalImg, title, description };
    }

    const modal = createModal();

    function openModalForCard(cardElement) {
        const imgSrc = getImageFromCard(cardElement);
        const titleText = getTitleFromCard(cardElement);
        const descriptionText = getDescriptionFromCard(cardElement);

        modal.modalImg.src = imgSrc;
        modal.title.textContent = titleText;
        modal.description.textContent = descriptionText;

        modal.overlay.classList.add('active');
    }

    function initModalOnCards() {
        const cards = document.querySelectorAll('.gallery-item');

        cards.forEach(card => {

            card.removeEventListener('click', card._modalHandler);

            const handler = function (e) {

                e.stopPropagation();
                openModalForCard(this);
            };

            card._modalHandler = handler;
            card.addEventListener('click', handler);

            card.style.cursor = 'pointer';
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initModalOnCards);
    } else {
        initModalOnCards();
    }
})();


//Контакты

document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');

    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const consent = document.getElementById('consent');
            if (!consent.checked) {
                alert('Пожалуйста, подтвердите согласие на обработку персональных данных');
                return;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                topic: document.getElementById('topic').value,
                message: document.getElementById('message').value
            };

            if (!formData.name || !formData.email || !formData.message) {
                alert('Пожалуйста, заполните все обязательные поля');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Пожалуйста, введите корректный email');
                return;
            }

            console.log('Отправка формы:', formData);
            alert('Спасибо! Ваше сообщение отправлено. Я свяжусь с вами в ближайшее время.');

            form.reset();
        });
    }
});
