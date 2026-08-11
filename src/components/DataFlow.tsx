/**
 * DataFlow — internal solver pipeline snake with stage icons.
 * SVG, theme-aware tokens, solid triangle arrows colored per source block.
 *
 * Motion (polish pass): a single luminous pulse threads through the pipeline in
 * solver order, tracing each box perimeter and each connector as it advances,
 * taking that stage's physics-accent colour. ~4s traversal, 3s still pause, loops.
 * Fully removed under prefers-reduced-motion (static figure preserved).
 */
export function DataFlow() {
  return (
    <div className="my-6 mx-auto" style={{ maxWidth: 720 }}>
      <svg viewBox="0 0 680 250" width="100%" role="img" aria-label="Internal solver data flow" style={{ fontFamily: 'var(--font-sans, sans-serif)' }}>
        <style>{`@keyframes df1{0%{opacity:1;stroke-dashoffset:100}5.195%{opacity:1;stroke-dashoffset:0}5.205%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df2{0%,5.185%{opacity:0;stroke-dashoffset:100}5.195%{opacity:1;stroke-dashoffset:100}10.39%{opacity:1;stroke-dashoffset:0}10.4%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df3{0%,10.38%{opacity:0;stroke-dashoffset:100}10.39%{opacity:1;stroke-dashoffset:100}15.584%{opacity:1;stroke-dashoffset:0}15.594%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df4{0%,15.574%{opacity:0;stroke-dashoffset:100}15.584%{opacity:1;stroke-dashoffset:100}20.779%{opacity:1;stroke-dashoffset:0}20.789%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df5{0%,20.769%{opacity:0;stroke-dashoffset:100}20.779%{opacity:1;stroke-dashoffset:100}25.974%{opacity:1;stroke-dashoffset:0}25.984%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df6{0%,25.964%{opacity:0;stroke-dashoffset:100}25.974%{opacity:1;stroke-dashoffset:100}31.169%{opacity:1;stroke-dashoffset:0}31.179%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df7{0%,31.159%{opacity:0;stroke-dashoffset:100}31.169%{opacity:1;stroke-dashoffset:100}36.364%{opacity:1;stroke-dashoffset:0}36.374%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df8{0%,36.354%{opacity:0;stroke-dashoffset:100}36.364%{opacity:1;stroke-dashoffset:100}41.558%{opacity:1;stroke-dashoffset:0}41.568%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df9{0%,41.548%{opacity:0;stroke-dashoffset:100}41.558%{opacity:1;stroke-dashoffset:100}46.753%{opacity:1;stroke-dashoffset:0}46.763%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df10{0%,46.743%{opacity:0;stroke-dashoffset:100}46.753%{opacity:1;stroke-dashoffset:100}51.948%{opacity:1;stroke-dashoffset:0}51.958%,100%{opacity:0;stroke-dashoffset:0}}@keyframes df11{0%,51.938%{opacity:0;stroke-dashoffset:100}51.948%{opacity:1;stroke-dashoffset:100}57.143%{opacity:1;stroke-dashoffset:0}57.153%,100%{opacity:0;stroke-dashoffset:0}}.df-pulse{fill:none;stroke-width:2.5px;stroke-linecap:round;stroke-dasharray:12 88;opacity:0}@media (prefers-reduced-motion: reduce){.df-pulse{animation:none !important;opacity:0 !important}}`}</style>
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

        {/* ── Animated pulse overlay (polish pass) ─────────────────────────── */}
        <g>
          <path className="df-pulse" d="M28,30 H208 A8,8 0 0 1 216,38 V76 A8,8 0 0 1 208,84 H28 A8,8 0 0 1 20,76 V38 A8,8 0 0 1 28,30 Z" pathLength={100} stroke="var(--cold)" style={{ animation: "df1 7s linear infinite", filter: "drop-shadow(0 0 3px var(--cold))" }} />
          <path className="df-pulse" d="M218,57 L256,57" pathLength={100} stroke="var(--cold)" style={{ animation: "df2 7s linear infinite", filter: "drop-shadow(0 0 3px var(--cold))" }} />
          <path className="df-pulse" d="M266,30 H390 A8,8 0 0 1 398,38 V76 A8,8 0 0 1 390,84 H266 A8,8 0 0 1 258,76 V38 A8,8 0 0 1 266,30 Z" pathLength={100} stroke="var(--violet)" style={{ animation: "df3 7s linear infinite", filter: "drop-shadow(0 0 3px var(--violet))" }} />
          <path className="df-pulse" d="M400,57 L448,57" pathLength={100} stroke="var(--violet)" style={{ animation: "df4 7s linear infinite", filter: "drop-shadow(0 0 3px var(--violet))" }} />
          <path className="df-pulse" d="M458,30 H592 A8,8 0 0 1 600,38 V76 A8,8 0 0 1 592,84 H458 A8,8 0 0 1 450,76 V38 A8,8 0 0 1 458,30 Z" pathLength={100} stroke="var(--key-frame)" style={{ animation: "df5 7s linear infinite", filter: "drop-shadow(0 0 3px var(--key-frame))" }} />
          <path className="df-pulse" d="M525,86 L525,146" pathLength={100} stroke="var(--key-frame)" style={{ animation: "df6 7s linear infinite", filter: "drop-shadow(0 0 3px var(--key-frame))" }} />
          <path className="df-pulse" d="M454,148 H596 A8,8 0 0 1 604,156 V194 A8,8 0 0 1 596,202 H454 A8,8 0 0 1 446,194 V156 A8,8 0 0 1 454,148 Z" pathLength={100} stroke="var(--key-frame)" style={{ animation: "df7 7s linear infinite", filter: "drop-shadow(0 0 3px var(--key-frame))" }} />
          <path className="df-pulse" d="M444,175 L410,175" pathLength={100} stroke="var(--key-frame)" style={{ animation: "df8 7s linear infinite", filter: "drop-shadow(0 0 3px var(--key-frame))" }} />
          <path className="df-pulse" d="M220,148 H400 A8,8 0 0 1 408,156 V194 A8,8 0 0 1 400,202 H220 A8,8 0 0 1 212,194 V156 A8,8 0 0 1 220,148 Z" pathLength={100} stroke="var(--hot)" style={{ animation: "df9 7s linear infinite", filter: "drop-shadow(0 0 3px var(--hot))" }} />
          <path className="df-pulse" d="M210,175 L184,175" pathLength={100} stroke="var(--hot)" style={{ animation: "df10 7s linear infinite", filter: "drop-shadow(0 0 3px var(--hot))" }} />
          <path className="df-pulse" d="M28,148 H174 A8,8 0 0 1 182,156 V194 A8,8 0 0 1 174,202 H28 A8,8 0 0 1 20,194 V156 A8,8 0 0 1 28,148 Z" pathLength={100} stroke="var(--warm)" style={{ animation: "df11 7s linear infinite", filter: "drop-shadow(0 0 3px var(--warm))" }} />
        </g>
      </svg>
    </div>
  );
}
