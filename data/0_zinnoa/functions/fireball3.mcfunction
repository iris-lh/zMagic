#execute unless score @p LAPIS >= tier6 LAPIS_COSTS run tellraw @p ["",{"text":"Insufficient reagents!","color":"red","italic":true}]

execute unless score @p LAPIS >= tier6 LAPIS_COSTS run tellraw @p ["",{"text":"Insufficient reagents!","color":"dark_red","italic":true,"hoverEvent":{"action":"show_text","value":{"text":"L64","color":"aqua","underlined":true,"italic":false}}}]

execute if score @p LAPIS >= tier6 LAPIS_COSTS run summon minecraft:fireball ~ ~1 ~ {ExplosionPower:8,direction:[0.0,0.0,0.0],Motion:[0.0,0.0,0.0]}

execute if score @p LAPIS >= tier6 LAPIS_COSTS run clear @p minecraft:lapis_lazuli 64
