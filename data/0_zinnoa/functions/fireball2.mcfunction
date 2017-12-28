execute unless score @p LAPIS >= tier4 LAPIS_COSTS run tellraw @p ["",{"text":"Insufficient reagents!","color":"red","italic":true}]

execute if score @p LAPIS >= tier4 LAPIS_COSTS run summon minecraft:fireball ~ ~1 ~ {ExplosionPower:3,direction:[0.0,0.0,0.0],Motion:[0.0,0.0,0.0]}

execute if score @p LAPIS >= tier4 LAPIS_COSTS run clear @p minecraft:lapis_lazuli 16
