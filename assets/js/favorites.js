$(document).ready(() => {
    loadFavorites();
});

async function loadFavorites() {
    const $container = $('#recipes');
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
        showEmptyState($container, "You haven't added any favorites yet!");
        return;
    }

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        const favRecipes = data.recipes.filter(recipe => favoriteIds.includes(recipe.id));

        $container.empty();
        if (favRecipes.length === 0) {
            showEmptyState($container, "Your favorite recipes couldn't be found. They might have been removed.");
        } else {
            favRecipes.forEach(recipe => generateRecipeCard(recipe, '#recipes'));
        }
    } catch (error) {
        showErrorState($container, 'Failed to load favorites. Please try again later.');
    }
}
