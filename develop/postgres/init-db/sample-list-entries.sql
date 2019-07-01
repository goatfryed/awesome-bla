INSERT INTO "bucket_list" (id, createn_date, last_updated, num_entries, title) values (42, NOW(), NOW(), 0, 'web engineering dreams');

INSERT INTO comment (id, dtype)
    VALUES (1, 'Commentable'),
           (2, 'Commentable'),
           (3, 'Commentable'),
           (4, 'Commentable');
INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id, comment_board_id)
    VALUES (2, 'Think of an bucket list item', NOW(), NOW(), 42, 1),
           (3, 'Learn web development', NOW(), NOW(), 42, 2),
           (5, 'Make an awesome bucket list application', NOW(), NULL, 42, 3),
           (7, 'Pet a dog', NOW(), NULL, 42, 4);

INSERT INTO comment (dtype, id, master_id, parent_id, created, comment)
    VALUES ('Comment', 11, 1, 1, NOW(), 'sounds like a lot of work')
                ,('Comment', 12, 1, 11, NOW(), 'i''m sure, we'' find something')
            ,('Comment', 13, 1, 1, NOW(), 'eat pie')
                ,('Comment', 14, 1, 13, NOW(), 'strawberry pie')
                    ,('Comment', 15, 1, 14, NOW(), 'The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.')
                ,('Comment', 16, 1, 13, NOW(), 'Lucio fulci tremor est dark vivos magna. Expansis creepy arm yof darkness ulnis witchcraft missing carnem armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras. Nihil horum sagittis tincidunt, zombie slack-jawed gelida survival portenta. The unleashed virus est, et iam zombie mortui ambulabunt super terram. Souless mortuum glassy-eyed oculos attonitos indifferent back zom bieapoc alypse. An hoc dead snow braaaiiiins sociopathic incipere Clairvius Narcisse, an ante? Is bello mundi z?')
                    ,('Comment', 17, 1, 16, NOW(), 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby.')
;
