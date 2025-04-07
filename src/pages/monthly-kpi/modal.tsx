import {
  Button,
  Form,
  DatePicker,
  Drawer,
  Spin,
  Select,
  Row,
  Col,
  Input,
} from "antd";
import { useTranslation } from "react-i18next";
import { useForm } from "antd/lib/form/Form";
import { ModalPropType } from "@types";
import { useApiMutation, useApiQuery } from "@hooks";
import { useState, useEffect } from "react";
import moment from "moment";
import { MinusOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;
const { TextArea } = Input;

const Index = ({ open, handleCancel, update }: ModalPropType) => {
  const { t } = useTranslation();
  const [form] = useForm();
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  const { mutateAsync: createItem, isPending: isCreating } = useApiMutation<any>({
    url: "monthly-goals",
    method: "POST",
  });

  const { data: yearlyGoals, isLoading: isYearlyGoalsLoading } = useApiQuery<any>({
    url: "yearly-goals",
    method: "GET",
    params: {
      ...(selectedYear ? { year__eq: selectedYear } : {}),
      ...(selectedMonth ? { month__eq: selectedMonth } : {}),
    },
    enabled: !!selectedYear,
  });

  const { data: teamsData, isLoading: isTeamsLoading } = useApiQuery<any>({
    url: "teams",
    method: "GET",
    enabled: true,
  });

  useEffect(() => {
    if (yearlyGoals?.result?.[0]?.year_goal_categories) {
      const allGoalGroups = yearlyGoals.result[0].year_goal_categories.flatMap(
        (item: any) => item.goal_groups || []
      );
      console.log("Setting all goals:", allGoalGroups);
      setGoals(allGoalGroups);
    }
  }, [yearlyGoals]);

  useEffect(() => {
    if (teamsData?.result) {
      console.log("Setting teams:", teamsData.result);
      setTeams(teamsData.result);
    }
  }, [teamsData]);

  const handleSubmit = async (values: any) => {
    try {
      const res = await createItem({
        data: {
          year: Number(values.year.format("YYYY")),
          month_num: values.month ? parseInt(values.month.format("MM")) : null,
          yearly_group_id: values.selectedGoal,
          team_id: values.selectedTeam,
          goal_content: values.goalContent,
          target_values: values.tasks,
        },
      });
      if (res.status === 201) {
        handleCancel();
      }
    } catch (error) {
      console.error(error, "ERROR");
    }
  };

  const handleYearChange = (date: moment.Moment | null) => {
    if (date) {
      const year = date.format("YYYY");
      setSelectedYear(year);
      console.log(`Tanlangan yil: ${year}`);
    } else {
      setSelectedYear(null);
      setSelectedMonth(null);
      setGoals([]);
      form.setFieldsValue({
        selectedGoal: null,
        selectedTeam: null,
        month: null,
        goalContent: null,
      });
    }
  };

  const handleMonthChange = (date: moment.Moment | null) => {
    if (date) {
      const month = date.format("MM");
      setSelectedMonth(month);
      console.log(`Tanlangan oy: ${month}`);
    } else {
      setSelectedMonth(null);
      form.setFieldsValue({ selectedGoal: null });
    }
  };

  const filterTeamOption = (input: string, option?: { children: string }) =>
    (option?.children ?? "").toLowerCase().includes(input.toLowerCase());

  const typeOptions = [
    { value: "text", label: "text" },
    { value: "ratio", label: "ratio" },
    { value: "number", label: "number" },
  ];
  const typeOptionsValue = [
    { value: "more", label: "more" },
    { value: "below", label: "below" },
    { value: "agreement", label: "agreement" },
    { value: "over", label: "over" },
    { value: "under", label: "under" },
  ];

  return (
    <Drawer
      open={open}
      title={t("create")}
      onClose={handleCancel}
      width={650}
      placement="right"
    >
      <Form
        form={form}
        name="roleForm"
        style={{ width: "100%", marginTop: "20px" }}
        onFinish={handleSubmit}
        layout="vertical"
      >
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item
              label={t("year")}
              name="year"
              rules={[{ required: true, message: t("year") }]}
            >
              <DatePicker
                picker="year"
                size="large"
                placeholder={t("year")}
                style={{ width: "100%" }}
                onChange={handleYearChange}
              />
            </Form.Item>

            <Form.Item
              label={t("select_month")}
              name="month"
              rules={[{ required: true, message: t("select_month") }]}
            >
              <DatePicker
                picker="month"
                size="large"
                placeholder={t("select_month")}
                style={{ width: "100%" }}
                onChange={handleMonthChange}
                disabled={!selectedYear}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label={t("select_goal")}
              name="selectedGoal"
              rules={[{ required: true, message: t("select_goal") }]}
            >
              <Select
                size="large"
                placeholder={t("select_goal")}
                style={{ width: "100%" }}
                disabled={!selectedYear || isYearlyGoalsLoading || goals.length === 0}
              >
                {goals.map((goal) => (
                  <Option key={goal.id} value={goal.id}>
                    {goal.header}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={t("select_team")}
              name="selectedTeam"
              rules={[{ required: true, message: t("select_team") }]}
            >
              <Select
                size="large"
                placeholder={t("select_team")}
                style={{ width: "100%" }}
                disabled={isTeamsLoading || teams.length === 0}
                showSearch
                filterOption={filterTeamOption}
                optionFilterProp="children"
              >
                {teams.map((team) => (
                  <Option key={team.id} value={team.id}>
                    {team.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label={t("goal_content")}
          name="goalContent"
          rules={[{ required: true, message: t("goal_content") }]}
        >
          <TextArea
            size="large"
            placeholder={t("goal_content")}
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.List name="tasks">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <Row gutter={10} key={field.key} style={{ marginBottom: 8 }}>
                  <Col span={6}>
                    <Form.Item
                      {...field}
                      name={[field.name, "value_type"]}
                      rules={[{ required: true, message: t("select_type") }]}
                    >
                      <Select
                        size="large"
                        placeholder={t("select_type")}
                        style={{ width: "100%" }}
                      >
                        {typeOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Form.Item shouldUpdate noStyle>
                    {({ getFieldValue }) => {
                      const selectedType = getFieldValue(["tasks", field.name, "value_type"]);
                      const showNumInput = selectedType === "number" || selectedType === "ratio";
                      const showValueNumType = selectedType !== "text";

                      return (
                        <>
                          <Col span={showNumInput ? 8 : showValueNumType ? 10 : 16}>
                            <Form.Item
                              {...field}
                              name={[field.name, "content"]}
                              rules={[{ required: true, message: t("enter_task") }]}
                            >
                              <Input
                                size="large"
                                placeholder={t("enter_task")}
                                style={{ width: "100%" }}
                              />
                            </Form.Item>
                          </Col>
                          {showNumInput && (
                            <Col span={2}>
                              <Form.Item
                                {...field}
                                name={[field.name, "value"]}
                                rules={[{ required: true, message: t("enter_num") }]}
                              >
                                <Input
                                  size="large"
                                  placeholder="..."
                                  style={{ width: "100%" }}
                                />
                              </Form.Item>
                            </Col>
                          )}
                          {showValueNumType && (
                            <Col span={6}>
                              <Form.Item
                                {...field}
                                name={[field.name, "value_num_type"]}
                                rules={[{ required: true, message: t("select_type") }]}
                              >
                                <Select
                                  size="large"
                                  placeholder={t("select_type_value")}
                                  style={{ width: "100%" }}
                                >
                                  {typeOptionsValue.map((option) => (
                                    <Option key={option.value} value={option.value}>
                                      {option.label}
                                    </Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </Col>
                          )}
                        </>
                      );
                    }}
                  </Form.Item>
                  <Col span={2}>
                    <Button
                      size="large"
                      type="dashed"
                      onClick={() => remove(field.name)}
                      icon={<MinusOutlined />}
                      style={{ width: "100%" }}
                    />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                  style={{ width: "100%" }}
                >
                  {t("add_task")}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {(isYearlyGoalsLoading || isTeamsLoading) && (
          <Spin style={{ display: "block", margin: "10px 0" }} />
        )}
        <Form.Item>
          <Button
            size="large"
            style={{ width: "100%" }}
            type="primary"
            className="btn"
            htmlType="submit"
            loading={isCreating}
          >
            {update ? t("update") : t("create")}
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default Index;