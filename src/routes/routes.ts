import { lazy } from 'react-router-guard'

export default [
    {
        path: '/',
        exact: true,
        component: lazy(() => import('../pages/home'))
    },
    {
        path: '/login',
        component: lazy(() => import('../pages/login'))
    },
    {
        path: '/dashboard',
        component: lazy(() => import('../pages/dashboard')),
        routes: [
            {
                path: '/dashboard',
                exact: true,
                component: lazy(() => import('../pages/dashboard/home'))
            },
            {
                path: '/dashboard/programs',
                component: lazy(() => import('../pages/dashboard/programs')),
            },
            {
                path: '/dashboard/program/create',
                component: lazy(() => import('../pages/dashboard/programs/create'))
            },
            {
                path: '/dashboard/evaluations',
                component: lazy(() => import('../pages/dashboard/projects'))
            }
        ]
    }
]