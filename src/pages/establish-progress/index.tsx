import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import {TeamKPI,EmployeeKPI} from '@components'
const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps['items'] = [
  {
    key: '1',
    label: 'Team',
    children: <TeamKPI/>,
  },
  {
    key: '2',
    label: 'Employee',
    children: <EmployeeKPI/>,
  }
];

const Index = () => <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;

export default Index;