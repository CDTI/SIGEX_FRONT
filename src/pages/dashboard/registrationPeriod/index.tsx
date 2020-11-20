import React, { useEffect, useState } from 'react'
import Structure from '../../../components/layout/structure'
import { IRegistrationPeriod } from '../../../interfaces/registrationPeriod'
import { getAllPeriods, updatePeriod } from '../../../services/registrationPeriod_service'
import { List, Switch, Typography } from 'antd'

const RegistrationPeriod: React.FC = () => {
    const [periods, setPeriods] = useState<IRegistrationPeriod[]>([])

    useEffect(() => {
        getAllPeriods().then(allPeriods => {
            setPeriods(allPeriods)
        })
    }, [])

    const changePeriod = async (value: boolean, period: IRegistrationPeriod) => {
        period.isActive = value;

        const update = await updatePeriod(period)
        console.log(update)
    }

    return (
        <Structure title='Todos os períodos'>
            <List>
                {periods.map((e) => (
                    <List.Item
                        title={e.name}
                    >
                       <Typography>{e.name}</Typography> <Switch onChange={event => changePeriod(event, e)} defaultChecked={e.isActive} />
                    </List.Item>
                ))}
            </List>
        </Structure>
    )
}

export default RegistrationPeriod