import { AppstoreOutlined, SettingOutlined, PieChartOutlined } from "@ant-design/icons";

// localStorage dan status olish uchun yordamchi funksiya
const getUserStatus = () => {
  return localStorage.getItem("super");
};

// Marshrutlar massivi
export const routes = [
  {
    title: "dashboard",
    path: "/layout",
    icon: <AppstoreOutlined />,
    visible: () => true, // Har doim ko‘rinadi
  },
  {
    title: "kpi_process",
    icon: <PieChartOutlined />,
    visible: () => true, // Admin va user uchun
    children: [
      {
        path: "/layout/yearly-kpi",
        title: "yearly_kpi",
        visible: () => true,
      },
      {
        path: "/layout/monthly-kpi",
        title: "monthly_kpi",
        visible: () => true,
      },
      {
        path: "/layout/Approved",
        title: "approved",
        visible: () => true,
      },
    ],
  },
  {
    title: "settings",
    icon: <SettingOutlined />,
    visible: () => true, // Admin va user uchun
    children: [
      {
        path: "/layout/role",
        title: "role",
        visible: () => true, // Faqat admin uchun
      },
      {
        path: "/layout/user",
        title: "user",
        visible: () => true, // Faqat admin uchun
      },
      {
        path: "/layout/team",
        title: "team",
        visible: () => getUserStatus() === "true", 
      },
      {
        path: "/layout/team-members",
        title: "team_members",
        visible: () => getUserStatus() === "false", 
      },
    ],
  },
];

// Ko‘rinadigan marshrutlarni filtrlaydigan funksiya
export const getVisibleRoutes = () => {
  const filterRoutes:any = (routeList: typeof routes) => {
    return routeList
      .filter((route) => (route.visible ? route.visible() : true))
      .map((route) => {
        if (route.children) {
          return {
            ...route,
            children: filterRoutes(route.children),
          };
        }
        return route;
      });
  };
  return filterRoutes(routes);
};

export default getVisibleRoutes;