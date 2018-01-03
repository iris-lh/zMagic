execute unless score @s blaze_powder >= 1 blaze_costs run tellraw @s ["",{"text":"Insufficient reagents!","color":"red","italic":true},{"text":"\nRequired: ","color":"red","italic":true},{"text":"blaze powder","color":"gold"},{"text":" x 4\n","color":"red"}]
execute if score @s blaze_powder >= 1 blaze_costs run setblock ~ ~ ~ minecraft:lava
execute if score @s blaze_powder >= 1 blaze_costs run setblock ~ ~1 ~ minecraft:lava
execute if score @s blaze_powder >= 1 blaze_costs run setblock ~ ~1 ~ minecraft:air
execute if score @s blaze_powder >= 1 blaze_costs run clear @s minecraft:blaze_powder 4