import React, { useEffect, useState, useMemo } from 'react'
import { Divider, Steps, Button, Space, Collapse, Typography, Result, Modal, Form, Input, Timeline } from 'antd'
import Structure from '../../../../../components/layout/structure'
import { ContainerFlex } from '../../../../../global/styles'
import { IMaterials, IProject } from '../../../../../interfaces/project'
import { compareDate, currentProject } from '../../../../../util'
import MyTable from '../../../../../components/layout/table'
import { listCategories } from '../../../../../services/category_service'
import { ICategory } from '../../../../../interfaces/category'
import { listPrograms } from '../../../../../services/program_service'
import { IPrograms } from '../../../../../interfaces/programs'
import { ReturnResponse, updateProject } from '../../../../../services/project_service'
import { Link } from 'react-router-dom'
import { IFeedback } from '../../../../../interfaces/feedback'
import { createFeedbackProject, listFeedbackProject } from '../../../../../services/feedback_service'
const { Step } = Steps;
const { Panel } = Collapse
const { TextArea } = Input

interface Props {
    location: {
        state: IProject
    }
}

const columnsMaterials = [
    {
        title: 'Nome',
        dataIndex: 'item',
        key: 'item'
    },
    {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: 'Quantidade',
        dataIndex: 'quantity',
        key: 'quantity'
    },
    {
        title: 'Valor Unitário',
        dataIndex: 'unitaryValue',
        key: 'unitaryValue'
    },
    {
        title: 'Total',
        key: 'total',
        render: (text: string, material: IMaterials) => (
            <Typography>{material.quantity * material.unitaryValue}</Typography>
        )
    }
]

const columnsTransport = [
    {
        title: 'Tipo',
        dataIndex: 'typeTransport',
        key: 'typeTransport'
    },
    {
        title: 'Descrição',
        dataIndex: 'description',
        key: 'description'
    },
    {
        title: 'Quantidade',
        dataIndex: 'quantity',
        key: 'quantity'
    },
    {
        title: 'Valor Unitário',
        dataIndex: 'unitaryValue',
        key: 'unitaryValue'
    },
    {
        title: 'Total',
        key: 'total',
        render: (text: string, material: IMaterials) => (
            <Typography>{material.quantity * material.unitaryValue}</Typography>
        )
    }
]

