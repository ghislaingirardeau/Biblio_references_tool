import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'references', component: () => import('pages/IndexPage.vue') },
      { path: '/books', name: 'books', component: () => import('pages/BooksPage.vue') },
      {
        path: 'books/:id',
        name: 'books-id',
        component: () => import('pages/books/BookPage.vue'),
        props: (route) => ({ id: route.params.id }),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
