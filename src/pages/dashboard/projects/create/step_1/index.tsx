import React from 'react'
import { Form, Input, Button, Select } from 'antd'
import { extensionPrograms } from '../../../../../mocks/mockPrograms'
import { ContainerFlex } from '../../../../../global/styles';
import { IBasicInfo } from '..';
import { IProject } from '../../../../../interfaces/project';

const { Option } = Select
const { TextArea } = Input

export interface Props {
   changeBasicInfo(values: IBasicInfo): void;
   project: IProject
}

const BasicInfo: React.FC<Props> = ({ changeBasicInfo, project }) => {
   return (
      <ContainerFlex>
         <Form
            onFinish={changeBasicInfo}
            layout="vertical"
            style={{ width: '100%', maxWidth: '500px' }}
            initialValues={project}
         >
            <Form.Item
               label='Nome'
               name='name'
               rules={[
                  { required: true, message: 'Campo Obrigatório' },
                  { max: 40, message: 'Número de caracteres excedido' }
               ]}
            >
               <Input placeholder="Nome do projeto" />
            </Form.Item>
            <Form.Item
               label='Descrição'
               name='description'
               rules={[
                  { required: true, message: 'Campo Obrigatório' },
                  { max: 300, message: 'Número de caracteres excedido' }
               ]}
            >
               <TextArea placeholder="Descrição do projeto" />
            </Form.Item>
            <Form.Item
               label="Programa"
               name="program_id"
               rules={[{ required: true, message: 'Campo Obrigatório' }]}
            >
               <Select>
                  {extensionPrograms.map(e => (
                     <Option key={e.id} value={e.id}>
                        {e.name}
                     </Option>
                  ))}
               </Select>
            </Form.Item>
            <Form.Item
               label="Unidade"
               name="unity"
               rules={[{ required: true, message: 'Campo Obrigatório' }]}
            >
               <Select
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}>
                  <Option value={1}>
                     UP - Curitiba
                  </Option>
                  <Option value={2}>
                     UP - Santos Andrade
                  </Option>
                  <Option value={3}>
                     UP - Praça Osório
                  </Option>
                  <Option value={4}>
                     UP - Londrina
                  </Option>
               </Select>
            </Form.Item>
            <Form.Item
               label="Resultado"
               name="results"
               rules={[
                  { required: true, message: 'Campo Obrigatório' }
               ]}
            >
               <TextArea placeholder="Digite aqui qual será a entrega final para a comunidade?" />
            </Form.Item>
            <Form.Item>
               <Button htmlType='submit' type="primary">Próximo</Button>
            </Form.Item>
         </Form>
      </ContainerFlex>
   )
}

export default BasicInfo