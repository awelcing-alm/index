--
-- PostgreSQL database dump
--

\restrict 9IcvusYe0mpKM7QeHxGfNZbXbP4il2yM2VeV4Rd7Ryrn33vG1XPuUXd2sKVGcop

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.10 (Debian 16.10-1.pgdg12+1)

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: groups_user_count_maintain(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.groups_user_count_maintain() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE groups
       SET user_count = COALESCE(user_count, 0) + 1
     WHERE id = NEW.group_id AND account_id = NEW.account_id;
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.group_id <> OLD.group_id THEN
      UPDATE groups
         SET user_count = GREATEST(0, COALESCE(user_count,0) - 1)
       WHERE id = OLD.group_id AND account_id = OLD.account_id;
      UPDATE groups
         SET user_count = COALESCE(user_count, 0) + 1
       WHERE id = NEW.group_id AND account_id = NEW.account_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE groups
       SET user_count = GREATEST(0, COALESCE(user_count,0) - 1)
     WHERE id = OLD.group_id AND account_id = OLD.account_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END
$$;


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


--
-- Name: sync_users_group_id(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_users_group_id() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users
       SET group_id = NEW.group_id, updated_at = now()
     WHERE external_id = NEW.user_external_id
       AND (account_id::text IS NULL OR account_id::text = NEW.account_id);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    IF NEW.group_id <> OLD.group_id THEN
      UPDATE users
         SET group_id = NEW.group_id, updated_at = now()
       WHERE external_id = NEW.user_external_id
         AND (account_id::text IS NULL OR account_id::text = NEW.account_id);
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users
       SET group_id = NULL, updated_at = now()
     WHERE external_id = OLD.user_external_id
       AND (account_id::text IS NULL OR account_id::text = OLD.account_id);
    RETURN OLD;
  END IF;
  RETURN NULL;
END
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: account_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.account_activity (
    id integer NOT NULL,
    account_id integer,
    date date NOT NULL,
    active_users integer DEFAULT 0,
    pageviews integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: account_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.account_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: account_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.account_activity_id_seq OWNED BY public.account_activity.id;


--
-- Name: accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.accounts (
    id integer NOT NULL,
    external_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    type character varying(50),
    status character varying(50) NOT NULL,
    industry character varying(255),
    website character varying(255),
    contact_name character varying(255),
    contact_email character varying(255),
    contact_phone character varying(50),
    address text,
    total_users integer DEFAULT 0,
    active_users integer DEFAULT 0,
    mrr numeric(10,2),
    subscription_start date,
    next_billing date,
    health_score integer,
    rep_id character varying(50),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.accounts_id_seq OWNED BY public.accounts.id;


--
-- Name: attribute_definitions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attribute_definitions (
    slug text NOT NULL,
    label text,
    input_type text,
    required boolean,
    select_options jsonb
);


--
-- Name: group_memberships; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.group_memberships (
    account_id text NOT NULL,
    user_external_id text NOT NULL,
    group_id uuid NOT NULL,
    assigned_by text,
    assigned_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.groups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    account_id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    color character varying(7),
    icon text,
    default_template text,
    product_grant_ids text[] DEFAULT '{}'::text[] NOT NULL,
    demographics jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    user_count integer DEFAULT 0 NOT NULL
);

ALTER TABLE ONLY public.groups FORCE ROW LEVEL SECURITY;


--
-- Name: newsletters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletters (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: newsletters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletters_id_seq OWNED BY public.newsletters.id;


--
-- Name: product_usage; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_usage (
    id integer NOT NULL,
    account_id integer,
    product_id integer,
    date date NOT NULL,
    pageviews integer DEFAULT 0,
    active_users integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: product_usage_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_usage_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_usage_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_usage_id_seq OWNED BY public.product_usage.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    external_id character varying(255) NOT NULL,
    account_id integer,
    customer_name character varying(255) NOT NULL,
    email character varying(255),
    plan character varying(50) NOT NULL,
    plan_type character varying(50) NOT NULL,
    status character varying(50) NOT NULL,
    amount numeric(10,2),
    billing_cycle character varying(50),
    start_date date,
    next_billing date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: top_pages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.top_pages (
    id integer NOT NULL,
    account_id integer,
    url character varying(255) NOT NULL,
    title character varying(255),
    pageviews integer DEFAULT 0,
    avg_time_on_page integer DEFAULT 0,
    bounce_rate numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: top_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.top_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: top_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.top_pages_id_seq OWNED BY public.top_pages.id;


--
-- Name: user_accounts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_accounts (
    user_id integer NOT NULL,
    account_id integer NOT NULL
);


--
-- Name: user_activity; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_activity (
    id integer NOT NULL,
    user_id integer,
    date date NOT NULL,
    logins integer DEFAULT 0,
    pageviews integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_activity_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_activity_id_seq OWNED BY public.user_activity.id;


--
-- Name: user_newsletters; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_newsletters (
    id integer NOT NULL,
    user_id integer,
    newsletter_id integer,
    subscribed boolean DEFAULT true,
    open_rate numeric(5,2) DEFAULT 0,
    click_rate numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: user_newsletters_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.user_newsletters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: user_newsletters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.user_newsletters_id_seq OWNED BY public.user_newsletters.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    external_id character varying(255) NOT NULL,
    account_id integer,
    email character varying(255) NOT NULL,
    role character varying(50),
    status character varying(50),
    department character varying(255),
    title character varying(255),
    phone character varying(50),
    join_date date,
    last_login timestamp with time zone,
    login_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    attributes jsonb DEFAULT '{}'::jsonb,
    firstname character varying(255),
    lastname character varying(255),
    group_id uuid,
    last_synced_at timestamp with time zone,
    last_source text
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: account_activity id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_activity ALTER COLUMN id SET DEFAULT nextval('public.account_activity_id_seq'::regclass);


--
-- Name: accounts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts ALTER COLUMN id SET DEFAULT nextval('public.accounts_id_seq'::regclass);


--
-- Name: newsletters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletters ALTER COLUMN id SET DEFAULT nextval('public.newsletters_id_seq'::regclass);


--
-- Name: product_usage id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_usage ALTER COLUMN id SET DEFAULT nextval('public.product_usage_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: top_pages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_pages ALTER COLUMN id SET DEFAULT nextval('public.top_pages_id_seq'::regclass);


--
-- Name: user_activity id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity ALTER COLUMN id SET DEFAULT nextval('public.user_activity_id_seq'::regclass);


--
-- Name: user_newsletters id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_newsletters ALTER COLUMN id SET DEFAULT nextval('public.user_newsletters_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: account_activity account_activity_account_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_activity
    ADD CONSTRAINT account_activity_account_id_date_key UNIQUE (account_id, date);


--
-- Name: account_activity account_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_activity
    ADD CONSTRAINT account_activity_pkey PRIMARY KEY (id);


--
-- Name: accounts accounts_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_external_id_key UNIQUE (external_id);


--
-- Name: accounts accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.accounts
    ADD CONSTRAINT accounts_pkey PRIMARY KEY (id);


--
-- Name: attribute_definitions attribute_definitions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attribute_definitions
    ADD CONSTRAINT attribute_definitions_pkey PRIMARY KEY (slug);


--
-- Name: group_memberships group_memberships_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_pkey PRIMARY KEY (account_id, user_external_id);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: newsletters newsletters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletters
    ADD CONSTRAINT newsletters_pkey PRIMARY KEY (id);


--
-- Name: product_usage product_usage_account_id_product_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_usage
    ADD CONSTRAINT product_usage_account_id_product_id_date_key UNIQUE (account_id, product_id, date);


--
-- Name: product_usage product_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_usage
    ADD CONSTRAINT product_usage_pkey PRIMARY KEY (id);


--
-- Name: products products_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_name_key UNIQUE (name);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_external_id_key UNIQUE (external_id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: top_pages top_pages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_pages
    ADD CONSTRAINT top_pages_pkey PRIMARY KEY (id);


--
-- Name: user_accounts user_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_pkey PRIMARY KEY (user_id, account_id);


--
-- Name: user_activity user_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_pkey PRIMARY KEY (id);


--
-- Name: user_activity user_activity_user_id_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_user_id_date_key UNIQUE (user_id, date);


--
-- Name: user_newsletters user_newsletters_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_newsletters
    ADD CONSTRAINT user_newsletters_pkey PRIMARY KEY (id);


--
-- Name: user_newsletters user_newsletters_user_id_newsletter_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_newsletters
    ADD CONSTRAINT user_newsletters_user_id_newsletter_id_key UNIQUE (user_id, newsletter_id);


--
-- Name: users users_external_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_external_id_key UNIQUE (external_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: accounts_external_id_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX accounts_external_id_unique ON public.accounts USING btree (external_id);


--
-- Name: gm_by_group; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gm_by_group ON public.group_memberships USING btree (account_id, group_id);


--
-- Name: gm_by_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX gm_by_user ON public.group_memberships USING btree (account_id, user_external_id);


--
-- Name: groups_account_id_slug_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX groups_account_id_slug_key ON public.groups USING btree (account_id, slug);


--
-- Name: idx_accounts_rep_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_accounts_rep_id ON public.accounts USING btree (rep_id);


--
-- Name: idx_groups_account; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_account ON public.groups USING btree (account_id);


--
-- Name: idx_groups_account_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_groups_account_id ON public.groups USING btree (account_id);


--
-- Name: idx_users_team_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_team_id ON public.users USING btree (group_id);


--
-- Name: users_account_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_account_email_idx ON public.users USING btree (account_id, email);


--
-- Name: users_account_email_unique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX users_account_email_unique ON public.users USING btree (account_id, lower((email)::text));


--
-- Name: users_account_group_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_account_group_idx ON public.users USING btree (account_id, group_id);


--
-- Name: users_attr_country_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_attr_country_idx ON public.users USING btree (((attributes ->> 'country'::text)));


--
-- Name: users_attr_job_area_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_attr_job_area_idx ON public.users USING btree (((attributes ->> 'job-area'::text)));


--
-- Name: users_attr_job_func_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_attr_job_func_idx ON public.users USING btree (((attributes ->> 'job-function'::text)));


--
-- Name: users_email_lower_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_lower_idx ON public.users USING btree (lower((email)::text));


--
-- Name: group_memberships trg_gm_counts; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_gm_counts AFTER INSERT OR DELETE OR UPDATE ON public.group_memberships FOR EACH ROW EXECUTE FUNCTION public.groups_user_count_maintain();


--
-- Name: group_memberships trg_gm_sync_users; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_gm_sync_users AFTER INSERT OR DELETE OR UPDATE ON public.group_memberships FOR EACH ROW EXECUTE FUNCTION public.sync_users_group_id();


--
-- Name: groups trg_groups_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_groups_updated_at BEFORE UPDATE ON public.groups FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users users_set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: account_activity account_activity_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.account_activity
    ADD CONSTRAINT account_activity_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: group_memberships group_memberships_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE CASCADE;


--
-- Name: group_memberships group_memberships_user_external_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.group_memberships
    ADD CONSTRAINT group_memberships_user_external_id_fkey FOREIGN KEY (user_external_id) REFERENCES public.users(external_id) ON DELETE CASCADE;


--
-- Name: product_usage product_usage_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_usage
    ADD CONSTRAINT product_usage_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: product_usage product_usage_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_usage
    ADD CONSTRAINT product_usage_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: subscriptions subscriptions_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: top_pages top_pages_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.top_pages
    ADD CONSTRAINT top_pages_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: user_accounts user_accounts_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id) ON DELETE CASCADE;


--
-- Name: user_accounts user_accounts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_accounts
    ADD CONSTRAINT user_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: user_activity user_activity_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_activity
    ADD CONSTRAINT user_activity_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: user_newsletters user_newsletters_newsletter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_newsletters
    ADD CONSTRAINT user_newsletters_newsletter_id_fkey FOREIGN KEY (newsletter_id) REFERENCES public.newsletters(id);


--
-- Name: user_newsletters user_newsletters_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_newsletters
    ADD CONSTRAINT user_newsletters_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: users users_account_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.accounts(id);


--
-- Name: users users_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.groups(id) ON DELETE SET NULL;


--
-- Name: group_memberships gm_delete; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY gm_delete ON public.group_memberships FOR DELETE USING (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (current_setting('app.role'::text, true) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (account_id = current_setting('app.account_id'::text, true))));


--
-- Name: group_memberships gm_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY gm_select ON public.group_memberships FOR SELECT USING (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (current_setting('app.role'::text, true) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (account_id = current_setting('app.account_id'::text, true))));


--
-- Name: group_memberships gm_update; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY gm_update ON public.group_memberships FOR UPDATE USING (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (current_setting('app.role'::text, true) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (account_id = current_setting('app.account_id'::text, true)))) WITH CHECK ((account_id = current_setting('app.account_id'::text, true)));


--
-- Name: group_memberships gm_write; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY gm_write ON public.group_memberships FOR INSERT WITH CHECK (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (current_setting('app.role'::text, true) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (account_id = current_setting('app.account_id'::text, true))));


--
-- Name: group_memberships; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.group_memberships ENABLE ROW LEVEL SECURITY;

--
-- Name: groups; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

--
-- Name: groups groups_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY groups_select ON public.groups FOR SELECT USING (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (lower(current_setting('app.role'::text, true)) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (account_id = current_setting('app.account_id'::text, true))));


--
-- Name: users; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

--
-- Name: users users_select; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY users_select ON public.users FOR SELECT USING (((current_setting('app.account_id'::text, true) IS NOT NULL) AND (current_setting('app.role'::text, true) = ANY (ARRAY['owner'::text, 'admin'::text])) AND (EXISTS ( SELECT 1
   FROM public.accounts a
  WHERE ((a.id = users.account_id) AND ((a.external_id)::text = current_setting('app.account_id'::text, true)))))));


--
-- PostgreSQL database dump complete
--

\unrestrict 9IcvusYe0mpKM7QeHxGfNZbXbP4il2yM2VeV4Rd7Ryrn33vG1XPuUXd2sKVGcop

