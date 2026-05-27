import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { message } from 'antd';

import { LoadingWrapper } from '../../components/loading-wrapper/loading-wrapper';
import { TreeRender } from '../../components/tree-render/tree-render';
import { getTreeRequest } from '../../modules/fetch-api';
import type { TreeData } from '../../types/tree.type';

export const Tree = () => {
  const { '*': personId } = useParams();
  const [treeData, setTreeData] = useState<TreeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getTreeData = async () => {
    setIsLoading(true);
    if (personId) {
      const data = await getTreeRequest(personId);
      setTreeData(data);
    } else {
      message.error('Нужен путь');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getTreeData();
  }, []);

  return (
    <LoadingWrapper isLoading={isLoading} skeletonRows={50}>
      {treeData ? <TreeRender data={treeData} /> : <h1>no data</h1>}
    </LoadingWrapper>
  );
};
