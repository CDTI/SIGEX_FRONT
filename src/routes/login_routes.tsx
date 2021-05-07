import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from '../pages/home'
import ChangePassword from '../pages/change-password'

import Login from '../pages/login'

const SignRoutes: React.FC = () => {
    return (
        <BrowserRouter>
            <Route path='/' exact={true} component={Home} />
            <Route path='/login' component={Login} />
            <Route path='/changePassword' component={ChangePassword} />
        </BrowserRouter>
    )
}

export default SignRoutes