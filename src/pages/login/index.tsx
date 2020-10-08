import React from 'react'
import { Form, Button, Input } from 'antd'
import { Users } from '../../mocks/mockLogin'
import { FormDiv, Container, LabelInput, ContainerImage, ImageLogo } from './style'
import { history } from 'react-router-guard'
import { User } from '../../store/ducks/user/types';
import { ApplicationState } from '../../store';
import { Dispatch, bindActionCreators } from 'redux';
import * as UserActions from '../../store/ducks/user/actions'
import { connect } from 'react-redux';

interface ValueLogin {
  cpf: string,
  password: string
}

interface StateProps {
  user: User
}

interface DispatchProps {
  loadRequest(): void;
  addUser(data: User): void;
  requestUser(): void;
}

type Props = StateProps & DispatchProps

const LoginPage: React.FC<Props> = ({ addUser }) => {

  const onFinish = (values: ValueLogin) => {
    console.log(values.cpf)
    const user = Users.find(e => e.cpf === values.cpf && e.password === values.password)

    if (user !== undefined) {
        addUser(user)
        history.push('/dashboard')
    } else {
      alert('Login ou senha incorreto')
    }
  }

  return (
    <Container>
      <FormDiv>
        <>
          <ContainerImage>
            <ImageLogo src="https://www.up.edu.br/blogs/wp-content/uploads/2020/03/cropped-favicon.png" />
          </ContainerImage>
          <Form
            onFinish={onFinish}
            name="basic"
          >
            <LabelInput>CPF</LabelInput>
            <Form.Item name="cpf"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <LabelInput>Senha</LabelInput>
            <Form.Item name="password"
              rules={[{ required: true, message: 'Campo obrigatório' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <p style={{ textAlign: 'center' }}>
                <Button type="primary" htmlType="submit">Login</Button>
              </p>
            </Form.Item>
          </Form>
        </>
      </FormDiv>
    </Container>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  user: state.user.data
})

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(Object.assign({}, UserActions), dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)