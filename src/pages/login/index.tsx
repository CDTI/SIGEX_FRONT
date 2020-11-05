import React, { useState } from 'react'
import { Form, Button, Input, Spin } from 'antd'
import InputMask from 'antd-mask-input'
import { FormDiv, Container, LabelInput, ContainerImage, ImageLogo } from './style'
import { useAuth } from '../../context/auth'
import logo from '../../sigex.png'
import { checkUser, createUser } from '../../services/user_service'
import { UserInterface } from '../../interfaces/user'

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
  const [cpf, setCpf] = useState('')
  const [newUser, setNewUser] = useState(false)
  const [loginUser, setLoginUser] = useState(false)
  const [password, setPassword] = useState('')
  const [ form ] = Form.useForm()

  const onFinish = (values: ValueLogin) => {
    setLoading(false)
    context.login(values)
  }

  const handleCreateUser = async (userNew: any) => {
    const cUser = {
      cpf: userNew.cpf,
      email: userNew.email,
      lattes: userNew.lattes,
      name: userNew.name,
      password: userNew.password,
      role: 'teacher',
      isActive: false
    }

    setPassword(userNew.password)
    const newUser = await createUser(cUser)
    const login = { cpf: cpf, password: password}
    console.log(newUser)
    setCpf(userNew.cpf)
    setNewUser(false)
    setLoginUser(true)
    context.login(login)
  }

  const handleCheckUser = async (value: any) => {
    const check = await checkUser(value)
    setCpf(value.cpf)
    const cpf = { cpf: value.cpf}
    form.setFieldsValue(cpf)
    if (check) {
      setLoginUser(true)
    } else {
      setNewUser(true)
    }
  }

  return (
    <Container>
      {!loading && (
        <FormDiv>
          <>
            <ContainerImage>
              <ImageLogo src={logo} />
            </ContainerImage>
            {(!newUser && !loginUser) && (
              <Form
                form={form}
                onFinish={handleCheckUser}
                style={{ maxWidth: '520px', width: '100%', color: '#fff !important' }}
                layout='vertical'
              >
                <LabelInput>CPF</LabelInput>
                <Form.Item
                  name='cpf'
                  rules={[{ required: true, message: 'Campo Obrigatório ' }]}
                >
                  <InputMask mask='111.111.111-11' />
                </Form.Item>
                <Form.Item>
                  <Button htmlType='submit' type='primary'>Avançar</Button>
                </Form.Item>
              </Form>
            )}
            {loginUser && (
              <Form
                onFinish={onFinish}
                name="basic"
                form={form}
              >
                <LabelInput>CPF</LabelInput>
                <Form.Item name="cpf"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Input placeholder='Digite seu CPF' disabled/>
                </Form.Item>
                <LabelInput>Senha</LabelInput>
                <Form.Item name="password"
                  rules={[{ required: true, message: 'Campo obrigatório' }]}
                >
                  <Input.Password draggable type='password' placeholder='Digite sua senha' />
                </Form.Item>
                <Form.Item>
                  <p style={{ textAlign: 'center' }}>
                    <Button type="primary" htmlType="submit">Login</Button>
                  </p>
                </Form.Item>
              </Form>
            )}
            {newUser && (
              <Form
                form={form}
                layout='vertical'
                onFinish={handleCreateUser}
                style={{ maxWidth: '520px', width: '100%' }}
              >
                <LabelInput>CPF</LabelInput>
                <Form.Item
                  name='cpf'
                  rules={[
                    { required: true, message: 'Campo Obrigatório' }
                  ]}
                >
                  <InputMask mask='111.111.111-11' disabled/>
                </Form.Item>
                <LabelInput>Name</LabelInput>
                <Form.Item
                  name='name'
                  rules={[
                    { required: true, message: 'Campo Obrigatório' }
                  ]}
                >
                  <Input placeholder='Digite o Nome' />
                </Form.Item>
                <LabelInput>E-Mail</LabelInput>
                <Form.Item
                  name='email'
                  rules={[
                    { required: true, message: 'Campo Obrigatório' }
                  ]}
                >
                  <Input placeholder='Digite o E-Mail' />
                </Form.Item>
                <LabelInput>Cod. Lattes</LabelInput>
                <Form.Item
                  name='lattes'
                  rules={[
                    { required: true, message: 'Campo Obrigatório' }
                  ]}
                >
                  <Input addonBefore='https://cnpq.lattes/' placeholder='Digite o código lattes' />
                </Form.Item>
                <LabelInput>Senha</LabelInput>
                <Form.Item
                  name='password'
                  rules={[
                    { required: true, message: 'Campo Obrigatório' }
                  ]}
                >
                  <Input.Password draggable type='password' placeholder='Digite a Senha' />
                </Form.Item>
                <Form.Item>
                  <Button type='primary' htmlType='submit'>Cadastrar</Button>
                </Form.Item>
              </Form>
            )}
          </>
        </FormDiv>
      )
      }
      {
        loading && (
          <Spin size="large" />
        )
      }
    </Container >
  )
}

export default LoginPage