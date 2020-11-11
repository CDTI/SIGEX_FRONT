import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Checkbox, Typography, InputNumber, Space } from 'antd'
import { ContainerFlex } from '../../../../../../global/styles';
import { IBasicInfo } from '..';
import { IProject } from '../../../../../../interfaces/project';
import { ICategory } from '../../../../../../interfaces/category';
import { listCategories } from '../../../../../../services/category_service';
import { calendar, ICalendar } from '../../../../../../mocks/mockCalendar'
import { ILocal } from '../../../../../../mocks/mockCalendar'
import { IPrograms } from '../../../../../../interfaces/programs';
import { listPrograms } from '../../../../../../services/program_service';

const { Option } = Select
const { TextArea } = Input

export interface Props {
   changeBasicInfo(values: IBasicInfo, firstSemester: ILocal[], secondSemester: ILocal[]): void;
   project: IProject
}

const BasicInfo: React.FC<Props> = ({ changeBasicInfo, project }) => {
   const [categories, setCategories] = useState<ICategory[]>([])
   const [selectedCalendar, setCalendar] = useState<ICalendar | null>(null)
   const [programs, setPrograms] = useState<IPrograms[] | null>(null)
   const firstSemester: ILocal[] = []
   const secondSemester: ILocal[] = []

   useEffect(() => {
      listCategories().then(dataCategories => {
         setCategories(dataCategories)
         listPrograms().then(data => {
            setPrograms(data.programs)
            changeCalendar(project.categoryId)
         })
      })
   }, [project.categoryId])

   const changeCalendar = (id: string) => {
      const filterCalendar = calendar.find(e => e.categoryId === id)
      if (filterCalendar !== undefined)
         setCalendar(filterCalendar)
   }

   const changeDaysFirst = (e: any) => {
      firstSemester.push(e.target.value)
   }

   const changeDaysSecond = (e: any) => {
      secondSemester.push(e.target.value)
   }

   const submit = (value: IBasicInfo) => {
      changeBasicInfo(value, firstSemester, secondSemester)
   }

   const compareChecked = (local: ILocal) => {

      const filterLocal = project.firstSemester.find(e => e.day === local.day && e.name === local.name)
      if (filterLocal !== undefined) {
         delete filterLocal._id
         const compareA = Object.keys(local)
         const compareB = Object.keys(filterLocal)

         if (compareA.length !== compareB.length) {
            return false
         } else {

            const diff = compareA.some((key, index) => compareA[index] === compareB[index])
            console.log(diff)
            return diff
         }

      } else {
         return false
      }
   }

   return (
      <ContainerFlex>
         <Form
            onFinish={submit}
            layout="vertical"
            style={{ width: '100%', maxWidth: '700px' }}
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
               label="Programa"
               name="programId"
               rules={[{ required: true, message: 'Campo Obrigatório' }]}
            >
               <Select
                  placeholder='Selecione um programa'
               >
                  {programs?.map(e => {
                     if (e._id !== undefined) {
                        return (
                           <Option key={e._id} value={e._id}>
                              {e.name}
                           </Option>
                        )
                     }
                  })}
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
            <Space>
               <Form.Item
                  label="Horários disponíveis 1° Semestre"
                  name="firstSemester"
               >
                  <Checkbox.Group>
                     {selectedCalendar?.local.map((local, index) => {
                        return (
                           <Checkbox key={index} value={local} onChange={changeDaysFirst} defaultChecked={true}>{local.name} - {local.turn} - {local.day}</Checkbox>
                        )
                     })}
                  </Checkbox.Group>
                  {selectedCalendar === null && (
                     <Typography>Selecione uma categoria</Typography>
                  )}
               </Form.Item>
               <Form.Item
                  label="Horários disponíveis 2° Semestre"
                  name="secondSemester"
               >
                  <Checkbox.Group>
                     {selectedCalendar?.local.map((local, index) => {
                        return (
                           <Checkbox key={index} value={local} onChange={changeDaysSecond} defaultChecked={true}>{local.name} - {local.turn} - {local.day}</Checkbox>
                        )
                     })}
                  </Checkbox.Group>
                  {selectedCalendar === null && (
                     <Typography>Selecione uma categoria</Typography>
                  )}
               </Form.Item>
            </Space>
            <Form.Item
               label='Carga horária disponível para a extensão institucional'
               name='totalCH'
               rules={[
                  { required: true, message: 'Campo Obrigatório' }
               ]}
            >
               <InputNumber />
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
            {/* <Form.Item
               label="Resultado"
               name="results"
               rules={[
                  { required: true, message: 'Campo Obrigatório' }
               ]}
            >
               <TextArea placeholder="Digite aqui qual será a entrega final para a comunidade?" />
            </Form.Item> */}
            <Form.Item>
               <Button htmlType='submit' type="primary">Próximo</Button>
            </Form.Item>
         </Form>
      </ContainerFlex>
   )
}

export default BasicInfo