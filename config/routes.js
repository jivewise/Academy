exports.routes = function (map) {

    pageRoute(map);
    usersRoute(map);
    groupsRoute(map);
    productsRoute(map);

};

function usersRoute(map) {
    map.get('/students', 'users#index', {as: 'users_page'});
    map.get('/users', 'users#getUsers', {as: 'get_users'});
    map.post('/users/user/add', 'users#addUser', {as: 'add_user'});
    map.post('/users/user/edit', 'users#editUser', {as: 'edit_user'});
    map.post('/users/user/password/reset', 'users#resetUserPassword', {as: 'reset_user_password'});
    map.post('/users/user/del', 'users#delUser', {as: 'del_user'});

    map.post('/users/user/scores', 'users#getUserScores', {as: 'get_user_scores'});
    map.post('/users/histories', 'users#getHistories', {as: 'get_histories'});
    map.post('/users/user/section/edit', 'users#editUserSection', {as: 'edit_user_section'});
    map.post('/users/sections/section/scores', 'users#getUsersSectionScores', {as: 'get_users_section_scores'});
    map.post('/users/user/section', 'users#getUserSection', {as: 'get_user_section'});
    map.post('/users/user/achievements', 'users#getUserAchievements', {as: 'get_user_achievements'});
}

function groupsRoute(map) {
    map.get('/classes', 'groups#index', {as: 'groups_page'});
    map.get('/groups', 'groups#getGroups', {as: 'get_groups'});
    map.post('/groups/group', 'groups#getGroup', {as: 'get_group'});
    map.post('/groups/group/add', 'groups#addGroup', {as: 'add_group'});
    map.post('/groups/group/edit', 'groups#editGroup', {as: 'edit_group'});
    map.post('/groups/group/del', 'groups#delGroup', {as: 'del_group'});

    map.post('/groups/group/users', 'groups#getGroupUsers', {as: 'get_group_users'});
    map.post('/groups/group/users/add', 'groups#addUsersToGroup', {as: 'add_users_to_group'});
    map.post('/groups/group/users/del', 'groups#delUsersFromGroup', {as: 'del_users_from_group'});

}

function productsRoute(map) {
    map.get('/lessons', 'products#index', {as: 'products_page'});
    map.get('/products', 'products#getProducts', {as: 'get_products'});
    map.post('/products/product/chapters', 'products#getProductChapters', {as: 'get_product_chapters'});
    map.post('/products/product/chapters/chapter/sections', 'products#getProductChapterSections', {as: 'get_product_chapter_sections'});
    map.post('/products/product/chapters/chapter/sections/section', 'products#getProductChapterSection', {as: 'get_product_chapter_section'})
}

function pageRoute(map) {
    map.get('/validateToken', 'service#service');

    map.get('/login', 'login#index', {as: 'login_page'});
    map.post('/login/post', 'login#post');
    map.post('/login/ajax', 'login#ajax');

    map.get('/register', 'register#index', {as: 'register_page'});
    map.post('/register/post', 'register#post');

    map.get('/forgot', 'forgot#index', {as: 'forgot_page'});
    map.post('/forgot/post', 'forgot#post');

    map.get('/passports', 'passports#getPassports', {as: 'get_passports'});

    map.post('/download/section', 'download#section', {as: 'download_section'});

    map.post('/front_error', 'error#frontError', {as: 'front_error'});
}
