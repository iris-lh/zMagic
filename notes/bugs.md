# BUGS


## Items with custom names
last seen: 18w50a

[tracked here](https://bugs.mojang.com/browse/MC-123782)

On minecraft 18w01a there is a bug that causes the game to crash if you select an item with the wrong JSON formatting in its display.Name data.

#### To reproduce:
Literally just give yourself an item the "wrong" way.
```
/give zinnoa minecraft:paper{display: {Name: "Ignus Page I"}}
```
[crash report](https://github.com/isaachelbling/zMagic/blob/master/notes/crashes/json-display-name.txt)

#### Workaround:

For a while I was worried this would completely prevent me from using custom-named items.
Luckily, you just need to make sure to cross your T's and dot your I's when writing display.Name JSON.

Example:

```
/give zinnoa minecraft:paper{display: {Name: "{\"text\":\"Ignus Page I\"}"}}
```


## Killing blows from player-launched projectiles
last seen: 18w50a

[tracked here](https://bugs.mojang.com/browse/MC-122883)

They currently crash the game with null pointer exceptions for some reason. Who knows.

UPDATE: seems to happen with any lethal player-launched projectile.

#### To reproduce:
- [Kill another player with a fireball you summoned. (not self)](https://github.com/isaachelbling/zMagic/blob/master/notes/crashes/fireball.txt)
- [Kill any player with a with an arrow.](https://github.com/isaachelbling/zMagic/blob/master/notes/crashes/arrow.txt)
- [Kill any player with a potion of harming.](https://github.com/isaachelbling/zMagic/blob/master/notes/crashes/potion.txt)

Could it be related to ```Entity's Vehicle: ~~ERROR~~ NullPointerException: null```?


#### Workaround:
None yet. I want to have fiery wizard duels, and to the death, dang it!


## Shooting arrows with downward levitation effect
last seen: 18w50a

[tracked here](https://bugs.mojang.com/browse/MC-98222?jql=text%20~%20%22levitation%20bow%22)

For some reason, a downward levitation effecct (amplifiers 128-255) causes a player to be unable to shoot arrows. Which defeats the entire purpose of the Eagle Eye spell.

#### To reproduce:
```
/effect give @s minecraft:levitation 10 255
```
and try to shoot an arrow.


#### Workaround:
Currently the only workarounds I can think of are to either remove the levitation effect and have Eagle Eye root the caster in place, or to use a upward levitation effect (amplifier 0) and deal with the annoyances that creates.

Neither workaround is really ideal.

Unfortunately, there does not appear to be any help on the way from Mojang for this one.
