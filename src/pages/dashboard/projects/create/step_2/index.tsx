import React, { useState } from 'react'
import { Form, Input, Button, Space, Empty } from 'antd'
import { IPartnership, IProject } from '../../../../../interfaces/project';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'
import { ContainerFlex } from '../../../../../global/styles';
import MaskedInput from 'antd-mask-input'

const { TextArea } = Input

export interface Props {
    changePartner(values: IPartnership[]): void
    previous(): void
    next(): void
    project: IProject
}

const PartnerShip: React.FC<Props> = ({ changePartner, previous, project, next }) => {
    const [partners, setPartners] = useState<IPartnership[]>([{ text: '', contacts: [] }])
    const [primary, setPrimary] = useState(true)
    const [form] = Form.useForm()

    const addPartner = (partner: IPartnership) => {
        if (primary) {
            partners.length = 0
        }
        partners.push(partner)
        console.log(partners)
        setPartners(partners)
        setPrimary(false)
        changePartner(partners)
        form.resetFields()
    }

    const formatterPhone = (phone?: string) => {
        if (phone && phone.length > 9) {
            phone.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            const phoneFormatter = `(${phone[1]}${phone[2]}) ${phone[3]}${phone[4]}${phone[5]}${phone[6]}-${phone[7]}${phone[8]}${phone[9]}${phone[10]}`

            return phoneFormatter
        }

        return '000000000'
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
                    <Form.Item
                        name="text"
                        label="Sobre"
                        rules={[{ required: true, message: 'Campo Obritarório' }]}
                        style={{ width: '100%' }}
                    >
                        <TextArea placeholder="Fale sobre sua parceria" />
                    </Form.Item>
                    <h2>Contatos</h2>
                    <Form.List name="contacts">
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
                                            block
                                        >
                                            <PlusOutlined /> Adicionar Contato
                                        </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List>
                    <Form.Item>
                        <Space>
                            <Button type="primary" htmlType="submit">Inserir</Button>
                        </Space>
                    </Form.Item>
                </Form >
            </ContainerFlex >
            <ContainerFlex>
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
                    <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="primary" onClick={previous}>Anterior</Button>
                        <Button type="primary" onClick={next}>Próximo</Button>
                    </Space>
                </div>
            </ContainerFlex>
        </>
    )
}

export default PartnerShip