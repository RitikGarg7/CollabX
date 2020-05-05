create table newcollab( id INT NOT NULL AUTO_INCREMENT,
                      Doc_name varchar(20) NOT NULL,
                      collaborator_name varchar(30) NOT NULL,
                      added_at TIMESTAMP DEFAULT now(),
                      PRIMARY KEY (id,Doc_name,collaborator_name)
 );

insert into newcollab(Doc_name,collaborator) values ('apple','ritik7garg@gmail.com');
insert into newcollab(Doc_name,collaborator) values ('apple','test@gmail.com');


ALTER TABLE newcollab
RENAME COLUMN created_at TO added_at;

ALTER TABLE newcollab
CHANGE COLUMN created_at added_at TIMESTAMP DEFAULT now();
