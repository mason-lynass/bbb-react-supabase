

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgaudit" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."reset_users_average_review_score"() RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
UPDATE users
SET average_review_score = (
    SELECT ROUND(AVG(average_rating)::numeric, 2)
    FROM reviews
    WHERE user_id = users.id
)
WHERE EXISTS (
    SELECT 1
    FROM reviews
    WHERE user_id = users.id
);
end$$;


ALTER FUNCTION "public"."reset_users_average_review_score"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_bathroom_average_score"("newbathroomid" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update bathrooms
  set average_score = (
    SELECT ROUND(AVG(average_rating)::numeric, 2)
    from reviews
    where bathroom_id = newbathroomid
  )
  where id = newbathroomid;
end;$$;


ALTER FUNCTION "public"."update_bathroom_average_score"("newbathroomid" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_bathroom_number_of_favorites"("bathroomid" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update bathrooms
  set number_of_favorites = (
    SELECT COUNT(id)
    from favorites
    where bathroom_id = bathroomid
  )
  where id = bathroomid;
end;$$;


ALTER FUNCTION "public"."update_bathroom_number_of_favorites"("bathroomid" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_user_average_review_score"("userid" "uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$begin
  update users
  set average_review_score = (
    SELECT ROUND(AVG(average_rating)::numeric, 2)
    from reviews
    where user_id = userid
  )
  where id = userid;
end;$$;


ALTER FUNCTION "public"."update_user_average_review_score"("userid" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bathrooms" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "location_name" "text" NOT NULL,
    "address" "text" NOT NULL,
    "description" "text" NOT NULL,
    "neighborhood" "text" NOT NULL,
    "public" boolean NOT NULL,
    "approved" boolean DEFAULT false,
    "latitude" real,
    "longitude" real,
    "external_id" "text",
    "gender_neutral" boolean DEFAULT false,
    "average_score" real,
    "number_of_favorites" smallint DEFAULT '0'::smallint NOT NULL,
    "diaper_changing" boolean DEFAULT false NOT NULL,
    "ada_compliant" boolean DEFAULT false NOT NULL,
    "submitted_by" "uuid",
    CONSTRAINT "bathrooms_location_name_check" CHECK (("length"("location_name") < 100))
);


ALTER TABLE "public"."bathrooms" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bathrooms"."approved" IS 'def false => true when we manually approve it';



COMMENT ON COLUMN "public"."bathrooms"."latitude" IS 'this should come from sending an address to a geocoding API';



COMMENT ON COLUMN "public"."bathrooms"."longitude" IS 'this should come from sending an address to a geocoding API';



COMMENT ON COLUMN "public"."bathrooms"."external_id" IS 'an id associated with this location from Google Places API / MapQuest API / MapBox API, etc.';



COMMENT ON COLUMN "public"."bathrooms"."gender_neutral" IS 'do these facilities have gender-neutral restrooms?';



COMMENT ON COLUMN "public"."bathrooms"."average_score" IS 'average score of reviews associated with this restroom - will be calculted with a DB function each time a new review is added or removed';



COMMENT ON COLUMN "public"."bathrooms"."number_of_favorites" IS 'the number of users that have favorited this bathroom - will be a DB function that runs each time a favorite for this bathroom is added or removed';



COMMENT ON COLUMN "public"."bathrooms"."diaper_changing" IS 'a boolean for diaper changing stations';



COMMENT ON COLUMN "public"."bathrooms"."ada_compliant" IS 'boolean for ADA compliancy';



COMMENT ON COLUMN "public"."bathrooms"."submitted_by" IS '(this should be set to not nullable once everything is labeled)';



ALTER TABLE "public"."bathrooms" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."bathrooms_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."favorites" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bathroom_id" bigint NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."favorites" OWNER TO "postgres";


ALTER TABLE "public"."favorites" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."favorites_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."reviews" (
    "id" bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "bathroom_id" bigint NOT NULL,
    "date" "date" NOT NULL,
    "description" "text" NOT NULL,
    "cleanliness" "text",
    "cleanliness_rating" smallint NOT NULL,
    "function" "text",
    "function_rating" smallint NOT NULL,
    "style" "text",
    "style_rating" smallint NOT NULL,
    "user_id" "uuid" NOT NULL,
    "average_rating" real NOT NULL,
    "photo_approved" boolean DEFAULT false NOT NULL,
    CONSTRAINT "reviews_cleanliness_rating_check" CHECK ((("cleanliness_rating" >= 0) AND ("cleanliness_rating" <= 10))),
    CONSTRAINT "reviews_function_rating_check" CHECK ((("function_rating" >= 0) AND ("function_rating" <= 10))),
    CONSTRAINT "reviews_style_rating_check" CHECK ((("style_rating" >= 0) AND ("style_rating" <= 10)))
);


ALTER TABLE "public"."reviews" OWNER TO "postgres";


COMMENT ON COLUMN "public"."reviews"."average_rating" IS 'this should be an average of the three ratings - calculate before form submission, NOT as a DB function';



COMMENT ON COLUMN "public"."reviews"."photo_approved" IS 'was the photo approved through Cloudinary?';



ALTER TABLE "public"."reviews" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."reviews_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" NOT NULL,
    "email" "text",
    "username" "text",
    "average_review_score" real,
    CONSTRAINT "users_username_check" CHECK (("length"("username") < 40))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


COMMENT ON COLUMN "public"."users"."average_review_score" IS 'the average of all scores from all user reviews - needs a DB function that runs each time a user adds or removes a review';



ALTER TABLE ONLY "public"."bathrooms"
    ADD CONSTRAINT "bathrooms_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."bathrooms"
    ADD CONSTRAINT "bathrooms_submitted_by_fkey" FOREIGN KEY ("submitted_by") REFERENCES "public"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_bathroom_id_fkey" FOREIGN KEY ("bathroom_id") REFERENCES "public"."bathrooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."favorites"
    ADD CONSTRAINT "favorites_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_bathroom_id_fkey" FOREIGN KEY ("bathroom_id") REFERENCES "public"."bathrooms"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reviews"
    ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id");



CREATE POLICY "Enable delete for users based on user_id" ON "public"."favorites" FOR DELETE USING (( SELECT ("auth"."uid"() = "favorites"."user_id")));



CREATE POLICY "Enable insert for authenticated users only" ON "public"."bathrooms" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."favorites" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable insert for authenticated users only" ON "public"."reviews" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Enable read access for all users" ON "public"."bathrooms" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."favorites" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."reviews" FOR SELECT USING (true);



CREATE POLICY "Enable read access for all users" ON "public"."users" FOR SELECT USING (true);



CREATE POLICY "Enable update all for service role" ON "public"."users" FOR UPDATE TO "service_role" USING (true) WITH CHECK (true);



CREATE POLICY "Enable update for users based on email" ON "public"."users" FOR UPDATE USING (((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = "email") OR ( SELECT ("auth"."role"() = 'admin'::"text")))) WITH CHECK ((( SELECT ("auth"."jwt"() ->> 'email'::"text")) = "email"));



ALTER TABLE "public"."bathrooms" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."favorites" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."reviews" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."bathrooms";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."favorites";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."reviews";



ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."users";



REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






































































































































































































GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."reset_users_average_review_score"() TO "anon";
GRANT ALL ON FUNCTION "public"."reset_users_average_review_score"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."reset_users_average_review_score"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_bathroom_average_score"("newbathroomid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_bathroom_average_score"("newbathroomid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_bathroom_average_score"("newbathroomid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_bathroom_number_of_favorites"("bathroomid" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."update_bathroom_number_of_favorites"("bathroomid" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_bathroom_number_of_favorites"("bathroomid" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."update_user_average_review_score"("userid" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."update_user_average_review_score"("userid" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_user_average_review_score"("userid" "uuid") TO "service_role";





















GRANT ALL ON TABLE "public"."bathrooms" TO "anon";
GRANT ALL ON TABLE "public"."bathrooms" TO "authenticated";
GRANT ALL ON TABLE "public"."bathrooms" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bathrooms_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bathrooms_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bathrooms_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."favorites" TO "anon";
GRANT ALL ON TABLE "public"."favorites" TO "authenticated";
GRANT ALL ON TABLE "public"."favorites" TO "service_role";



GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."favorites_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."reviews" TO "anon";
GRANT ALL ON TABLE "public"."reviews" TO "authenticated";
GRANT ALL ON TABLE "public"."reviews" TO "service_role";



GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."reviews_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
