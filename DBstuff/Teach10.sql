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

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Mother2'
,	'Surname'
,	'2017-03-09');

insert into person
(	fname
,	lname
,	date_of_birth)
values
(	'Child3'
,	'Surname'
,	'2030-04-05');

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

insert into parent_child
(	father_id
,	mother_id
,	child_id)
values
(	(select person_id from person where fname = 'Child')
,	(select person_id from person where fname = 'Mother2')
,	(select person_id from person where fname = 'Child3'));

select 
	case when c.person_id = 3 then c.fname || ' ' || c.lname
	     when m.person_id = 3 then m.fname || ' ' || m.lname
	     when f.person_id = 3 then f.fname || ' ' || f.lname
	end as person_name,
	case when f.person_id = 3 then 'PERSON'
		 else f.fname || ' ' || f.lname
	end as father_name,
	case when m.person_id = 3 then 'PERSON'
		 else m.fname || ' ' || m.lname
	end as mother_name,
	case when c.person_id = 3 then 'PERSON'
		 else c.fname || ' ' || c.lname
	end as child_name
from 
	parent_child pc
inner join 
	person c
on c.person_id = pc.child_id
inner join
	person f
on f.person_id = pc.father_id
inner join
	person m
on m.person_id = pc.mother_id
where pc.father_id = 3
or pc.mother_id = 3
or pc.child_id = 3;