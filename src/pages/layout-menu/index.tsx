import { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { useTranslation } from 'react-i18next';

import { Button, Layout, theme, Menu, Modal, Select } from "antd";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { routes } from "../../router/routes";
const { Option } = Select
// import { removeAccessToken } from "@utils/token-service";
// import MainLogo from "../../assets/logo.svg";
// import LogoTitle from '../../assets/logo_title.svg'
const { Header, Sider, Content } = Layout;

const Index = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem('lang') || 'en') 
  const { i18n } = useTranslation();
  useEffect(() => {
    // Find the active route and set the selected key based on the current path
    const currentRouteIndex = routes.findIndex(
      route => route.path === location.pathname
    );
    console.log(currentRouteIndex);
    if (currentRouteIndex !== -1) {
      setSelectedKey(currentRouteIndex.toString());
    }
  }, [location.pathname]);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const navigate = useNavigate();
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    console.log(value)
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
    // Here you would typically call a function to change the app's language
    // For example: changeAppLanguage(value);
  }
  const handleLogout = () => {
    Modal.confirm({
      title: "Do you want to logout?",
      icon: <LogoutOutlined />,
      content: "Your session will be closed.",
      onOk() {
        navigate("/");
        // removeAccessToken()
      },
      okButtonProps: {
        style: {
          backgroundColor: "#d55200", 
          borderColor: "#ff4d4f", 
        },
      },
      okText: "Confirm", 
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          minHeight: "100vh",
          width: "400px",
          overflow: "auto",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        {/* <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "space-around",
            padding: collapsed ? "16px 8px" : "20px",
            marginBottom: "16px",
          }}
        >
          <img
            src={MainLogo}
            alt="Main Logo"
            style={{ width: collapsed ? 40 : 48 }}
          />
          {!collapsed && (
            <img
            src={LogoTitle}
            alt="Logo title"
            // style={{ width: collapsed ? 32 : 48 }}
          />
          )}
        </div> */}
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]} // Dynamically set selected keys
          items={routes.map((item, index) => ({
            key: index.toString(), // Use string keys for consistency
            icon: item.icon,
            label: <NavLink to={item.path}>{item.title}</NavLink>,
          }))}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        {/* <Header
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
          <Button
            type="text"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{ marginRight: "16px" }}
          >
            Logout
          </Button>
        </Header> */}
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
          <div style={{ display: "flex", alignItems: "center" }}>
            <Select
              defaultValue={language}
              style={{ width: 120, marginRight: 16 }}
              onChange={handleLanguageChange}
              suffixIcon={<GlobalOutlined />}
            >
              <Option value="en">English</Option>
              <Option value="ko">한국어</Option>
            </Select>
            <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} style={{ marginRight: "16px" }}>
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
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