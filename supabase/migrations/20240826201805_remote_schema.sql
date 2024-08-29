create policy "Enable read access for all users"
on "storage"."buckets"
as permissive
for select
to public
using (true);


create policy "Admin can delete banner images jiskx7_0"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'banner_images'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((auth.uid() = p.user_id) AND (p.is_admin = true))))));


create policy "Admin can delete images"
on "storage"."objects"
as permissive
for delete
to authenticated
using (((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.user_id = auth.uid()) AND (p.is_admin = true))))));


create policy "Admin can insert new products 1ifhysk_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((auth.uid() = p.user_id) AND (p.is_admin = true))))));


create policy "Admin can update banner images jiskx7_0"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'banner_images'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((auth.uid() = p.user_id) AND (p.is_admin = true))))))
with check ((bucket_id = 'banner_images'::text));


create policy "Admin can update images"
on "storage"."objects"
as permissive
for update
to authenticated
using (((bucket_id = 'products'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.user_id = auth.uid()) AND (p.is_admin = true))))))
with check ((bucket_id = 'products'::text));


create policy "Admins can insert new banner images jiskx7_0"
on "storage"."objects"
as permissive
for insert
to authenticated
with check (((bucket_id = 'banner_images'::text) AND (EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((auth.uid() = p.user_id) AND p.is_admin)))));


create policy "Enable read access for all users"
on "storage"."objects"
as permissive
for select
to anon, authenticated
using (true);



