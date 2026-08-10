/**
 * DataFlow — internal solver pipeline snake with stage icons.
 * SVG, theme-aware tokens, solid triangle arrows colored per source block.
 */
export function DataFlow() {
  return (
    <div className="my-6 mx-auto" style={{ maxWidth: 720 }}>
      <svg viewBox="0 0 680 250" width="100%" role="img" aria-label="Internal solver data flow" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
        <defs>
          <marker id="a-cold" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="var(--cold)" /></marker>
          <marker id="a-violet" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="var(--violet)" /></marker>
          <marker id="a-key" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="var(--key-frame)" /></marker>
          <marker id="a-hot" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M1 1L9 5L1 9Z" fill="var(--hot)" /></marker>
        </defs>

        {/* Row 1 */}
        <g>
          <rect x="20" y="30" width="196" height="54" rx="8" fill="var(--callout-cold-bg)" stroke="var(--cold)" strokeWidth="1.5" />
          <g stroke="var(--cold)" strokeWidth="1.5" fill="none"><rect x="40" y="44" width="26" height="26" rx="2"/><line x1="40" y1="53" x2="66" y2="53"/><line x1="40" y1="61" x2="66" y2="61"/><line x1="49" y1="44" x2="49" y2="70"/><line x1="57" y1="44" x2="57" y2="70"/></g>
          <text x="80" y="58" dominantBaseline="central" fill="var(--cold)" fontSize="12.5" fontWeight="600">Mesh (Trilinos-STK)</text>
        </g>
        <line x1="218" y1="57" x2="256" y2="57" stroke="var(--cold)" strokeWidth="2" markerEnd="url(#a-cold)" />

        <g>
          <rect x="258" y="30" width="140" height="54" rx="8" fill="var(--map-highlight-bg)" stroke="var(--violet)" strokeWidth="1.5" />
          <g stroke="var(--violet)" strokeWidth="1.5" fill="none"><polygon points="288,46 300,52 288,58 276,52"/><polyline points="276,56 288,62 300,56"/><polyline points="276,60 288,66 300,60"/></g>
          <text x="316" y="57" dominantBaseline="central" fill="var(--violet)" fontSize="12.5" fontWeight="600">Fields</text>
        </g>
        <line x1="400" y1="57" x2="448" y2="57" stroke="var(--violet)" strokeWidth="2" markerEnd="url(#a-violet)" />

        <g>
          <rect x="450" y="30" width="150" height="54" rx="8" fill="var(--key-bg)" stroke="var(--key-frame)" strokeWidth="1.5" />
          <g stroke="var(--key-frame)" strokeWidth="1.5" fill="none"><rect x="468" y="44" width="12" height="12" rx="1.5"/><rect x="482" y="44" width="12" height="12" rx="1.5"/><rect x="468" y="58" width="12" height="12" rx="1.5"/><rect x="482" y="58" width="12" height="12" rx="1.5"/></g>
          <text x="504" y="57" dominantBaseline="central" fill="var(--key-frame)" fontSize="12.5" fontWeight="600">Assembly</text>
        </g>

        {/* bend down */}
        <line x1="525" y1="86" x2="525" y2="146" stroke="var(--key-frame)" strokeWidth="2" markerEnd="url(#a-key)" />

        {/* Row 2 */}
        <g>
          <rect x="446" y="148" width="158" height="54" rx="8" fill="var(--key-bg)" stroke="var(--key-frame)" strokeWidth="1.5" />
          <g stroke="var(--key-frame)" strokeWidth="1.5" fill="none"><rect x="468" y="162" width="26" height="26" rx="2"/><line x1="468" y1="171" x2="494" y2="171"/><line x1="477" y1="162" x2="477" y2="188"/></g>
          <text x="500" y="175" dominantBaseline="central" fill="var(--key-frame)" fontSize="12.5" fontWeight="600">Linear system</text>
        </g>
        <line x1="444" y1="175" x2="410" y2="175" stroke="var(--key-frame)" strokeWidth="2" markerEnd="url(#a-key)" />

        <g>
          <rect x="212" y="148" width="196" height="54" rx="8" fill="var(--callout-hot-bg, rgba(249,115,22,0.1))" stroke="var(--hot)" strokeWidth="1.75" />
          <g stroke="var(--hot)" strokeWidth="1.5" fill="none"><rect x="232" y="162" width="26" height="26" rx="2"/><rect x="238" y="168" width="14" height="14" rx="1"/><line x1="245" y1="158" x2="245" y2="162"/><line x1="245" y1="188" x2="245" y2="192"/><line x1="228" y1="175" x2="232" y2="175"/><line x1="258" y1="175" x2="262" y2="175"/></g>
          <text x="272" y="168" dominantBaseline="central" fill="var(--hot)" fontSize="12.5" fontWeight="600">Solver backend</text>
          <text x="272" y="184" dominantBaseline="central" fill="var(--hot)" fontSize="10">PETSc / HYPRE / Trilinos</text>
        </g>
        <line x1="210" y1="175" x2="184" y2="175" stroke="var(--hot)" strokeWidth="2" markerEnd="url(#a-hot)" />

        <g>
          <rect x="20" y="148" width="162" height="54" rx="8" fill="var(--callout-warm-bg, rgba(217,90,48,0.1))" stroke="var(--warm)" strokeWidth="1.5" />
          <g stroke="var(--warm)" strokeWidth="1.5" fill="none"><polyline points="40,186 49,175 57,181 66,166"/><line x1="40" y1="162" x2="40" y2="188"/><line x1="40" y1="188" x2="66" y2="188"/></g>
          <text x="80" y="175" dominantBaseline="central" fill="var(--warm)" fontSize="12.5" fontWeight="600">Post-processing</text>
        </g>
      </svg>
    </div>
  );
}
