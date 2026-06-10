"use client";

import { useEffect, useState } from "react";
import { Copy, Check, Terminal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

type SetupGuideModalProps = {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  apiKey: string;
};

function CodeEditorMockup({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-hairline dark:border-white/[0.08] bg-canvas dark:bg-[#0a0a0a] shadow-level4">
      <div className="flex items-center justify-between border-b border-hairline dark:border-white/[0.08] bg-canvas-soft dark:bg-white/[0.02] px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
            <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
            <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-mute">{filename}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 text-mute hover:text-ink"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-ink leading-relaxed">
        <pre className="!bg-transparent !p-0 !m-0">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

export function SetupGuideModal({ isOpen, onClose, siteName, apiKey }: SetupGuideModalProps) {
  const [origin, setOrigin] = useState("https://pulse.example.com");
  const [endpoint, setEndpoint] = useState("https://api.pulse.example.com/i");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
      setEndpoint(process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL + "/i" : "http://localhost:5000/i");
    }
  }, []);

  const scriptTag = `<script src="${origin}/tracker.js" data-api-key="${apiKey}" data-endpoint="${endpoint}"></script>`;

  const htmlCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${siteName}</title>
    
    <!-- Pulse Analytics -->
    ${scriptTag}
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

  const nextJsCode = `import Script from "next/script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script 
          src="${origin}/tracker.js"
          data-api-key="${apiKey}"
          data-endpoint="${endpoint}"
          strategy="afterInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}`;

  const nuxtCode = `// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      script: [
        {
          src: "${origin}/tracker.js",
          'data-api-key': "${apiKey}",
          'data-endpoint': "${endpoint}",
          defer: true
        }
      ]
    }
  }
})`;

  const svelteCode = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    %sveltekit.head%
    
    <!-- Pulse Analytics -->
    ${scriptTag}
  </head>
  <body data-sveltekit-preload-data="hover">
    <div style="display: contents">%sveltekit.body%</div>
  </body>
</html>`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden bg-canvas dark:bg-[#0a0a0a]">
        <div className="p-6 md:p-8 border-b border-hairline dark:border-white/[0.08] min-w-0">
          <DialogTitle className="text-xl font-semibold tracking-display-sm text-ink flex items-center gap-2">
            <Terminal className="h-5 w-5 text-mute" />
            Install Pulse on {siteName}
          </DialogTitle>
          <DialogDescription className="mt-2 text-sm text-body">
            Choose your framework below and paste the tracking snippet into your application's head element.
          </DialogDescription>
        </div>

        <div className="p-6 md:p-8 bg-canvas-soft dark:bg-transparent min-w-0">
          <Tabs defaultValue="html" className="w-full">
            <TabsList className="mb-4 bg-canvas border border-hairline dark:border-white/[0.08] p-1">
              <TabsTrigger value="html" className="rounded-sm text-xs font-medium">HTML / Vue</TabsTrigger>
              <TabsTrigger value="nextjs" className="rounded-sm text-xs font-medium">React / Next.js</TabsTrigger>
              <TabsTrigger value="nuxt" className="rounded-sm text-xs font-medium">Nuxt</TabsTrigger>
              <TabsTrigger value="svelte" className="rounded-sm text-xs font-medium">SvelteKit</TabsTrigger>
            </TabsList>

            <TabsContent value="html" className="m-0 focus:outline-none">
              <p className="text-sm text-body mb-2">
                For standard HTML sites or single-page apps (like Vue or standard React), paste the snippet right before the closing <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">&lt;/head&gt;</code> tag in your main <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">index.html</code> file.
              </p>
              <CodeEditorMockup code={htmlCode} filename="index.html" />
            </TabsContent>

            <TabsContent value="nextjs" className="m-0 focus:outline-none">
              <p className="text-sm text-body mb-2">
                For Next.js (App Router), use the built-in <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">next/script</code> component in your root <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">layout.tsx</code>. This ensures it loads optimally without blocking the page.
              </p>
              <CodeEditorMockup code={nextJsCode} filename="app/layout.tsx" />
            </TabsContent>

            <TabsContent value="nuxt" className="m-0 focus:outline-none">
              <p className="text-sm text-body mb-2">
                For Nuxt 3, you can globally inject the script via the <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">app.head.script</code> array in your <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">nuxt.config.ts</code>.
              </p>
              <CodeEditorMockup code={nuxtCode} filename="nuxt.config.ts" />
            </TabsContent>

            <TabsContent value="svelte" className="m-0 focus:outline-none">
              <p className="text-sm text-body mb-2">
                For SvelteKit, add the script tag directly to your <code className="text-xs bg-canvas px-1 py-0.5 rounded border border-hairline dark:border-white/[0.08]">src/app.html</code> file inside the head section.
              </p>
              <CodeEditorMockup code={svelteCode} filename="src/app.html" />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
