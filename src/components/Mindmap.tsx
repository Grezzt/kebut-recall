"use client";

import { useEffect, useRef, useMemo } from "react";
import type { MindmapNode } from "@/types";

interface Props {
  nodes: MindmapNode[];
}

/**
 * Convert flat MindmapNode[] (with parent_id) into Mermaid mindmap syntax.
 * Example output:
 *   mindmap
 *     root((Sistem Basis Data))
 *       SQL
 *         DDL
 *           CREATE
 */
function buildMermaidSyntax(data: MindmapNode[]): string {
  // Build children map
  const childrenMap: Record<string, string[]> = {};
  const rootNodes: string[] = [];

  // Filter invalid nodes that has no ID
  const validData = data.filter(n => n?.id);

  validData.forEach((n) => {
    // If parent_id is empty, "root", or points to itself, it's a root node
    if (!n.parent_id || n.parent_id === "root" || n.parent_id === n.id) {
       // Only add to root if it's not already there
       if (!rootNodes.includes(n.id)) rootNodes.push(n.id);
    } else {
      if (!childrenMap[n.parent_id]) childrenMap[n.parent_id] = [];
      childrenMap[n.parent_id].push(n.id);
    }
  });

  const nodeMap: Record<string, MindmapNode> = {};
  validData.forEach((n) => (nodeMap[n.id] = n));

  function sanitizeLabel(text: string) {
    if (!text) return "Untitled";
    // Mermaid mindmap breaks on certain characters like newlines, quotes, or unescaped parentheses
    // Best practice for Mindmaps in a modern Mermaid.js is to replace them with space and wrap in backticks or standard shapes
    return text.replace(/[\n\r`""''[\]()]/g, " ").trim();
  }

  function buildLines(nodeId: string, depth: number, visited: Set<string>): string[] {
    // Prevent infinite cyclic loops in case AI hallucinated self-referencing nodes
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);

    const node = nodeMap[nodeId];
    if (!node) return [];

    // Mermaid mindmap requires exact 2 or 4 spaces indentation per depth level
    // depth 1 = master root (2 spaces), depth 2 = sub root (4 spaces), etc.
    const indent = "  ".repeat(depth);
    const safeLabel = sanitizeLabel(node.label);

    // Default rounded rect [label] or basic string
    let labelFmt = `${node.id}["${safeLabel}"]`;
    if (depth === 1) { // though with forced master root, AI nodes start at depth 2
      labelFmt = `${node.id}(("${safeLabel}"))`;
    }

    const lines = [`${indent}${labelFmt}`];

    (childrenMap[nodeId] ?? []).forEach((childId) => {
      lines.push(...buildLines(childId, depth + 1, new Set(visited)));
    });
    return lines;
  }

  // Force a single Master Root to prevent "There can be only one root" error
  const allLines = [
    "mindmap",
    "  MasterRoot((\"Materi Inti\"))"
  ];

  // Render all forest/trees from the AI under the MasterRoot (depth 2)
  rootNodes.forEach((rootId) => {
    allLines.push(...buildLines(rootId, 2, new Set()));
  });

  return allLines.join("\n");
}

export default function Mindmap({ nodes }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const syntax = useMemo(() => buildMermaidSyntax(nodes), [nodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    const render = async () => {
      const mermaid = (await import("mermaid")).default;

      mermaid.initialize({
        startOnLoad: false,
        theme: "default",
        mindmap: {
          padding: 20,
        },
        themeVariables: {
          // Mindmap uses these for branch coloring
          primaryColor: "#3b30d4",
          primaryTextColor: "#fff",
          primaryBorderColor: "#3b30d4",
          lineColor: "#aaa",
          nodeBorder: "#ccc",
          clusterBkg: "#f9f9f9",
        },
      });

      const id = `mindmap-${Date.now()}`;
      const { svg } = await mermaid.render(id, syntax);

      if (containerRef.current) {
        containerRef.current.innerHTML = svg;
        // Make SVG responsive
        const svgEl = containerRef.current.querySelector("svg");
        if (svgEl) {
          svgEl.style.width = "100%";
          svgEl.style.height = "100%";
          svgEl.removeAttribute("width");
          svgEl.removeAttribute("height");
        }
      }
    };

    render().catch(console.error);
  }, [syntax]);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div
        ref={containerRef}
        style={{ minHeight: "520px" }}
        className="w-full flex items-center justify-center p-4 text-sm text-gray-400"
      >
        Memuat mind-map...
      </div>
    </div>
  );
}
