import type { Graph, GraphNode, GraphEdge, SubGraph } from './types.js';

function escapeLabel(text: string): string {
  return text.replace(/"/g, '#quot;').replace(/[[\](){}]/g, '');
}

function nodeShape(node: GraphNode): string {
  const label = escapeLabel(node.label);
  const shape = node.style?.shape || 'rectangle';
  switch (shape) {
    case 'rounded':
      return `${node.id}("${label}")`;
    case 'diamond':
      return `${node.id}{"${label}"}`;
    case 'circle':
      return `${node.id}(("${label}"))`;
    case 'hexagon':
      return `${node.id}{{"${label}"}}`;
    default:
      return `${node.id}["${label}"]`;
  }
}

function edgeArrow(edge: GraphEdge): string {
  const label = edge.label ? `|${escapeLabel(edge.label)}|` : '';
  switch (edge.style) {
    case 'dashed':
      return `${edge.sourceId} -.${label}-> ${edge.targetId}`;
    case 'dotted':
      return `${edge.sourceId} -.${label}.- ${edge.targetId}`;
    case 'thick':
      return `${edge.sourceId} ==${label}==> ${edge.targetId}`;
    default:
      return `${edge.sourceId} --${label}--> ${edge.targetId}`;
  }
}

function nodeStyle(node: GraphNode): string | null {
  if (!node.style?.fill && !node.style?.stroke) return null;
  const parts: string[] = [];
  if (node.style.fill) parts.push(`fill:${node.style.fill}`);
  if (node.style.stroke) parts.push(`stroke:${node.style.stroke}`);
  return `style ${node.id} ${parts.join(',')}`;
}

export function generateFlowchart(graph: Graph): string {
  const lines: string[] = [];
  lines.push(`flowchart ${graph.direction}`);

  if (graph.title) {
    lines.push(`  %% ${graph.title}`);
  }

  // Render subgraphs first
  const nodesInSubgraphs = new Set<string>();
  if (graph.subGraphs) {
    for (const sg of graph.subGraphs) {
      lines.push(`  subgraph ${sg.id}["${escapeLabel(sg.label)}"]`);
      for (const nodeId of sg.nodeIds) {
        const node = graph.nodes.find(n => n.id === nodeId);
        if (node) {
          lines.push(`    ${nodeShape(node)}`);
          nodesInSubgraphs.add(nodeId);
        }
      }
      lines.push('  end');
    }
  }

  // Render nodes not in subgraphs
  for (const node of graph.nodes) {
    if (!nodesInSubgraphs.has(node.id)) {
      lines.push(`  ${nodeShape(node)}`);
    }
  }

  // Render edges
  for (const edge of graph.edges) {
    lines.push(`  ${edgeArrow(edge)}`);
  }

  // Render styles
  for (const node of graph.nodes) {
    const style = nodeStyle(node);
    if (style) lines.push(`  ${style}`);
  }

  return lines.join('\n');
}

export function generateGantt(
  title: string,
  sections: Array<{ name: string; tasks: Array<{ name: string; start: string; end?: string; done?: boolean }> }>
): string {
  const lines: string[] = [];
  lines.push('gantt');
  lines.push(`  title ${title}`);
  lines.push('  dateFormat YYYY-MM-DD');

  for (const section of sections) {
    lines.push(`  section ${section.name}`);
    for (const task of section.tasks) {
      const status = task.done ? 'done,' : '';
      const end = task.end || 'active';
      lines.push(`    ${task.name} :${status} ${task.start}, ${end}`);
    }
  }

  return lines.join('\n');
}
