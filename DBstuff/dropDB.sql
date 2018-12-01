drop table admin_users, area_codes, users, assets, user_assets;
drop sequence area_codes_s1, users_s1, assets_s1;

drop table table_names;

drop function insert_user
(	f_user_name 	varchar(40)
,	f_fname 		varchar(40)
,	f_lname 		varchar(40)
,	f_area_code 	varchar(3)
,	f_phone_number 	varchar(8)
,	f_salt_id 		integer
,	f_hashed_password text
,	f_mname 		varchar(40)
);

drop function insert_asset
(	f_user_name 	varchar(40)
,	f_quantity 		integer
,	f_asset_value 	bigint
,	f_asset_name 	text
);

drop function change_user_asset
(	f_user_name 		varchar(40)
,	f_asset_id 	 		integer
,	f_asset_value 		bigint
,	f_old_asset_value 	bigint
,	f_quantity 			integer
);