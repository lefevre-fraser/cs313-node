-- --------------------------------------------------------------
-- Create Table To Keep Track Of All Table Names
-- --------------------------------------------------------------
create table table_names
(	table_name varchar(40) unique);


-- --------------------------------------------------------------
-- Create Admin User Table
--	then add the table name to table_names
-- --------------------------------------------------------------
create table admin_users
(	admin_user_id integer primary key
,	admin_user_name varchar(40) not null);
insert into table_names values
(	'ADMIN_USERS');

-- add SYSADMIN as the first admin user
insert into admin_users
(	admin_user_id
,	admin_user_name
)
values
(	0001
,	'SYSADMIN'
);


-- --------------------------------------------------------------
-- Create Area Codes Table
--	then add the table name to table_names
-- --------------------------------------------------------------
create table area_codes
(	area_code_id integer primary key
,	area_code varchar(3) not null unique
,	last_changed_by integer references admin_users(admin_user_id)
,	last_changed_date date not null
,	created_by integer references admin_users(admin_user_id)
,	creation_date date not null);
insert into table_names values
(	'AREA_CODES');

-- area code sequence for adding new area codes
create sequence area_codes_s1 start with 1000;


-- --------------------------------------------------------------
-- Create User Table
--	then add the table name to table_names
-- --------------------------------------------------------------
create table users
(	user_id integer primary key
,	user_name varchar(40) not null unique
,	fname varchar(40) not null
,	mname varchar(40)
,	lname varchar(40) not null
,	area_code_id integer references area_codes(area_code_id)
,	phone_number varchar(8) not null
,	hashed_password text not null
,	last_changed_by integer references admin_users(admin_user_id)
,	last_changed_date date not null
,	created_by integer references admin_users(admin_user_id)
,	creation_date date not null);
insert into table_names values
(	'USERS');

-- user sequence for adding new users
create sequence users_s1 start with 1000;


-- --------------------------------------------------------------
-- Create Assets Table
--	then add the table name to table_names
-- --------------------------------------------------------------
create table assets
(	asset_id integer primary key
,	asset_name text not null unique
,	last_changed_by integer references admin_users(admin_user_id)
,	last_changed_date date not null
,	created_by integer references admin_users(admin_user_id)
,	creation_date date not null);
insert into table_names values
(	'ASSETS');

-- asset sequence for adding new users
create sequence assets_s1 start with 1000;


-- --------------------------------------------------------------
-- Create User's Asstes Table
--	then add the table name to table_names
-- --------------------------------------------------------------
create table user_assets
(	user_id integer references users(user_id)
,	asset_id integer references assets(asset_id)
,	quantity integer not null
,	asset_value bigint not null
,	last_changed_by integer references admin_users(admin_user_id)
,	last_changed_date date not null
,	created_by integer references admin_users(admin_user_id)
,	creation_date date not null
,	primary key (user_id, asset_id, asset_value));
insert into table_names values
(	'USER_ASSETS');


-- --------------------------------------------------------------
-- Insert In Testing Data
-- --------------------------------------------------------------
insert into area_codes
(	area_code_id
,	area_code
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	nextval('area_codes_s1')
,	'702'
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);

insert into users
(	user_id
,	user_name
,	fname
,	mname
,	lname
,	area_code_id
,	phone_number
,	hashed_password
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	nextval('users_s1')
,	'lefeve'
,	'Fraser'
,	'A'
,	'LeFevre'
,	(select area_code_id from area_codes where area_code = '702')
,	'960-3038'
,	'$2y$08$NWRvYXNkbHZ1YTthc25mZOc5GiQvbMkRgQhkcU8e7FgP5fKS2nDTO'
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);

insert into assets
(	asset_id
,	asset_name
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	nextval('assets_s1')
,	'Lap Top'
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);

insert into user_assets
(	user_id
,	asset_id
,	quantity
,	asset_value
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	(select user_id from users where user_name = 'lefeve')
,	(select asset_id from assets where asset_name = 'Lap Top')
,	4
,	500
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);

insert into assets
(	asset_id
,	asset_name
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	nextval('assets_s1')
,	'Couch'
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);

insert into user_assets
(	user_id
,	asset_id
,	quantity
,	asset_value
,	last_changed_by
,	last_changed_date
,	created_by
,	creation_date)
values
(	(select user_id from users where user_name = 'lefeve')
,	(select asset_id from assets where asset_name = 'Couch')
,	1
,	80
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date
,	(select admin_user_id from admin_users where admin_user_name = 'SYSADMIN')
,	current_date);
