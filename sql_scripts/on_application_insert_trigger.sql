delimiter //
create trigger if not exists on_application_insert
after insert 
on Application For each row
begin
	declare roll_number varchar(20) default '';
    declare curr_application_id int default 0;
    declare rowcount int default 0;
    declare req_fdose_id varchar(75) default '';
    declare req_sdose_id varchar(75) default '';
    declare req_rtpcr_id varchar(75) default '';
    
    -- Selecting student roll number
    set roll_number = new.student_roll_number;
    set curr_application_id = new.application_id;
    
    select count(*) into rowcount from first_dose_b where student_roll_number = roll_number;
    set rowcount = rowcount -1 ;
    if rowcount <> -1 then
		set req_fdose_id = (select Fdose_id from first_dose_b where student_roll_number = roll_number limit 1 offset rowcount);
    end if;
    
    select count(*) into rowcount from second_dose_b where student_roll_number = roll_number;
    set rowcount = rowcount -1 ;
	if rowcount <> -1 then
		select Sdose_id into req_sdose_id from second_dose_b where student_roll_number = roll_number limit 1 offset rowcount;
    end if;
    
    select count(*) into rowcount from rtpcr_b where student_roll_number = roll_number;
    set rowcount = rowcount -1 ;
	if rowcount <> -1 then	
		select rtpcr_id into req_rtpcr_id from rtpcr_b where student_roll_number = roll_number limit 1 offset rowcount;
    end if;
    
    if req_fdose_id <> '' then
		insert into has_certificate_of_fd values(curr_application_id,req_fdose_id);
	end if;
    if req_sdose_id <> '' then
		insert into has_certificate_of_sd values(curr_application_id,req_sdose_id);
	end if;
    if req_rtpcr_id <> '' then
		insert into has_report_of values(curr_application_id,req_rtpcr_id);
	end if;
end //
delimiter ;
