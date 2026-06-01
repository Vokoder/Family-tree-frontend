import { useEffect } from 'react';
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  Position,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';

import dagre from 'dagre';

import { REL_TRANSLATIONS } from '../../constants/constants';
import type { TreeData } from '../../types/tree.type';
import styles from './tree-render.module.css';

export interface PersonNodeData {
  label: string;
  gender: boolean;
  isRoot: boolean;
  [key: string]: unknown;
}

export type PersonNode = Node<PersonNodeData>;

export const getLayoutedElements = (nodes: PersonNode[], edges: Edge[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 150, ranksep: 100 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 80 });
  });

  edges.forEach((edge) => {
    const isHorizontal = edge.data?.isHorizontal;
    dagreGraph.setEdge(edge.source, edge.target, {
      minlen: isHorizontal ? 0 : 1,
      weight: isHorizontal ? 2 : 1,
    });
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: Position.Top,
      sourcePosition: Position.Bottom,
      position: {
        x: nodeWithPosition.x - 90,
        y: nodeWithPosition.y - 40,
      },
    };
  });
};

type TreeDataProps = {
  data: TreeData;
};

export const TreeRender = ({ data }: TreeDataProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    const initialNodes = data.persons.map((p) => ({
      id: p.id,
      data: {
        label: `${p.firstName} ${p.lastName}`,
        gender: p.gender,
        isRoot: p.id === data.rootId,
      },
      position: { x: 0, y: 0 },
      style: {
        background: p.gender ? '#1677ff' : '#eb2f96',
        border: p.id === data.rootId ? '2px solid #ff9800' : '1px solid #90caf9',
        borderRadius: '8px',
        width: 180,
      },
    }));

    const initialEdges = data.relations.map((rel) => {
      const typeInfo = data.types.find((t) => t.id === rel.relationId);
      const typeId = typeInfo?.id || '';
      const isHorizontal = typeId === 'sibling' || typeId === 'spouse';
      const isChildToParentInDB = typeInfo ? !typeInfo.isInverted : true;
      const needsDisplayInversion = !isHorizontal && isChildToParentInDB;

      const translation = REL_TRANSLATIONS[typeId];
      const labelText = translation ? (needsDisplayInversion ? translation.inverted : translation.direct) : typeId;

      return {
        id: rel.id,
        source: isHorizontal ? rel.sourcePersonId : needsDisplayInversion ? rel.targetPersonId : rel.sourcePersonId,
        target: isHorizontal ? rel.targetPersonId : needsDisplayInversion ? rel.sourcePersonId : rel.targetPersonId,
        label: labelText,
        data: { isHorizontal },
        type: isHorizontal ? 'straight' : 'smoothstep',
      };
    });

    const layouted = getLayoutedElements(initialNodes, initialEdges);
    setNodes(layouted);
    setEdges(initialEdges);
  }, [data, setNodes, setEdges]);

  return (
    <div className={styles.container}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} fitView>
        <Background gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
};
