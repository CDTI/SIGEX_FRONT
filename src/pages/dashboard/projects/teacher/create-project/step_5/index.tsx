import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space, InputNumber, Checkbox } from 'antd'
import { IProject } from '../../../../../../interfaces/project'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
    changeResources(resource: any): void
    previous(): void
    removeMaterials(index: number): void
    project: IProject
    edited: boolean
}

const Resources: React.FC<Props> = ({ changeResources, previous, project, edited, removeMaterials }) => {
    return (
        <ContainerFlex>
            <div>
                <div>
                    {project.resources.materials.map((material, index) => (
                        <div>
                            <Button onClick={() => removeMaterials(index)}>Remover</Button>
                            <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
                                <Form.Item
                                    label='Item'
                                >
                                    <Input value={material.item}/>
                                </Form.Item>
                                <Form.Item
                                    label='Descrição'
                                >
                                    <Input value={material.description}/>
                                </Form.Item>
                                <Form.Item
                                    label='Unidade'
                                >
                                    <Input value={material.unity}/>
                                </Form.Item>
                                <Form.Item
                                    label='Quantidade'
                                >
                                    <Input value={material.quantity}/>
                                </Form.Item>
                                <Form.Item
                                    label='Preço unitário'
                                >
                                    <Input value={material.unitaryValue}/>
                                </Form.Item>
                                <Form.Item
                                    label='Total'
                                >
                                    <Input value={material.quantity * material.unitaryValue}/>
                                </Form.Item>
                            </Space>
                        </div>
                    ))}
                </div>
                <Form
                    layout="vertical"
                    onFinish={changeResources}
                // initialValues={project.resources}
                >
                    <Form.List name="materials">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map(field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                {...field}
                                                label="Item"
                                                name={[field.name, 'item']}
                                                fieldKey={[field.fieldKey, 'item']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Nome do Item" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Descrição"
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey, 'description']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Descrição" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Unidade"
                                                name={[field.name, 'unity']}
                                                fieldKey={[field.fieldKey, 'unity']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Unidade" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Quantidade"
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey, 'quantity']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <InputNumber
                                                    defaultValue={0}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                                                    placeholder="Quantidade" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Preço Unitário"
                                                name={[field.name, 'unitaryValue']}
                                                fieldKey={[field.fieldKey, 'unitaryValue']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <InputNumber
                                                    defaultValue={0}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                                                    placeholder="Preço Unitário" />
                                            </Form.Item>
                                            <Form.Item
                                                name='totalPrice'
                                                style={{ display: 'none' }}
                                            >
                                                <Checkbox value='0' checked></Checkbox>
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
                                            <PlusOutlined /> Adicionar Materiais
                                    </Button>
                                    </Form.Item>
                                </div>
                            );
                        }}
                    </Form.List>
                    <Form.List name="transport">
                        {(fields, { add, remove }) => {
                            return (
                                <div>
                                    {fields.map(field => (
                                        <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                            <Form.Item
                                                {...field}
                                                label="Tipo de transporte"
                                                name={[field.name, 'typeTransport']}
                                                fieldKey={[field.fieldKey, 'typeTransport']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Ex: Carro, Moto..." />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Descrição"
                                                name={[field.name, 'description']}
                                                fieldKey={[field.fieldKey, 'description']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Descrição" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Unidade"
                                                name={[field.name, 'unity']}
                                                fieldKey={[field.fieldKey, 'unity']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Unidade" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Quantidade"
                                                name={[field.name, 'quantity']}
                                                fieldKey={[field.fieldKey, 'quantity']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <InputNumber
                                                    defaultValue={0}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                                                    placeholder="Quantidade" />
                                            </Form.Item>
                                            <Form.Item
                                                {...field}
                                                label="Preço Unitário"
                                                name={[field.name, 'unitaryValue']}
                                                fieldKey={[field.fieldKey, 'unitaryValue']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <InputNumber
                                                    defaultValue={0}
                                                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                                    parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                                                    placeholder="Preço Unitário" />
                                            </Form.Item>
                                            <Form.Item
                                                name='totalPrice'
                                                style={{ display: 'none' }}
                                            >
                                                <Checkbox value='0' checked></Checkbox>
                                            </Form.Item>
                                            <MinusCircleOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        </Space>
                                    ))}

                                    {fields.length < 1 && (
                                        <Form.Item>
                                            <Button
                                                type="dashed"
                                                onClick={() => {
                                                    add();
                                                }}
                                                block
                                            >
                                                <PlusOutlined /> Adicionar Transporte
                                    </Button>
                                        </Form.Item>
                                    )}
                                </div>
                            );
                        }}
                    </Form.List>
                    <Form.Item>
                        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button type="primary" onClick={previous}>Anterior</Button>
                            {!edited ? <Button type="primary" htmlType="submit">Finalizar</Button> : <Button type="primary" htmlType="submit">Atualizar</Button>}

                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </ContainerFlex>
    )
}

export default Resources