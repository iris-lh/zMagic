# desired file structure
```
zMagic/
  pack.mcmeta
  data/
    minecraft/
      tags/
        functions/
          tick.json
    zmagic/
      functions/
        init.mcfunction
        tick.mcfunction
        misc_root_function_1.mcfunction
        misc_root_function_2.mcfunction
        misc_root_function_3.mcfunction
        cast/
          spell_1.mcfunction
          spell_2.mcfunction
          spell_3.mcfunction
        give_book/
          book_1.mcfunction
          book_2.mcfunction
          book_3.mcfunction
        init/
          constants.mcfunction
          objectives.mcfunction
          triggers.mcfunction
        reagents/
          tick.mcfunction
        triggers/
          tick.mcfunction
      tags/
        blocks/
          buildable.json
        functions/
          books.json
```

under this new system, each spell yaml will specify a trigger name. For example, "Fireball" gets "fireballI", "fireballII", "fireballiii". A long spell name like "Wrath of the Forgotten King" with more than 16 characters would need a shortened trigger name like "wrathOfKingIII".

Sounds like a human's job, honestly. The human-specified trigger name ideally would be no more than 13 characters long in order to make room for tier roman numerals. Could incorporate some error handling to that effect.

The goal is to have everything in /data built out with Node, giving me quite possibly the dryest code of any datapack maker. :)
Ultimately, I'd also like the majority of these systems and tools to be useable for future datapack projects.



# schools of magic

## Summary
There are multiple schools of magic, each with its own domains, play style, and spell selection. A spell can be adopted by multiple schools.



## gnosis
triggers 0-99

#### description
spells based around stealth, agility, and gathering intelligence.

#### domains
- knowledge
- mobility
- stealth
- water

#### reagents
- lapis

#### example spells:
- detect monsters
  - detect mobs within a certain radius
- detect humans
  - detect players within a certain radius
- reveal monsters
  - apply glowing effect within radius
- reveal humans
- invisibility
  - cause invisibility effect
  - POSSIBLY use scoreboard magic to give channeling cost
- blinding flash
  - inflict blindness on others within radius
- detect treasure??
  - search nearby blocks for containers with loot?
- agility
  - increase movement speed and jump height




## ignus
triggers 100-199

#### description
extremely destructive but expensive fire-based spells. many ignan spells pose a danger to the caster if not handled carefully.

#### domains
- fire
- destruction
- marksmanship

#### reagents
- blaze powder

#### example spells
- fireball
  - summon launchable fireball at current location. multiple tiers
- exploding arrow
  - detonate special arrows after firing
  - will require some very complex entity manipulation
- resist fire
  - basic fire resistance effect. channelled?
- lava flow
  - summon lava block at current location
- self destruct
  - create  explosion at own location (should be certain suicide)
- summon blaze
  - does what it says on the tin



## terra
triggers 200-299

#### description
magic focused on nature, mining, and terrain manipulation. terran magic tends to be more defensive.

#### domains
- protection
- mining
- nature

#### reagents
- iron

#### example spells
- tunnel
  - digs blocks in direction caster is facing
- summon golem
  - summons iron golem with limited lifespan
- canopy
  - protective spell that encases caster in a tree
- iron hide
  - boost caster's armor and reduce knockback received
- [insert name having to do with good mining or strong arms]
  - boost mining speed
- conjure food
  - yum



## chaos
triggers 300-399

#### description
a school of magic that deals with necromancy, poison, murder, and (as the name would suggest) sowing chaos.

#### domains
- death
- confusion
- affliction

#### reagents
- bonesmeal

#### example spells
- summon skeleton
  - summon a skeleton
  - currently no way to have it on your team (as far as I know)
- summon zombie
  - same as above
- summon pigmen
  - summons a pack of zombie pigmen
- lightning strike
  - summon a lightning bolt
- gather skeletons
  - teleports all skeletons within a certain radius to current location
- scramble
  - teleport all players and mobs within a certain radius in random directions
- plague



## aurus
triggers 400-499

#### description
auran magic focuses on the improvement of the body.

#### domains
- bodily augmentation
- healing

#### reagents
- glowstone

#### example spells
- strength
- agility
- iron hide
- mending
- cure
- resist fire
- night vision
- water breathing
