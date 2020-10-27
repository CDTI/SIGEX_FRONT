import React, { useState } from 'react'
import { Form, Button, Input, Spin } from 'antd'
import { FormDiv, Container, LabelInput, ContainerImage, ImageLogo } from './style'
import { useAuth } from '../../context/auth'
import logo from '../../sigex.png'

interface ValueLogin {
  email: string,
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
              <LabelInput>Email</LabelInput>
              <Form.Item name="email"
                rules={[{ required: true, message: 'Campo obrigatório' }]}
              >
                <Input type='email' placeholder='Digite seu e-mail' />
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