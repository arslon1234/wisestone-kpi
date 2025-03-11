import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import {TeamKPI,EmployeeKPI} from '@components'
import { useState } from 'react';
const Index = () => {
  const [type,setType] = useState('team')
  const onChange = (key: string) => {
    setType(key)
  };
  
  const items: TabsProps['items'] = [
    {
      key: 'team',
      label: 'Team',
      children: <TeamKPI type={type}/>,
    },
    {
      key: 'employee',
      label: 'Employee',
      children: <EmployeeKPI type={type}/>,
    }
  ];
  return (
    <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
  )
};

export default Index;