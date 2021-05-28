import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Divider } from 'antd'
import { ContainerHome, TitleHome, SubTitleHome } from './style'
import { useAuth } from '../../context/auth'

const HomePage: React.FC = () => {
  const { user } = useAuth()

  return (
    <ContainerHome>
      <div>
        <TitleHome>
          SISTEMA DE EXTENSÃO
       </TitleHome>
        <SubTitleHome>
          Universidade Positivo
       </SubTitleHome>
        <Divider />
        <SubTitleHome>
          {(user !== null && user?.roles.length) > 0 && (
            <Button type='primary'>
              <Link to='/dashboard'>Entrar</Link>
            </Button>
          )}
          {(user === null) && (
            <Button type="primary">
              <Link to="/login">Entrar</Link>
            </Button>
          )}
        </SubTitleHome>
      </div>
    </ContainerHome>
  )
}

export default HomePage