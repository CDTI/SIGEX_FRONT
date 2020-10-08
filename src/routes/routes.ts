import { lazy } from 'react-router-guard'
import { isLogged, isNotLogged } from '../guards'

export default [
    {
        path: '/',
        exact: true,
        component: lazy(() => import('../pages/home'))
    },
    {
        path: '/login',
        canActivate: [isLogged],
        component: lazy(() => import('../pages/login'))
    },
    {
        path: '/dashboard',
        canActivate: [isNotLogged],
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
                path: '/dashboard/project/create',
                component: lazy(() => import('../pages/dashboard/projects/create'))
            },
            {
                path: '/dashboard/projects',
                component: lazy(() => import('../pages/dashboard/projects'))
            },
            {
                path: '/dashboard/form/create',
                component: lazy(() => import('../pages/dashboard/forms/create'))
            }
        ]
    },
    {
        path: '*',
        component: lazy(() => import('../pages/404'))
    }
]