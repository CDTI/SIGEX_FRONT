import React, { useEffect, useState } from 'react'
import Structure from '../../../../../components/layout/structure'
import { IProject } from '../../../../../interfaces/project'
import { listApprovedProjects } from '../../../../../services/project_service'

const SelectProjects: React.FC = () => {
    const [projects, setProjects] = useState<IProject[] | null>(null)

    useEffect(() => {
        listApprovedProjects().then(data => {
            setProjects(data.projects)
        })
    }, [])

    return (
        <Structure title='Selecionar projetos'>
            <h2>Em contrução</h2>
        </Structure>
    )
}

export default SelectProjects