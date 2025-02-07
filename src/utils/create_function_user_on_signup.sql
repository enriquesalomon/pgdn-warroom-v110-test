begin
 INSERT INTO public.users(id,email,fullname,contactno,accesstype,createdby,page_permission,user_pass,action_permission,account_role,leader_id,baco_id,brgy,allowed_view_brgy)
  VALUES (NEW.id,NEW.email,NEW.raw_user_meta_data->>'fullname',NEW.raw_user_meta_data->>'contactno',NEW.raw_user_meta_data->>'accesstype',NEW.raw_user_meta_data->>'createdby',NEW.raw_user_meta_data->>'page_permission',NEW.raw_user_meta_data->>'user_pass',NEW.raw_user_meta_data->>'action_permission',NEW.raw_user_meta_data->>'account_role',CAST(NEW.raw_user_meta_data->>'leader_id' AS BIGINT),CAST(NEW.raw_user_meta_data->>'baco_id' AS BIGINT),NEW.raw_user_meta_data->>'brgy',NEW.raw_user_meta_data->>'allowed_view_brgy');
  return NEW;
end;