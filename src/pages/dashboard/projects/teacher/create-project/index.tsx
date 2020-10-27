import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { Button, Result, Steps } from 'antd'

// Steps
import BasicInfo from './step_1'
import Partner from './step_2'
import SpecificCommunity from './step_3'
import Planning from './step_4'
import Resource from './step_5'
import Attachment from './step_6'
import { IPartnership, IProject, ISpecificCommunity } from '../../../../../interfaces/project'
import { newProject } from '../../../../../mocks/mockDefaultValue'
import { Link } from 'react-router-dom'
import { useAuth } from '../../../../../context/auth'
import { createProject } from '../../../../../services/project_service'

const { Step } = Steps

export interface IBasicInfo {
  name: string
  description: string
  unity: number[]
  programId: string
  results: string
  categoryId: string
}

const CreateProject: React.FC = () => {
  const [current, setCurrent] = useState(0)
  const [project, setProject] = useState<IProject>(newProject)
  const [finish, setFinish] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    console.log(project)
  }, [project])

  const changeBasicInfo = (values: IBasicInfo) => {
    console.log(values)
    const date = new Date()
    if (user !== null) {
      setProject({ ...project, name: values.name, description: values.description, unity: values.unity, programId: values.programId, results: values.results, dateStart: date, dateFinal: date, status: 'pending', categoryId: values.categoryId, author: user.cpf })
    } else {
      setProject({ ...project, name: values.name, description: values.description, unity: values.unity, programId: values.programId, results: values.results, dateStart: date, dateFinal: date, status: 'pending', categoryId: values.categoryId })
    }
    setCurrent(current + 1)
  }

  const changePartner = (partner: IPartnership[]) => {
    setProject({ ...project, partnership: partner })
  }

  const changeSpecificCommunity = (specificCommunity: ISpecificCommunity) => {
    setProject({ ...project, specificCommunity: specificCommunity })
    setCurrent(current + 1)
  }

  const changePlanning = (planning: any) => {
    project.planning = planning.planning;
    setProject(project)
    setCurrent(current + 1)
  }

  const changeResource = (resource: any) => {
    project.resources.transport = resource.transport[0]
    project.resources.materials = resource.materials
    setProject(project)
    setCurrent(current + 1)
  }

  const changeAttachment = async (attachment: any) => {
    setProject({ ...project, attachments: attachment })
    console.log(project)
    const projectData = await createProject(project)
    console.log(projectData)
    setFinish(true)
  }

  const previous = () => {
    setCurrent(current - 1)
  }

  const next = () => {
    setCurrent(current + 1)
  }

  // Steps
  const steps = [
    {
      title: 'Informações Básicas',
      content: <BasicInfo changeBasicInfo={changeBasicInfo} project={project} />
    },
    {
      title: 'Parcerias',
      content: <Partner changePartner={changePartner} previous={previous} next={next} project={project} />
    },
    {
      title: 'Comunidade',
      content: <SpecificCommunity previous={previous} changeCommunitySpecific={changeSpecificCommunity} project={project} />
    },
    {
      title: 'Planejamento',
      content: <Planning previous={previous} changePlanning={changePlanning} project={project} />
    },
    {
      title: 'Recursos',
      content: <Resource previous={previous} changeResources={changeResource} project={project} />
    },
    {
      title: 'Anexos',
      content: <Attachment changeAttachement={changeAttachment} previous={previous} project={project} />
    }
  ]

  return (
    <>
      {!finish && (
        <Structure title="Registrar Projeto">
          <Steps current={current}>
            {steps.map(item => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div className="steps-content">{steps[current].content}</div>
        </Structure>
      )}
      {finish && (
        <Result
          status="success"
          title="Seu projeto foi registrado com sucesso"
          subTitle="Você pode acompanha os seus projetos no menu 'Meus Projetos'."
          extra={[
            <Button type="primary" key="console">
              <Link to="/dashboard">Voltar</Link>
            </Button>,
          ]}
        />
      )}
    </>
  )
}

export default CreateProject