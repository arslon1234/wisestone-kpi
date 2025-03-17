import { AppstoreOutlined, SettingOutlined} from "@ant-design/icons";
// BarChartOutlined, SyncOutlined
export const routes = [
  {
    title: "dashboard",
    path: "/layout",
    icon: <AppstoreOutlined />,
  },
  // {
  //   title: "yearly_kpi",
  //   path: "/layout/yearly-kpi",
  //   icon: <BarChartOutlined />,
  // },
  // {
  //   title: "establish_progress",
  //   path: "/layout/establish-progress",
  //   icon: <SyncOutlined />,
  // },
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
