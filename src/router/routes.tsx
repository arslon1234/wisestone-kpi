import { AppstoreOutlined, SettingOutlined, BarChartOutlined } from "@ant-design/icons";
export const routes = [
  {
    title: "dashboard",
    path: "/layout",
    icon: <AppstoreOutlined />,
  },
  {
    title: "yearly_kpi",
    path: "/layout/yearly-kpi",
    icon: <BarChartOutlined />,
  },
  {
    title: "settings",
    icon: <SettingOutlined />,
    children: [
      {
        path: "/layout/role",
        title: "role",
      },
      {
        path: "/layout/user",
        title: "user",
      },
      {
        path: "/layout/team",
        title: "team",
      },
    ],
  },
];
