import React, { useState, useEffect, useMemo } from 'react'
import { Form, Input, Button, Select, Checkbox } from 'antd'
import { extensionPrograms } from '../../../../../../mocks/mockPrograms'
import { ContainerFlex } from '../../../../../../global/styles';
import { IBasicInfo } from '..';
import { IProject } from '../../../../../../interfaces/project';
import { ICategory } from '../../../../../../interfaces/category';
import { listCategories } from '../../../../../../services/category_service';
import { calendar, ICalendar } from '../../../../../../mocks/mockCalendar'

const { Option } = Select
const { TextArea } = Input

export interface Props {
   changeBasicInfo(values: IBasicInfo): void;
   project: IProject
}

const BasicInfo: React.FC<Props> = ({ changeBasicInfo, project }) => {
   const [categories, setCategories] = useState<ICategory[]>([])
   const [selectedCalendar, setCalendar] = useState<ICalendar | null>(null)

   useEffect(() => {
      listCategories().then(dataCategories => setCategories(dataCategories))
   }, [])

   const changeCalendar = (id: string) => {
      const filterCalendar = calendar.find(e => e.categoryId === id)
      if (filterCalendar !== undefined)
         setCalendar(filterCalendar)
   }

   const changeDays = (e: any) => {
      console.log(e)
   }

   const memoCalendar = useMemo(() => {
      return (
         <>
            <Checkbox.Group>
               {selectedCalendar?.local.map((local, index) => {
                  return (
                     <Checkbox key={index} value={local} onChange={changeDays}>{local.name} - {local.turn} - {local.day}</Checkbox>
                  )
               })}
            </Checkbox.Group>
         </>
      )
   }, [selectedCalendar])

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
               name="programId"
               rules={[{ required: true, message: 'Campo Obrigatório' }]}
            >
               <Select
                  placeholder='Selecione um programa'
               >
                  {extensionPrograms.map(e => (
                     <Option key={e._id} value={e.name}>
                        {e.name}
                     </Option>
                  ))}
               </Select>
            </Form.Item>
            <Form.Item
               label='Categoria'
               name='categoryId'
               rules={[
                  { required: true, message: 'Campo Obrigatório' }
               ]}
            >
               <Select
                  placeholder='Selecione uma categoria'
                  onChange={changeCalendar}
               >
                  {categories.map(e => (
                     <Option key={e._id} value={e._id}>
                        {e.name}
                     </Option>
                  ))}
               </Select>
            </Form.Item>
            <Form.Item
               label="Unidade"
               name="unity"
            >
               <Checkbox.Group>
                  {selectedCalendar?.local.map((local, index) => {
                     return (
                        <Checkbox key={index} value={local} onChange={changeDays}>{local.name} - {local.turn} - {local.day}</Checkbox>
                     )
                  })}
               </Checkbox.Group>
               {/* <Select
                  placeholder='Escolha 1 ou + unidades'
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
               </Select> */}
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