import { Link } from 'wouter';

/**
 * InputMap — the manual's \inputmap: a tree diagram of the whole input.i
 * structure, with the current chapter's branch highlighted. See
 * DESIGN-BRIEF.md §13 (amended/authoritative — supersedes §10).
 *
 * The highlight groups and their href targets mirror exactly what
 * manuals-source/user-guide/main.tex defines: each chapter invokes
 * \inputmap{<group>} with one of meshblk/physan/interfaces/solver/materials/
 * output/nohighlight — "rigid_bodies" has its own tikz style but no chapter
 * currently invokes it, and analysis_type/domains[]/solver_control have no
 * highlight style at all in the source, so they are plain (never-highlighted)
 * links here too.
 *
 * NodeTree below is the generalisation used for the manual's smaller "children
 * of X" reference tikz diagrams (e.g. children of solver_control, of
 * basic_settings, of a domain entry) — same elbow connectors and block style,
 * a focused subtree instead of the whole input.i map.
 */
export type InputMapGroup =
  | 'mesh'
  | 'physical_analysis'
  | 'rigid_bodies'
  | 'interfaces'
  | 'solver'
  | 'materials'
  | 'output';

export interface TreeNode {
  id: string;
  label: string;
  href?: string;
  /** Small dim annotation to the right of the block, e.g. "required (§8.2.1)" */
  note?: string;
  /** Highlighted when it matches the InputMap's `highlight` prop */
  group?: InputMapGroup;
  /** Rendered with the maroon-free "conditional" tone (grey-filled, per the manual's grey tikz blocks) */
  conditional?: boolean;
  children?: TreeNode[];
}

const TREE: TreeNode = {
  id: 'root',
  label: 'input.i',
  children: [
    { id: 'mesh', label: 'mesh', href: '/get-started/mesh', group: 'mesh' },
    {
      id: 'simulation',
      label: 'simulation',
      children: [
        {
          id: 'physical_analysis',
          label: 'physical_analysis',
          href: '/get-started/physical-analysis',
          group: 'physical_analysis',
          children: [
            { id: 'analysis_type', label: 'analysis_type', href: '/get-started/physical-analysis' },
            { id: 'domains', label: 'domains[]', href: '/get-started/physical-analysis' },
            { id: 'rigid_bodies', label: 'rigid_bodies[]', href: '/get-started/physical-analysis', group: 'rigid_bodies' },
            { id: 'interfaces', label: 'interfaces[]', href: '/get-started/interfaces', group: 'interfaces' },
          ],
        },
        {
          id: 'solver',
          label: 'solver',
          href: '/get-started/numerics',
          group: 'solver',
          children: [
            { id: 'solver_control', label: 'solver_control', href: '/get-started/numerics' },
            { id: 'output_control', label: 'output_control', href: '/get-started/output', group: 'output' },
            { id: 'restart_control', label: 'restart_control', href: '/get-started/output', group: 'output' },
          ],
        },
        { id: 'material_library', label: 'material_library', href: '/get-started/materials', group: 'materials' },
      ],
    },
  ],
};

/** Horizontal indent per depth level — generous, per DESIGN-BRIEF.md §13c. */
const LEVEL_WIDTH = 36;

function NodeChip({ node, highlighted }: { node: TreeNode; highlighted: boolean }) {
  const clickable = !!node.href && !highlighted;

  const className = 'inline-block px-2.5 py-1.5 rounded text-xs sm:text-[13px] border leading-none whitespace-nowrap';
  const style: React.CSSProperties = { fontFamily: 'var(--font-mono)', ...(highlighted
    ? { borderColor: 'var(--map-highlight)', background: 'var(--map-highlight-bg)', color: 'var(--map-highlight)', fontWeight: 600 }
    : node.conditional
    ? { borderColor: 'var(--hairline)', background: 'var(--surface-2)', color: 'var(--text-dim)' }
    : { borderColor: 'var(--hairline)', background: 'var(--surface)', color: 'var(--text)' }) };

  if (clickable) {
    return (
      <Link
        href={node.href!}
        className={`${className} transition-colors hover:border-[var(--cold)] hover:text-[var(--cold)] hover:bg-[var(--surface-2)]`}
        style={style}
      >
        {node.label}
      </Link>
    );
  }
  return <span className={className} style={style}>{node.label}</span>;
}

