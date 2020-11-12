import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space, InputNumber } from 'antd'
import { IMaterials, IProject } from '../../../../../../interfaces/project'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
    changeResources(transport: any, resources: IMaterials[]): void
    previous(): void
    removeMaterials(index: number): void
    project: IProject
    edited: boolean
}

const Resources: React.FC<Props> = ({ changeResources, previous, project, edited, removeMaterials }) => {
    const formatReal = (value: any) => {
        var tmp = value + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
    }

    const handle = async (value: any) => {
        const submitMaterial = value.materials as IMaterials[] | undefined
        let materials: IMaterials[] = []
        if (project.resources.materials !== undefined) {
            materials = project.resources.materials
        }

        if (submitMaterial !== undefined) {
            for await (let e of submitMaterial) {
                materials.push(e)
            }
        }

        if (value.transport !== undefined) {
            changeResources(value.transport[0], materials)
        } else {
            changeResources(undefined, materials)
        }
    }

    return (
        <ContainerFlex>
            <div>
                <div>
                    {project.resources.materials?.map((material, index) => (
                        <div>
                            <Button onClick={() => removeMaterials(index)} type='link' style={{ margin: '8px 0', padding: '0' }}>
                                <MinusCircleOutlined />
                                Remover
                                </Button>
                            <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
                                <Form.Item
                                    label='Item'
                                >
                                    <Input value={material.item} />
                                </Form.Item>
                                <Form.Item
                                    label='Descrição'
                                >
                                    <Input value={material.description} />
                                </Form.Item>
                                <Form.Item
                                    label='Quantidade'
                                >
                                    <InputNumber
                                        defaultValue={material.quantity}
                                        formatter={value => `${value}`.replace(/\D+/g, '')}
                                        min={1} step={1}
                                        placeholder="Quantidade" />
                                </Form.Item>
                                <Form.Item
                                    label='Preço unitário'
                                >
                                    <InputNumber
                                        defaultValue={material.unitaryValue}
                                        formatter={value => formatReal(value)}
                                        placeholder="Preço Unitário" />
                                </Form.Item>
                            </Space>
                        </div>
                    ))}
                </div>
                <ContainerFlex>
                    <Form
                        layout="vertical"
                        onFinish={handle}
                    // initialValues={project.resources}
                    >
                        <Form.List name="materials">
                            {(fields, { add, remove }) => {
                                return (
                                    <div>
                                        {fields.map(field => (
                                            <>
                                                <Button onClick={() => remove(field.name)} type='link' style={{ margin: '8px 0', padding: '0' }}>
                                                    <MinusCircleOutlined />
                                                Remover
                                             </Button>
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
                                                    {/* <Form.Item
                                                    {...field}
                                                    label="Unidade"
                                                    name={[field.name, 'unity']}
                                                    fieldKey={[field.fieldKey, 'unity']}
                                                    rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                                >
                                                    <Input placeholder="Unidade" />
                                                </Form.Item> */}
                                                    <Form.Item
                                                        {...field}
                                                        label="Quantidade"
                                                        name={[field.name, 'quantity']}
                                                        fieldKey={[field.fieldKey, 'quantity']}
                                                        rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                                    >
                                                        <InputNumber
                                                            defaultValue={0}
                                                            formatter={value => `${value}`.replace(/\D+/g, '')}
                                                            min={1} step={1}
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
                                                            formatter={value => formatReal(value)}
                                                            placeholder="Preço Unitário" />
                                                    </Form.Item>
                                                </Space>
                                            </>
                                        ))}

                                        <Form.Item>
                                            <>
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        add();
                                                    }}
                                                    block
                                                >
                                                    <PlusOutlined /> Adicionar Materiais
                                    </Button>
                                    (quando o projeto exigir materiais específicos.
Por exemplo: material descartável para atendimento de
saúde, impressão de banner, material para impressora
3D)

                                    </>
                                        </Form.Item>
                                    </div>
                                );
                            }}
                        </Form.List>
                        <Form.List name="transport">
                            {(fields, { add, remove }) => {
                                console.log(project)
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
                                                {/* <Form.Item
                                                {...field}
                                                label="Unidade"
                                                name={[field.name, 'unity']}
                                                fieldKey={[field.fieldKey, 'unity']}
                                                rules={[{ required: true, message: 'Campo Obrigatório' }]}
                                            >
                                                <Input placeholder="Unidade" />
                                            </Form.Item> */}
                                                <Form.Item
                                                    {...field}
                                                    label="Quantidade"
                                                    name={[field.name, 'quantity']}
                                                    fieldKey={[field.fieldKey, 'quantity']}
                                                    rules={[
                                                        { required: true, message: 'Campo Obrigatório' },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        defaultValue={0}
                                                        formatter={value => `${value}`.replace(/\D+/g, '')}
                                                        min={1} step={1}
                                                        placeholder="Quantidade" />
                                                </Form.Item>
                                                <Form.Item
                                                    {...field}
                                                    label="Preço Unitário"
                                                    name={[field.name, 'unitaryValue']}
                                                    fieldKey={[field.fieldKey, 'unitaryValue']}
                                                    rules={[
                                                        { required: true, message: 'Campo Obrigatório' },
                                                    ]}
                                                >
                                                    <InputNumber
                                                        defaultValue={0}
                                                        formatter={value => formatReal(value)}
                                                        placeholder="Preço Unitário" />
                                                </Form.Item>
                                                <MinusCircleOutlined
                                                    onClick={() => {
                                                        remove(field.name);
                                                    }}
                                                />
                                            </Space>
                                        ))}

                                        {((fields.length < 1 && project.resources.transport?.typeTransport.length === 0) || (fields.length < 1 && project.resources.transport === null)) && (
                                            <Form.Item>
                                                <>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            add();
                                                        }}
                                                        block
                                                    >
                                                        <PlusOutlined /> Adicionar Transporte
                                                </Button>
                                                (quando a comunidade estiver fora da região metropolitana de Curitiba)
                                                </>
                                            </Form.Item>
                                        )}
                                        {
                                            (project.resources.transport !== null && project.resources.transport.typeTransport.length) > 0 && (
                                                <Space style={{ display: 'flex', marginBottom: 8 }}>
                                                    <Form.Item
                                                        label='Tipo de transporte'
                                                    >
                                                        <Input defaultValue={project.resources.transport?.typeTransport} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Descrição'
                                                    >
                                                        <Input defaultValue={project.resources.transport?.description} />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Quantidade'
                                                    >
                                                        <InputNumber
                                                            defaultValue={project.resources.transport?.quantity}
                                                            formatter={value => `${value}`.replace(/\D+/g, '')}
                                                            placeholder="Preço Unitário" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Preço unitário'
                                                    >
                                                         <InputNumber
                                                            defaultValue={project.resources.transport?.unitaryValue}
                                                            formatter={value => formatReal(value)}
                                                            min={1} step={1}
                                                            placeholder="Quantidade" />
                                                    </Form.Item>
                                                </Space>
                                            )
                                        }
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
                </ContainerFlex>
            </div>
        </ContainerFlex>
    )
}

export default Resources