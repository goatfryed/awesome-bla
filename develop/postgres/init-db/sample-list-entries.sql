TRUNCATE bucket_list CASCADE;
TRUNCATE comment CASCADE;
TRUNCATE bucket_list_entry_comments CASCADE;
TRUNCATE comment_comments CASCADE;
TRUNCATE bucket_list_comments CASCADE;
TRUNCATE users CASCADE;
TRUNCATE bucket_list_accessed_users CASCADE;

INSERT INTO users (id,user_name,full_name) VALUES (101,'Test User 1','Tests 1 Full Name');
INSERT INTO users (id,user_name,full_name) VALUES (102,'Test User 2','Tests 2 Full Name');
INSERT INTO users (id,user_name,full_name) VALUES (103,'Test User 3','Tests 3 Full Name');
INSERT INTO users (id,user_name,full_name) VALUES (104,'Test User 4','Tests 4 Full Name');

INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (50, NOW(), NOW(), 0, 'Public Liste 1',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (51, NOW(), NOW(), 0, 'Public Liste 2',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (52, NOW(), NOW(), 0, 'Public Liste 3',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (53, NOW(), NOW(), 0, 'Public Liste 4',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (54, NOW(), NOW(), 0, 'Public Liste 5',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (55, NOW(), NOW(), 0, 'Public Liste 6',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (56, NOW(), NOW(), 0, 'Public Liste 7',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (57, NOW(), NOW(), 0, 'Public Liste 8',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (58, NOW(), NOW(), 0, 'Public Liste 9',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (59, NOW(), NOW(), 0, 'Public Liste 10',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (60, NOW(), NOW(), 0, 'Public Liste 11',false,101);

INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (42, NOW(), NOW(), 0, 'web engineering dreams',false,101);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (43, NOW(), NOW(), 0, 'private web engineering dreams',true,102);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (44, NOW(), NOW(), 0, 'private web dreams for test uesr 1',true,102);
INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (45, NOW(), NOW(), 0, 'Test users Private List',true,101);

INSERT INTO "bucket_list" (id, creation_date, last_updated, num_entries, title, private_list,owner_id) values (666, NOW(), NOW(), 0, 'thing'' i wanna fail at', false,103);

INSERT INTO "public"."bucket_list_entry" ("id", "title", "created", "completed", bucket_list_id)
    VALUES (1001, 'Think of an bucket list item', NOW(), NOW(), 42),
           (2001, 'Learn web development', NOW(), NOW(), 42),
           (3001, 'Make an awesome bucket list application', NOW(), NULL, 42),
           (4001, 'Pet a dog', NOW(), NULL, 42)
;

INSERT INTO comment (id, created, comment)
    VALUES (101, NOW(), 'sounds like a lot of work')
                ,(10101, NOW(), 'i''m sure, we'' find something')
            ,(201, NOW(), 'eat pie')
                ,(20101, NOW(), 'strawberry pie')
                ,(20102, NOW(), 'chcocolate pie')
            ,(301, NOW(), 'The voodoo sacerdos flesh eater, suscitat mortuos comedere carnem virus. Zonbi tattered for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo horror. Nigh tofth eliv ingdead.')
                ,(30101, NOW(), 'Lucio fulci tremor est dark vivos magna. Expansis creepy arm yof darkness ulnis witchcraft missing carnem armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras. Nihil horum sagittis tincidunt, zombie slack-jawed gelida survival portenta. The unleashed virus est, et iam zombie mortui ambulabunt super terram. Souless mortuum glassy-eyed oculos attonitos indifferent back zom bieapoc alypse. An hoc dead snow braaaiiiins sociopathic incipere Clairvius Narcisse, an ante? Is bello mundi z?')
                    ,(301011, NOW(), 'Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora quaeritis. Summus brains sit​​, morbo vel maleficia? De apocalypsi gorger omero undead survivor dictum mauris. Hi mindless mortuis soulless creaturas, imo evil stalking monstra adventus resi dentevil vultus comedat cerebella viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby.')
;

INSERT INTO bucket_list_entry_comments (bucket_list_entry_id, comments_id)
    VALUES
    (1001, 101),
    (1001, 201),
    (1001, 301)
;

INSERT INTO comment_comments (comment_id, comments_id)
    VALUES
    (101, 10101),
    (201, 20101),
    (201, 20102),
    (301, 30101),
    (30101, 301011)
;

INSERT INTO comment (id, created, comment)
    VALUES
    (42100, NOW(), 'I should buy a boat and quit my job'),
    (42200, NOW(), 'Web Engineering is dead. We should focus on desktop applications!'),
    (42300, NOW(), 'We should definetliy learn Reason instead of Typescript'),
    (42400, NOW(), 'I hope, i get to know nice people')
;

INSERT INTO bucket_list_comments (bucket_list_id, comments_id)
    VALUES
    (42, 42100),
    (42, 42200),
    (42, 42300),
    (42, 42400)
;

INSERT INTO bucket_list_accessed_users (bucket_list_id,accessed_users_id) VALUES (44,101);