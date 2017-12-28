tell @p THIS IS THE NODE.JS VERSION OF "Fireball I"
execute unless score @p LAPIS >= tier2 [object Object] run tellraw @p ["",{"text":"Insufficient reagents!","color":"red","italic":true}]
execute if score @p LAPIS >= tier2 [object Object] summon minecraft:fireball ~ ~1 ~ {"ExplosionPower":1,"direction":[0,0,0],"Motion":[0,0,0]}
execute if score @p LAPIS >= tier2 [object Object] run clear @p minecraft:lapis_lazuli 4