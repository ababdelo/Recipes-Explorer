$(document).ready(() => {
    loadFavorites();
});

async function loadFavorites() {
    const $container = $('#recipes');
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
        $container.html(`<div class="status-msg">You haven't added any favorites yet!</div>`);
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        const favRecipes = data.recipes.filter(recipe => favoriteIds.includes(recipe.id));
        
        $container.empty();
        favRecipes.forEach(recipe => generateRecipeCard(recipe, '#recipes'));
    } catch (error) {
        $container.html(`<div class="status-msg" style="color: #DC2626;">Failed to load favorites.</div>`);
    }
}
