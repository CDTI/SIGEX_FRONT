import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Select, Checkbox, Typography, InputNumber, Space, Radio } from 'antd'
import { ContainerFlex } from '../../../../../../global/styles';
import { IBasicInfo } from '..';
import { IProject } from '../../../../../../interfaces/project';
import { ICategory } from '../../../../../../interfaces/category';
import { listCategories } from '../../../../../../services/category_service';
import { calendar } from '../../../../../../mocks/mockCalendar'
import { ILocal } from '../../../../../../mocks/mockCalendar'
import { IPrograms } from '../../../../../../interfaces/programs';
import { listPrograms } from '../../../../../../services/program_service';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useAuth } from '../../../../../../context/auth';

const { Option } = Select
const { TextArea } = Input

export interface Props {
   changeBasicInfo(values: IBasicInfo, firstSemester: ILocal[], secondSemester: ILocal[]): void;
   removeLocal(index: number, name: 'firstSemester' | 'secondSemester'): void
   specific: boolean,
   commom: boolean
   project: IProject
}

export interface ICal {
   _id?: string
   name: string,
   turn: string,
   day: string,
   checked?: boolean
}

const BasicInfo: React.FC<Props> = ({ changeBasicInfo, project, removeLocal, specific, commom }) => {
   const [categories, setCategories] = useState<ICategory[]>([])
   const [firstCalendar, setFirstCalendar] = useState<ICal[]>([])
   const [secondCalendar, setSecondCalendar] = useState<ICal[]>([])
   const [categoryId, setCategoryId] = useState('')
   const [category, setCategory] = useState<ICategory | null>(null)
   const [programs, setPrograms] = useState<IPrograms[] | null>(null)
   const [typeProject, setTypeProject] = useState<'extraCurricular' | 'curricularComponent' | 'common'>('common')
   let firstSemester: ICal[] = []
   const secondSemester: ICal[] = []
   const { user } = useAuth()

   useEffect(() => {
      listCategories().then(dataCategories => {
         setCategories(dataCategories)
         listPrograms().then(data => {
            setPrograms(data.programs)
            setCategoryId(project.categoryId)
            changeCalendar(project.categoryId)
         })
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

   const compareChecked = async (local: ILocal, nameArray: 'firstSemester' | 'secondSemester') => {
      const filterLocal = project[nameArray].find(e => e.day === local.day && e.name === local.name) as ICal | undefined
      if (filterLocal !== undefined) {
         delete filterLocal._id
         delete filterLocal.checked
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


   const changeCalendar = async (id: string) => {
      setCategoryId(id)
      const cat = categories.find(e => e._id === id)
      if (cat !== undefined)
         setCategory(cat)
      firstCalendar.splice(1, firstCalendar.length)
      secondCalendar.splice(1, secondCalendar.length)
      const filterCalendar = calendar.find(e => e.categoryId === id)
      if (filterCalendar !== undefined) {
         const first: ICal[] = []
         const second: ICal[] = []
         for await (let e of filterCalendar.local) {
            const cal = { day: e.day, turn: e.turn, name: e.name, checked: await compareChecked(e, 'firstSemester') }
            const cal2 = { day: e.day, turn: e.turn, name: e.name, checked: await compareChecked(e, 'secondSemester') }
            first.push(cal)
            second.push(cal2)
         }

         setFirstCalendar(first)
         setSecondCalendar(second)
      }
   }

   const submit = async (value: IBasicInfo) => {
      value.typeProject = typeProject
      const filterFirst = firstCalendar.filter(e => e.checked === true)
      console.log(firstCalendar)
      if (filterFirst !== undefined) {
         for await (let e of filterFirst) {
            const verify = await compareChecked(e, 'firstSemester')
            if (!verify)
               firstSemester.push(e)
         }
      }

      const filterSecond = secondCalendar.filter(e => e.checked === true)
      if (filterSecond !== undefined) {
         for await (let e of filterSecond) {
            const verify = await compareChecked(e, 'secondSemester')
            if (!verify)
               secondSemester.push(e)
         }
      }
      changeBasicInfo(value, firstSemester, secondSemester)
   }

   const changeDaysFirst = async (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
         const verify = await compareChecked(e.target.value, 'firstSemester')
         if (!verify)
            if (firstSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn) === -1)
               firstSemester.push(e.target.value)
      } else {
         const exist = firstSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
         if (exist !== -1) {
            firstSemester.splice(exist, 1)
         } else {
            const exist2 = project.firstSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
            if (exist2 !== -1) {
               removeLocal(exist2, 'firstSemester')
               const indexCalendar = firstCalendar.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
               if (indexCalendar !== -1) {
                  firstCalendar[indexCalendar].checked = false
                  setFirstCalendar(firstCalendar)
               }
            }
         }
      }
   }

   const changeDaysSecond = async (e: CheckboxChangeEvent) => {
      if (e.target.checked) {
         const verify = await compareChecked(e.target.value, 'secondSemester')
         if (!verify)
            if (secondSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn) === -1)
               secondSemester.push(e.target.value)
      } else {
         const exist = secondSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
         if (exist !== -1) {
            secondSemester.splice(exist, 1)
         } else {
            const exist2 = project.secondSemester.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
            if (exist2 !== -1) {
               removeLocal(exist2, 'secondSemester')
               const indexCalendar = secondCalendar.findIndex(local => local.day === e.target.value.day && local.name === e.target.value.name && local.turn === e.target.value.turn)
               if (indexCalendar !== -1) {
                  secondCalendar[indexCalendar].checked = false
                  setSecondCalendar(secondCalendar)
               }
            }
         }
      }
   }

   const changeTypeProject = (e: any) => {
      const value = e.target.value as 'extraCurricular' | 'curricularComponent'

      setTypeProject(value)
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
               label='Nome do projeto'
               name='name'
               rules={[
                  { required: true, message: 'Campo Obrigatório' },
                  { max: 200, message: 'Número de caracteres excedido' }
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
                  {categories.map(e => {
                     if (e.name !== 'Extensão específica do curso' && commom) {
                        return (
                           <Option key={e._id} value={e._id}>
                              {e.name}
                           </Option>
                        )
                     } else {
                        if (user?.role.includes('ndePresident') && specific) {
                           return (
                              <Option key={e._id} value={e._id}>
                                 {e.name}
                              </Option>
                           )
                        }
                     }
                  })}
               </Select>
            </Form.Item>
            {(category?.name !== 'Extensão específica do curso' && category !== null) && (
               <>
                  <Space style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                     <Form.Item
                        label="Horários disponíveis 1° Semestre"
                        name="firstSemester"
                     >
                        {firstCalendar.map((local, index) => (
                           <Checkbox key={index} value={local} onChange={changeDaysFirst} defaultChecked={local.checked}>{local.name} - {local.turn} - {local.day}</Checkbox>
                        )
                        )}
                        {firstCalendar === null && (
                           <Typography>Selecione uma categoria</Typography>
                        )}
                     </Form.Item>
                     <Form.Item
                        label="Horários disponíveis 2° Semestre"
                        name="secondSemester"
                     >
                        {secondCalendar.map((local, index) => (
                           <Checkbox key={index} value={local} onChange={changeDaysSecond} defaultChecked={local.checked}>{local.name} - {local.turn} - {local.day}</Checkbox>
                        )
                        )}
                        {secondCalendar === null && (
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
               </>
            )}
            {category?.name === 'Extensão específica do curso' && (
               <Radio.Group onChange={changeTypeProject}>
                  <Radio value='curricularComponent'>Componente Curricular</Radio>
                  <Radio value='extraCurricular'>Extra Curricular</Radio>
               </Radio.Group>
            )}
            <Form.Item
               label='Descrição'
               name='description'
               rules={[
                  { required: true, message: 'Campo Obrigatório' },
                  { max: 3000, message: 'Número de caracteres excedido' }
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