import { Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
interface SearchProps {
  params: {
    multi_search: string;
    page: number;
    limit: number;
  };
  setParams: (updater: (prevParams: any) => any) => void; 
}

const Index = (props: SearchProps) => {
  const { t } = useTranslation()
  const { params, setParams } = props;
  const navigate = useNavigate();
  const location = useLocation(); 
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get("search") || ""; 

    setParams((prev) => ({
      ...prev,
      multi_search: searchQuery,
    }));
  }, [location.search, setParams]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchValue = e.target.value;

    setParams((prev) => ({
      ...prev,
      multi_search: newSearchValue,
    }));

    const searchParams = new URLSearchParams(location.search);
    searchParams.set("search", newSearchValue); 
    navigate(`?${searchParams.toString()}`);
  };

  return <Input placeholder={t('search')} value={params.multi_search} onChange={handleChange} className="search-input"/>;
};

export default Index;
