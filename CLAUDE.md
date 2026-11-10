# CLAUDE.md

> Always in context, so it stays under ~80 lines. Detail lives in `.claude/rules/` (each file
> loads only when you touch the files it covers) and in the slash commands.

## Project

- **Name:** Fathom Solutions (fathomsolutions)
- **Purpose:** The Fathom Solutions landing page: services, projects, about, and a contact form.
- **Profile:** site, public at https://fathomsolutions.dev. Pushing main deploys it: the user
  pushes, never Claude. · **Stack:** React + Vite, static, built and served by GitHub Pages
- **Public repo:** nothing internal goes into commits (no client names, drafts or internal
  notes); PM lives in the private nested repo `project-management/`.
- **Vault note:** C:/Users/flow/Vault/20 Projects/Fathom Website.md
- Not a Tawa repo: Tawa workflow rules (issues, self-merge, releases) don't apply here.

@.claude/TIER.md

## Lean by default

- **Trivial prompts** (questions, lookups, explanations, one-line fixes): just answer or fix.
  Touch no PM file, run no verify, write no report.
- **During work**, capture only what would otherwise be lost: one register row (IDEA is enough)
  or a `D-n` stub (the question, status OPEN). Don't rewrite CURRENT.md or tidy docs mid-task.
- **`/wrap-session`** is the routine bookkeeping point, a couple of minutes. **`/cleanup`** is
  the deep pass, run when asked.
- Open a rules file or plan doc only when the task needs it.

## Git — the policy is in TIER.md; the full guide is `.claude/rules/git.md`

- **`main` policy with `Deploys on push: yes`:** commit on main once `python verify.py` passes
  (it runs the site build). Never push main: hand the user `! git push origin main`, which
  deploys the site. The guard and `settings.json` both deny Claude's push.
- **Risky changes** (navigation, layout, build config, the Pages workflow) go on a short branch,
  previewed locally (`npm run build:pages`, then `npm run preview`), merged locally, then handed
  over.
- **The PM repo** is its own git repo (`git -C project-management …`), excluded from the host.
  `settings.json` denies its push too: hand over `! git -C project-management push`.
- **Always:** no force-push, no rewriting pushed history, no deleting unmerged work.
  Commits read `<type>(F-n): summary`, type ∈ feat · fix · refactor · docs · chore · test.
- Two things at once in this repo → a worktree under `.claude/worktrees/`, removed once merged.

`.claude/hooks/guard_commands.py` enforces the hard parts.

## Non-negotiables (every tier)

1. **Terraform:** never `apply`, `destroy` or `import` without explicit per-instance permission.
2. **Browser automation** only with explicit permission.
3. **No secrets in the repo.** Ever.
4. **Science.** Any figure, unit or technical claim in the site copy (SWPT, LCA-Pave and other
   project descriptions) belongs to the user (PhD, environmental engineering). Propose and
   recommend; never choose.
5. **Destructive data operations** (deleting user data, irreversible changes) need explicit
   permission.
6. If a permission you lack would make the work meaningfully faster or better, say so and ask.

## Decisions — the tier sets which lane

- **Decide and log:** one line in the Decision Log at the bottom of `DECISIONS.md`.
- **Stop and ask:** a `D-n` under Needs you, status OPEN, with options and a recommendation.
  Carry on with whatever doesn't depend on it.
- **Built on a provisional choice that's the user's to make:** a `D-n` with status PROPOSED.

## Code posture

Minimal, not clever. Prefer deleting to adding. No dead code, no speculative layers. A fix that
needs a workaround says so, and the real problem gets a register row.

## Where things live

| Need | File |
| --- | --- |
| Where things stand (printed at session start) | `project-management/CURRENT.md` |
| Every feature, fix, bug and idea (the register) | `project-management/FEATURES.md` |
| Decisions: the user's, resolved, and Claude's log | `project-management/DECISIONS.md` |
| Chores only the user can do | `project-management/CHORES.md` |
| Scope, roadmap, architecture | `project-management/PLAN.md` |
| PM files from a linked worktree (private mode: the main folder only) | `$(git rev-parse --path-format=absolute --git-common-dir)/../project-management/` |
| PM rules, git guide, code standards | `.claude/rules/` |
| Health check, code, site build and PM | `python verify.py` |
