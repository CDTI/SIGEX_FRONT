import React from 'react'
import { useAuth } from '../context/auth'
import OtherRoutes from './other_routes'

import SignRoutes from './login_routes'

const Routes: React.FC = () => {
    const { signed } = useAuth()

    return signed ? <OtherRoutes /> : <SignRoutes />
}

export default Routes