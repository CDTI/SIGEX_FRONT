import React from 'react'
import { Form, Input, Button, Space, Divider } from 'antd'
import { IPartnership, IProject } from '../../../../../../interfaces/project';
import { MinusCircleOutlined, PlusOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { ContainerFlex } from '../../../../../../global/styles';
import MaskedInput from 'antd-mask-input'

const { TextArea } = Input

export interface Props {
    changePartner(values: IPartnership[]): void
    changeEditPartner(event: any, index: number): void
    addContact(index: number): void
    previous(): void
    removeContact(indexParnter: number, indexContact: number): void
    removePartner(index: number): void
    project: IProject
}

const PartnerShip: React.FC<Props> = ({ changePartner, previous, project, removeContact, removePartner, changeEditPartner, addContact }) => {
    const [form] = Form.useForm()
    const totalPartner = project.partnership.length

    const addPartner = (partners: any) => {
        const changepartners = partners.partners as IPartnership[]
        changePartner(changepartners)
        form.resetFields()
    }

    return (
        <>
            <ContainerFlex>
                <div
                    style={{ width: '100%', maxWidth: '500px' }}
                >
                    {project.partnership.map((e, index) => (
                        <>
                            <Form key={index}
                                layout='vertical'
                                style={{ width: '100%', maxWidth: '500px' }}
                            >
                                <h2>Parceria {index + 1}</h2>
                                <Button
                                    type='link'
                                    style={{ margin: '8px 0', padding: '0' }}
                                    onClick={() => removePartner(index)}><MinusCircleOutlined />
                                Remover Parceiro
                            </Button>
                                <Form.Item
                                    label='Sobre'
                                    name={[index, 'text']}
                                    rules={[
                                        { required: true, message: 'Campo Obrigatório' }
                                    ]}
                                >
                                    <Input.TextArea defaultValue={e.text} onChange={event => changeEditPartner(event, index)} />
                                </Form.Item>
                                {e.contacts.map((contact, indexC) => (
                                    <div key={indexC}>
                                        <Button onClick={() => removeContact(index, indexC)}
                                            type='link'
                                            style={{ margin: '8px 0', padding: '0' }}
                                        ><UserAddOutlined />Remover Contato</Button>
                                        <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                label='Nome'
                                                name={[indexC, 'name']}
                                                rules={[
                                                    { required: true, message: 'Campo Obrigatório' }
                                                ]}
                                            >
                                                <Input defaultValue={contact.name} />
                                            </Form.Item>
                                            <Form.Item
                                                label='Telefone'
                                                name={[indexC, 'phone']}
                                                rules={[
                                                    { required: true, message: 'Campo Obrigatório' }
                                                ]}
                                            >
                                                <MaskedInput mask='(11) 11111-1111' defaultValue={contact.phone} />
                                            </Form.Item>
                                        </Space>
                                    </div>
                                ))}
                                <Button
                                    style={{ backgroundColor: '#439A86', color: '#fff' }}
                                    onClick={() => addContact(index)}
                                    block >
                                    <UserAddOutlined /> Adicionar Contato
                            </Button>
                            </Form>
                            <Divider style={{ backgroundColor: '#333' }} />
                        </>
                    ))}
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
                                        {fieldsPart.map((fieldPart, indexPart) => (
                                            <>
                                                <div>
                                                    <Space style={{width: '100%'}}>
                                                        <h2 style={{ margin: '8px 0', padding: '0' }}>Parceria {totalPartner + indexPart + 1}</h2>
                                                        <Button
                                                            type='link'
                                                            style={{ margin: '8px 0', padding: '0' }}
                                                            onClick={() => {
                                                                remove(fieldPart.name);
                                                            }}>
                                                            <MinusCircleOutlined />
                                                        Remover Parceiro
                                                    </Button>
                                                    </Space>
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
                                                </div>
                                                <Form.List name={[fieldPart.name, 'contacts']}>
                                                    {(fields, { add, remove }) => {
                                                        return (
                                                            <div>
                                                                {fields.map(field => (
                                                                    <>
                                                                        <Button
                                                                            type='link'
                                                                            style={{ margin: '8px 0', padding: '0' }}
                                                                            onClick={() => {
                                                                                remove(field.name);
                                                                            }}
                                                                        >
                                                                            <UserDeleteOutlined />
                                                                            Remover contato
                                                                        </Button>
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

                                                                        </Space>
                                                                    </>
                                                                ))}

                                                                <Form.Item>
                                                                    <Button
                                                                        style={{ backgroundColor: '#439A86', color: '#fff' }}
                                                                        onClick={() => {
                                                                            add();
                                                                        }}
                                                                        block >
                                                                        <UserAddOutlined /> Adicionar Contato
                                                                </Button>
                                                                </Form.Item>
                                                            </div>
                                                        );
                                                    }}
                                                </Form.List>
                                                <Divider style={{ backgroundColor: '#333' }} />
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
                </div>
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