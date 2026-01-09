```bash
node --prof --no-turbo-inlining ./tooling/score_sequence_difficulty.ts ./tooling/sequences/TEST.txt
node --prof-process --preprocess -j isolate-*.log > profile.json
```