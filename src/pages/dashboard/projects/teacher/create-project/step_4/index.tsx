import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space, Divider } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IPlanning, IProject } from '../../../../../../interfaces/project'
import { MaskedInput } from 'antd-mask-input'

interface Props {
    changePlanning(plannings: IPlanning[]): void
    removeStep(index: number): void
    next(): void
    previous(): void
    project: IProject
    changeStep(index: number, name: 'developmentSite' | 'developmentMode' | 'startDate' | 'finalDate' | 'text',
        value: string): void
}

const Planning: React.FC<Props> = ({ changePlanning, previous, project, removeStep, next, changeStep }) => {
    const totalSteps = project.planning.length

    const handlePlanning = async (event: any) => {
        if (event.planning !== undefined) {
            console.log(event.planning)
            changePlanning(event.planning)
        } else {
            changePlanning([])
        }
    }

    return (
        <ContainerFlex>
            <div
                style={{ maxWidth: '520px', width: '100%' }}
            >
                <div
                    style={{ width: '100%' }}
                >
                    <div style={{ maxWidth: '520px', width: '100%' }}>
                        {project.planning.map((p, index) => (
                            <div>
                                <h2>Etapa {index + 1}</h2>
                                {index !== 0 && (
                                    <Button
                                        type='link'
                                        style={{ margin: '8px 0', padding: '0' }}
                                        onClick={() => {
                                            removeStep(index);
                                        }}>
                                        <MinusCircleOutlined />
                                                        Excluir
                                    </Button>
                                )}
                                <Form layout='vertical'>
                                    <Form.Item
                                        label='Etapa'
                                        name={[index, 'text']}
                                        rules={[
                                            { required: true, message: 'Campo Obrigatório' }
                                        ]}
                                    >
                                        <Input defaultValue={p.text} onChange={event => changeStep(index, 'text', event.target.value)} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Onde será desenvolvida'
                                        rules={[
                                            { required: true, message: 'Campo Obrigatório' },
                                        ]}
                                        name={[index, 'developmentSite']}
                                    >
                                        <Input defaultValue={p.developmentSite} onChange={event => changeStep(index, 'developmentSite', event.target.value)} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Como será desenvolvida (indicar recursos de
                                        infraestrutura necessários, tais como laboratório de
                                        informática, laboratório específico, etc.)'
                                        rules={[
                                            { required: true, message: 'Campo Obrigatório' }
                                        ]}
                                        name={[index, 'developmentMode']}
                                    >
                                        <Input defaultValue={p.developmentMode} onChange={event => changeStep(index, 'developmentMode', event.target.value)} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Data de inicío'
                                        rules={[
                                            { required: true, message: 'Campo Obrigatório' }
                                        ]}
                                        name={[index, 'startDate']}
                                    >
                                        <MaskedInput mask='11/11/1111' defaultValue={p.startDate} onChange={event => changeStep(index, 'startDate', event.target.value)} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Data de término'
                                        rules={[
                                            { required: true, message: 'Campo Obrigatório' }
                                        ]}
                                        name={[index, 'finalDate']}
                                    >
                                        <MaskedInput mask='11/11/1111' defaultValue={p.finalDate} onChange={event => changeStep(index, 'finalDate', event.target.value)} />
                                    </Form.Item>
                                </Form>
                                <Divider style={{ backgroundColor: '#333' }} />
                            </div>
                        ))}
                    </div>
                    <Form
                        layout='vertical'
                        style={{ maxWidth: '520px', width: '100%' }}
                        initialValues={project.planning}
                        onFinish={handlePlanning}
                    >
                        <Form.List name='planning'>
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map((field, index) => (
                                            <>
                                                <h2>Etapa {totalSteps + index + 1}</h2>
                                                {(fields.length > 1 || project.planning.length > 0) ? (
                                                    <Button
                                                        type='link'
                                                        style={{ margin: '8px 0', padding: '0' }}
                                                        onClick={() => {
                                                            remove(field.name);
                                                        }}>
                                                        <MinusCircleOutlined />
                                                        Excluir
                                                    </Button>

                                                ) : null}
                                                <Form.Item
                                                    required={false}
                                                    key={field.key}
                                                >
                                                    <Form.Item
                                                        {...field}
                                                        label={`Etapa ${index + 1}`}
                                                        name={[field.name, 'text']}
                                                        fieldKey={[field.fieldKey, 'text']}
                                                        rules={[
                                                            { required: true, message: 'Campo obrigatório' },
                                                            { max: 200, message: 'Número de caracteres ultrapassado' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Descreva a etapa" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentSite']}
                                                        label="Local"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Indicar o local onde essa etapa será desenvolvida" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentMode']}
                                                        label="Como será desenvolvida (indicar recursos de
                                                            infraestrutura necessários, tais como laboratório de
                                                            informática, laboratório específico, etc.)"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Como será desenvolvida?" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'startDate']}
                                                        label="Data de inicío"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <MaskedInput
                                                            mask="11/11/1111"
                                                        />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'finalDate']}
                                                        label="Data de término"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <MaskedInput
                                                            mask="11/11/1111"
                                                        />
                                                    </Form.Item>
                                                </Form.Item>
                                                <Divider style={{ backgroundColor: '#333' }} />
                                            </>
                                        ))}

                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    add();
                                                }}
                                                style={{ width: '100%' }}
                                            >
                                                <PlusOutlined /> Adicionar Etapa
                                    </Button>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>

                        <Form.Item>
                            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Button type="primary" onClick={previous}>Anterior</Button>
                                <Button htmlType="submit" type="primary">Próximo</Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </ContainerFlex>
    )
}

export default Planning