# 🤖 Fully Automated Model Discovery & Addition System

## Overview

**ZERO human intervention required.** New AI models are automatically:
1. Detected from Hugging Face, arXiv, etc.
2. Benchmark data scraped
3. Added to leaderboard
4. Committed to GitHub
5. Deployed to production

**Live within 24 hours of release.**

---

## How It Works

### Daily Workflow (Fully Automatic)

**9:00 AM UTC** - Cron job triggers

**9:01 AM** - Monitor checks sources:
- 🤗 Hugging Face trending models
- 📄 arXiv new LLM papers
- 🔬 LM Council updates (future)

**9:02 AM** - Filter for notable models:
- Watched providers (OpenAI, Anthropic, etc.)
- High downloads (>50k)
- Benchmark keywords detected

**9:03 AM** - For each notable model:
1. Scrape Hugging Face model card
2. Extract benchmarks (GPQA, MMLU, HumanEval, etc.)
3. Calculate overall score
4. Determine pricing, category, provider

**9:04 AM** - Quality checks:
- ✅ Minimum 2 benchmarks found?
- ✅ Score above 50?
- ✅ Valid metadata extracted?

**9:05 AM** - Auto-add if passed:
1. Generate model entry
2. Insert into `data/agents.js`
3. Git commit with `[AUTO-ADDED]` tag
4. Push to main branch
5. Deploy to production

**9:06 AM** - Model is LIVE:
- https://agentleaderboards.com updated
- Searchable, filterable, sortable
- Full benchmark details shown

---

## Quality Gates

Models are **only** auto-added if they meet ALL criteria:

### 1. Benchmark Requirements
- Minimum **2 benchmarks** found
- Recognized benchmarks only (GPQA, MMLU, HumanEval, MATH, BBH, GSM8K)
- Scores must be numeric and realistic (0-100%)

### 2. Score Requirements
- Calculated score ≥ **50** (on 0-100 scale)
- Average of all found benchmarks
- Normalized to standard scale

### 3. Metadata Requirements
- Valid provider extracted
- Model name parseable
- Hugging Face URL accessible

### 4. Provider Whitelist
Auto-add **only** for watched providers:
- OpenAI, Anthropic, Google, Meta
- Mistral AI, Cohere, xAI
- Moonshot AI, DeepSeek, Alibaba
- Hugging Face official models

**If ANY requirement fails:**
- Model is NOT added automatically
- GitHub issue created for manual review
- You get notification
- You can manually add later

---

## Safety Features

### 1. Read-Only Scraping
- Never writes to external sources
- Only reads public data
- No API rate limit violations

### 2. Git Tracking
- Every auto-add is a separate commit
- Commit message includes model name and `[AUTO-ADDED]` tag
- Full audit trail in Git history
- Easy to revert if needed

### 3. Data Validation
- Benchmarks checked for realistic values
- Pricing validated (0-1000 range)
- Category must be valid (coding, reasoning, etc.)
- Score capped at 0-100

### 4. Graceful Failures
- If scraping fails → skip, don't crash
- If commit fails → rollback, log error
- If deploy fails → model added, deploy manually later
- All errors logged to monitoring report

### 5. Manual Override
- Set `AUTO_ADD_MODELS=false` to disable
- Models still detected and reported
- You add manually when ready

---

## Configuration

### Environment Variables

Create `.env` file or set in system:

```bash
# Enable/disable auto-add
AUTO_ADD_MODELS=true

# Quality thresholds
MIN_BENCHMARKS=2        # Minimum benchmarks required
MIN_QUALITY_SCORE=50    # Minimum overall score (0-100)
```

### GitHub Actions

Already configured in `.github/workflows/monitor-new-models.yml`:

```yaml
env:
  AUTO_ADD_MODELS: true  # Automatic addition enabled
```

### OpenClaw Cron

Set environment in cron job creation or:

```bash
export AUTO_ADD_MODELS=true
cd /root/.openclaw/workspace-agentleaderboards/repo/scripts
node monitor-new-models.js
```

---

## Testing

### Test Auto-Add Script Directly

```bash
cd /root/.openclaw/workspace-agentleaderboards/repo/scripts
node auto-add-model.js moonshotai/Kimi-K2.5
```

**Expected output:**
```
🤖 AUTO-ADD: moonshotai/Kimi-K2.5
==================================================
📊 Scraping benchmarks...
   Found 6 benchmarks: GPQA Diamond, AIME 2025, ...
   Calculated score: 89.3

📝 Model Entry:
   Provider: Moonshot AI
   Category: coding
   Pricing: $0.6/$2.5 per 1M tokens

💾 Adding to agents.js...
✅ Added model to agents.js

🚀 Deploying to production...
✅ Committed changes
✅ Pushed to GitHub
✅ Deployed to production

✅ SUCCESS! Model is now live at:
   https://agentleaderboards.com
```

### Test Full Monitoring Pipeline

```bash
cd /root/.openclaw/workspace-agentleaderboards/repo/scripts
AUTO_ADD_MODELS=true node monitor-new-models.js
```

### Disable Auto-Add (Testing)

```bash
AUTO_ADD_MODELS=false node monitor-new-models.js
```

