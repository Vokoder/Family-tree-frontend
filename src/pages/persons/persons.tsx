import { Layout, Typography } from 'antd';

import { GoToProfileButton } from '../../components/go-to-profile-button';
import { SearchPersons } from '../../components/search-persons/search-persons';
import { WEBSITE_TITLE } from '../../constants/constants';
import styles from './persons.module.css';

const { Header } = Layout;
const { Title } = Typography;

export const Persons = () => {
  return (
    <Layout className={styles.main_layout}>
      {/* Шапка */}
      <Header className={styles.header}>
        <Title level={3} className={styles.title}>
          {WEBSITE_TITLE}
        </Title>
        <GoToProfileButton />
      </Header>
      <SearchPersons />
    </Layout>
  );
};
