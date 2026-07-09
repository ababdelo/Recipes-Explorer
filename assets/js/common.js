
// ==========================================
// 1. LOCAL STORAGE (FAVORITES)
// ==========================================
function getFavorites() {
    const favs = localStorage.getItem('recipe_favorites');
    return favs ? JSON.parse(favs) : [];
}

function saveFavorites(favArray) {
    localStorage.setItem('recipe_favorites', JSON.stringify(favArray));
}

function toggleFavorite(recipeId, buttonElement) {
    let favorites = getFavorites();
    const icon = buttonElement.querySelector('i');

    if (favorites.includes(recipeId)) {
        favorites = favorites.filter(id => id !== recipeId);
        buttonElement.classList.remove('active');
        icon.classList.replace('fa-solid', 'fa-regular');
    } else {
        favorites.push(recipeId);
        buttonElement.classList.add('active');
        icon.classList.replace('fa-regular', 'fa-solid');
    }

    saveFavorites(favorites);
}

// ==========================================
// 2. SHARED UI HELPERS
// ==========================================
function setFooterYear() {
    const dateSpan = document.getElementById('date');
    if (dateSpan) {
        dateSpan.textContent = new Date().getFullYear();
    }
}

function generateRecipeCard(recipe, parentContainer) {
    const favorites = getFavorites();
    const isFavorited = favorites.includes(recipe.id);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
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
    `;
    parentContainer.appendChild(card);
}

// ==========================================
// 3. GLOBAL EVENT DELEGATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    setFooterYear();
    const recipesGrid = document.getElementById('recipes');
    if (recipesGrid) {
        recipesGrid.addEventListener('click', (event) => {
            const favButton = event.target.closest('.btn-favorite');
            if (favButton) {
                const recipeId = parseInt(favButton.dataset.id, 10);
                toggleFavorite(recipeId, favButton);
                if (window.location.pathname.includes('favorites.html')) {
                    favButton.closest('.card').remove();
                    if (recipesGrid.children.length === 0) {
                        recipesGrid.innerHTML = `<div class="status-msg">You haven't added any favorites yet!</div>`;
                    }
                }
            }
            const detailsButton = event.target.closest('.btn-details');
            if (detailsButton) {
                const recipeId = detailsButton.dataset.id;
                window.location.href = `recipe-details.html?id=${recipeId}`;
            }
        });
    }
});
