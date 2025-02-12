import { AppstoreOutlined, SettingOutlined } from "@ant-design/icons";
export const routes = [
  {
    title: "home",
    path: "/layout",
    icon: <AppstoreOutlined />,
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
    ],
  },
];
