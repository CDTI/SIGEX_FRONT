import React from 'react'
import { Link } from 'react-router-guard'
import { Button, Divider } from 'antd'
import { ContainerHome, TitleHome, SubTitleHome } from './style'

const HomePage: React.FC = () => {
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
          <Button type="primary">
            <Link to="/login">Entrar</Link>
          </Button>
        </SubTitleHome>
      </div>
    </ContainerHome>
  )
}

export default HomePage