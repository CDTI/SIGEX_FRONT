import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { IProject } from '../../../../../../interfaces/project'
import { MaskedInput } from 'antd-mask-input'

interface Props {
    changePlanning(planning: any): void
    previous(): void
    project: IProject
}

const Planning: React.FC<Props> = ({ changePlanning, previous, project }) => {
    return (
        <ContainerFlex>
            <Form
                initialValues={project.planning}
                onFinish={changePlanning}
            >
                <Form.List name='planning'>
                    {(fields, { add, remove }) => {
                        return (
                            <div>
                                {fields.map((field, index) => (
                                    <Form.Item
                                        required={false}
                                        key={field.key}
                                    >
                                        <Form.Item
                                            {...field}
                                            label={`Etapas ${index + 1}`}
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
                                ))}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => {
                                            add();
                                        }}
                                        style={{ width: '60%' }}
                                    >
                                        <PlusOutlined /> Adicionar atividade
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
        </ContainerFlex>
    )
}

export default Planning