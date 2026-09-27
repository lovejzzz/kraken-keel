# 海妖龙骨 Kraken Keel

A pixel-art Viking sea brawler that runs in the browser. Hold the deck of your longship against boarders, build ballistas, raise Bon the scarlet macaw, and sail two chapters to the kraken and the frost wyrm.

一款在浏览器里玩的像素风维京海战游戏：守住长船甲板、打退登船的海盗、建造弩炮、养成鹦鹉伙伴 Bon，穿过两章航海图，迎战海妖与霜龙。

**Play:** https://lovejzzz.github.io/kraken-keel/

## Controls

| | Keyboard / mouse | Touch |
|---|---|---|
| Move | A / D | ◀ ▶ |
| Jump (double jump) | Space / W | JUMP |
| Attack · hold to charge | Left mouse · hold, or right mouse | ATK (hold) |
| Roll | Shift | ROLL |
| Brace | S | BRACE |
| Patch holes, light braziers | E | E |
| Switch weapon | Q | Q |
| Pause | Esc | ⚙ |

Swings lean toward the cursor; the scatterbow aims at it. On touch, attacks aim at the nearest foe.

## Features

- Two chapters on a branching sea chart (fights, elites, wrecks, harbours, fog), ending with the kraken and the frost wyrm
- Three weapons with their own play styles: oar, cutlass (bleed, dash cut) and scatterbow (spread shot, piercing charge)
- Bon the parrot fights beside you: team-up moves, lightning and phoenix magic, food, gear and a wardrobe, kept between voyages
- Auto-save with continue; clear chapter 1 to start straight from chapter 2
- Chinese and English, music and sound toggles; plays on desktop and touch screens

## Build

The game is plain JavaScript on a canvas, no dependencies.

```
python3 tools/build.py      # inlines src/ into index.html and dist/kraken-keel.html
python3 tools/serve.py 8791 # dev server for src/ (open http://localhost:8791/?test)
```

`src/dev-*.js` are play-test helpers used during development and are not part of the build.
