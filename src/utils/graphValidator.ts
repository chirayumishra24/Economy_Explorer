import { CONNECTIONS } from '../data/connections';
import { ECONOMIC_NODES } from '../data/nodes';

export interface ValidationResult {
  isValid: boolean;
  message: string;
  violatedEdge?: { from: string; to: string };
}

/**
 * Validates whether an ordered list of node IDs satisfies all dependency edges.
 * For any dependency edge A -> B, A must appear before B in the list.
 */
export function validateDependencyChain(
  orderedNodeIds: string[],
  requiredEdges: Array<{ from: string; to: string }>
): ValidationResult {
  if (orderedNodeIds.length === 0) {
    return { isValid: false, message: 'Please arrange the steps in order.' };
  }

  const positions = new Map<string, number>();
  orderedNodeIds.forEach((id, index) => {
    positions.set(id, index);
  });

  for (const edge of requiredEdges) {
    const fromIdx = positions.get(edge.from);
    const toIdx = positions.get(edge.to);

    // If both nodes are part of this chain, verify precedence
    if (fromIdx !== undefined && toIdx !== undefined) {
      if (fromIdx >= toIdx) {
        const fromNode = ECONOMIC_NODES.find(n => n.id === edge.from);
        const toNode = ECONOMIC_NODES.find(n => n.id === edge.to);
        const conn = CONNECTIONS.find(c => c.from === edge.from && c.to === edge.to);

        const feedback = conn?.wrongLinkFeedback ||
          `${fromNode?.label || 'Source'} must come before ${toNode?.label || 'Destination'} in the economic chain.`;

        return {
          isValid: false,
          message: feedback,
          violatedEdge: edge
        };
      }
    }
  }

  return {
    isValid: true,
    message: 'Excellent! Every stage in the economic chain follows a logical sequence.'
  };
}

/**
 * Validates a repaired connection in "Fix the Economy".
 * Returns whether the proposed connection matches a legitimate link in the economy.
 */
export function validateProposedConnection(fromId: string, toId: string): {
  isValid: boolean;
  connection?: (typeof CONNECTIONS)[0];
  feedback: string;
} {
  const match = CONNECTIONS.find(c => c.from === fromId && c.to === toId);
  if (match) {
    return {
      isValid: true,
      connection: match,
      feedback: match.rationale
    };
  }

  // Check reverse direction
  const reverseMatch = CONNECTIONS.find(c => c.from === toId && c.to === fromId);
  if (reverseMatch) {
    return {
      isValid: false,
      feedback: `The direction is reversed! Goods flow from ${toId} to ${fromId}, not the other way around.`
    };
  }

  return {
    isValid: false,
    feedback: 'This link does not make economic sense in the chain. Think about where raw materials come from and where finished goods go.'
  };
}
