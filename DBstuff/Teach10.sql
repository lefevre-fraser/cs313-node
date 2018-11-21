create table person
(	person_id serial primary key
,	fname varchar(40) not null
,	lname varchar(40) not null
,	date_of_birth date not null);

create table parent_child
(	father_id integer not null references person(person_id)
,	mother_id integer not null references person(person_id)
,	child_id integer not null references person(person_id)
,	primary key(father_id, mother_id, child_id));

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Father'
,	'Surname'
,	'1990-06-04');

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Mother'
,	'Surname'
,	'1991-09-08');

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Child'
,	'Surname'
,	'2015-07-20');

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Child2'
,	'Surname'
,	'2015-07-20');

insert into parent_child
(	father_id
,	mother_id
,	child_id)
values
(	(select person_id from person where fname = 'Father')
,	(select person_id from person where fname = 'Mother')
,	(select person_id from person where fname = 'Child'));

insert into parent_child
(	father_id
,	mother_id
,	child_id)
values
(	(select person_id from person where fname = 'Father')
,	(select person_id from person where fname = 'Mother')
,	(select person_id from person where fname = 'Child2'));