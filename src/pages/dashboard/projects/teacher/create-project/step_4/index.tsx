import React from 'react'
import { ContainerFlex, Title } from '../../../../../../global/styles'
import { Form, Input, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IProject } from '../../../../../../interfaces/project'
import { MaskedInput } from 'antd-mask-input'

interface Props {
    changePlanning(planning: any): void
    removeStep(index: number): void
    previous(): void
    project: IProject
}

const Planning: React.FC<Props> = ({ changePlanning, previous, project, removeStep }) => {
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
                                <Button onClick={() => removeStep(index)}>Remover</Button>
                                <Form.Item label='Etapa'>
                                    <Input value={p.text} disabled/>
                                </Form.Item>
                                <Form.Item
                                    label='Área de desenvolvimento'
                                >
                                    <Input value={p.developmentSite} disabled/>
                                </Form.Item>
                                <Form.Item
                                    label='Modo desenvolvimento'
                                >
                                    <Input value={p.developmentMode} disabled/>
                                </Form.Item>
                                <Form.Item
                                    label='Data de inicío'
                                >
                                    <Input value={p.startDate} disabled/>
                                </Form.Item>
                                <Form.Item
                                    label='Data de término'
                                >
                                    <Input value={p.finalDate} disabled/>
                                </Form.Item>
                            </div>
                        ))}
                    </div>
                    <Form
                        layout='vertical'
                        style={{ maxWidth: '520px', width: '100%' }}
                        initialValues={project.planning}
                        onFinish={changePlanning}
                    >
                        <Form.List name='planning'>
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map((field, index) => (
                                            <>
                                                <Title>Etapa {index + 1}</Title>
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
                                                            { max: 50, message: 'Número de caracteres ultrapassado' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Descreva a etapa" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentSite']}
                                                        label="Área de desenvolvimento"
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <Input placeholder="Onde será desenvolvida?" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        name={[field.name, 'developmentMode']}
                                                        label="Modo de desenvolvimento"
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
                                                    {fields.length > 1 ? (
                                                        <>
                                                            <MinusCircleOutlined
                                                                className="dynamic-delete-button"
                                                                style={{ margin: '0 8px' }}
                                                                onClick={() => {
                                                                    remove(field.name);
                                                                }}
                                                            />
                                                Excluir
                                            </>
                                                    ) : null}
                                                </Form.Item>
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