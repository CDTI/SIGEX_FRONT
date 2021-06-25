import React from 'react'
import { Table } from 'antd'

interface Props {
    columns: any,
    data: any[],
    pagination?: false
}

const MyTable: React.FC<Props> = ({ columns, data, pagination }) =>
{
    return <Table pagination={pagination} columns={columns} dataSource={data} />;
}

export default MyTable