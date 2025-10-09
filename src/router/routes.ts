import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/guest',
    component: () => import('layouts/GuestLayout.vue'),
    children: [{ path: '', name: 'guest', component: () => import('pages/GuestPage.vue') }],
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name: 'references', component: () => import('pages/IndexPage.vue') },
      {
        path: 'bibliography',
        name: 'bibliography',
        component: () => import('pages/BibliographyPage.vue'),
      },
      {
        path: '/:type',
        name: 'references-type',
        component: () => import('pages/ReferencePage.vue'),
        props: (route) => ({ type: route.params.type as string }),
      },
      {
        path: ':type/:id',
        name: 'quotes-id',
        component: () => import('pages/quotes/IdPage.vue'),
        props: (route) => ({ type: route.params.type, id: route.params.id }),
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
