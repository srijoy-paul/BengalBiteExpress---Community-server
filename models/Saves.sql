CREATE TABLE saves(
user_id INT NOT NULL,
post_id INT NOT NULL,
CONSTRAINT fk_usermodel
 FOREIGN KEY(user_id)
         REFERENCES userinfo(id),
CONSTRAINT fk_postmodel
 FOREIGN KEY(post_id)
         REFERENCES posts(post_id)
);