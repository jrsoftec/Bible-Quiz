/*
# Seed Bible Quiz Data

1. Purpose
Inserts sample categories and quiz questions covering Old Testament, New Testament, Gospels, and Acts/Epistles.

2. Data
- 4 categories with distinct colors and icons
- 20 questions total (5 per category)
- Questions include Bible verse references
*/

INSERT INTO categories (name, description, icon, color) VALUES
  ('Old Testament', 'Stories, laws, and wisdom from the Old Testament', 'scroll', '#8B5CF6'),
  ('New Testament', 'Teachings and events of the New Testament', 'book-open', '#3B82F6'),
  ('Gospels', 'The life and teachings of Jesus Christ', 'cross', '#EF4444'),
  ('Acts & Epistles', 'The early church and letters of the apostles', 'church', '#10B981')
ON CONFLICT DO NOTHING;

INSERT INTO questions (category_id, question, options, correct_answer, difficulty, reference) VALUES
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Who built the ark?', ARRAY['Noah', 'Moses', 'Abraham', 'David'], 0, 'easy', 'Genesis 6:9'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'What was the first plague of Egypt?', ARRAY['Water turned to blood', 'Frogs', 'Locusts', 'Darkness'], 0, 'medium', 'Exodus 7:14'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Who was swallowed by a great fish?', ARRAY['Jonah', 'Daniel', 'Elijah', 'Elisha'], 0, 'easy', 'Jonah 1:17'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'How many days did God take to create the world?', ARRAY['6 days', '7 days', '10 days', '3 days'], 0, 'easy', 'Genesis 1'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Which king had 700 wives and 300 concubines?', ARRAY['Solomon', 'David', 'Saul', 'Rehoboam'], 0, 'medium', '1 Kings 11:3'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Who led the Israelites into the Promised Land?', ARRAY['Joshua', 'Moses', 'Caleb', 'Aaron'], 0, 'easy', 'Joshua 1:1'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'What was the name of the garden where Adam and Eve lived?', ARRAY['Garden of Eden', 'Garden of Gethsemane', 'Garden of Paradise', 'Garden of Life'], 0, 'easy', 'Genesis 2:8'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Who was known as the father of faith?', ARRAY['Abraham', 'Isaac', 'Jacob', 'Joseph'], 0, 'easy', 'Genesis 12:1'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'Which prophet was taken to heaven in a chariot of fire?', ARRAY['Elijah', 'Elisha', 'Isaiah', 'Jeremiah'], 0, 'medium', '2 Kings 2:11'),
  ((SELECT id FROM categories WHERE name = 'Old Testament'), 'What did God create on the first day?', ARRAY['Light', 'Sun and Moon', 'Land and Sea', 'Animals'], 0, 'easy', 'Genesis 1:3'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Who baptized Jesus?', ARRAY['John the Baptist', 'Peter', 'Paul', 'Matthew'], 0, 'easy', 'Matthew 3:13'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'What was the first miracle of Jesus?', ARRAY['Turning water into wine', 'Feeding the 5000', 'Walking on water', 'Healing the blind man'], 0, 'medium', 'John 2:1'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Who was the first martyr in the New Testament?', ARRAY['Stephen', 'James', 'John', 'Paul'], 0, 'medium', 'Acts 7:59'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Which city was Saul traveling to when he was converted?', ARRAY['Damascus', 'Jerusalem', 'Antioch', 'Rome'], 0, 'medium', 'Acts 9:3'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Who wrote the Book of Revelation?', ARRAY['John', 'Paul', 'Peter', 'Matthew'], 0, 'easy', 'Revelation 1:1'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'What was the profession of Matthew before becoming an apostle?', ARRAY['Tax collector', 'Fisherman', 'Carpenter', 'Tentmaker'], 0, 'medium', 'Matthew 9:9'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'On which day was Jesus resurrected?', ARRAY['The third day', 'The first day', 'The second day', 'The fourth day'], 0, 'easy', 'Matthew 28:1'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Who replaced Judas Iscariot as an apostle?', ARRAY['Matthias', 'Paul', 'Barnabas', 'Silas'], 0, 'medium', 'Acts 1:26'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'Which apostle was a tentmaker by trade?', ARRAY['Paul', 'Peter', 'John', 'Matthew'], 0, 'hard', 'Acts 18:3'),
  ((SELECT id FROM categories WHERE name = 'New Testament'), 'What was the name of the high priest who questioned Jesus?', ARRAY['Caiaphas', 'Annas', 'Herod', 'Pilate'], 0, 'hard', 'Matthew 26:57'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'How many disciples did Jesus have?', ARRAY['12', '10', '7', '70'], 0, 'easy', 'Matthew 10:1'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'What was the name of Jesus'' mother?', ARRAY['Mary', 'Elizabeth', 'Anna', 'Martha'], 0, 'easy', 'Luke 1:27'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'Which Gospel was written by a physician?', ARRAY['Luke', 'Matthew', 'Mark', 'John'], 0, 'medium', 'Luke 1:1'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'How many loaves of bread did Jesus use to feed the 5000?', ARRAY['5', '2', '7', '3'], 0, 'medium', 'Matthew 14:17'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'What was the profession of Peter before following Jesus?', ARRAY['Fisherman', 'Tax collector', 'Carpenter', 'Shepherd'], 0, 'easy', 'Matthew 4:18'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'Which Gospel is the shortest?', ARRAY['Mark', 'Matthew', 'Luke', 'John'], 0, 'hard', 'N/A'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'In which town was Jesus born?', ARRAY['Bethlehem', 'Nazareth', 'Jerusalem', 'Capernaum'], 0, 'easy', 'Matthew 2:1'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'What was the name of the river where Jesus was baptized?', ARRAY['Jordan', 'Nile', 'Euphrates', 'Tigris'], 0, 'easy', 'Matthew 3:6'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'Who was the Roman governor who sentenced Jesus to death?', ARRAY['Pilate', 'Herod', 'Caesar', 'Festus'], 0, 'easy', 'Matthew 27:2'),
  ((SELECT id FROM categories WHERE name = 'Gospels'), 'What was the name of the garden where Jesus prayed before his arrest?', ARRAY['Gethsemane', 'Eden', 'Golgotha', 'Bethany'], 0, 'medium', 'Matthew 26:36'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'On which day did the Holy Spirit come upon the apostles?', ARRAY['Pentecost', 'Passover', 'Sabbath', 'Atonement'], 0, 'medium', 'Acts 2:1'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Who was the first Gentile convert to Christianity?', ARRAY['Cornelius', 'Lydia', 'The Ethiopian Eunuch', 'Sergius Paulus'], 0, 'hard', 'Acts 10:1'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'How many letters did Paul write in the New Testament?', ARRAY['13', '10', '14', '7'], 0, 'medium', 'N/A'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Which city was Paul''s birthplace?', ARRAY['Tarsus', 'Damascus', 'Antioch', 'Jerusalem'], 0, 'hard', 'Acts 22:3'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'What was the name of the shipwreck where Paul was stranded?', ARRAY['Malta', 'Crete', 'Cyprus', 'Patmos'], 0, 'hard', 'Acts 28:1'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Who was the author of the Book of Hebrews?', ARRAY['Unknown', 'Paul', 'Apollos', 'Luke'], 0, 'hard', 'N/A'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Which apostle was imprisoned on the island of Patmos?', ARRAY['John', 'Paul', 'Peter', 'James'], 0, 'medium', 'Revelation 1:9'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'What was the name of the church council in Acts 15?', ARRAY['Jerusalem Council', 'Antioch Council', 'Nicaea Council', 'Ephesus Council'], 0, 'hard', 'Acts 15:1'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Which city was known as the place where disciples were first called Christians?', ARRAY['Antioch', 'Jerusalem', 'Rome', 'Ephesus'], 0, 'medium', 'Acts 11:26'),
  ((SELECT id FROM categories WHERE name = 'Acts & Epistles'), 'Who was the first missionary journey companion of Paul?', ARRAY['Barnabas', 'Silas', 'Timothy', 'Mark'], 0, 'medium', 'Acts 13:2')
ON CONFLICT DO NOTHING;
