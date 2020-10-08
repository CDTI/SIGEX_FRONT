import React, { useState } from 'react'
import { IPrograms } from '../../../../interfaces/programs'
import { RouteProps } from 'react-router'
import Structure from '../../../../components/layout/structure'
import { Button, Divider, Form } from 'antd'
import { IFormProgram, IGroupsProgram } from '../../../../interfaces/formProgram'
import Modal from 'antd/lib/modal/Modal'
import CreateGroup from '../../../../components/forms/create-group'
import ListGroups from '../../../../components/layout/list-groups'

interface Props {
  location: RouteProps['location']
}

const CreateForm: React.FC<Props> = (props) => {
  const program = props.location?.state as IPrograms
  const [formProgram, setFormProgram] = useState<IFormProgram>({ id: 0, groups: [] })
  const [modal, setModal] = useState({ visible: false, confirmLoading: false, indexGroup: -1 })
  const [modalGroup, setModalGroup] = useState(({ visible: false, confirmLoading: false }))

  /**
    * @description
    * Funções relacionadas aos grupos
    */

  const showModalGroup = () => {
    setModalGroup({ ...modal, visible: true })
  }

  const closeModalGroup = () => {
    setModalGroup({ ...modal, visible: false })
  }

  const addGroup = (group: IGroupsProgram) => {
    formProgram.groups.push({ id: 0, name: group.name, questions: []})

    setFormProgram({ ...formProgram, groups: formProgram.groups })
    setModalGroup({ ...modalGroup, visible: false })
  }

  /**
   * @description
   * Funções relacionadas as questões
   */

  return (
    <Structure title={`Criando formulário para o programa ${program.name}`}>
      <Button type="primary" onClick={showModalGroup}>
        Criar Grupo
      </Button>
      <Divider />
      <>
        {/* Modal para criação de grupo */}
        <Modal
          title="Adicionar Grupo"
          visible={modalGroup.visible}
          onCancel={closeModalGroup}
          footer={[]}
        >
          <CreateGroup addGroup={addGroup} />
        </Modal>
      </>

      {/* Lista os grupos */}
      <ListGroups form={formProgram} />

    </Structure>
  )
}

export default CreateForm