import React from 'react'
import { ContainerFlex } from '../../../../../../global/styles'
import { Form, Input, Button, InputNumber, Space } from 'antd'
import { IProject } from '../../../../../../interfaces/project'
import { ICommunity } from '../../../../../../interfaces/community'

const { TextArea } = Input

interface Props {
    changeCommunitySpecific(specificCommunity: ICommunity): void
    previous(): void
    project: IProject
}

const SpecificCommunity: React.FC<Props> = ({ changeCommunitySpecific, project, previous }) => {

    return (
        <ContainerFlex>
            <Form initialValues={project.specificCommunity}
                onFinish={changeCommunitySpecific}
                style={{ width: '100%', maxWidth: '500px' }}
                layout="vertical"
            >
                <Form.Item
                    label="Sobre"
                    name="text"
                    rules={[
                        { required: true, message: 'Campo Obrigatório' }
                    ]}
                >
                    <TextArea placeholder="Digite sobre a comunidade" />
                </Form.Item>
                <Form.Item
                    label="Localização"
                    name="location"
                    rules={[
                        { required: true, message: 'Campo Obrigatório' }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="N° de pessoas envolvidas"
                    name="peopleInvolved"
                    rules={[
                        { required: true, message: 'Campo Obrigatório' }
                    ]}
                >
                    <InputNumber
                        placeholder="Ex: 120"
                        defaultValue={0}
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        parser={value => `${value}`.replace(/\$\s?|(,*)/g, '')}
                    />
                </Form.Item>
                <Form.Item>
                    <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="primary" onClick={previous}>Anterior</Button>
                        <Button type="primary" htmlType="submit">Próximo</Button>
                    </Space>
                </Form.Item>
            </Form>
        </ContainerFlex>
    )
}

export default SpecificCommunity