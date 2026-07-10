let allRecipes = [];

$(document).ready(() => {
    setupEventListeners();
    getRecipes();
});

/* === HIDE THE LOADING SPLASH SCREEN === */
function hideLoader() {
    const $loader = $('#app-loader');
    if ($loader.length) {
        $loader.addClass('hidden');
        setTimeout(() => $loader.remove(), 700);
    }
}

function setupEventListeners() {
    $('#search-bar').on('input', applyFilters);
    $('#cuisine, #difficulty, #mealType').on('change', applyFilters);
}

async function getRecipes() {
    const $container = $('#recipes');
    const startTime = Date.now();

    try {
        const response = await fetch('https://dummyjson.com/recipes');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        allRecipes = data.recipes;

        setFilters(allRecipes);
        renderRecipes(allRecipes);

        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 2000 - elapsed);

        setTimeout(() => {
            hideLoader();
        }, remainingTime);

    } catch (error) {
        const elapsed = Date.now() - startTime;
        const remainingTime = Math.max(0, 500 - elapsed);

        setTimeout(() => {
            hideLoader();
            showErrorState($container, 'Failed to load recipes. Please try again later.');
        }, remainingTime);
    }
}


function setFilters(recipes) {
    const $cuisineSel = $('#cuisine');
    const $difficultySel = $('#difficulty');
    const $mealTypeSel = $('#mealType');

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
        showEmptyState($container, 'No recipes found. Try adjusting your filters.');
        return;
    }

    recipesArray.forEach(recipe => generateRecipeCard(recipe, '#recipes'));
}
