# AgentLeaderboards - Automatic Model Discovery

## Overview

This system automatically monitors AI model releases and benchmark data from multiple sources, alerting when new models are available to add to the leaderboard.

## How It Works

### 1. Data Sources Monitored

**Daily checks:**
- 🤗 **Hugging Face** - Trending text-generation models (API)
- 📄 **arXiv** - New LLM research papers (RSS feed)
- 🔬 **LM Council** - Updated benchmarks
- 🏆 **Open LLM Leaderboard** - New model submissions

**Watched providers:**
- OpenAI, Anthropic, Google, Meta
- Mistral, Cohere, xAI, Moonshot AI
- DeepSeek, Alibaba, and more

### 2. Detection Criteria

A model is flagged as "notable" if:
- From a watched provider (OpenAI, Anthropic, etc.)
- High download count (>50k on HuggingFace)
- Mentions benchmark keywords (GPQA, SWE-bench, MMLU, etc.)
- Recent publication (<7 days old)

### 3. Automatic Actions

When a new model is detected:

1. **Generate report** → `data/new-models-report.json`
2. **Create GitHub issue** → Tagged with `new-model` label
3. **Send notification** (optional) → Telegram, email, etc.
4. **Generate model template** → Ready to add to `agents.js`

## Usage

### Manual Check

```bash
cd /root/.openclaw/workspace-agentleaderboards/repo/scripts
node monitor-new-models.js
```

### View Last Report

```bash
cat ../data/new-models-report.json
```

### Check Specific Model

```bash
# Search for model in report
cat ../data/new-models-report.json | jq '.newModels[] | select(.name | contains("kimi"))'
```

## Automated Scheduling

### Option 1: GitHub Actions (Recommended)

The workflow `.github/workflows/monitor-new-models.yml` runs daily at 9 AM UTC.

**Features:**
- Automatic issue creation when new models found
- Commits report to repo
- No server required

**To enable:**
1. Push to GitHub
2. Enable Actions in repo settings
3. Workflow runs automatically

### Option 2: OpenClaw Cron Job

Add to OpenClaw gateway cron:

```javascript
{
  "name": "AgentLeaderboards Model Monitor",
  "schedule": {
    "kind": "cron",
    "expr": "0 9 * * *", // Daily at 9 AM UTC
    "tz": "UTC"
  },
  "payload": {
    "kind": "systemEvent",
    "text": "Run model monitor: cd /root/.openclaw/workspace-agentleaderboards/repo/scripts && node monitor-new-models.js"
  },
  "sessionTarget": "main",
  "notify": true
}
```

### Option 3: Server Crontab

```bash
# Add to crontab
crontab -e

# Add this line:
0 9 * * * cd /root/.openclaw/workspace-agentleaderboards/repo/scripts && node monitor-new-models.js
```

## Adding a Detected Model

When a new model is flagged:

1. **Check the report:**
   ```bash
   cat data/new-models-report.json
   ```

2. **Search for benchmark data:**
   - Visit model's Hugging Face page
   - Check LM Council benchmarks
   - Read the research paper
   - Look for SWE-bench, GPQA, MMLU scores

3. **Add to agents.js:**
   ```javascript
   {
       id: "new-model-id",
       name: "New Model Name",
       provider: "Provider",
       category: "coding", // or "reasoning", "research", "analysis", "all"
       score: 85.0, // Calculate average of benchmarks
       benchmarks: {
           "GPQA Diamond": 85.5,
           "SWE-bench Verified": 72.3,
           // Add actual scores
       },
       pricing: "$X / $Y per 1M tokens",
       priceInput: X,
       priceOutput: Y,
       speed: "Fast", // Fast, Medium, Slow
       context: "XXK tokens",
       rating: 4.5,
       ratingCount: 0, // Start at 0 for new models
       badges: ["New Release"],
       description: "Brief description highlighting key features",
       released: "Feb 2026",
       source: "https://..." // Link to benchmark source
   }
   ```

4. **Test locally:**
   ```bash
   # Open index.html in browser
   # Verify model appears and sorts correctly
   ```

5. **Deploy:**
   ```bash
   git add data/agents.js
   git commit -m "Add [Model Name] to leaderboard"
   git push origin main
   /root/deploy.sh agentleaderboards
   ```

## Notification Setup (Optional)

### Telegram Notifications

Add to `monitor-new-models.js`:

```javascript
// Send Telegram notification
async function notifyTelegram(newModels) {
    const message = `🚨 ${newModels.length} new AI models detected:\n\n${
        newModels.map(m => `• ${m.name}`).join('\n')
    }`;
    
    // Send to Telegram bot
    // (Implementation depends on your setup)
}
```

### Email Notifications

```javascript
// Send email via SendGrid, etc.
async function notifyEmail(report) {
    // Implementation
}
```

## Example: Kimi K2.5

When Kimi K2.5 was released:

1. **Detected by monitor** (Jan 30, 2026)
   - Source: Hugging Face trending
   - Provider: moonshotai (watched)
   - High downloads

2. **Benchmark data found**
   - SWE-bench Verified: 76.8%
   - GPQA Diamond: 87.6%
   - AIME 2025: 96.1%

3. **Added to leaderboard** (same day)
   - Overall score: 89.3
   - Category: coding
   - Badges: #1 SWE-bench, Agent Swarm

## Troubleshooting

**Monitor not finding new models?**
- Check if sources are accessible (firewall, rate limits)
- Verify `SOURCES` URLs in monitor script
- Check last report timestamp

**False positives?**
- Adjust `WATCHED_PROVIDERS` list
- Increase download threshold
- Filter by benchmark keywords

**Missing a known model?**
- Manually trigger: `node monitor-new-models.js`
- Check if model is on Hugging Face
- Verify provider name matches watched list

## Future Enhancements

- [ ] Add OpenAI blog RSS feed
- [ ] Monitor Anthropic announcements
- [ ] Scrape LM Council leaderboard
- [ ] Auto-extract benchmark scores from papers
- [ ] Auto-generate model entries (with review)
- [ ] Weekly digest email
- [ ] Discord/Slack integration

---

Last updated: 2026-02-18
