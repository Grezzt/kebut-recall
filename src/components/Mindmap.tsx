"use client";

import { useEffect, useRef, useMemo, useState } from "react";
import type { MindmapNode } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  nodes: MindmapNode[];
  onNodeClick?: (node: MindmapNode) => void;
}

/**
 * Convert flat MindmapNode[] (with parent_id) into Mermaid mindmap syntax.
 */
function buildMermaidSyntax(data: MindmapNode[]): string {
  const validData = data.filter((n) => n?.id);

  const nodeMap: Record<string, MindmapNode> = {};
  validData.forEach((n) => (nodeMap[n.id] = n));

  const childrenMap: Record<string, string[]> = {};
  const rootNodes: string[] = [];

  validData.forEach((n) => {
    let parent = n.parent_id;

    // Jika node tidak memiliki parent dan bukan "root", arahkan ke "root"
    if ((!parent || parent.trim() === "") && n.id !== "root") {
      parent = "root";
    }

    if (!parent || parent === "none" || parent === n.id || !nodeMap[parent]) {
      if (!rootNodes.includes(n.id)) rootNodes.push(n.id);
    } else {
      if (!childrenMap[parent]) childrenMap[parent] = [];
      childrenMap[parent].push(n.id);
    }
  });

  function sanitizeLabel(text: string) {
    if (!text) return "Untitled";
    return text.replace(/[\n\r`"''[\]()]/g, " ").trim();
  }

  function buildLines(nodeId: string, depth: number, visited: Set<string>): string[] {
    if (visited.has(nodeId)) return [];
    visited.add(nodeId);

    const node = nodeMap[nodeId];
    if (!node) return [];

    const indent = "  ".repeat(depth);
    const safeLabel = sanitizeLabel(node.label) || "Untitled";

    let labelFmt = `${node.id.replace(/[^a-zA-Z0-9]/g, "")}["${safeLabel}"]`;
    if (depth === 1) {
      labelFmt = `${node.id.replace(/[^a-zA-Z0-9]/g, "")}(("${safeLabel}"))`;
    }

    let level = depth - 1;
    if (level > 3) level = 3;

    const lines = [
      `${indent}${labelFmt}`,
      // Inject internal node ID as a CSS class so we can find it in the SVG
      `${indent}:::node-${node.id.replace(/[^a-zA-Z0-9]/g, "")}`,
      `${indent}:::level${level}`
    ];

    (childrenMap[nodeId] ?? []).forEach((childId) => {
      lines.push(...buildLines(childId, depth + 1, new Set(visited)));
    });
    return lines;
  }

  const allLines = ["mindmap"];

  if (rootNodes.length === 1) {
    allLines.push(...buildLines(rootNodes[0], 1, new Set()));
  } else {
    allLines.push(
      "  MasterRoot((\"Materi Inti\"))",
      "  :::level0"
    );
    rootNodes.forEach((rootId) => {
      allLines.push(...buildLines(rootId, 2, new Set()));
    });
  }

  return allLines.join("\n");
}

export default function Mindmap({ nodes: initialNodes, onNodeClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState(initialNodes);
  const syntax = useMemo(() => buildMermaidSyntax(nodes), [nodes]);

  const onNodeClickRef = useRef(onNodeClick);
  useEffect(() => {
    onNodeClickRef.current = onNodeClick;
  }, [onNodeClick]);

  // Update when prop changes
  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes]);

  useEffect(() => {
    if (!containerRef.current) return;

    let isCancelled = false;

    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          mindmap: { padding: 20 },
          themeVariables: {
            primaryColor: "#4e39c5",
            primaryTextColor: "#ffffff",
            primaryBorderColor: "#4e39c5",
            lineColor: "#d7dfe9",
            nodeBorder: "#ffffff",
            clusterBkg: "transparent",
          },
          themeCSS: `
            path.edge { stroke: #d7dfe9 !important; stroke-width: 2px !important; fill: none !important; opacity: 0.6; }
            .level0 rect, .level0 circle, .level0 ellipse, .level0 polygon, .level0 path:not(.edge) { fill: #c5d8f1 !important; stroke: none !important; }
            .level0 span, .level0 tspan, .level0 text { color: #181e2a !important; fill: #181e2a !important; font-weight: bold; }
            .level1 rect, .level1 circle, .level1 ellipse, .level1 polygon, .level1 path:not(.edge) { fill: #4e39c5 !important; stroke: none !important; }
            .level1 span, .level1 tspan, .level1 text { color: #ffffff !important; fill: #ffffff !important; font-weight: bold; }
            .level2 rect, .level2 circle, .level2 ellipse, .level2 polygon, .level2 path:not(.edge) { fill: #ffd900 !important; stroke: none !important; }
            .level2 span, .level2 tspan, .level2 text { color: #181e2a !important; fill: #181e2a !important; font-weight: bold; }
            .level3 rect, .level3 circle, .level3 ellipse, .level3 polygon, .level3 path:not(.edge) { fill: #1db445 !important; stroke: none !important; }
            .level3 span, .level3 tspan, .level3 text { color: #ffffff !important; fill: #ffffff !important; font-weight: bold; }
            g.mindmap-node, g > rect, g > polygon, g > circle, g > ellipse { cursor: pointer; transition: opacity 0.2s ease; }
            g.mindmap-node:hover, g:hover > rect, g:hover > polygon, g:hover > circle, g:hover > ellipse { opacity: 0.8; filter: drop-shadow(0px 0px 4px rgba(255,255,255,0.4)); }
          `
        });

        // Ensure unique ID for this render to avoid conflicts
        const id = `mindmap-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const { svg } = await mermaid.render(id, syntax);

        if (!isCancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          const svgEl = containerRef.current.querySelector("svg");
          if (svgEl) {
            svgEl.style.width = "100%";
            svgEl.style.height = "100%";
            svgEl.removeAttribute("width");
            svgEl.removeAttribute("height");

            // Gunakan CAPTURE phase (true) dan pencarian node berbasis TEXT CONTENT (Label)
            // Ini paling aman karena Mermaid Mindmap seringkali mengubah ID/Class secara internal.
            svgEl.addEventListener("click", (e: MouseEvent) => {
              const target = e.target as Element;
              
              // Cari group (<g>) terdekat yang merupakan node mindmap
              const nodeGroup = target.closest("g.mindmap-node");
              
              if (nodeGroup) {
                // Ambil teks di dalam node (Mermaid merendernya dalam <text> atau <span>)
                const nodeText = (nodeGroup.textContent || "").trim();
                const classAttr = nodeGroup.getAttribute("class") || "";
                
                console.log("Mindmap Node Clicked:", { label: nodeText, classes: classAttr });

                // Cari node berdasarkan Label yang sama persis
                const clickedNode = nodes.find((n) => n.label.trim() === nodeText);

                if (clickedNode) {
                  console.log("MATCH FOUND (by label):", clickedNode.label, "-> Page:", clickedNode.page_number);
                  if (onNodeClickRef.current) {
                    onNodeClickRef.current(clickedNode);
                  }
                } else {
                  console.warn("Click detected, but could not match label:", nodeText);
                }
              }
            }, true);
          }
        }
      } catch (err) {
        console.error("Mermaid error:", err);
      }
    };

    render();

    return () => {
      isCancelled = true;
    };
  }, [syntax]);

  return (
    <div className="w-full rounded-2xl border-[3px] border-white/30 bg-dark-90 shadow-[6px_6px_0px_#ffffff] relative flex flex-col h-full">
      <div className="flex-none h-12 w-full bg-dark/80 flex items-center justify-between px-4 border-b-[3px] border-white/30 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-400 border-2 border-white/30"></div>
          <div className="w-3 h-3 rounded-full bg-yellow border-2 border-white/30"></div>
          <div className="w-3 h-3 rounded-full bg-green border-2 border-white/30"></div>
          <span className="ml-2 text-xs font-black uppercase tracking-widest text-white/80">Mind-Map Viewer</span>
        </div>
      </div>

      <div className="flex-1 w-full bg-dark ks-grid-bg relative overflow-hidden" style={{ minHeight: "600px" }}>
        <div ref={containerRef} className="w-full h-full min-h-[600px] flex items-center justify-center p-6 text-white/40 font-bold">
          Memuat mind-map...
        </div>
      </div>
    </div>
  );
}
