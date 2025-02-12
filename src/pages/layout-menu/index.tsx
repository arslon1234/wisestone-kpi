import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Button, Layout, theme, Menu, Select } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
const { Option } = Select;
const { Header, Sider, Content } = Layout;
import { ProfileDropdown } from "@components";
const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState(
    localStorage.getItem("lang") || "en"
  );
  const { i18n, t } = useTranslation();
  useEffect(() => {
    // Hozirgi `pathname` bo‘yicha to‘g‘ri `key` ni topish
    routes.forEach((item, index) => {
      if (item.path === location.pathname) {
        setSelectedKey(index.toString());
      } else if (item.children) {
        item.children.forEach((child, childIndex) => {
          if (child.path === location.pathname) {
            setSelectedKey(`${index}-${childIndex}`);
          }
        });
      }
    });
  }, [location.pathname]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    console.log(value);
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
            justifyContent: collapsed ? "center" : "space-around",
            padding: collapsed ? "16px 8px" : "20px",
            marginBottom: "16px",
          }}
        ></div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={routes.map((item, index) => ({
            key: index.toString(),
            icon: item.icon,
            label: item.children ? (
              t(item.title)
            ) : (
              <NavLink to={item.path}>{t(item.title)}</NavLink>
            ),
            children: item.children
              ? item.children.map((child, childIndex) => ({
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
