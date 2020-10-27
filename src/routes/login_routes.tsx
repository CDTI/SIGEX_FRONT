import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from '../pages/home'

import Login from '../pages/login'

const SignRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Route path='/' exact={true} component={Home} />
            <Route path='/login' component={Login} />
        </BrowserRouter>
    )
}

export default SignRoutes