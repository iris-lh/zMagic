tellraw @p ["",{"text":"\nYou quiet your mind and search for auras...","italic":true}]
execute as @e[distance=..20,type=!item,type=!player] run tellraw @p ["",{"text":"- You sense a ","italic":true},{"selector":"@s","italic":true},{"text":".","italic":true}]
tellraw @p ""
