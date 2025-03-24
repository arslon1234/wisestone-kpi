import { Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

interface SearchProps {
  searchKey: string;
  params: Record<string, any>;
  setParams: (updater: (prevParams: any) => any) => void;
}

const Index = (props: SearchProps) => {
  const { t } = useTranslation();
  const { params, setParams, searchKey } = props;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get(searchKey) || "";

    setParams((prev) => ({
      ...prev,
      [searchKey]: searchQuery,
    }));
  }, [location.search, setParams, searchKey]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value;

    setParams((prev) => ({
      ...prev,
      [searchKey]: newSearchValue,
    }));

    const searchParams = new URLSearchParams(location.search);
    searchParams.set(searchKey, newSearchValue);
    navigate(`${location.pathname}?${searchParams.toString()}`); // To‘liq yo‘l bilan yangilash
  };

  return (
    <Input
      placeholder={t("search")}
      value={params[searchKey] || ""}
      onChange={handleChange}
      className="search-input"
    />
  );
};

export default Index;