import { Select } from 'antd';

import type { Person } from '../types/person.type';

interface PersonSelectProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  allPersons: Person[];
  onSearch: (name: string) => void;
}

export const PersonSelect = ({ value, onChange, placeholder, allPersons, onSearch }: PersonSelectProps) => {
  return (
    <Select
      showSearch
      value={value}
      placeholder={placeholder}
      defaultActiveFirstOption={false}
      filterOption={false}
      onSearch={onSearch}
      onChange={onChange}
      notFoundContent={null}
      allowClear
    >
      {allPersons.map((p) => (
        <Select.Option key={p.id} value={p.id}>
          {`${p.lastName} ${p.firstName} ${p.middleName || ''}`}
        </Select.Option>
      ))}
    </Select>
  );
};
