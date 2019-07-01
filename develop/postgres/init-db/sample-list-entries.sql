INSERT INTO "bucket_list" (id, createn_date, last_updated, num_entries, title) values (1, NOW(), NOW(), 0, 'web engineering dreams');

INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id) VALUES (2, 'Think of an bucket list item', NOW(), NOW(), 1);
INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id) VALUES (3, 'Learn web development', NOW(), NOW(), 1);
INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id) VALUES (5, 'Make an awesome bucket list application', NOW(), NULL, 1);
INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id) VALUES (7, 'Pet a dog', NOW(), NULL, 1);

INSERT INTO comment (id, master_id, parent_id, created, comment) values (1, 2, null, NOW(), 'sounds like a lot of work');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (2, 2, 1, NOW(), 'i''m sure, we'' find something');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (3, 2, null, NOW(), 'eat pie');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (4, 2, 3, NOW(), 'strawberry pie');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (5, 2, 4, NOW(), 'The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (6, 2, 3, NOW(), 'Lucio fulci tremor est dark vivos magna. Expansis creepy arm yof darkness ulnis witchcraft missing carnem armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras. Nihil horum sagittis tincidunt, zombie slack-jawed gelida survival portenta. The unleashed virus est, et iam zombie mortui ambulabunt super terram. Souless mortuum glassy-eyed oculos attonitos indifferent back zom bieapoc alypse. An hoc dead snow braaaiiiins sociopathic incipere Clairvius Narcisse, an ante? Is bello mundi z?');
INSERT INTO comment (id, master_id, parent_id, created, comment) values (7, 2, 6, NOW(), 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby.');