Models will be **detected** but **not added**.

---

## Manual Intervention (If Needed)

### Review Auto-Added Models

Check Git log:
```bash
git log --grep="AUTO-ADDED" --oneline
```

### Revert Auto-Added Model

```bash
git revert <commit-hash>
git push origin main
/root/deploy.sh agentleaderboards
```

### Edit Auto-Added Model

Just edit `data/agents.js` manually:
- Fix benchmarks
- Update pricing
- Change category
- Add missing badges

Then commit and deploy normally.

### Disable Auto-Add Temporarily

```bash
# In .env file
AUTO_ADD_MODELS=false
```

Or:
```bash
# In GitHub Actions workflow
env:
  AUTO_ADD_MODELS: false
```

---

## Example: Full Automatic Flow

### Day 1: Claude Opus 4.7 Releases

**8:00 AM** - Anthropic announces Claude Opus 4.7

**9:00 AM** - Monitor script runs

**9:01 AM** - Detects model on Hugging Face:
```
🚨 NOTABLE NEW MODELS:
   ⭐ anthropic/claude-opus-4.7
      Source: huggingface
      URL: https://huggingface.co/anthropic/claude-opus-4.7
      Downloads: 125,432
```

**9:02 AM** - Scrapes model card:
```
📊 Scraping benchmarks...
   Found 8 benchmarks: GPQA Diamond, MMLU, HumanEval, MATH, ...
   Calculated score: 92.4
```

**9:03 AM** - Generates entry:
```
📝 Model Entry:
   Provider: Anthropic
   Category: reasoning
   Pricing: $20/$100 per 1M tokens
```

**9:04 AM** - Quality check passes:
```
✅ Has 8 benchmarks (≥2 required)
✅ Score 92.4 (≥50 required)
✅ Valid metadata extracted
```

**9:05 AM** - Adds to leaderboard:
```
💾 Adding to agents.js...
✅ Added model to agents.js

🚀 Deploying to production...
✅ Committed: "chore: auto-add Claude Opus 4.7 [AUTO-ADDED]"
✅ Pushed to GitHub
✅ Deployed to production
```

**9:06 AM** - Live on site:
- https://agentleaderboards.com shows Claude Opus 4.7
- Ranked #2 overall (score 92.4)
- All 8 benchmarks displayed
- Fully searchable and comparable

**Total time: 6 minutes from detection to live.**

---

## Monitoring & Logs

### Daily Report

Check auto-generated report:
```bash
cat /root/.openclaw/workspace-agentleaderboards/repo/data/new-models-report.json
```

Contains:
- Timestamp
- Models detected
- Models auto-added
- Benchmarks found
- Any errors

### GitHub Actions Logs

View in GitHub:
- Actions tab → Monitor New AI Models
- See full output of each run
- Check which models were added

### Git History

```bash
cd /root/.openclaw/workspace-agentleaderboards/repo
git log --grep="AUTO-ADDED" --stat
```

Shows every auto-added model with:
- Model name
- Timestamp
- Files changed
- Commit hash (for reverting)

---

## Roadmap

### Current (v1.0)
- ✅ Hugging Face scraping
- ✅ Benchmark extraction
- ✅ Auto-add to agents.js
- ✅ Auto-commit & deploy
- ✅ Quality gates
- ✅ GitHub Actions integration

### Next (v1.1)
- [ ] LM Council RSS feed monitoring
- [ ] OpenAI blog scraping
- [ ] Anthropic announcements
- [ ] Auto-extract pricing from official docs

### Future (v2.0)
- [ ] Machine learning for benchmark prediction
- [ ] Auto-generate model descriptions (GPT)
- [ ] Community voting integration
- [ ] Slack/Discord notifications
- [ ] Web dashboard for monitoring

---

## FAQ

**Q: What if bad data gets auto-added?**  
A: Revert the commit. Quality gates should prevent this, but Git makes it easy to undo.

**Q: Can I review before auto-add?**  
A: Set `AUTO_ADD_MODELS=false`. Models will be detected, reported, but not added.

**Q: What if pricing is wrong?**  
A: Edit `data/agents.js` manually and commit. Auto-add uses defaults if not found.

**Q: How often does it run?**  
A: Daily at 9 AM UTC via GitHub Actions + OpenClaw cron.

**Q: Can I trigger manually?**  
A: Yes: `cd scripts && AUTO_ADD_MODELS=true node monitor-new-models.js`

**Q: What if I want to add a model manually?**  
A: Just edit `data/agents.js` directly. Auto-system won't duplicate.

**Q: Does it work for closed-source models?**  
A: Only if they're on Hugging Face with public model cards.

---

## Success Metrics

**Target: 95%+ of new frontier models auto-added within 24 hours**

Track:
- Models detected vs. actually released
- Auto-add success rate
- Benchmark data completeness
- Time from release to live

**Current performance (once live):**
- Detection latency: <24 hours
- Auto-add success rate: TBD (monitoring starting)
- Manual intervention rate: Target <5%

---

**Last updated:** 2026-02-18  
**Status:** ✅ FULLY IMPLEMENTED & READY FOR PRODUCTION
