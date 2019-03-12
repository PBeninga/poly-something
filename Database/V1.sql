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
   thumbnail varbinary(MAX) not null,
   timePosted bigInt not null,
   constraint FKMessage_ownerId foreign key (ownerId) references Person(id)
    on delete cascade
);

create table Comment (
   id int auto_increment primary key,
   cnvId int not null,
   prsId int not null,
   content varchar(1000) not null,
   constraint FKMessage_cnvId foreign key (prjId) references Conversation(id)
    on delete cascade,
   constraint FKMessage_prsId foreign key (prsId) references Person(id)
    on delete cascade
);

create table Like (
   id int auto_increment primary key,
   prjId int not null,
   prsId int not null,
   constraint FKLike_prjId foreign key (prjId) references Project(id)
    on delete cascade,
   constraint FKLike_prsId foreign key (prsId) references Person(id)
    on delete cascade
)

insert into Person (email, password, handle, role)
 VALUES ("admin@aol.net", "password", "admin", NOW(), 1);
