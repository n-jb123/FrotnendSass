import React from 'react';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import {
  Sparkles,
  Inbox,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const DesignSystemView: React.FC = () => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
          SupportFlow AI — Design System & Tokens
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Production design foundations conforming to domain-native SaaS guidelines, zero-pill discipline, WCAG AA contrast, and bilingual typography.
        </p>
      </div>

      {/* Section 1: Typography */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          01. Typographic Hierarchy
        </h2>
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Display / Page Heading (24px–36px)</span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Customer Operations Command Center
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Section Subtitle / Card Heading (14px–18px)</span>
            <span className="text-base font-bold">
              Autonomous Webhook Ingestion & Telemetry Diagnostics
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Body Prose (13px–14px, 1.5 line height)</span>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Real-time webhook dispatch logs are retained for 30 days under Enterprise retention compliance. Signature verifications enforce constant-time cryptographic checks.
            </p>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 block font-mono">Tabular Numerals for Telemetry & Finance (`tabular-nums font-mono`)</span>
            <div className="text-base font-bold font-mono tabular-nums text-indigo-600 dark:text-indigo-400">
              $34,800.00 USD · 4,280 msgs/sec · 99.4% SLA
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Zero-Pill Status Badges */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          02. Status & Priority Badges (Zero-Pill Restraint)
        </h2>
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-xs text-slate-500">
            Per Section 1.A of the Frontend Design Constitution, status indicators use restrained rectangular micro-tags with paired text labels (never pill enclosures or hue alone).
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="open" />
            <StatusBadge status="pending" />
            <StatusBadge status="resolved" />
            <StatusBadge status="closed" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <StatusBadge priority="low" />
            <StatusBadge priority="medium" />
            <StatusBadge priority="high" />
            <StatusBadge priority="urgent" />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <StatusBadge sentiment="positive" />
            <StatusBadge sentiment="neutral" />
            <StatusBadge sentiment="frustrated" />
            <StatusBadge sentiment="angry" />
          </div>
        </div>
      </div>

      {/* Section 3: Button Primitives */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          03. Button Primitives & Interactive States
        </h2>
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Action</Button>
            <Button variant="accent">Accent Action</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Action</Button>
            <Button variant="ghost">Ghost Action</Button>
            <Button variant="danger">Destructive Action</Button>
            <Button variant="primary" isLoading>Loading State</Button>
          </div>
        </div>
      </div>

      {/* Section 4: AI Explainability Patterns */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          04. Explainable AI Co-pilot Modules
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-indigo-700 dark:text-indigo-300">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Suggested Response with Attribution</span>
              </span>
              <span className="text-[10px] font-mono">96% confidence</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/40 font-mono text-[11px]">
              "Hi Maya, we provisioned burst capacity (+5,000 req/sec) on your cluster. Please implement the jittered retry backoff documented in the attached guide."
            </p>
            <span className="text-[10px] text-slate-400 block">
              Grounded in Webhook Concurrency Knowledge Article #ART-1
            </span>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <Lock className="w-4 h-4" />
              <span>Internal Team Note (Customer-Hidden)</span>
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200">
              "Checked ingress logs. HyperScale default quota was set to 2,500 req/sec burst. They peaked at 3,450 req/sec. Tier 2 approved quota boost."
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Loading Skeletons & Empty States */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          05. State Resiliency (Skeletons & Empty States)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-400">Loading Skeleton Preview</span>
            <div className="animate-pulse space-y-2.5">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-full" />
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-5/6" />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2">
            <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Zero Unresolved Escalations
            </h3>
            <p className="text-[11px] text-slate-500">
              All tickets across your priority queue have been addressed within SLA targets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