/** One rail column: a passthrough vertical line if an ancestor still has siblings below, else blank. */
function RailColumn({ continues }: { continues: boolean }) {
  return (
    <div style={{ width: LEVEL_WIDTH, flexShrink: 0, position: 'relative', alignSelf: 'stretch' }}>
      {continues && (
        <div style={{ position: 'absolute', left: LEVEL_WIDTH / 2, top: 0, bottom: 0, width: 1, background: 'var(--map-connector)' }} />
      )}
    </div>
  );
}

/** This node's own elbow: top half-line (always) + horizontal arm + bottom half-line (only if it has more siblings below). */
function ElbowColumn({ isLast }: { isLast: boolean }) {
  return (
    <div style={{ width: LEVEL_WIDTH, flexShrink: 0, position: 'relative', alignSelf: 'stretch' }}>
      <div style={{ position: 'absolute', left: LEVEL_WIDTH / 2, top: 0, height: '50%', width: 1, background: 'var(--map-connector)' }} />
      <div style={{ position: 'absolute', left: LEVEL_WIDTH / 2, top: '50%', width: LEVEL_WIDTH / 2 - 3, height: 1, background: 'var(--map-connector)' }} />
      {!isLast && (
        <div style={{ position: 'absolute', left: LEVEL_WIDTH / 2, top: '50%', bottom: 0, width: 1, background: 'var(--map-connector)' }} />
      )}
    </div>
  );
}

function Row({
  node, depth, isLast, ancestorContinues, isHighlighted,
}: {
  node: TreeNode; depth: number; isLast: boolean; ancestorContinues: boolean[]; isHighlighted: boolean;
}) {
  return (
    <div className="flex items-stretch">
      {ancestorContinues.map((continues, i) => <RailColumn key={i} continues={continues} />)}
      {depth > 0 && <ElbowColumn isLast={isLast} />}
      <div className="flex items-center gap-2 py-1">
        <NodeChip node={node} highlighted={isHighlighted} />
        {node.note && <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-dim)' }}>{node.note}</span>}
      </div>
    </div>
  );
}

function renderChildren(
  children: TreeNode[], ancestorContinues: boolean[], depth: number, isMatch: (n: TreeNode) => boolean,
): React.ReactNode {
  return children.map((child, i) => {
    const isLast = i === children.length - 1;
    return (
      <div key={child.id}>
        <Row node={child} depth={depth} isLast={isLast} ancestorContinues={ancestorContinues} isHighlighted={isMatch(child)} />
        {child.children && child.children.length > 0 &&
          renderChildren(child.children, [...ancestorContinues, !isLast], depth + 1, isMatch)}
      </div>
    );
  });
}

/**
 * NodeTree — generic elbow-connector tree, same rendering as InputMap, for an
 * arbitrary root (the manual's smaller "children of X" reference diagrams).
 */
export function NodeTree({ root, highlightId }: { root: TreeNode; highlightId?: string }) {
  const isMatch = (n: TreeNode) => n.id === highlightId;
  return (
    <div
      className="my-6 rounded-md border overflow-x-auto p-4"
      style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}
    >
      <div className="min-w-max">
        <Row node={root} depth={0} isLast={true} ancestorContinues={[]} isHighlighted={isMatch(root)} />
        {renderChildren(root.children ?? [], [], 1, isMatch)}
      </div>
    </div>
  );
}

interface InputMapProps {
  /** Which block this chapter documents. Omit for no highlight (e.g. Chapter 4). */
  highlight?: InputMapGroup;
}

export function InputMap({ highlight }: InputMapProps) {
  const isMatch = (n: TreeNode) => n.group !== undefined && n.group === highlight;
  return (
    <div
      className="my-6 rounded-md border overflow-x-auto p-4"
      style={{ borderColor: 'var(--hairline)', background: 'var(--surface-2)' }}
    >
      <div className="min-w-max">
        <Row node={TREE} depth={0} isLast={true} ancestorContinues={[]} isHighlighted={isMatch(TREE)} />
        {renderChildren(TREE.children ?? [], [], 1, isMatch)}
      </div>
    </div>
  );
}
