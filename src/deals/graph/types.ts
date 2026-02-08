export interface GraphNode {
  id: string;
  label: string;
  type: 'account' | 'deal' | 'site' | 'stakeholder' | 'milestone' | 'stage';
  metadata: Record<string, string>;
  style?: {
    fill?: string;
    stroke?: string;
    shape?: 'rectangle' | 'rounded' | 'diamond' | 'circle' | 'hexagon';
  };
}

export interface GraphEdge {
  sourceId: string;
  targetId: string;
  label?: string;
  style?: 'solid' | 'dashed' | 'dotted' | 'thick';
}

export interface SubGraph {
  id: string;
  label: string;
  nodeIds: string[];
}

export interface Graph {
  title?: string;
  direction: 'LR' | 'TD' | 'BT' | 'RL';
  nodes: GraphNode[];
  edges: GraphEdge[];
  subGraphs?: SubGraph[];
}
