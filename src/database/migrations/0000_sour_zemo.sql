CREATE SCHEMA "product_management";
--> statement-breakpoint
CREATE SCHEMA "user_management";
--> statement-breakpoint
CREATE TYPE "public"."typePhone" AS ENUM('mobile', 'home', 'work');--> statement-breakpoint
CREATE TABLE "user_management"."addresses" (
	"address_id" uuid DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"country" varchar(50) NOT NULL,
	"city" varchar(50) NOT NULL,
	"street" varchar(100),
	"postal_code" varchar(20) NOT NULL,
	CONSTRAINT "pk_addresses_address_id" PRIMARY KEY("address_id")
);
--> statement-breakpoint
CREATE TABLE "product_management"."brands" (
	"brand_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL,
	CONSTRAINT "pk_brands_brand_id" PRIMARY KEY("brand_id"),
	CONSTRAINT "uq_brands_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_management"."categories" (
	"category_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(100) NOT NULL,
	"description" text,
	CONSTRAINT "pk_categories_category_id" PRIMARY KEY("category_id"),
	CONSTRAINT "uq_categories_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_management"."categories_to_products" (
	"category_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	CONSTRAINT "pk_categories_to_products_category_id_product_id" PRIMARY KEY("category_id","product_id")
);
--> statement-breakpoint
CREATE TABLE "product_management"."colors" (
	"color_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL,
	"hex_code" varchar(7) NOT NULL,
	CONSTRAINT "pk_colors_color_id" PRIMARY KEY("color_id"),
	CONSTRAINT "uq_colors_name_hex_code" UNIQUE("name","hex_code")
);
--> statement-breakpoint
CREATE TABLE "product_management"."images" (
	"image_id" uuid DEFAULT gen_random_uuid(),
	"variant_id" uuid NOT NULL,
	"url" text NOT NULL,
	CONSTRAINT "pk_images_variant_id" PRIMARY KEY("variant_id")
);
--> statement-breakpoint
CREATE TABLE "user_management"."profiles" (
	"profile_id" uuid DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"avatar_url" text,
	CONSTRAINT "pk_profiles_profile_id" PRIMARY KEY("profile_id"),
	CONSTRAINT "uq_profiles_user_id" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "user_management"."roles" (
	"role_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar NOT NULL,
	CONSTRAINT "pk_roles_role_id" PRIMARY KEY("role_id"),
	CONSTRAINT "uq_roles_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_management"."users" (
	"user_id" uuid DEFAULT gen_random_uuid(),
	"username" varchar(50) NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_users_user_id" PRIMARY KEY("user_id"),
	CONSTRAINT "uq_users_email" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_management"."users_to_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	CONSTRAINT "pk_users_to_roles_user_id_role_id" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "user_management"."phones" (
	"phone_id" uuid DEFAULT gen_random_uuid(),
	"profile_id" uuid NOT NULL,
	"country_code" varchar(5) NOT NULL,
	"phone_number" varchar(20) NOT NULL,
	"type" "typePhone" DEFAULT 'mobile',
	"is_primary" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"update_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_phones_phone_id" PRIMARY KEY("phone_id"),
	CONSTRAINT "uq_phones_country_code_phone_number" UNIQUE("country_code","phone_number")
);
--> statement-breakpoint
CREATE TABLE "user_management"."users_to_products" (
	"user_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"purchase_date" timestamp DEFAULT now(),
	"quantity" integer NOT NULL,
	CONSTRAINT "pk_users_to_products_user_id_product_id_purchase_date" PRIMARY KEY("user_id","product_id","purchase_date")
);
--> statement-breakpoint
CREATE TABLE "product_management"."products" (
	"product_id" uuid DEFAULT gen_random_uuid(),
	"brand_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "pk_products_product_id" PRIMARY KEY("product_id")
);
--> statement-breakpoint
CREATE TABLE "product_management"."product_variants" (
	"variant_id" uuid DEFAULT gen_random_uuid(),
	"product_id" uuid NOT NULL,
	"color_id" uuid NOT NULL,
	"size_id" uuid NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	CONSTRAINT "pk_product_variants_variant_id" PRIMARY KEY("variant_id")
);
--> statement-breakpoint
CREATE TABLE "product_management"."sizes" (
	"size_id" uuid DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL,
	CONSTRAINT "pk_sizes_size_id" PRIMARY KEY("size_id"),
	CONSTRAINT "uq_sizes_name" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "product_management"."stocks" (
	"stock_id" uuid DEFAULT gen_random_uuid(),
	"variant_id" uuid NOT NULL,
	"quantity" integer DEFAULT 0,
	CONSTRAINT "pk_stocks_stock_id" PRIMARY KEY("stock_id")
);
--> statement-breakpoint
ALTER TABLE "user_management"."addresses" ADD CONSTRAINT "fk_addresses_profile_id_profiles_profile_id" FOREIGN KEY ("profile_id") REFERENCES "user_management"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."categories_to_products" ADD CONSTRAINT "fk_categories_to_products_category_id_categories_category_id" FOREIGN KEY ("category_id") REFERENCES "product_management"."categories"("category_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."categories_to_products" ADD CONSTRAINT "fk_categories_to_products_product_id_products_product_id" FOREIGN KEY ("product_id") REFERENCES "product_management"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."images" ADD CONSTRAINT "fk_images_variant_id_product_variants_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_management"."product_variants"("variant_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."profiles" ADD CONSTRAINT "fk_profiles_user_id_users_user_id" FOREIGN KEY ("user_id") REFERENCES "user_management"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."users_to_roles" ADD CONSTRAINT "fk_users_to_roles_user_id_users_user_id" FOREIGN KEY ("user_id") REFERENCES "user_management"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."users_to_roles" ADD CONSTRAINT "fk_users_to_roles_role_id_roles_role_id" FOREIGN KEY ("role_id") REFERENCES "user_management"."roles"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."phones" ADD CONSTRAINT "fk_phones_profile_id_profiles_profile_id" FOREIGN KEY ("profile_id") REFERENCES "user_management"."profiles"("profile_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."users_to_products" ADD CONSTRAINT "fk_users_to_products_user_id_users_user_id" FOREIGN KEY ("user_id") REFERENCES "user_management"."users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_management"."users_to_products" ADD CONSTRAINT "fk_users_to_products_product_id_products_product_id" FOREIGN KEY ("product_id") REFERENCES "product_management"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."products" ADD CONSTRAINT "fk_products_brand_id_brands_brand_id" FOREIGN KEY ("brand_id") REFERENCES "product_management"."brands"("brand_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."product_variants" ADD CONSTRAINT "fk_product_variants_product_id_products_product_id" FOREIGN KEY ("product_id") REFERENCES "product_management"."products"("product_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."product_variants" ADD CONSTRAINT "fk_product_variants_color_id_colors_color_id" FOREIGN KEY ("color_id") REFERENCES "product_management"."colors"("color_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."product_variants" ADD CONSTRAINT "fk_product_variants_size_id_sizes_size_id" FOREIGN KEY ("size_id") REFERENCES "product_management"."sizes"("size_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_management"."stocks" ADD CONSTRAINT "fk_stocks_variant_id_product_variants_variant_id" FOREIGN KEY ("variant_id") REFERENCES "product_management"."product_variants"("variant_id") ON DELETE no action ON UPDATE no action;