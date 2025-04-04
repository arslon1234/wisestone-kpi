import { Dropdown, Avatar, Modal } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { removeItem } from "@utils/storage-service";

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const onProfileClick = () => {
    navigate("/layout/profile"); 
  };

  const onSettingsClick = () => {
    navigate("/layout/role");
  };

  const onLogout = () => {
    Modal.confirm({
      title: t("logout_title"),
      icon: <LogoutOutlined />,
      content: t("logout_desc"),
      onOk() {
        navigate("/");
        removeItem("access_token");
        removeItem('user_id')
        removeItem('super')
      },
      onCancel() {
        console.log("Cancel clicked");
      },
      okButtonProps: {
        style: {
          backgroundColor: "#d55200",
          borderColor: "#ff4d4f",
        },
      },
      okText: t("confirm"),
      cancelText: t("cancel"),
    });
  };

  const items: MenuProps["items"] = [
    {
      key: "profile",
      label: t("profile"),
      icon: <UserOutlined />,
      onClick: onProfileClick,
    },
    {
      key: "settings",
      label: t("settings"),
      icon: <SettingOutlined />,
      onClick: onSettingsClick,
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: t("logout"),
      icon: <LogoutOutlined />,
      onClick: onLogout,
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={["click"]}>
      <Avatar
        style={{ backgroundColor: "#87d068", cursor: "pointer" }}
        icon={<UserOutlined />}
      />
    </Dropdown>
  );
};

export default ProfileDropdown;
