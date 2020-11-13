import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, Space, InputNumber } from 'antd'
import { IMaterials, IProject } from '../../../../../../interfaces/project'
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons'

interface Props {
    changeResources(transport: any, resources: IMaterials[]): void
    previous(): void
    removeMaterials(index: number): void
    removeTransport(): void
    project: IProject
    edited: boolean
}

const Resources: React.FC<Props> = ({ changeResources, previous, project, edited, removeMaterials, removeTransport }) => {
    console.log(project.resources.transport)

    const formatReal = (value: any) => {
        var tmp = value + '';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if (tmp.length > 6)
            tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$),([-])/g, ".$1,$2");
        return tmp;
    }

    const formatInteger = (value: any) => {
        let format = value.toString().replace(/\D/g, '')
        if (format === '0') {
            format = '1'
        }
        return format
    }

    const editMaterial = (index: number, ev: any,
        nameEvent: any) => {
        if (project.resources.materials !== undefined) {
            const material = project.resources.materials[index] as any
            material[nameEvent] = ev.target.value
        }
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
                <>
                    {project.resources.materials?.map((material, index) => (
                        <ContainerFlex>
                            <Form
                                style={{ maxWidth: '720px' }}
                                layout='vertical'
                            >
                                <Button onClick={() => removeMaterials(index)} type='link' style={{ margin: '8px 0', padding: '0' }}>
                                    <MinusCircleOutlined />
                                    Remover
                                </Button>
                                <Space style={{ display: 'flex', marginBottom: 8 }} align="start">
                                    <Form.Item
                                        label='Item'
                                    >
                                        <Input defaultValue={material.item} onChange={event => editMaterial(index, event, 'item')} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Descrição'
                                    >
                                        <Input defaultValue={material.description} onChange={event => editMaterial(index, event, 'description')} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Quantidade'
                                    >
                                        <InputNumber
                                            defaultValue={material.quantity}
                                            formatter={value => `${value}`.replace(/\D+/g, '')}
                                            min={0} step={1}
                                            placeholder="Quantidade" onChange={event => {
                                                if (event !== undefined) {
                                                    const value = event.toString()
                                                    const ev = { target: { value: value } }
                                                    editMaterial(index, ev, 'quantity')
                                                }
                                            }} />
                                    </Form.Item>
                                    <Form.Item
                                        label='Preço unitário'
                                    >
                                        <InputNumber
                                            defaultValue={material.unitaryValue}
                                            min={0}
                                            formatter={value => formatReal(value)}
                                            placeholder="Preço Unitário"
                                            onChange={event => {
                                                if (event !== undefined) {
                                                    const value = event.toString()
                                                    const ev = { target: { value: value } }
                                                    editMaterial(index, ev, 'unitaryValue')
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                </Space>
                            </Form>
                        </ContainerFlex>
                    ))}
                </>
                <ContainerFlex>
                    <Form
                        style={{ maxWidth: '720px' }}
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
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            formatter={value => formatInteger(value)}
                                                            step={1}
                                                            placeholder="Quantidade" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="Preço Unitário"
                                                        name={[field.name, 'unitaryValue']}
                                                        fieldKey={[field.fieldKey, 'unitaryValue']}
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <InputNumber
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
                                            <>
                                                <Button
                                                    onClick={() => remove(field.name)}
                                                    style={{ margin: '8px 0', padding: '0' }}
                                                    type='link'
                                                >
                                                    <MinusCircleOutlined />
                                                    Remover Transporte
                                                </Button>
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
                                                            formatter={value => formatInteger(value)}
                                                            step={1}
                                                            style={{ appearance: "textfield" }}
                                                            placeholder="Quantidade" />
                                                    </Form.Item>
                                                    <Form.Item
                                                        {...field}
                                                        label="Preço Unitário"
                                                        name={[field.name, 'unitaryValue']}
                                                        fieldKey={[field.fieldKey, 'unitaryValue']}
                                                        rules={[
                                                            { required: true, message: 'Campo Obrigatório' }
                                                        ]}
                                                    >
                                                        <InputNumber
                                                            defaultValue={0}
                                                            formatter={value => formatReal(value)}
                                                            placeholder="Preço Unitário" />
                                                    </Form.Item>
                                                </Space>
                                            </>
                                        ))}

                                        {((fields.length < 1 && project.resources.transport === undefined) || (fields.length < 1 && project.resources.transport === null)) && (
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
                                            (project.resources.transport !== null && project.resources.transport !== undefined) && (
                                                <Space style={{ display: 'flex', marginBottom: 8 }}>
                                                    <Button
                                                        type='link'
                                                        style={{ margin: '8px 0', padding: '0' }}
                                                        onClick={removeTransport}
                                                    >
                                                        <MinusCircleOutlined />
                                                        Remover transporte
                                                    </Button>
                                                    <Form.Item
                                                        label='Tipo de transporte'
                                                    >
                                                        <Input defaultValue={project.resources.transport?.typeTransport} disabled />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Descrição'
                                                    >
                                                        <Input defaultValue={project.resources.transport?.description} disabled />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Quantidade'
                                                    >
                                                        <InputNumber
                                                            defaultValue={project.resources.transport?.quantity}
                                                            formatter={value => `${value}`.replace(/\D+/g, '')}
                                                            placeholder="Preço Unitário" disabled />
                                                    </Form.Item>
                                                    <Form.Item
                                                        label='Preço unitário'
                                                    >
                                                        <InputNumber
                                                            defaultValue={project.resources.transport?.unitaryValue}
                                                            formatter={value => formatReal(value)}
                                                            min={1} step={1}
                                                            placeholder="Quantidade" disabled />
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