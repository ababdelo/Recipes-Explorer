
document.addEventListener('DOMContentLoaded', () => {
    loadFavorites();
});

async function loadFavorites() {
    const container = document.getElementById('recipes');
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
        container.innerHTML = `<div class="status-msg">You haven't added any favorites yet! Go explore some recipes.</div>`;
        return;
    }

    container.innerHTML = '<div class="status-msg">Loading your favorites...</div>';

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error(`HTTP error!`);

        const data = await response.json();
        const favRecipes = data.recipes.filter(recipe => favoriteIds.includes(recipe.id));
        
        renderFavorites(favRecipes);

    } catch (error) {
        container.innerHTML = `<div class="status-msg" style="color: #DC2626;">Failed to load favorites.</div>`;
    }
}

function renderFavorites(recipesArray) {
    const container = document.getElementById('recipes');
    container.innerHTML = '';

    recipesArray.forEach(recipe => {
        generateRecipeCard(recipe, container);
    });
}
