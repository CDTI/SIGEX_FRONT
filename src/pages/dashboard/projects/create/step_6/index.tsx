import React, { useState } from 'react'
import { ContainerFlex } from '../../../../../global/styles'
import { Button, Form, Upload, Space } from 'antd'
import { IProject } from '../../../../../interfaces/project'
import { InboxOutlined } from '@ant-design/icons'

interface Props {
    changeAttachement(value: any): void
    previous(): void
    project: IProject
}

const Attachement: React.FC<Props> = ({ changeAttachement, previous, project }) => {
    const changeEvent = (event: any) => {
        console.log(event)
    }

    return (
        <ContainerFlex>
            <Form
                onFinish={changeAttachement}
                initialValues={project.resources}
            >
                <Form.Item label="Dragger">
                    <Form.Item name="attachments" valuePropName="fileList" getValueFromEvent={changeEvent} noStyle>
                        <Upload.Dragger name="files">
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Anexe aqui documentos que ache importante para o seu projeto</p>
                        </Upload.Dragger>
                    </Form.Item>
                </Form.Item>
                <Form.Item>
                    <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button type="primary" onClick={previous}>Anterior</Button>
                        <Button type="primary" htmlType="submit">Finalizar</Button>
                    </Space>
                </Form.Item>
            </Form>
        </ContainerFlex>
    )
}

export default Attachement