import { useTranslation } from 'react-i18next';

const Index = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('welcome')}</h1>
      <h1>Home</h1>
    </div>
  )
}

export default Index
