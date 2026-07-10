/* === 1. LOCAL STORAGE (FAVORITES) === */
function getFavorites() {
    const favs = localStorage.getItem('recipe_favorites');
    return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favArray) {
    localStorage.setItem('recipe_favorites', JSON.stringify(favArray));
}

function toggleFavorite(recipeId, buttonElement) {
    let favorites = getFavorites();
    const $btn = $(buttonElement);
    const $icon = $btn.find('i');
    const isFavorited = favorites.includes(recipeId);

    if (isFavorited) {
        favorites = favorites.filter(id => id !== recipeId);
        $btn.removeClass('active');
    } else {
        favorites.push(recipeId);
        $btn.addClass('active');
    }
    saveFavorites(favorites);

    $icon.fadeOut(100, function () {
        if (isFavorited) {
            $icon.removeClass('fa-solid').addClass('fa-regular');
        } else {
            $icon.removeClass('fa-regular').addClass('fa-solid');
        }
    }).fadeIn(100);
}

/* === 2. SHARED UI HELPERS === */
function setFooterYear() {
    $('#date').text(new Date().getFullYear());
}

function generateRecipeCard(recipe, parentContainer) {
    const favorites = getFavorites();
    const isFavorited = favorites.includes(recipe.id);
    const $parent = $(parentContainer);

    const cardHtml = `
        <div class='card'>
            <div class='card-header'>
                <span class='cuisine'>${recipe.cuisine.toUpperCase()}</span>
                <button class='btn-favorite ${isFavorited ? 'active' : ''}' data-id='${recipe.id}' aria-label="Add to favorites">
                    <i class="fa-${isFavorited ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <img src='${recipe.image}' alt='${recipe.name}' loading='lazy'/>
            </div>
            <div class='card-body'>
                <div>
                    <span>${recipe.mealType.join(', ')}</span>
                    <span class='rating'>
                        <i class="fa-solid fa-star"></i> 
                        <span>${recipe.rating}</span> 
                        <span class='reviews'>(${recipe.reviewCount} reviews)</span>
                    </span>    
                </div>
                <h2>${recipe.name}</h2>
                <div>
                    <p><i class="fa-regular fa-clock"></i> ${recipe.prepTimeMinutes} min</p>
                    <span class='difficulty ${recipe.difficulty.toLowerCase()}'>${recipe.difficulty}</span>
                </div>
                <button class='btn-details' data-id='${recipe.id}'>See Details</button>
            </div>
        </div>
    `;

    $(cardHtml).hide().appendTo($parent).fadeIn(350);
}

/* === 3. EMPTY / ERROR STATE WITH ILLUSTRATION === */
function showEmptyState($container, message = 'No items found.') {
    const html = `
        <div class="empty-state">
            <img src="./assets/imgs/noItemFound.png" alt="No items found" class="empty-state-img">
            <p class="empty-state-msg">${message}</p>
        </div>
    `;
    $container.empty().append(html);
}

function showErrorState($container, message = 'Something went wrong. Please try again later.') {
    showEmptyState($container, message);
}

/* === 4. GLOBAL EVENT DELEGATION === */
$(document).ready(() => {
    setFooterYear();

    $('#recipes').on('click', '.btn-favorite', function () {
        const recipeId = parseInt($(this).data('id'), 10);
        toggleFavorite(recipeId, this);

        if (window.location.pathname.includes('favorites.html')) {
            const $card = $(this).closest('.card');
            $card.fadeOut(300, function () {
                $(this).remove();
                if ($('#recipes').children().length === 0) {
                    showEmptyState($('#recipes'), "You haven't added any favorites yet!");
                }
            });
        }
    });

    $('#recipes').on('click', '.btn-details', function () {
        window.location.href = `recipe-details.html?id=${$(this).data('id')}`;
    });
});
