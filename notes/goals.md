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
