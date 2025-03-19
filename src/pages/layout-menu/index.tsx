import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button, Layout, theme, Menu, Select } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import getVisibleRoutes from "../../router/routes"; // routes o‘rniga getVisibleRoutes import qilinadi
import { ProfileDropdown } from "@components";

const { Option } = Select;
const { Header, Sider, Content } = Layout;

const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");
  const { i18n, t } = useTranslation();

  // Filtrlangan marshrutlarni olish
  const visibleRoutes:any = getVisibleRoutes();

  useEffect(() => {
    // Hozirgi `pathname` bo‘yicha to‘g‘ri `key` ni topish
    visibleRoutes.forEach((item:any, index:number) => {
      if (item.path === location.pathname) {
        setSelectedKey(index.toString());
      } else if (item.children) {
        item.children.forEach((child:any, childIndex:number) => {
          if (child.path === location.pathname) {
            setSelectedKey(`${index}-${childIndex}`);
          }
        });
      }
    });
  }, [location.pathname, visibleRoutes]); // visibleRoutes qo‘shildi

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          minHeight: "100vh",
          width: "100%",
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "16px 8px" : "20px",
            marginBottom: "16px",
            background: "#001529",
            color: "#fff",
            fontSize: collapsed ? "20px" : "24px",
            fontWeight: "bold",
            letterSpacing: "1px",
            textTransform: "uppercase" as const,
          }}
        >
          KPI
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={visibleRoutes.map((item:any, index:number) => ({
            key: index.toString(),
            icon: item.icon,
            label: item.children ? (
              t(item.title)
            ) : (
              <NavLink to={item.path}>{t(item.title)}</NavLink>
            ),
            children: item.children
              ? item.children.map((child:any, childIndex:number) => ({
                  key: `${index}-${childIndex}`,
                  label: <NavLink to={child.path}>{t(child.title)}</NavLink>,
                }))
              : undefined,
          }))}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 63,
              height: 64,
            }}
          />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "10px",
            }}
          >
            <Select
              defaultValue={language}
              style={{ width: 120, marginRight: 16 }}
              onChange={handleLanguageChange}
              suffixIcon={<GlobalOutlined />}
            >
              <Option value="en">English</Option>
              <Option value="kr">한국어</Option>
            </Select>
            <ProfileDropdown />
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 20,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Index;