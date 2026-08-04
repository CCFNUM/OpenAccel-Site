import { useDocumentTitle } from '@/hooks/use-document-title';
import { SEO } from '@/components/SEO';
import { ExternalLink } from 'lucide-react';

export function License() {
  useDocumentTitle('License');

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <SEO
        title="License"
        description="OpenAccel is released under the BSD 3-Clause License — a permissive open-source license allowing free use, modification, and distribution, including for commercial purposes."
        path="/license"
      />
      <h1 className="font-display text-4xl font-bold mb-6">License</h1>
      
      <div className="prose prose-invert max-w-none text-[var(--text-dim)] mb-12">
        <p>
          OpenAccel is open-source software released under the <strong>BSD 3-Clause License</strong>. 
          This is a permissive license that allows for almost unrestricted freedom to use, modify, and distribute the software, 
          including for commercial purposes, provided the copyright notice is retained.
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--hairline)] rounded-lg p-6 mb-12 font-mono text-xs text-[var(--text-dim)] whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`BSD 3-Clause License

Copyright (c) 2024, CCFNUM
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`}
      </div>

      <h2 className="text-2xl font-display font-semibold mb-4 border-b border-[var(--hairline)] pb-2">Third-party Dependencies</h2>
      <p className="text-[var(--text-dim)] mb-4">
        OpenAccel bundles or links against several third-party libraries. When distributing binaries, you must comply with their respective licenses:
      </p>
      <ul className="space-y-3 text-sm text-[var(--text-dim)]">
        <li><strong>Trilinos</strong> (BSD License) <a href="https://trilinos.github.io/" target="_blank" rel="noreferrer" className="text-[var(--cold)] inline-flex items-center ml-1"><ExternalLink size={12}/></a></li>
        <li><strong>Eigen</strong> (MPL2 License) <a href="https://eigen.tuxfamily.org/" target="_blank" rel="noreferrer" className="text-[var(--cold)] inline-flex items-center ml-1"><ExternalLink size={12}/></a></li>
        <li><strong>nanoflann</strong> (BSD License) <a href="https://github.com/jlblancoc/nanoflann" target="_blank" rel="noreferrer" className="text-[var(--cold)] inline-flex items-center ml-1"><ExternalLink size={12}/></a></li>
        <li><strong>ExprTk</strong> (MIT License)</li>
        <li><strong>PETSc</strong> (BSD 2-Clause License)</li>
        <li><strong>HYPRE</strong> (Apache 2.0 / MIT License)</li>
      </ul>
    </div>
  );
}