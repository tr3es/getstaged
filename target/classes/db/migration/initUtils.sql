CREATE TABLE IF NOT EXISTS stage(
  stage_id INT,
  student_id INT,
  entreprise_id INT,
  offre_id INT,
  PRIMARY KEY(stage_id)
);

/*INSERT INTO users VALUES('STUDENT',1,'test@email.com','018-10-24 21:33:44', '2018-10-24 21:33:44',false,"toto","toto",1,1);*/
INSERT INTO students VALUES(1,"1111111");
INSERT INTO entreprise_offer VALUES(1, 'Il va falloir faire de la programmation.',12,0,'Le programmeur devra savoir faire de la programmation.','8 a 5 lundi au vendredi',true,2,'hiver 2019','informatique',	0,	'Programmeur');
INSERT INTO stage VALUEs (1,1,1,1);
