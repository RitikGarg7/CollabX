CREATE TABLE newuser( id MEDIUMINT NOT NULL AUTO_INCREMENT,
                      Username varchar(30) NOT NULL UNIQUE,
                      password varchar(15) NOT NULL,
                      created_at TIMESTAMP DEFAULT now(),
                      PRIMARY KEY (id)
                      );

INSERT INTO newuser(Username,password) VALUES('ritik7garg@gmail.com','noneofbusiness');
INSERT INTO newuser(Username,password) VALUES('kashgarg@gmail.com','wpa21234');


