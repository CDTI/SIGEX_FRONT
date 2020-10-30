import React, { useState } from 'react'
import { Form, Button, Input, Spin } from 'antd'
import InputMask from 'antd-mask-input'
import { FormDiv, Container, LabelInput, ContainerImage, ImageLogo } from './style'
import { useAuth } from '../../context/auth'
import logo from '../../sigex.png'

interface ValueLogin {
  cpf: string,
  password: string
}

interface Props {
  user: any
}

const LoginPage: React.FC<Props> = () => {
  const context = useAuth()
  const [loading, setLoading] = useState(false)

  const onFinish = (values: ValueLogin) => {
    setLoading(false)
    context.login(values)
  }

  return (
    <Container>
      {!loading && (
        <FormDiv>
          <>
            <ContainerImage>
              <ImageLogo src={logo} />
            </ContainerImage>
            <Form
              onFinish={onFinish}
              name="basic"
            >
              <LabelInput>CPF</LabelInput>
              <Form.Item name="cpf"
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <InputMask mask='111.111.111-11' placeholder='Digite seu CPF' />
              </Form.Item>
              <LabelInput>Senha</LabelInput>
              <Form.Item name="password"
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input.Password draggable type='password' placeholder='Digite sua senha'/>
              </Form.Item>
              <Form.Item>
                <p style={{ textAlign: 'center' }}>
                  <Button type="primary" htmlType="submit">Login</Button>
                </p>
              </Form.Item>
            </Form>
          </>
        </FormDiv>
      )}
      {loading && (
        <Spin size="large" />
      )}
    </Container>
  )
}

export default LoginPage