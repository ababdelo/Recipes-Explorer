let allRecipes = [];

$(document).ready(() => {
    setupEventListeners();
    getRecipes();
});

function setupEventListeners() {
    $('#search-bar').on('input', applyFilters);
    $('#cuisine, #difficulty, #mealType').on('change', applyFilters);
}

async function getRecipes() {
    const $container = $('#recipes');
    $container.html('<div class="status-msg">Loading recipes...</div>');

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json();
        allRecipes = data.recipes;

        setFilters(allRecipes);
        renderRecipes(allRecipes);
    } catch (error) {
        $container.html(`<div class="status-msg" style="color: #DC2626;">Failed to load recipes.</div>`);
    }
}

function setFilters(recipes) {
    const $cuisineSel = $('#cuisine');
    const $difficultySel = $('#difficulty');
    const $mealTypeSel = $('#mealType');

    // Clear and reset using jQuery
    $cuisineSel.empty().append('<option value="all" selected>All Cuisines</option>');
    $difficultySel.empty().append('<option value="all" selected>All Difficulties</option>');
    $mealTypeSel.empty().append('<option value="all" selected>All Meal Types</option>');

    [...new Set(recipes.map(r => r.cuisine))].sort().forEach(c => $cuisineSel.append(new Option(c, c.toLowerCase())));
    [...new Set(recipes.map(r => r.difficulty))].sort().forEach(d => $difficultySel.append(new Option(d, d.toLowerCase())));
    [...new Set(recipes.flatMap(r => r.mealType))].sort().forEach(m => $mealTypeSel.append(new Option(m, m.toLowerCase())));
}

function applyFilters() {
    const search = $('#search-bar').val().trim().toLowerCase();
    const cuisine = $('#cuisine').val();
    const difficulty = $('#difficulty').val();
    const mealType = $('#mealType').val();

    const filteredRecipes = allRecipes.filter(recipe => {
        const matchSearch = !search || recipe.name.toLowerCase().includes(search) || recipe.ingredients.some(ing => ing.toLowerCase().includes(search));
        const matchCuisine = cuisine === 'all' || recipe.cuisine.toLowerCase() === cuisine;
        const matchDifficulty = difficulty === 'all' || recipe.difficulty.toLowerCase() === difficulty;
        const matchMealType = mealType === 'all' || recipe.mealType.some(m => m.toLowerCase() === mealType);
        return matchSearch && matchCuisine && matchDifficulty && matchMealType;
    });

    renderRecipes(filteredRecipes);
}

function renderRecipes(recipesArray) {
    const $container = $('#recipes');
    $container.empty();

    $('#found').text(recipesArray.length);
    $('#total').text(allRecipes.length);

    if (recipesArray.length === 0) {
        $container.html(`<div class="status-msg">No recipes found.</div>`).hide().fadeIn(300);
        return;
    }

    recipesArray.forEach(recipe => generateRecipeCard(recipe, '#recipes'));
}
