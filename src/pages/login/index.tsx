import React from 'react'
import { Row, Col, Form, Button, Input } from 'antd'
import { Users } from '../../mocks/mockLogin'
import { FormDiv, Container } from './style'
import { history } from 'react-router-guard'

interface ValueLogin {
  cpf: string,
  password: string
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const LoginPage: React.FC = () => {

  const onFinish = (values: ValueLogin) => {
    console.log(values.cpf)
    const user = Users.find(e => e.cpf === values.cpf && e.password === values.password)

    if (user != undefined) {
      history.push('/dashboard')
    } else {
      alert('Login ou senha incorreto')
    }
  }

  return (
    <Container>
      {/* <FormDiv> */}
      <Form
        onFinish={onFinish}
        {...layout}
        name="basic"
      >
        <Form.Item name="cpf"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          label="CPF"
        >
          <Input />
        </Form.Item>
        <Form.Item name="password"
          rules={[{ required: true, message: 'Campo obrigatório' }]}
          label="Senha"
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">Login</Button>
        </Form.Item>
      </Form>
      {/* </FormDiv> */}
    </Container>
  )
}

export default LoginPage