# BUGS
I really should be reporting these.


## Items with custom names
version: 18w50a
On minecraft 18w01a there is a bug that causes the game to crash if you select an item with the wrong JSON formatting in its display.Name data.

#### To reproduce:
Literally just give yourself an item the "wrong" way.
```
/give zinnoa minecraft:paper{display: {Name: "Ignus Page I"}}
```

#### Workaround:

For a while I was worried this would completely prevent me from using custom-named items.
Luckily, you just need to make sure to cross your T's and dot your I's when writing display.Name JSON.

Example:

```
/give zinnoa minecraft:paper{display: {Name: "{\"text\":\"Ignus Page I\"}"}}
```


## Killing blows from player-launched projectiles
version: 18w50a
They currently crash the game for some reason. Who knows.

UPDATE: seems to happen with any lethal player-launched projectile.

#### To reproduce:
Get on LAN and try any of the following:
- Kill another player with a fireball you summoned.
- Kill another player with a with an arrow.
- Kill yourself with an arrow.
- Kill another player with a potion of harming.
- Kill yourself with a potion of harming.

Need to figure out if it happens in other contexts.


#### Workaround:
None yet. I want to have fiery wizard duels, and to the death, dang it!


## Shooting arrows with downward levitation effect
version: 18w50a
For some reason, a downward levitation effecct (amplifiers 128-255) causes a player to be unable to shoot arrows. Which defeats the entire purpose of the Eagle Eye spell.

#### To reproduce:
```
/effect give @s minecraft:levitation 10 255
```
and try to shoot an arrow.


#### Workaround:
Currently the only workarounds I can think of are to either remove the levitation effect and have Eagle Eye root the caster in place, or to use a upward levitation effect (amplifier 0) and deal with the annoyances that creates.

Neither workaround is really ideal.
