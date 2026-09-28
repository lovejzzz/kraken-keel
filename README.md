# 海妖龙骨 Kraken Keel

A pixel-art Viking sea brawler that runs in the browser. Hold the deck of your longship against boarders, build ballistas, raise Bon the scarlet macaw, and sail five chapters, from the kraken to Ragnarök.

一款在浏览器里玩的像素风维京海战游戏：守住长船甲板、打退登船的海盗、建造弩炮、养成鹦鹉伙伴 Bon，穿过五章航海图——海妖、霜龙、火巨人苏尔特、死者之船与海拉，直到诸神黄昏的尘世巨蟒。

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

Swings lean toward the cursor; the scatterbow and harpoon aim at it. On touch, attacks aim at the nearest foe.

## Features

- Five chapters on a branching sea chart (fights, elites, wrecks, harbours, fog), each with its own sky, enemies and boss:
  the Fjords (kraken), the Frozen North (frost wyrm), the Fire Isles (Surtr), the Sea of the Dead (Naglfar and Hel) and Ragnarök (Jörmungandr)
- Every boss drops a weapon with its own play style: oar, cutlass (bleed, dash cut), scatterbow (spread shot), lava axe (burning cuts, fire fissure),
  soul harpoon (drag foes to you, or yourself to them) and Thor's hammer (chain lightning, thrown and recalled)
- Up to eight upgrade levels as the chapters go on; weapons turn iron, gilt and finally glowing rune steel, and the longship gains iron straps,
  steel cladding, a gilded prow and sail
- Bon the parrot fights beside you: team-up moves, lightning and phoenix magic, food, gear and a wardrobe, kept between voyages
- Auto-save with continue; clear a chapter to start straight from the next one
- Chinese and English, music and sound toggles; plays on desktop and touch screens

## Build

The game is plain JavaScript on a canvas, no dependencies.

```
python3 tools/build.py      # inlines src/ into index.html and dist/kraken-keel.html
python3 tools/serve.py 8791 # dev server for src/ (open http://localhost:8791/?test)
```

`src/dev-*.js` are play-test helpers used during development and are not part of the build.
