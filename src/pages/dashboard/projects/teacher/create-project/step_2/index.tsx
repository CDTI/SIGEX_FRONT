import React from 'react'
import { Form, Input, Button, Space } from 'antd'
import { IPartnership, IProject } from '../../../../../../interfaces/project';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ContainerFlex } from '../../../../../../global/styles';
import MaskedInput from 'antd-mask-input'

const { TextArea } = Input

export interface Props {
    changePartner(values: IPartnership[]): void
    previous(): void
    next(): void
    project: IProject
}

const PartnerShip: React.FC<Props> = ({ changePartner, previous, project, next }) => {
    const [form] = Form.useForm()

    const addPartner = (partners: any) => {
        const changepartners = partners.partners as IPartnership[]
        changePartner(changepartners)
        form.resetFields()
    }

    return (
        <>
            <ContainerFlex>
                <Form
                    form={form}
                    onFinish={addPartner}
                    layout="vertical"
                    style={{ width: '100%', maxWidth: '500px' }}
                    initialValues={project}
                >
                    <Form.List name='partners'>
                        {(fieldsPart, { add, remove }) => {
                            return (
                                <>
                                    {fieldsPart.map(fieldPart => (
                                        <>
                                            <div>
                                                <Form.Item
                                                    {...fieldPart}
                                                    name={[fieldPart.name, 'text']}
                                                    fieldKey={[fieldPart.fieldKey, 'text']}
                                                    label="Sobre"
                                                    rules={[{ required: true, message: 'Campo Obritarório' }]}
                                                    style={{ width: '100%' }}
                                                >
                                                    <TextArea placeholder="Fale sobre sua parceria" />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                        remove(fieldPart.name);
                                                    }}
                                                />
                                            </div>
                                            <Form.List name={[fieldPart.name, 'contacts']}>
                                                {(fields, { add, remove }) => {
                                                    return (
                                                        <div>
                                                            {fields.map(field => (
                                                                <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                                                    <Form.Item
                                                                        {...field}
                                                                        label="Nome"
                                                                        name={[field.name, 'name']}
                                                                        fieldKey={[field.fieldKey, 'name']}
                                                                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                                                                    >
                                                                        <Input placeholder="Nome do contato" />
                                                                    </Form.Item>
                                                                    <Form.Item
                                                                        {...field}
                                                                        label="Telefone"
                                                                        name={[field.name, 'phone']}
                                                                        fieldKey={[field.fieldKey, 'phone']}
                                                                        rules={[{ required: true, message: 'Campo obrigatório' }]}
                                                                    >
                                                                        <MaskedInput
                                                                            mask="(11) 11111-1111"
                                                                        />
                                                                    </Form.Item>

                                                                    <MinusCircleOutlined
                                                                        onClick={() => {
                                                                            remove(field.name);
                                                                        }}
                                                                    />
                                                                </Space>
                                                            ))}

                                                            <Form.Item>
                                                                <Button
                                                                    type="dashed"
                                                                    onClick={() => {
                                                                        add();
                                                                    }}
                                                                    block >
                                                                    <PlusOutlined /> Adicionar Contato
                                                                </Button>
                                                            </Form.Item>
                                                        </div>
                                                    );
                                                }}
                                            </Form.List>
                                        </>
                                    ))}
                                    <Form.Item>
                                        <Button
                                            type="dashed"
                                            onClick={() => {
                                                add();
                                            }}
                                            block
                                        >
                                            <PlusOutlined /> Adicionar Parceria
                                        </Button>
                                    </Form.Item>
                                </>
                            )
                        }}
                    </Form.List>
                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button type="primary" onClick={previous}>Anterior</Button>
                            <Button type="primary" htmlType='submit'>Próximo</Button>
                        </Space>
                    </Form.Item>
                </Form >
            </ContainerFlex >
            {/* <ContainerFlex>
                <div style={{ width: '100%', maxWidth: '500px' }}>
                    <h1 style={{ fontSize: '18pt', color: '#333', borderBottom: '3px solid #333' }}>Lista de parceiros</h1>
                    {project.partnership.length > 0 && (
                        <ul>
                            {project.partnership.map(e => (
                                <>
                                    <label style={{ fontSize: '14pt', color: '#333' }}>{e.text}</label>
                                    <ul>
                                        {e.contacts.map(contact => (
                                            <li>
                                                {contact.name} | {contact.phone}
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ))}
                        </ul>
                    )}

                    {project.partnership.length === 0 && (
                        <Empty description={
                            <span>
                                Sem parceiros inseridos
                            </span>
                        } />
                    )}

                </div>
            </ContainerFlex> */}
        </>
    )
}

export default PartnerShip