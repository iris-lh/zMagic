# BUGS

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
