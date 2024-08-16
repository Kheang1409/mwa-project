export const environment = {

    application: {
        name: 'Restos',
        description: 'Savor the flavors and indulge in the culinary delights. Experience unmatched taste and pure bliss.',
        developer: 'Kheang',

    },
    params: {
        restaurantId: 'id',
        dishId: 'dishId',
    },
    urlShared: {
        login: '/login',
    },
    urlFrontend: {
        home: 'home',
        restaurants: 'restaurants',
        restaurant: 'restaurant',
        restaurant_id: 'restaurant/:id',
        createRestaurant: 'create-restaurant',
        editRestaurant: 'edit-restaurant',
        editRestaurant_id: 'edit-restaurant/:id',
        createDish: 'restaurant/:id/add-dish',
        editDish: 'restaurant/:id/edit-dish/:dishId',
        signIn: 'sign-in',
        signUp: 'sign-up',
        error: '**',
    },
    urlApi: {
        baseUserUrl: 'http://localhost:3000/api/users',
        baseRestaurantUrl: 'http://localhost:3000/api/restaurants',
        total: 'totals',
        dishes: 'dishes',
        query: {
            pageNumber: 'pageNumber',
            name: 'name'
        },
    },
    message: {
        updateFailMessage: 'Update unsuccessfully!',
        createFailMessage: 'Create unsuccessfully!',
        unauthorizedMessage: 'Unauthorized!',
        missingUsernamePassword: 'Missing Username or Password!',
        passwordMissedMatch: 'Password missed match!',
        filledInTheBlank: 'Filled in the Blank!'
    },
    numbers: {
        page: 1,
        limit: 4,
    },
    keys: {
        tokenKey: 'authToken',
        pageNumberKey: 'pageNumber',
    },
    forms: {

        dishForm: 'dishForm',
        restaurantForm: 'restaurantForm',
    }
};
