drop database if exists polysomething;
create database polysomething;
use polysomething;

create table Person (
   id int auto_increment primary key,
   email varchar(30) not null,
   handle varchar(30) not null,
   password varchar(50),
   role int unsigned not null,  # 0 normal, 1 admin
   unique key(email)
);

create table Project (
   id int auto_increment primary key,
   ownerId int,
   title varchar(80) not null,
   content varchar(10000) not null,
   thumbnail blob(65535) not null,
   contributors varchar(200) not null,
   category varchar(30) not null,
   timePosted bigInt not null,
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade
);

create table Comment (
   id int auto_increment primary key,
   prjId int not null,
   prsId int not null,
   content varchar(1000) not null,
   constraint FKMessage_prjId foreign key (prjId) references Project(id)
    on delete cascade,
   constraint FKMessage_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

create table Likes (
   id int auto_increment primary key,
   prjId int not null,
   prsId int not null,
   constraint FKLike_prjId foreign key (prjId) references Project(id)
    on delete cascade,
   constraint FKLike_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

insert into Person (email, password, handle, role)
 VALUES ("admin@aol.net", "password", "admin", 1);
