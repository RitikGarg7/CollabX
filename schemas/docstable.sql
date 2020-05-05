create table newdoc( id INT NOT NULL AUTO_INCREMENT,
                      Doc_name Varchar(20) NOT NULL UNIQUE,
                      created_by Varchar(30),
                      created_at TIMESTAMP DEFAULT now(),
                      content TEXT  ,
                      PRIMARY KEY (id)
                      );

 