import React from "react";
import { Line, Bar, Pie, Area, Column, Scatter } from "@ant-design/charts";
import { Card } from "antd"; // Ant Design Card komponenti uchun

// Ma'lumotlar uchun interfeyslar
interface ChartData {
  year?: string;
  category?: string;
  type?: string;
  value: number;
  month?: string;
}

// Dashboard komponenti
const Index: React.FC = () => {
  // Line Graph ma'lumotlari
  const lineData: ChartData[] = [
    { year: "2020", value: 3 },
    { year: "2021", value: 4 },
    { year: "2022", value: 3.5 },
    { year: "2023", value: 5 },
    { year: "2024", value: 4.9 },
    { year: "2025", value: 6 },
  ];

  const lineConfig = {
    data: lineData,
    xField: "year",
    yField: "value",
    smooth: true, // Egri chiziq uchun
    point: { size: 5, shape: "circle", style: { fill: "#fff", stroke: "#1890ff" } },
    lineStyle: { stroke: "#1890ff", lineWidth: 2 },
    height: 250,
  };

  // Bar Chart ma'lumotlari
  const barData: ChartData[] = [
    { category: "A", value: 10 },
    { category: "B", value: 20 },
    { category: "C", value: 15 },
    { category: "D", value: 25 },
  ];

  const barConfig = {
    data: barData,
    xField: "category",
    yField: "value",
    color: "#52c41a",
    label: { position: "top", style: { fill: "#000", fontSize: 12 } },
    barWidthRatio: 0.6,
    height: 250,
  };

  // Pie Chart ma'lumotlari
  const pieData: ChartData[] = [
    { type: "Category 1", value: 27 },
    { type: "Category 2", value: 25 },
    { type: "Category 3", value: 18 },
    { type: "Category 4", value: 15 },
    { type: "Category 5", value: 10 },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    innerRadius: 0.6, // Donut chart effekti uchun
    label: {
      type: "inner",
      offset: "-50%",
      content: ({ percent }: { percent: number }) => `${(percent * 100).toFixed(0)}%`,
      style: { fontSize: 14, textAlign: "center" as const },
    },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
    height: 250,
  };

  // Area Chart ma'lumotlari
  const areaData: ChartData[] = [
    { month: "Jan", value: 10 },
    { month: "Feb", value: 15 },
    { month: "Mar", value: 12 },
    { month: "Apr", value: 18 },
    { month: "May", value: 20 },
  ];

  const areaConfig = {
    data: areaData,
    xField: "month",
    yField: "value",
    smooth: true,
    areaStyle: { fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff" }, // Gradient effekt
    height: 250,
  };

  // Column Chart ma'lumotlari
  const columnData: ChartData[] = [
    { category: "Product A", value: 30 },
    { category: "Product B", value: 40 },
    { category: "Product C", value: 35 },
  ];

  const columnConfig = {
    data: columnData,
    xField: "category",
    yField: "value",
    color: "#ff4d4f",
    columnWidthRatio: 0.5,
    label: { position: "middle", style: { fill: "#fff" } },
    height: 250,
  };

  // Scatter Chart ma'lumotlari
  const scatterData: ChartData[] = [
    { year: "2020", value: 3 },
    { year: "2021", value: 4.5 },
    { year: "2022", value: 3.8 },
    { year: "2023", value: 5.2 },
    { year: "2024", value: 4.7 },
  ];

  const scatterConfig = {
    data: scatterData,
    xField: "year",
    yField: "value",
    size: 6,
    shape: "circle",
    color: "#faad14",
    pointStyle: { fillOpacity: 0.8 },
    height: 250,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>Dashboard</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {/* Line Graph */}
        <Card title="Line Graph" bordered={false}>
          <Line {...lineConfig} />
        </Card>

        {/* Bar Chart */}
        <Card title="Bar Chart" bordered={false}>
          <Bar {...barConfig} />
        </Card>

        {/* Pie Chart */}
        <Card title="Pie Chart" bordered={false}>
          <Pie {...pieConfig} />
        </Card>

        {/* Area Chart */}
        <Card title="Area Chart" bordered={false}>
          <Area {...areaConfig} />
        </Card>

        {/* Column Chart */}
        <Card title="Column Chart" bordered={false}>
          <Column {...columnConfig} />
        </Card>

        {/* Scatter Chart */}
        <Card title="Scatter Chart" bordered={false}>
          <Scatter {...scatterConfig} />
        </Card>
      </div>
    </div>
  );
};

export default Index;