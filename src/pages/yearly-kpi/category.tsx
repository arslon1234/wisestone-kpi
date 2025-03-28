import { Button, Collapse, Card, Spin, Empty } from "antd";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useApiQuery, useApiMutation } from "@hooks";
import Modal from "./category-modal";
import GoalModal from "./goal-modal";
import { getItem } from "@utils/storage-service";
import { useParams } from "react-router-dom";

const Index = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const super_user = getItem("super");

  const { data: categoriesData, isLoading: isCategoriesLoading } = useApiQuery<any>({
    url: "yearly-goals/categories",
    method: "GET",
    id,
  });

  const { mutate: deleteGroup } = useApiMutation({
    url: "yearly-goals/categories/groups",
    method: "DELETE",
  });

  const fetchGroups = async (key: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_URL}/yearly-goals/categories/groups/${key}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getItem("access_token")}`,
          },
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error("Failed to fetch groups");

      console.log(`Groups data for ${key}:`, data.result);
      data.result.forEach((group: any, index: number) => {
        console.log(`Group ${index} in ${key}:`, group);
      });

      setGroups(data.result || []);
    } catch (error) {
      console.error(`Error fetching groups for ${key}:`, error);
      setGroups([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGroup = (groupId: any) => {
    deleteGroup({ id: groupId }, {
      onSuccess: () => {
        setGroups((prev) => prev.filter((group) => group.id !== groupId));
      },
    });
  };

  const handleCancel = () => {
    setModalVisible(false);
    setGoalModalVisible(false);
    setSelectedCategory(null);
  };

  const handleAddGoal = (categoryId: any) => {
    setSelectedCategory(categoryId);
    setGoalModalVisible(true);
  };

  const handleCollapseChange = (keys: string[]) => {
    setExpandedKeys(keys);
    const newKeys = keys.filter((key) => !expandedKeys.includes(key));
    if (newKeys.length > 0) {
      fetchGroups(newKeys[0]); // Yangi ochilgan key uchun so‘rov
    }
  };

  useEffect(() => {
    if (expandedKeys.length > 0 && groups.length === 0 && !loading) {
      fetchGroups(expandedKeys[expandedKeys.length - 1]);
    }
  }, [expandedKeys]);

  const items = categoriesData?.result?.map((item: any) => ({
    key: item.id,
    label: item?.category?.name,
    children: (
      <div>
        {loading ? (
          <Spin />
        ) : groups.length > 0 ? (
          groups.map((group: any) => (
            <Card
              key={group.id}
              title={group.header}
              style={{ marginBottom: 10 }}
              extra={
                super_user === "true" && (
                  <Button
                    type="primary"
                    danger
                    size="small"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    {t("delete")}
                  </Button>
                )
              }
            >
              <p>{group.description || t("no_description")}</p>
              <p>({t('total_ratio')} {group?.percent}%)</p>
            </Card>
          ))
        ) : (
          <Empty description={t("no_criteria_found")} />
        )}
        {super_user === "true" && (
          <>
            <Button
              type="primary"
              onClick={() => handleAddGoal(item.id)}
              style={{ marginRight: 10 }}
            >
              {t("add_goal")}
            </Button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <>
      <Modal open={modalVisible} update={null} handleCancel={handleCancel} />
      <GoalModal
        open={goalModalVisible}
        categoryId={selectedCategory}
        handleCancel={handleCancel}
      />
      <div className="wrapper">
        <h1>{t("cretion_process")}</h1>
        {super_user === "true" && (
          <Button
            type="primary"
            className="btn"
            onClick={() => setModalVisible(true)}
          >
            {t("create")}
          </Button>
        )}
      </div>

      {isCategoriesLoading ? (
        <Spin />
      ) : (
        <Collapse
          items={items}
          onChange={handleCollapseChange}
          accordion // Accordion xususiyati qo‘shildi
        />
      )}
    </>
  );
};

export default Index;