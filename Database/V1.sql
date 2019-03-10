create table Person (
   id int auto_increment primary key,
   firstName varchar(30),
   lastName varchar(30) not null,
   email varchar(30) not null,
   password varchar(50),
   whenRegistered  bigInt not null,
   termsAccepted bigInt,
   role int unsigned not null,  # 0 normal, 1 admin
   unique key(email)
);

create table Conversation (
   id int auto_increment primary key,
   ownerId int,
   title varchar(80) not null,
   lastMessage bigInt,
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade,
   unique key UK_title(title)
);

create table Message (
   id int auto_increment primary key,
   cnvId int not null,
   prsId int not null,
   whenMade bigInt not null,
   content varchar(5000) not null,
   constraint FKMessage_cnvId foreign key (cnvId) references Conversation(id)
    on delete cascade,
   constraint FKMessage_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

insert into Person (firstName, lastName, email, password, whenRegistered, role)
            VALUES ("Joe",     "Admin", "adm@11.com", "password", NOW(), 1);