const AdminViewProject: React.FC<Props> = ({ location }) => {
    const [edited, setEdited] = useState<ReturnResponse | null>(null)
    const [feedback, setFeedback] = useState<IFeedback | null>(null)
    const [category, setCategory] = useState<ICategory | null>(null)
    const [program, setProgram] = useState<IPrograms | null>(null)
    const [status, setStatus] = useState(false)
    const [visible, setVisible] = useState(false)
    const [form] = Form.useForm()

    useEffect(() => {
        listCategories().then(data => {
            const categorySelected = data.find(cat => cat._id === location.state.categoryId)
            if (categorySelected !== undefined)
                setCategory(categorySelected)
            listPrograms().then(programsData => {
                const programSelected = programsData.programs.find(e => e._id === location.state.programId)
                if (programSelected !== undefined)
                    setProgram(programSelected)
                listFeedbackProject(location.state._id).then(data => {
                    console.log(data)
                    setFeedback(data.feedback)
                })
            })
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const totalSpending = (): number => {
        const resource = location.state.resources
        let value = 0;

        value += resource.transport.quantity * resource.transport.unitaryValue

        resource.materials.map(e => value += e.quantity * e.unitaryValue)
        return value
    }

    const totalproject = totalSpending()

    const changeStatus = async (status: 'approved' | 'reproved' | 'adjust') => {
        location.state.status = status

        const update = await updateProject(location.state)
        console.log(update)
        setStatus(true)
        setEdited({ message: update.message, result: update.result, project: update.project })
    }

    const openModal = () => {
        setVisible(true)
    }

    const modalFeedback = useMemo(() => {
        const submitFeedback = async (values: { text: string }) => {
            console.log(values)
            setVisible(false)
            const registerFeed = await createFeedbackProject(location.state._id, values)
            console.log(registerFeed)
        }

        const closeModal = () => {
            setVisible(false)
        }

        return (
            <Modal
                title="Enviar feedback"
                visible={visible}
                onCancel={closeModal}
                footer={[]}
            >
                <Form
                    form={form}
                    style={{ maxWidth: '500px', width: '100%' }}
                    layout='vertical'
                    onFinish={submitFeedback}
                >
                    <Form.Item
                        label='Feedback'
                        name='text'
                        rules={[
                            { required: true, message: 'Campo Obrigatório ' }
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Space>
                            <Button onClick={closeModal} type='primary' style={{ backgroundColor: '#a31621', color: '#fff' }}>Cancelar</Button>
                            <Button htmlType='submit' type='primary' style={{ backgroundColor: '#439A86', color: '#fff' }}>Enviar</Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        )
    }, [form, location.state._id, visible])


    return (
        <>
            {!status && (
                <Structure title={location.state.name}>
                    <ContainerFlex>
                        <div>
                            <Steps direction="horizontal" current={currentProject(location.state)}>
                                {location.state.status === 'reproved' && (
                                    <Step title="Reprovado" description="Projeto foi reprovado" />
                                )}
                                {location.state.status === 'pending' && (
                                    <Step title="Em análise" description="Projeto aguardando aprovação." />
                                )}
                                {location.state.status === 'adjust' && (
                                    <Step title="Correção" description="Projeto aguardando correção" />
                                )}
                                {location.state.status !== 'reproved' && (
                                    <>
                                        <Step title="Aprovado" description="Projeto aprovado." />
                                        <Step title="Em andamento" description="Projeto em andamento." />
                                        <Step title="Finalizado" description="Projeto finalizado." />
                                    </>
                                )}
                            </Steps>
                            <Collapse accordion style={{ marginTop: '30px' }}>
                                <Panel header='Informações básicas' key='1'>
                                    <Typography>Nome: {location.state.name}</Typography>
                                    <Typography>Descrição: {location.state.description}</Typography>
                                    <Typography>Categoria: {category?.name}</Typography>
                                    <Typography>Programa: {program?.name}</Typography>
                                    <Typography style={{ fontWeight: 'bold', marginTop: '9px' }}>Disponibilidades de horários primeiro semestre:</Typography>
                                    <ul style={{ marginLeft: '18px' }}>
                                        {location.state.firstSemester.map(e => (
                                            <li>{e.name} - {e.day} - {e.turn}</li>
                                        ))}
                                    </ul>
                                    <Typography style={{ fontWeight: 'bold', marginTop: '9px' }}>Disponibilidades de horários segundo semestre:</Typography>
                                    <ul style={{ marginLeft: '18px' }}>
                                        {location.state.secondSemester.map(e => (
                                            <li>{e.name} - {e.day} - {e.turn}</li>
                                        ))}
                                    </ul>
                                    <Typography>CH disponível: {location.state.totalCH}</Typography>
                                </Panel>
                                <Panel header='Parcerias' key='2'>
                                    <Collapse accordion>
                                        {location.state.partnership.map((partner, index) => (
                                            <Panel header={'Parceria ' + (index + 1)} key={index}>
                                                <Typography>Sobre: {partner.text}</Typography>
                                                {partner.contacts.map((contact, contactInd) => (
                                                    <div key={contactInd}>
                                                        <Typography>{contact.name}</Typography>
                                                        <Typography>{contact.phone}</Typography>
                                                    </div>
                                                ))}
                                            </Panel>
                                        ))}
                                    </Collapse>
                                    <Typography></Typography>
                                </Panel>
                                <Panel header='Comunidade' key='3'>
                                    <Typography>Sobre: {location.state.specificCommunity.text}</Typography>
                                    <Typography>Localização: {location.state.specificCommunity.location}</Typography>
                                    <Typography>Pessoas envolvidas: {location.state.specificCommunity.peopleInvolved}</Typography>
                                </Panel>
                                <Panel header='Planejamento' key='4'>
                                    <Collapse>
                                        {location.state.planning.map((planning, planningIdx) => (
                                            <Panel header={'Etapas ' + (planningIdx + 1)} key={planningIdx}>
                                                <Typography>Sobre: {planning.text}</Typography>
                                                <Typography>Modo de desenvolvimento: {planning.developmentMode}</Typography>
                                                <Typography>Lugar de desenvolvimento: {planning.developmentSite}</Typography>
                                                <Typography>Inicio: {planning.startDate}</Typography>
                                                <Typography>Final: {planning.finalDate}</Typography>
                                            </Panel>
                                        ))}
                                    </Collapse>
                                </Panel>
                                <Panel header='Recursos' key='5'>
                                    <h2>Materiais</h2>
                                    <MyTable columns={columnsMaterials} pagination={false} data={location.state.resources.materials} />
                                    <Divider />
                                    <h2>Transportes</h2>
                                    <MyTable columns={columnsTransport} pagination={false} data={[location.state.resources.transport]}></MyTable>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '16pt', color: '#b80c09' }}>Valor total do projeto</Typography>
                                        <Typography style={{ marginRight: '50px', fontWeight: 'bold', fontSize: '16pt', color: '#b80c09' }}>{totalproject}</Typography>
                                    </div>
                                </Panel>
                            </Collapse>
                            <Space style={{ marginTop: '25px' }}>
                                {(location.state.status === 'pending') && (
                                    <>
                                        <Button style={{ backgroundColor: '#a31621', color: '#fff' }} onClick={() => changeStatus('reproved')}>Reprovar</Button>
                                        <Button style={{ backgroundColor: '#dbbb04', color: '#fff' }} onClick={openModal}>Solicitar ajuste</Button>
                                        <Button style={{ backgroundColor: '#439A86', color: '#fff' }} onClick={() => changeStatus('approved')}>Aprovar</Button>
                                    </>
                                )}
                            </Space>
                            <Timeline style={{ marginTop: '25px' }}>
                                {feedback?.registers.sort(compareDate).map(e => {
                                    return (
                                        <Timeline.Item>
                                            {e.text} - {e.date} - {e.typeFeedback}
                                        </Timeline.Item>
                                    )
                                })}
                            </Timeline>
                        </div>
                    </ContainerFlex>
                </Structure>
            )
            }
            {status && (
                <ContainerFlex>
                    <Result
                        status={edited?.result}
                        title={edited?.message}
                        subTitle={'Projeto editado: ' + edited?.project.name}
                        extra={[
                            <Button type="primary" key="/dashboard/projects">
                                <Link to='/dashboard/projects'>
                                    Voltar
                                </Link>
                            </Button>
                        ]}
                    />
                </ContainerFlex>
            )}
            {modalFeedback}
        </>
    )
}

export default AdminViewProject