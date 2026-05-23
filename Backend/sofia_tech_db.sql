--
-- PostgreSQL database dump
--

\restrict 0DhbdxcCuveEdsgSiyE5Wt9uTfX5xFs74NRgXNewaX7uaU6836DlEEpE0A6B578

-- Dumped from database version 17.9 (Debian 17.9-0+deb13u1)
-- Dumped by pg_dump version 17.9 (Debian 17.9-0+deb13u1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO postgres;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    parent_id integer,
    name character varying(150) NOT NULL,
    slug character varying(150) NOT NULL,
    level smallint NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    order_number character varying(50) NOT NULL,
    user_id character varying(50),
    customer_name character varying(200) NOT NULL,
    customer_email character varying(200) NOT NULL,
    customer_phone character varying(20) NOT NULL,
    customer_address text NOT NULL,
    items text NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    customer_comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: products_brandt; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_brandt (
    id integer NOT NULL,
    category_id integer,
    brand_id integer,
    main_image character varying(500),
    name character varying(255) NOT NULL,
    model character varying(100),
    specifications text,
    design text,
    price numeric(10,2) NOT NULL,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products_brandt OWNER TO postgres;

--
-- Name: products_brandt_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_brandt_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_brandt_id_seq OWNER TO postgres;

--
-- Name: products_brandt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_brandt_id_seq OWNED BY public.products_brandt.id;


--
-- Name: products_dedietrich; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_dedietrich (
    id integer NOT NULL,
    category_id integer,
    brand_id integer,
    main_image character varying(500),
    model character varying(100),
    name character varying(500) NOT NULL,
    line character varying(255),
    specifications text,
    color character varying(100),
    price_public numeric(10,2),
    comment text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.products_dedietrich OWNER TO postgres;

--
-- Name: products_dedietrich_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_dedietrich_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_dedietrich_id_seq OWNER TO postgres;

--
-- Name: products_dedietrich_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_dedietrich_id_seq OWNED BY public.products_dedietrich.id;


--
-- Name: products_homeier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_homeier (
    id integer NOT NULL,
    sku character varying(255) NOT NULL,
    name character varying(500),
    price numeric(10,2),
    category_id integer,
    brand_id integer,
    group_level_1 character varying(255),
    group_level_2 character varying(255),
    main_image character varying(500),
    comment text,
    description text,
    color character varying(100),
    width numeric(10,3),
    height numeric(10,3),
    depth numeric(10,3),
    volume numeric(10,6),
    net_weight numeric(10,3),
    gross_weight numeric(10,3),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.products_homeier OWNER TO postgres;

--
-- Name: products_homeier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_homeier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_homeier_id_seq OWNER TO postgres;

--
-- Name: products_homeier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_homeier_id_seq OWNED BY public.products_homeier.id;


--
-- Name: products_liebherr; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_liebherr (
    id integer NOT NULL,
    category_id integer,
    brand_id integer,
    model character varying(100),
    ean character varying(50),
    status character varying(50),
    name character varying(500) NOT NULL,
    category_name character varying(255),
    production_start integer,
    factory character varying(255),
    warranty integer,
    price_public numeric(10,2),
    price_wholesale numeric(10,2),
    promo_price_public numeric(10,2),
    promo_price_wholesale numeric(10,2),
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.products_liebherr OWNER TO postgres;

--
-- Name: products_liebherr_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_liebherr_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_liebherr_id_seq OWNER TO postgres;

--
-- Name: products_liebherr_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_liebherr_id_seq OWNED BY public.products_liebherr.id;


--
-- Name: products_nivona; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products_nivona (
    id integer NOT NULL,
    category_id integer,
    brand_id integer,
    main_image character varying(500),
    sku character varying(50),
    model character varying(100),
    name character varying(500) NOT NULL,
    description text,
    price_public numeric(10,2),
    comment text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.products_nivona OWNER TO postgres;

--
-- Name: products_nivona_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_nivona_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_nivona_id_seq OWNER TO postgres;

--
-- Name: products_nivona_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_nivona_id_seq OWNED BY public.products_nivona.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    is_admin boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone,
    phone character varying(20),
    address text
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: products_brandt id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_brandt ALTER COLUMN id SET DEFAULT nextval('public.products_brandt_id_seq'::regclass);


--
-- Name: products_dedietrich id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_dedietrich ALTER COLUMN id SET DEFAULT nextval('public.products_dedietrich_id_seq'::regclass);


--
-- Name: products_homeier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_homeier ALTER COLUMN id SET DEFAULT nextval('public.products_homeier_id_seq'::regclass);


--
-- Name: products_liebherr id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_liebherr ALTER COLUMN id SET DEFAULT nextval('public.products_liebherr_id_seq'::regclass);


--
-- Name: products_nivona id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_nivona ALTER COLUMN id SET DEFAULT nextval('public.products_nivona_id_seq'::regclass);


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands (id, name) FROM stdin;
4	Homeier
7	Brandt
8	Liebherr
5	Dedietrich
12	Nivona
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, parent_id, name, slug, level, sort_order, created_at) FROM stdin;
1	\N	Крупная бытовая техника	large-appliances	1	10	2026-05-11 17:02:45.83791+03
2	\N	Встраиваемая техника	built-in-appliances	1	20	2026-05-11 17:02:45.83791+03
3	\N	Мелкая бытовая техника	small-appliances	1	30	2026-05-11 17:02:45.83791+03
4	\N	Аксессуары и комплектующие	accessories	1	40	2026-05-11 17:02:45.83791+03
5	\N	Кухонные блоки	kitchen-blocks	1	50	2026-05-11 17:02:45.83791+03
10	1	Стиральные машины	washing-machines	2	10	2026-05-11 17:02:57.575969+03
11	1	Сушильные машины	dryers	2	20	2026-05-11 17:02:57.575969+03
12	1	Стирально-сушильные машины	washer-dryers	2	30	2026-05-11 17:02:57.575969+03
13	1	Посудомоечные машины	dishwashers	2	40	2026-05-11 17:02:57.575969+03
14	1	Холодильники и морозильники	refrigeration	2	50	2026-05-11 17:02:57.575969+03
20	2	Духовые шкафы	ovens	2	10	2026-05-11 17:02:57.588383+03
21	2	Варочные поверхности	hobs	2	20	2026-05-11 17:02:57.588383+03
22	2	Вытяжки	hoods	2	30	2026-05-11 17:02:57.588383+03
23	2	Кофемашины встраиваемые	built-in-coffee-machines	2	40	2026-05-11 17:02:57.588383+03
24	2	Микроволновые печи	microwaves	2	50	2026-05-11 17:02:57.588383+03
25	2	Комбинированные духовые (с паром)	combi-steam-ovens	2	60	2026-05-11 17:02:57.588383+03
26	2	Подогреватели посуды	warming-drawers	2	70	2026-05-11 17:02:57.588383+03
27	2	Винные шкафы	wine-cabinets	2	80	2026-05-11 17:02:57.588383+03
28	2	Телевизоры	television	2	90	2026-05-11 17:02:57.588383+03
29	2	Вакууматоры	vacuum-sealers	2	100	2026-05-11 17:02:57.588383+03
30	3	Кофемашины отдельностоящие	coffee-machines	2	10	2026-05-11 17:02:57.589358+03
31	3	Кофемолки	coffee-grinders	2	20	2026-05-11 17:02:57.589358+03
32	3	Мясорубки	meat-grinders	2	30	2026-05-11 17:02:57.589358+03
33	3	Пылесосы	vacuums	2	40	2026-05-11 17:02:57.589358+03
34	3	Блендеры	blenders	2	50	2026-05-11 17:02:57.589358+03
40	4	Фильтры и аксессуары для вытяжек	hood-filters	2	10	2026-05-11 17:02:57.590068+03
41	4	Аксессуары	all-accessories	2	20	2026-05-11 17:02:57.590068+03
44	4	Монтажные комплекты и крепления	installation-kits	2	50	2026-05-11 17:02:57.590068+03
45	4	Фильтры и расходники	replacement-filters	2	60	2026-05-11 17:02:57.590068+03
46	4	Дизайнерские ручки, рамки, фасады	design-kits	2	70	2026-05-11 17:02:57.590068+03
47	4	Средства по уходу	care-products	2	80	2026-05-11 17:02:57.590068+03
48	4	Аксессуары для измельчителей пищевых отходов	disposer-accessories	2	90	2026-05-11 17:02:57.590068+03
200	20	Духовые шкафы электрические	electric-ovens	3	10	2026-05-11 17:09:11.179925+03
201	20	Духовые шкафы с паром	steam-ovens	3	20	2026-05-11 17:09:11.179925+03
202	20	Духовые шкафы с пиролизом	microwave-pyrolise	3	30	2026-05-11 17:09:11.179925+03
203	20	Компактные духовые шкафы	compact-ovens	3	40	2026-05-11 17:09:11.179925+03
204	20	Компактные духовые шкафы c паром	compact-ovens-breath	3	50	2026-05-11 17:09:11.179925+03
205	20	Компактные духовые шкафы c микроволнами	compact-ovens-micro	3	60	2026-05-11 17:09:11.179925+03
206	20	Компактные духовые шкафы c пиролизом	compact-ovens-pyrolise	3	70	2026-05-11 17:09:11.179925+03
207	20	Духовые шкафы ультракомбинированный 3 в 1	ultra-3-1-ovens	3	80	2026-05-11 17:09:11.179925+03
208	20	Духовые шкафы pizza party	pizza-ovens	3	90	2026-05-11 17:09:11.179925+03
210	21	Индукционные варочные панели	induction-hobs	3	10	2026-05-11 17:09:11.192095+03
211	21	Газовые варочные панели	gas-hobs	3	20	2026-05-11 17:09:11.192095+03
212	21	Электрические варочные панели	electric-hobs	3	30	2026-05-11 17:09:11.192095+03
213	21	Стеклокерамические варочные панели	ceram-hobs	3	40	2026-05-11 17:09:11.192095+03
214	21	Варочные панели с интегрированной вытяжкой	vitazka-hobs	3	50	2026-05-11 17:09:11.192095+03
215	21	Индукционная со встроенной вытяжкой	induct-hobs	3	60	2026-05-11 17:09:11.192095+03
216	21	Отдельностоящая газовая варочная поверхность	out-of-hobs	3	70	2026-05-11 17:09:11.192095+03
220	22	Встраиваемые вытяжки	built-in-hoods	3	10	2026-05-11 17:09:11.192894+03
221	22	Настенные вытяжки	wall-hoods	3	20	2026-05-11 17:09:11.192894+03
222	22	Островные вытяжки	island-hoods	3	30	2026-05-11 17:09:11.192894+03
223	22	Вытяжки с выдвижным экраном	ekran-hoods	3	60	2026-05-11 17:09:11.192894+03
224	22	Потолочные вытяжки	polotok-hoods	3	70	2026-05-11 17:09:11.192894+03
225	22	Пристенные вытяжки	pre-wall-hoods	3	80	2026-05-11 17:09:11.192894+03
226	22	Угловые вытяжки	ugol-hoods	3	90	2026-05-11 17:09:11.192894+03
227	22	T-образные вытяжки	t-shaped-hoods	3	15	2026-05-11 17:09:11.192894+03
228	22	Цилиндрические вытяжки	cylindrical-hoods	3	35	2026-05-11 17:09:11.192894+03
240	24	Микроволновые печи встраиваемые	built-in-microwaves	3	10	2026-05-11 17:09:11.194023+03
241	24	Отдельностоящие микроволновые печи	out-of-microwaves	3	20	2026-05-11 17:09:11.194023+03
242	24	Комбинированные микроволновые печи	combo-microwaves	3	30	2026-05-11 17:09:11.194023+03
243	24	Компактные микроволновые печи	compact-microwaves	3	40	2026-05-11 17:09:11.194023+03
270	27	Встраиваемые винные шкафы	built-in-wine-cabinets	3	10	2026-05-11 17:09:11.195022+03
271	27	Отдельностоящие винные шкафы	freestanding-wine-cabinets	3	30	2026-05-11 17:09:11.195022+03
280	13	Посудомоечные машины 60см	60-dishwashers	3	10	2026-05-11 17:09:11.19562+03
281	13	Посудомоечные машины 45см	45-dishwashers	3	20	2026-05-11 17:09:11.19562+03
460	13	Полностью встраиваемая	full-built-in-cleaner	3	10	2026-05-11 17:09:11.19562+03
461	13	Полностью встраиваемая увеличенная высота	full-built-in-high-cleaner	3	20	2026-05-11 17:09:11.19562+03
290	14	Уличные холодильники	outdoor-fridges	3	10	2026-05-11 17:09:11.19617+03
291	14	Морозильники встраиваемые	built-in-freezers	3	20	2026-05-11 17:09:11.19617+03
292	14	Встраиваемый холодильник	built-in-fridges	3	30	2026-05-11 17:09:11.19617+03
293	14	Отдельностоящий холодильник	multi-door-fridges	3	40	2026-05-11 17:09:11.19617+03
294	14	Встраиваемый холодильник с морозильной камерой	built-in-freeze-fridges	3	50	2026-05-11 17:09:11.19617+03
300	10	Отдельностоящие стиральные машины	out-of-washing-machines	3	10	2026-05-11 17:09:11.19688+03
301	10	Встраиваемая стиральная машина	built-in-washing-machines	3	20	2026-05-11 17:09:11.19688+03
302	11	Отдельностоящие сушильные машины	out-of-dryers	3	10	2026-05-11 17:09:11.19688+03
303	11	Встраиваемые сушильные машины	built-in-dryers	3	20	2026-05-11 17:09:11.19688+03
304	12	Встраиваемые стирально-сушильные машины	built-in-washer-dryers	3	10	2026-05-11 17:09:11.19688+03
305	12	Отдельностоящие стирально-сушильные машины	out-of-washer-dryers	3	20	2026-05-11 17:09:11.19688+03
330	28	Встраиваемый	built-in-tv	3	10	2026-05-11 17:09:11.1974+03
401	41	Аксессуары гриль	grill-accessories	3	10	2026-05-11 17:09:11.19808+03
402	41	Аксессуары для Fry-Top панели	frytop-accessories	3	20	2026-05-11 17:09:11.19808+03
403	41	Аксессуары для WOK	wok-accessories	3	30	2026-05-11 17:09:11.19808+03
404	41	Аксессуары для вакууматора	vacuum-accessories	3	40	2026-05-11 17:09:11.19808+03
405	41	Аксессуары для варочной панели	hob-with-hood-accessories	3	50	2026-05-11 17:09:11.19808+03
406	41	Аксессуары для вытяжек	hood-accessories	3	60	2026-05-11 17:09:11.19808+03
407	41	Аксессуары для кухонных блоков	kitchen-block-accessories	3	70	2026-05-11 17:09:11.19808+03
408	41	Аксессуары для посудомоечной машины	dishwasher-accessories	3	80	2026-05-11 17:09:11.19808+03
409	41	Аксессуары для приготовления на пару	steam-cooking-accessories	3	90	2026-05-11 17:09:11.19808+03
410	41	Телескопические направляющие	telescopic-rails	3	100	2026-05-11 17:09:11.19808+03
411	41	Аксессуары для кофемашин	coffee-accessories	3	110	2026-05-11 17:09:11.19808+03
412	41	Рамки для варочных поверхностей	hob-frames	3	120	2026-05-11 17:09:11.19808+03
435	32	Мясорубки	meat-grinders-main	3	10	2026-05-11 17:09:11.198702+03
550	44	Монтажные рамы и направляющие для вытяжек	mounting-frames-hoods	3	10	2026-05-11 17:09:11.199659+03
551	44	Кабельные удлинители	extension-cables	3	20	2026-05-11 17:09:11.199659+03
552	44	Потолочные крепления	ceiling-mounts	3	30	2026-05-11 17:09:11.199659+03
580	34	Диспоузеры бытовые	household-disposers	3	10	2026-05-11 17:09:11.200147+03
581	34	Диспоузеры полупромышленные	semi-commercial-disposers	3	20	2026-05-11 17:09:11.200147+03
650	34	Блендеры	blender-main	3	10	2026-05-11 17:09:11.200147+03
600	48	Системы управления (пневмо/радио)	disposer-controls	3	10	2026-05-11 17:09:11.200651+03
601	48	Сифоны и адаптеры	siphons-adapters	3	20	2026-05-11 17:09:11.200651+03
602	48	Крышки, рассекатели, вставки	covers-splitters-inserts	3	30	2026-05-11 17:09:11.200651+03
603	48	Декоративные фланцы	decorative-flanges	3	40	2026-05-11 17:09:11.200651+03
670	33	Пылесосы	vacuums-main	3	10	2026-05-11 17:09:11.201199+03
50	5	Кухонные блоки ILVE	ilve-kitchen-blocks	2	10	2026-05-11 17:18:40.0316+03
51	5	Мойки и смесители	sinks-and-taps	2	20	2026-05-11 17:18:40.0316+03
260	26	Подогреватели посуды	warming-drawers-sub	3	10	2026-05-15 10:57:36.349231+03
261	26	Вакуумные ящики	vacuum-drawers	3	20	2026-05-15 10:57:36.349231+03
262	26	Для хранения	safe-drawers	3	30	2026-05-15 10:57:36.349231+03
230	23	Встраиваемые кофемашины	built-in-coffee-machines-3	3	10	2026-05-15 16:17:12.083514+03
231	23	Кофемашины Nivona	coffee-machines-nivona	3	10	2026-05-15 18:55:44.920741+03
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, order_number, user_id, customer_name, customer_email, customer_phone, customer_address, items, total_amount, status, customer_comment, created_at, updated_at) FROM stdin;
2a8b92fb-51ac-42e7-826d-7afb24671433	ORD-20260512-6AC9108C	59c40195-c637-4c96-a761-22375ff97f92	Иван Петров	ivan@example.com	+79991234567	г. Москва, ул. Примерная, д. 1, кв. 10	[{"product_name": "\\u0414\\u0443\\u0445\\u043e\\u0432\\u043e\\u0439 \\u0448\\u043a\\u0430\\u0444", "product_sku": "BOP7544B", "product_price": 106990, "quantity": 1, "total_price": 106990}, {"product_name": "\\u0414\\u0443\\u0445\\u043e\\u0432\\u043e\\u0439 \\u0448\\u043a\\u0430\\u0444", "product_sku": "BOP7544LX", "product_price": 106990, "quantity": 1, "total_price": 106990}, {"product_name": "\\u0414\\u0443\\u0445\\u043e\\u0432\\u043e\\u0439 \\u0448\\u043a\\u0430\\u0444", "product_sku": "BOP7537LX", "product_price": 97990, "quantity": 1, "total_price": 97990}, {"product_name": "\\u0414\\u0443\\u0445\\u043e\\u0432\\u043e\\u0439 \\u0448\\u043a\\u0430\\u0444", "product_sku": "BOH7534LX", "product_price": 87990, "quantity": 2, "total_price": 175980}]	487950.00	pending	Позвонить перед доставкой, желательно доставка в субботу	2026-05-12 14:58:00.714451+03	\N
8acf672d-b90f-48bc-a9c3-5c955ebcf879	ORD-20260512-C9F3EEE1	59c40195-c637-4c96-a761-22375ff97f92	Иван Петров	ivan@example.com	+79991234567	г. Москва, ул. Примерная, д. 1, кв. 10	[{"product_name": "\\u0414\\u0443\\u0445\\u043e\\u0432\\u043e\\u0439 \\u0448\\u043a\\u0430\\u0444", "product_sku": "BOP7544B", "product_price": 106990, "quantity": 1, "total_price": 106990}]	106990.00	pending	Позвонить перед доставкой	2026-05-12 14:58:41.408135+03	\N
\.


--
-- Data for Name: products_brandt; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_brandt (id, category_id, brand_id, main_image, name, model, specifications, design, price, comment, created_at, updated_at) FROM stdin;
1	200	7	/uploads/products/7.1.jpg	Духовой шкаф	BOP7544B	Многофункциональная конвекция\nВстроенные рецепты\nТелескопические направляющие\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nПиролитическая очистка\nФункции: обдув горячим воздухом, стандартная, нижний нагрев + обдув, ECO, гриль / 4 уровня, гриль с обувом, обдув + верхний и нижний нагрев, размораживание, 12 встроенных рецептов, пиролитическая очистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nХолодная дверца\nСистема автоматической остановки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black	106990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
2	200	7	/uploads/products/7.2.jpg	Духовой шкаф	BOP7544LX	Многофункциональная конвекция\nВстроенные рецепты\nТелескопические направляющие\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nПиролитическая очистка\nФункции: обдув горячим воздухом, стандартная, нижний нагрев + обдув, ECO, гриль / 4 уровня, гриль с обувом, обдув + верхний и нижний нагрев, размораживание, 12 встроенных рецептов, пиролитическая очистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nХолодная дверца\nСистема автоматической остановки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Inox	106990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
3	200	7	/uploads/products/7.3.jpg	Духовой шкаф	BOP7537B	Quattro Pulse\nSmart Assist\nЭлектронный контроль температуры приготовления\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nПиролитическая очистка\nФункции: обдув горячим воздухом, стандартная, нижний нагрев + обдув, Eco, гриль, гриль с\nобдувом, приготовление на пару (белое мясо), приготовление на пару (рыба), приготовление на пару (птица), пиролиз 2H, очистка 39’\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nХолодная дверца\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black Inox	97990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
4	200	7	/uploads/products/7.4.jpg	Духовой шкаф	BOP7537LX	Quattro Pulse\nSmart Assist\nЭлектронный контроль температуры приготовления\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nПиролитическая очистка\nФункции: обдув горячим воздухом, стандартная, нижний нагрев + обдув, Eco, гриль, гриль с\nобдувом, приготовление на пару (белое мясо), приготовление на пару (рыба), приготовление на пару (птица), пиролиз 2H, очистка 39’\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nХолодная дверца\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Inox	97990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
5	200	7	/uploads/products/7.5.jpg	Духовой шкаф	BOH7534LX	Приготовление на пару\nOpti Steam\nГидролизный (паровой) режим очистки\nSmart Assist\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: обдув горячим воздухом, стандартная, Eco, гриль, гриль с обдувом, приготовление на пару (рыба), приготовление на пару (птица), чистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Inox	87990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
6	200	7	/uploads/products/7.6.jpg	Духовой шкаф	BOP7533BB	Quattro Pulse\nSmart Assist\nЭлектронный контроль температуры приготовления\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nПиролитическая очистка\nФункции: обдув горячим воздухом, стандартная, нижний нагрев + обдув, Eco, гриль, гриль с\nобдувом, приготовление на пару (белое мясо), приготовление на пару (рыба), приготовление на пару (птица), пиролиз 2H, очистка 39’\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 плоский противень + 1 глубокий противень\nХолодная дверца\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black	86990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
7	200	7	/uploads/products/7.7.jpg	Духовой шкаф	BOH7534BB	Приготовление на пару\nOpti Steam\nГидролизный (паровой) режим очистки\nSmart Assist\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: обдув горячим воздухом, стандартная, Eco, гриль, гриль с обдувом, приготовление на пару (рыба), приготовление на пару (птица), чистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black	84990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
8	200	7	/uploads/products/7.8.jpg	Духовой шкаф	BOH7532LX	Приготовление на пару\nOpti Steam\nГидролизный (паровой) режим очистки\nSmart Assist\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: обдув горячим воздухом, стандартная, Eco, гриль, гриль с обдувом, приготовление на пару (рыба), приготовление на пару (птица), чистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	White	80990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
9	200	7	/uploads/products/7.9.jpg	Духовой шкаф	BOH7532B	Приготовление на пару\nOpti Steam\nГидролизный (паровой) режим очистки\nSmart Assist\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: обдув горячим воздухом, стандартная, Eco, гриль, гриль с обдувом, приготовление на пару (рыба), приготовление на пару (птица), чистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black Inox	78990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
10	200	7	/uploads/products/7.10.jpg	Духовой шкаф	BOH7532BB	Приготовление на пару\nOpti Steam\nГидролизный (паровой) режим очистки\nSmart Assist\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: обдув горячим воздухом, стандартная, Eco, гриль, гриль с обдувом, приготовление на пару (рыба), приготовление на пару (птица), чистка\nСъемная, полностью стеклянная внутренняя дверца, мягкое закрытие\n1 решетка + 1 плоский противень + 1 глубокий противень\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black	78990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
11	200	7	/uploads/products/7.11.jpg	Духовой шкаф	BOP2112B	Рекомендации по многофункциональности и температуре приготовления\nПриготовление на пару птицы / рыбы / белого мяса\nХлеб\nОбъем рабочей камеры 67 л\nРежим приготовления Многофункциональный\nФункции: верхний и нижний нагркв + обдув, стандартная, нижний нагрев + обдув, ECO, гриль + 4 уровня, гриль с обдувом, хлеб, приготовление на пару «Рыба», приготовление на пару «Птица», приготовление на пару «Белое мясо», пиролиз\nПиролитическая очистка\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 глубокий противень\nХолодная дверца\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А+\nРазмеры для встраивания (ВхШхГ): 585x560x550	Black	74990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
12	200	7	/uploads/products/7.12.jpg	Духовой шкаф	BOH3415A	Многофункциональная конвекция\nПриготовление на пару птицы / рыбы / белого мяса\nГидролизный (паровой) режим очистки\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункци: обдув горячим воздухом, стандартная, нижний нагрев + обдув, ECO, гриль + 4 уровня, гриль с обдувом, хлеб, верхний и нижний нагрев + обдув, 12 встроенных рецептов, Steam Guide, очистка паром\nБелый LCD-дисплей\n1 решетка + 1 глубокий противень + телескопические направляющие\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А\nРазмеры для встра ивания (ВхШхГ): 585x560x550	Full Black	68990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
20	200	7	/uploads/products/7.20.jpg	Духовой шкаф	BOE1000X	Эмалированное покрытие\nГалогеновая подсветка\nОбъем рабочей камеры 72 л\nЕстественная конвекция\nФункции: стандартная, нижний нагрев, верхний нагрев, гриль, полный гриль\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 противень\nДверца с обдувом\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 590x560x555	Black Inox	41990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
13	200	7	/uploads/products/7.13.jpg	Духовой шкаф	BOH3415X	Многофункциональная конвекция\nПриготовление на пару птицы / рыбы / белого мяса\nГидролизный (паровой) режим очистки\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункци: обдув горячим воздухом, стандартная, нижний нагрев + обдув, ECO, гриль + 4 уровня, гриль с обдувом, хлеб, верхний и нижний нагрев + обдув, 12 встроенных рецептов, Steam Guide, очистка паром\nБелый LCD-дисплей\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 глубокий противень + телескопические направляющие\nСистема автоматической остановки, доступ к команде блокировки\nКласс энергоэффективности: А\nРазмеры для встра ивания (ВхШхГ): 585x560x550	Black Inox	68990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
14	200	7	/uploads/products/7.14.jpg	Духовой шкаф	BOH1325BB	Эмалированное покрытие\nЭкономия\nГалогеновая подсветка\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: размораживание, нагрев с обдувом, стандартная, верхний и нижний нагрев + обдув, пицца, гриль, полный гриль, полный гриль с обдувом, очистка\nГидролитическая очистка\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Full Black	63990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
15	200	7	/uploads/products/7.15.jpg	Духовой шкаф	BOH1325X	Эмалированное покрытие\nЭкономия\nГалогеновая подсветка\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный+\nФункции: размораживание, нагрев с обдувом, стандартная, верхний и нижний нагрев + обдув, пицца, гриль, полный гриль, полный гриль с обдувом, очистка\nГидролитическая очистка\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 плоский противень + 1 глубокий противень + телескопические направляющие\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Black Inox	63990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
16	200	7	/uploads/products/7.16.jpg	Духовой шкаф	BOH1224X	Эмалированное покрытие\nГалогеновая подсветка\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный\nГидролитическая очистка\nФункции: размораживание, нагрев с обдувом, стандартная, верхний и нижний нагрев + обдув, пицца, гриль, полный гриль, полный гриль с обдувом, очистка\n1 решетка + 1 плоский противень + 1 глубокий противень\nДверца с обдувом\nДоступ к команде блокировки\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Black Inox	55990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
17	200	7	/uploads/products/7.17.jpg	Духовой шкаф	BOH1222BB	Эмалированное покрытие\nГалогеновая подсветка\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный\nГидролитическая очистка\nФункци: размораживание, нижний нагрев, стандартный, нагрев с обдувом, гриль, гриль с обдувом\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 плоский противень + 1 глубокий противень\nДверца с обдувом\nДоступ к команде блокировки\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Full Black	50990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
18	200	7	/uploads/products/7.18.jpg	Духовой шкаф	BOH1222X	Эмалированное покрытие\nГалогеновая подсветка\nОбъем рабочей камеры 73 л\nРежим приготовления Многофункциональный\nГидролитическая очистка\nФункци: размораживание, нижний нагрев, стандартный, нагрев с обдувом, гриль, гриль с обдувом\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 плоский противень + 1 глубокий противень\nДверца с обдувом\nДоступ к команде блокировки\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Black Inox	50990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
19	200	7	/uploads/products/7.19.jpg	Духовой шкаф	BOE1120X	Эмалированное покрытие\nГалогеновая подсветка\nОбъем рабочей камеры 65 л\nФункции: размораживание, обдув горячим воздухлм, стандартная, верхний и нижний нагрев + обдув, пицца, гриль, полный гриль, гриль с обдувом\nСъемная, полностью стеклянная внутренняя дверца\n1 решетка + 1 противень\nДверца с обдувом\nКласс энергоэффективности: А\nРазмеры для встраивания (ВхШхГ): 600x560x570	Black Inox	43990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
36	210	7	/uploads/products/7.36.jpg	Варочная панель	BPI264HSB	HoriZone\nФункция Ultraboost\nФункция Гриль\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n3 конфорки: - Передняя правая, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт\n- Левая, horiZonetec 3750Вт	Black	84990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
21	240	7	/uploads/products/7.21.jpg	Микроволновая печь	BKC7153BB	Концепция полного встраивания\nКомбинированная\nСенсорные кнопки\nФункции: Метод приготовления - «Меньше» - «Больше» - Остановка вращающейся тарелки – Время программирования - Температура - Мощность\nТаймер на 60 минут\nОбъем рабочей камеры 40 л\nДиаметр вращающейся тарелки 36 см\nФункции приготовления: микроволны 1000Вт, настраиваемая мощность от 100Вт до 1000Вт, 100Вт, размораживание, нагрев с обдувом + микроволны, изменяемый уровень гриля 4 + микроволны, изменяемый уровень гриля 2 + микроволны, автоматическое приготовление, гриль с обдувом, гриль, нагрев с обдувом, размораживание птицы и\nмяса, память\nРазмеры ниши для встраивания (ВхШхГ): 450x560x550	Black	144990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
22	240	7	/uploads/products/7.22.jpg	Микроволновая печь	BKC7153LX	Концепция полного встраивания\nКомбинированная\nСенсорные кнопки\nФункции: Метод приготовления - «Меньше» - «Больше» - Остановка вращающейся тарелки – Время программирования - Температура - Мощность\nТаймер на 60 минут\nОбъем рабочей камеры 40 л\nДиаметр вращающейся тарелки 36 см\nФункции приготовления: микроволны 1000Вт, настраиваемая мощность от 100Вт до 1000Вт, 100Вт, размораживание, нагрев с обдувом + микроволны, изменяемый уровень гриля 4 + микроволны, изменяемый уровень гриля 2 + микроволны, автоматическое приготовление, гриль с обдувом, гриль, нагрев с обдувом, размораживание птицы и\nмяса, память\nРазмеры ниши для встраивания (ВхШхГ): 450x560x550	Inox	144990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
23	240	7	/uploads/products/7.23.jpg	Микроволновая печь	BKS7131BB	Концепция полного встраивания\nТолько микроволны\nПоворотные ручки\nФункции: Режимы – Метод приготовления\nТаймер на 60 минут\nОбъем рабочей камеры 40 л\nДиаметр вращающейся тарелки 36 см\nФункции приготовления: микроволны 1000Вт, 900Вт, микроволны 500Вт, микроволны 300Вт, микроволны 100Вт, автоматическое приготовление: свежие овощи, автоматическое приготовление: замороженные овощи, автоматическое приготовление: рыба, автоматическое\nразмораживание: Птица - Мясо – Готовые блюда, размораживание хлеба, разогрев\nРазмеры ниши для встраивания (ВхШхГ): 450x560x550	Black	107990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
24	240	7	/uploads/products/7.24.jpg	Микроволновая печь	BKS7131LX	Концепция полного встраивания\nТолько микроволны\nПоворотные ручки\nФункции: Режимы – Метод приготовления\nТаймер на 60 минут\nОбъем рабочей камеры 40 л\nДиаметр вращающейся тарелки 36 см\nФункции приготовления: микроволны 1000Вт, 900Вт, микроволны 500Вт, микроволны 300Вт, микроволны 100Вт, автоматическое приготовление: свежие овощи, автоматическое приготовление: замороженные овощи, автоматическое приготовление: рыба, автоматическое\nразмораживание: Птица - Мясо – Готовые блюда, размораживание хлеба, разогрев\nРазмеры ниши для встраивания (ВхШхГ): 450x560x550	Inox	107990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
25	240	7	/uploads/products/7.25.jpg	Микроволновая печь	BMS7120WW	Система Quattro\nТолько микроволны\nСенсорные кнопки\nФункции: Открыть дверцу - Отмена – Остановка вращающейся тарелки – Размораживание -Микроволны- Старт -Мощность – Остановить вращающуюся\nТаймер на 60 минут\nОбъем рабочей камеры 26 л\nДиаметр вращающейся тарелки 30 см\nФункции приготовления: мощность микроволн: 900Вт/700Вт/500Вт/350вт, автоматическое приготовление 2 (свежие овощи; рыба), автоматическое размораживание, автоматическое размораживание: Птица - Мясо – Готовые блюда\nРазмеры ниши для встраивания (ВхШхГ): 380x560x550	Full White	74990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
26	240	7	/uploads/products/7.26.jpg	Микроволновая печь	BMS7120B	Система Quattro\nТолько микроволны\nСенсорные кнопки\nФункции: Открыть дверцу - Отмена – Остановка вращающейся тарелки – Размораживание -Микроволны- Старт -Мощность – Остановить вращающуюся\nТаймер на 60 минут\nОбъем рабочей камеры 26 л\nДиаметр вращающейся тарелки 30 см\nФункции приготовления: мощность микроволн: 900Вт/700Вт/500Вт/350вт, автоматическое приготовление 2 (свежие овощи; рыба), автоматическое размораживание, автоматическое размораживание: Птица - Мясо – Готовые блюда\nРазмеры ниши для встраивания (ВхШхГ): 380x560x550	Black	73990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
37	210	7	/uploads/products/7.37.jpg	Варочная панель	BPI164HSB	HoriZone\nФункция Ultraboost\nФункция Piano\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n3 конфорки: - Передняя правая, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт\n- Левая, horiZonetech 4000Вт	Black \nfull glass	83990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
27	240	7	/uploads/products/7.27.jpg	Микроволновая печь	BMS7120X	Система Quattro\nТолько микроволны\nСенсорные кнопки\nФункции: Открыть дверцу - Отмена – Остановка вращающейся тарелки – Размораживание -Микроволны- Старт -Мощность – Остановить вращающуюся\nТаймер на 60 минут\nОбъем рабочей камеры 26 л\nДиаметр вращающейся тарелки 30 см\nФункции приготовления: мощность микроволн: 900Вт/700Вт/500Вт/350вт, автоматическое приготовление 2 (свежие овощи; рыба), автоматическое размораживание, автоматическое размораживание: Птица - Мясо – Готовые блюда\nРазмеры ниши для встраивания (ВхШхГ): 380x560x550	Inox	73990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
28	240	7	/uploads/products/7.28.jpg	Микроволновая печь	BMG2120B	9 функций гриля и комбинированных функций с микроволнами\nМикроволны + гриль\nСенсорные кнопки\nУровни мощности: 900Вт; 720 Вт; 450 Вт; 270Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31,5 см\nФункции приготовления: размораживание по весу / времени, 8 автоматических программ, гриль + микроволны\nРазмеры ниши длявстраивания (ВхШхГ): 380x560x500	Black	39990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
29	240	7	/uploads/products/7.29.jpg	Микроволновая печь	BMG2120W	10 функций гриля и комбинированных функций с микроволнами\nМикроволны + гриль\nСенсорные кнопки\nУровни мощности: 900Вт; 720 Вт; 450 Вт; 270Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31,5 см\nФункции приготовления: размораживание по весу / времени, 8 автоматических программ, гриль + микроволны\nРазмеры ниши длявстраивания (ВхШхГ): 380x560x500	White	51990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
30	240	7	/uploads/products/7.30.jpg	Микроволновая печь	BMG2120X	11 функций гриля и комбинированных функций с микроволнами\nМикроволны + гриль\nСенсорные кнопки\nУровни мощности: 900Вт; 720 Вт; 450 Вт; 270Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31,5 см\nФункции приготовления: размораживание по весу / времени, 8 автоматических программ, гриль + микроволны\nРазмеры ниши длявстраивания (ВхШхГ): 380x560x500	Inox	51990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
31	240	7	/uploads/products/7.31.jpg	Микроволновая печь	BMG2115B	9 функций гриля и комбинированных функций с микроволнами\nТолько микроволны\nПоворотные ручки\nУровни мощности: 900 Вт; 720 Вт; 450 Вт; 270 Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31,5 см\nФункции приготовления: 8 автоматических программ, размораживание по весу / времени, гриль\nРазмеры ниши для встраивания (ВхШхГ): 380x560x500	Black	50990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
32	240	7	/uploads/products/7.32.jpg	Микроволновая печь	BMG2115X	10 функций гриля и комбинированных функций с микроволнами\nТолько микроволны\nПоворотные ручки\nУровни мощности: 900 Вт; 720 Вт; 450 Вт; 270 Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31,5 см\nФункции приготовления: 8 автоматических программ, размораживание по весу / времени, гриль\nРазмеры ниши для встраивания (ВхШхГ): 380x560x500	Inox	50990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
33	240	7	/uploads/products/7.33.jpg	Микроволновая печь	BMG2112B	9 функций гриля и комбинированных функций с микроволнами\nМикроволны + гриль\nПоворотные ручки\nУровни мощности: 900 Вт; 720 Вт; 450 Вт; 270 Вт; 90 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 25 л\nДиаметр вращающейся тарелки 31 см\nФункции приготовления: 8 автоматических про-\nграмм, размораживание по весу / времени\nРазмеры ниши для встраивания (ВхШхГ): 380x560x500	Black	47990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
34	240	7	/uploads/products/7.34.jpg	Микроволновая печь	BMG2508B	9 функций гриля и комбинированных функций с микроволнами\nПоворотные ручки\nФункции: Открыть дверцу - Микроволны + гриль - Микроволны – Гриль\nУровни мощности: 800 Вт; 640 Вт; 400 Вт; 240 Вт; 80 Вт\nТаймер на 95 минут\nОбъем рабочей камеры 20 л\nДиаметр вращающейся тарелки 24 см\nФункции приготовления: автоматическое размораживание, 8 автоматических программ, гриль\nРазмеры ниши для встраивания (ВхШхГ): 380x560x550	Black	40990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
35	210	7	/uploads/products/7.35.jpg	Варочная панель	BPI184HUB	HoriZone\nФункция Ultraboost\nФункция кипячения Boil\n80 см\nКнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x770x510\n3 конфорки: - Левая, 400х230 мм 4000Вт\n- По центру, 280 мм 4000Вт\n- Передняя правая, 160 мм 2500Вт	Black \nfull glass	103990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
38	210	7	/uploads/products/7.38.jpg	Варочная панель	BPI164HUB	HoriZone\nФункция Ultraboost\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n3 конфорки: - Передняя правая, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт\n - Левая, horiZonetech 4000Вт	Black \nfull glass	83990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
39	210	7	/uploads/products/7.39.jpg	Варочная панель	BPI6414BM	9 режимов мощности\n60 см\nСенсорные кнопки, поворотные ручки\nРазмеры ниши для встраивания (ВхШхГ): 560x490\n4 конфорки:\n- Индукционная, 180 мм 2800Вт\n- Индукционная, задняя правая, 180 мм 2800Вт\n- Газовая большая 3100Вт\n- Газовая, 1500Вт	Black \nfull glass	76990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
40	210	7	/uploads/products/7.40.jpg	Варочная панель	BPI164DUB	DuoZone\nФункция Ultraboost\nСверхточные настройки\n60 см\nКнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n3 конфорки: - Левая, DuoZone 370x180 мм 4000Вт\n- Передняя, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт	Black	71990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
41	210	7	/uploads/products/7.41.jpg	Варочная панель	BPI1641SB	Функция Ultraboost\nФункция памяти Recall\nФункция кипячения Boil\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n4 конфорки: - Передняя левая, 180 мм 3600Вт\n- Задняя левая, 180 мм 3600Вт\n- Передняя правая, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт	Black \nfull glass	70990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
42	210	7	/uploads/products/7.42.jpg	Варочная панель	BPI1641UB	Функция Ultraboost\nФункция памяти Recall\n10 функций безопасности\n60 см\nКнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 60x580x510\n4 конфорки: - Передняя левая, 180 мм 3600Вт\n- Задняя левая, 180 мм 3600Вт\n- Передняя правая, 160 мм 2500Вт\n- Задняя правая, 210 мм 3600Вт	Black	64990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
43	210	7	/uploads/products/7.43.jpg	Варочная панель	BPI6464B	Определение размера\nпосуды\n10 функций безопасности\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 66x590x520\n4 конфорки: - Передняя левая, 180 мм 2400Вт\n- Задняя левая, 180 мм 2400Вт\n- Передняя правая, 160 мм 2200Вт\n- Задняя правая, 210 мм 2400Вт	Black	56990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
44	210	7	/uploads/products/7.44.jpg	Варочная панель	BPV6420B	Зона Quicklight\nИндикатор остаточного тепла\n60 см\nКнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 51x580x510\n4 конфорки: - Передняя левая, 200 мм 1800Вт\n- Задняя левая, 165 мм 1200Вт\n- Передняя правая, 165 мм 1200Вт\n- Задняя правая, 200 мм 1800Вт	Black \nfull glass	38990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
45	210	7	/uploads/products/7.45.jpg	Варочная панель	BPV1641B	Конфорка Speedring\n9 режимов мощности\nТаймер\n60 см\nСенсорные кнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 45x600x510\n4 конфорки: - Передняя левая, 145 мм 1200Вт\n- Задняя левая, 180 мм 1800Вт\n- Передняя правая, 145 мм 1200Вт\n- Задняя правая, 210 мм 2100Вт	Black \nfull glass	33990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
46	210	7	/uploads/products/7.46.jpg	Варочная панель	BPG6210B	30 см\nПоворотные ручки\nВстроенная система\nподжига\nРазмеры прибора (ВхШхГ): 101x510x288\n2 газовые конфорки: - Передняя, 1500Вт\n- Задняя, большая, 3100Вт	Black	31990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
47	210	7	/uploads/products/7.47.jpg	Варочная панель	BPV6210B	Зона Quicklight\nПоворотные ручки на 9 режимов на фронтальной панели управления\nИндикатор остаточного тепла\n30 см\nРазмеры прибора (ВхШхГ): 87x288x510\n2 конфорки: - Передняя, 165 мм 1200Вт\n- Задняя, 200 мм 1800Вт	Black \nfull glass	25990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
48	210	7	/uploads/products/7.48.jpg	Варочная панель	BPV6222B	Зона Quicklight\n9 режимов мощности\nТаймер\n30 см\nКнопки\nБлокировка для чистки\nРазмеры прибора (ВхШхГ): 55x288x550\n2 конфорки: - Передняя, 165 мм 1200Вт\n- Задняя, 200 мм 1800Вт	Black \nfull glass	25990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
49	222	7	/uploads/products/7.49.jpg	Вытяжка	BHI1043X	Островная вытяжка\nУгольный фильтр\nСветодиодная подсветка\n49 см\nРециркуляция воздуха\n200 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности В\nМаксимальная производительность отвода 640 м3/ч\nЭлектронное управление\n3 скорости\n2 лампы подсветки мощностью 5 Вт\nРазмеры прибора (ВхШхГ): 360x492x485	Inox	109990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
50	222	7	/uploads/products/7.50.jpg	Вытяжка	BHY2353B	Островная вытяжка\nТаймер\nРегулятор светодиодного освещения\n38 см\nРециркуляция воздуха\n160 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности A+\nПроизводительность отвода с функцией Boost 620 м3/ч\nПроизводительность рециркуляции с функцией Boost 460 м3/ч\nЭлектронное управление\n4 скорости\n4 лампы подсветки мощностью 4 Вт\nРазмеры прибора (ВхШхГ): 865x390x390	Black	106990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
51	222	7	/uploads/products/7.51.jpg	Вытяжка	BHI2353G	Островная вытяжка\nТаймер\nРегулятор светодиодного освещения\n38 см\nРециркуляция воздуха\n160 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности A+\nПроизводительность рециркуляции с функцией Boost 470 м3/ч\nЭлектронное управление\n4 скорости\n4 лампы подсветки мощностью 4 Вт\nРазмеры прибора (ВхШхГ): 320x390x390	Black	104990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
52	220	7	/uploads/products/7.52.jpg	Вытяжка	BHV2673XB	Электронное сенсорное управление\n60 см\nРециркуляция или отвод воздуха\n160 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффектив ности А+\nПроизводительность отвода для функции Boost 740 м3/ч\nЭлектронное управление с дисплеем\n4 скорости\n2 лампы подсветки мощностью 5 Вт\nРазмеры прибора (ВхШхГ): 390x600x396	\N	74990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
53	220	7	/uploads/products/7.53.jpg	Вытяжка	BHV1974IB	Всасывание по периметру\nЭлектронное сенсорное управление\nСветодиодная подсветка\n90 см\nРециркуляция или отвод воздуха\n78 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности А+\nМаксимальная производительность отвода 543 м3/ч\nЭлектронное управление с дисплеем\n3 скорости\n2 лампы подсветки мощностью 3 Вт\nРазмеры прибора (ВхШхГ): 390x900x394	Black	71990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
54	220	7	/uploads/products/7.54.jpg	Вытяжка	BHV1674IB	Всасывание по периметру\nЭлектронное сенсорное управление\nСветодиодная подсветка\n60 см\nРециркуляция или отвод воздуха\n78 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности А\nМаксимальная производительность отвода 472 м3/ч\nЭлектронное управление с дисплеем\n3 скорости\n2 лампы подсветки мощностью 3 Вт\nРазмеры прибора (ВхШхГ): 390x600x394	Black	58990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
55	220	7	/uploads/products/7.55.jpg	Вытяжка	BHV6801X	Всасывание по периметру\nЭлектронное сенсорное управление\nСветодиодная подсветка\n80 см\nРециркуляция или отвод воздуха\n320 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности А\nПроизводительность отвода с функцией Boost 726 м3/ч\nЭлектронное управление с дисплеем\n3 скорости\n2 лампы подсветки мощностью 3 Вт\nРазмеры прибора (ВхШхГ): 360x800x430	Inox	49990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
56	220	7	/uploads/products/7.56.jpg	Вытяжка	BHB6902X	Система Plug and Play\nСветодиодная подсветка\n90 см\nРециркуляция или отвод воздуха\n190 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности В\nМаксимальная производительность отвода 606 м3/ч\nУправление нажимными кнопками\n3 скорости\n2 лампы подсветки мощностью 4 Вт\nРазмеры прибора (ВхШхГ): 300x900x500	Inox	47990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
57	220	7	/uploads/products/7.57.jpg	Вытяжка	AD1049X	Сменные фильтры из алюминия\nУгольный фильтр\n90 см\nРециркуляция или отвод воздуха\n180 Вт\n1 мотор и 2 вентилятора\nКласс энергоэффективности С\nМаксимальная производительность отвода 603 м3/ч\nУправление нажимными кнопками\n3 скорости\n2 лампы подсветки мощностью 6 Вт\nРазмеры прибора (ВхШхГ): 197x900x450	Inox	43990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
58	220	7	/uploads/products/7.58.jpg	Вытяжка	AD1046X	Сменные фильтры из алюминия\nУгольный фильтр 60 см\nРециркуляция или отвод воздуха\n180 Вт\n1 мотор и 2 вентилятора\nКласс энергоэффективности С\nМаксимальная производительность отвода 603 м3/ч\nМеханическое управление с кнопками\n3 скорости\n2 лампы подсветки мощностью 6 Вт\nРазмеры прибора (ВхШхГ): 298x598x500	Inox	38990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
59	220	7	/uploads/products/7.59.jpg	Вытяжка	BHB1644IX	Светодиодная подсветка\nСтандартный угольный фильтр\n60 см\nРециркуляция или отвод воздуха\n78 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности А+\nМаксимальная производительность отвода 552 м3/ч\nЭлектронное управление\n3 скорости\n2 лампы подсветки мощностью 3 Вт\nРазмеры прибора (ВхШхГ): 65x600x500	Inox	37990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
60	220	7	/uploads/products/7.60.jpg	Вытяжка	BHB6602X	Система Plug and Play\nСветодиодная подсветка\n60 см\nРециркуляция или отвод воздуха\n190 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности В\nМаксимальная производительность отвода 593 м3/ч\nУправление нажимными\nкнопками\n3 скорости\n2 лампы подсветки мощностью 4 Вт\nРазмеры прибора  (ВхШхГ): 300x600x500	Inox	35990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
61	220	7	/uploads/products/7.61.jpg	Вытяжка	BHT2611B	Телескопическая вытяжка\nЭлектронное сенсорное управление\nРегулятор светодиодного освещения\n60 см\nРециркуляция или отвод воздуха\n120 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности С\nМаксимальная производительность отвода 405 м3/ч\n3 скорости\n2 лампы подсветки мощностью 3.4 Вт\nРазмеры прибора (ВхШхГ): 270x600x320	Black	34990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
62	220	7	/uploads/products/7.62.jpg	Вытяжка	AD1516X	Светодиодная подсветка\nСтандартный угольный фильтр\n60 см\nРециркуляция или отвод воздуха\n190 Вт\n1 мотор и 1 вентилятор\nКласс энергоэффективности В\nМаксимальная производительность отвода 611 м3/ч\nУправление нажимными кнопками\n3 скорости\n2 лампы подсветки мощностью 4 Вт\nРазмеры прибора (ВхШхГ): 80x600x500	Inox	29990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
63	220	7	/uploads/products/7.63.jpg	Вытяжка	AT1346X	Телескопическая вытяжка\nСменные фильтры из алюминия\n3 скорости отвода воздуха\n60 см\nРециркуляция или отвод воздуха\n130 Вт\n1 мотор и 1 вентилятор\nКласс светоотдачи D\nМаксимальная производительность отвода 384 м3/ч\nУправление нажимными кнопками\n2 лампы подсветки мощностью 6 Вт\nРазмеры прибора (ВхШхГ): 180x600x300	Inox	24990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
64	280	7	/uploads/products/7.64.jpg	Посудомоечная машина	BDJ424DB	Автоматическое открытие дверцы\nАвтоматическая программа\nОтложенный запуск\n14 комплектов\nКласс энергоэффективности D\nРасход воды: 11 л/цикл\nОтложенный запуск: 24 ч\nРазмеры прибора (ВхШхГ): 815x598x550\n6 программ: Интенсивная; Eco; Автоматическая; Оптимальная OptiA 60 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n4 температуры мытья: 40;45;55;60 (°C)\nИндикатор соли/ополаскивателя	\N	71990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
65	280	7	/uploads/products/7.65.jpg	Посудомоечная машина	BDJ424LB	Автоматическое открытие дверцы\nОтложенный на 3-6-9-12 часов запуск\nФункция AquaSafe\n14 комплектов\nКласс энергоэффективности D\nРасход воды: 10 л/цикл\nРазмеры прибора (ВхШхГ): 815x598x550\n6 программ: Интенсивная; Eco; Автоматическая; Оптимальная OptiA 60 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n4 температуры мытья: 40;50;55;65 (°C)\nИндикатор соли/ополаскивателя	\N	71990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
66	280	7	/uploads/products/7.66.jpg	Посудомоечная машина	LVE134J	Автоматическое открытие дверцы\nOptiA 60 минут\nОтложенный на 3-6-9-12 часов запуск\n13 комплектов\nКласс энергоэффективности D\nРасход воды: 10 л/цикл\nРазмеры прибора (ВхШхГ): 815x598x550\n6 программ: Интенсивная; Eco; Автоматическая; 60 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n4 температуры мытья: 40;50;55;65 (°C)\nИндикатор соли/ополаскивателя	\N	71990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
67	280	7	/uploads/products/7.67.jpg	Посудомоечная машина	BDJ325LB	Автоматическое открытие дверцы\nОтложенный на 3-6-9-12 часов запуск\nФункция AquaSafe\n13 комплектов\nКласс энергоэффективности D\nРасход воды: 10 л/цикл\nРазмеры прибора (ВхШхГ): 815x600x550\n6 программ: Интенсивная; Eco; Автоматическая; 60 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n4 температуры мытья: 40;50;55;65 (°C)\nИндикатор соли/ополаскивателя	\N	70990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
68	280	7	/uploads/products/7.68.jpg	Посудомоечная машина	VH1772J	Половинная загрузка\nОтложенный запуск\nФункция AquaSafe\n12 комплектов\nФункция 3 в 1\nКласс энергоэффективности E\nРасход воды: 11 л/цикл\nОтложенный запуск: 9 ч\nРазмеры прибора (ВхШхГ): 815x598x550\n5 программ: Интенсивная; Eco; Универсальная; 90 мин; Быстрая 30 мин\nОпции: Половинная загрузка; Сушка Плюс\n4 температуры мытья: 45;55;60;65 (°C)\nИндикатор соли/ополаскивателя	\N	58990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
69	280	7	/uploads/products/7.69.jpg	Посудомоечная машина	DWJ137DS	Половинная загрузка\nМалошумность\nОтложенный запуск\n13 комплектов\nКласс энергоэффективности E\nРасход воды: 11 л/цикл\nОтложенный запуск: 24 ч\nРазмеры прибора (ВхШхГ): 815x595x570\n6 программ: Интенсивная; Eco; Универсальная; 90 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n5 температур мытья: 45;50;55;60;65 (°C)\nИндикатор соли/ополаскивателя	\N	57990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
70	280	7	/uploads/products/7.70.jpg	Посудомоечная машина	DWJ127DS	Половинная загрузка\nМалошумность\nОтложенный запуск\n12 комплектов\nКласс энергоэффективности E\nРасход воды: 11 л/цикл\nОтложенный запуск: 24 ч\nРазмеры прибора (ВхШхГ): 815x595x570\n6 программ: Интенсивная; Eco; Универсальная; 90 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n5 температур мытья: 45;50;55;60;65 (°C)\nИндикатор соли/ополаскивателя	Silver	56990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
71	280	7	/uploads/products/7.71.jpg	Посудомоечная машина	LVE127J	Половинная загрузка\nМалошумность\nОтложенный запуск\n12 комплектов\nКласс энергоэффективности E\nРасход воды: 11 л/цикл\nОтложенный запуск: 24 ч\nРазмеры прибора (ВхШхГ): 815x598x550\n6 программ: Интенсивная; Eco; Универсальная; 90 мин; Быстрая 30 мин; Стекло\nОпции: Половинная загрузка\n5 температур мытья: 45;50;55;60;65 (°C)\nИндикатор соли/ополаскивателя	\N	56990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
72	300	7	/uploads/products/7.72.jpg	Стиральная машина	BT16524VE	Гигиена\nТишина\nБыстрая 60’\n6,5 кг\nМакс. скорость отжима 1200 об/мин\nОбъем барабана 42 л\nКласс энергоэффективности D\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850x400x600\n12 программ: 20°C; Смешанное; Деловая одежда; Хлопок / Полотенца; Деликатное / Шерсть; Eco 40-60; Экспресс 39 мин; Гигиена; Небольшая загрузка; Полоскание / Отжим; Спортивная одежда\nОпции: Отложенный запуск; Мой цикл; Предварительная стирка; Легкая глажка; Полоскание+	White	72990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
73	300	7	/uploads/products/7.73.jpg	Стиральная машина	BT16022VE	Гигиена\nОтложенный запуск\nБыстрая 39’\n6 кг\nМакс. скорость отжима 1200 об/мин\nОбъем барабана 42 л\nКласс энергоэффективности D\nОтложенный запуск 12 ч\nРазмеры прибора (ВхШхГ): 850x400x600\n9 программ: 20°C; Смешанное; Хлопок / Полотенца; Деликатное/ Шерсть; Eco 40-60; Экспресс 39 мин; Гигиена; Небольшая загрузка; Полоскание / Отжим\nОпции: Отложенный запуск; Мой цикл; Предварительная стирка; Легкая глажка; Полоскание+	White	64990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
74	300	7	/uploads/products/7.74.jpg	Стиральная машина	WFB386QWE	Гигиена\nОпция «Пар»\nОчистка барабана\n9 кг\nМакс. скорость отжима 1400 об/мин\nОбъем барабана 52,7 л\nКласс энергоэффективности A\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850х595х535\n14 программ: Синтетика – Полоскание/Отжим – Быстрая 15 мин – Очистка барабана – Смешанное белье – Память – Постельное белье – Детская одежда – Шерсть – Гигиена – Отжим – Хлопок – 20°С – ЭКО 40-60\nОпции: Степень загрязненности – Отложенный запуск – Тихая стирка – Предва-рительная стирка – Полоскание+ – Пар	White	64990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
75	300	7	/uploads/products/7.75.jpg	Стиральная машина	WFB394QWE	Антибактериальная обработка паром\nОчистка барабана\nБыстрая стирка 45 минут\n9 кг\nМакс. скорость отжима 1400 об/мин\nОбъем барабана 56 л\nКласс энергоэффективности A\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850х595х495\n15 программ: Спортивная одежда – Синтетика – Полоскание/Отжим – Быстрая 60 мин. – Быстрая 15 мин. – Смешанное белье – Постельное белье – Детская одежда – Джинсы – Шерсть – ЭКО 40-60 – Отжим – Хлопок – Антибактериальная – 20°С\nОпции: Очистка барабана – Отложенный запуск – Предварительная стирка – Полоскание+	White	57990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
76	300	7	/uploads/products/7.76.jpg	Стиральная машина	WFB184QWE	Класс А\nАнтибактериальная обработка паром\nБыстрая стирка 45 минут\n8 кг\nМакс. скорость отжима 1400 об/мин\nОбъем барабана 64 л\nКласс энергоэффективности A\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850х595х495\n15 программ: Быстрая 45 мин – Быстрая 15 мин – Спортивная одежда – Синтетика – Полоскание/Отжим – Постельное белье – Детская одежда – Шерсть – Джинсы – Смешанное белье – ЭКО 40-60 – Хлопок - 20°С – Антибактериальная – Отжим\nОпции: Очистка барабана - Отложенный запуск – По-лоскание+ – Предварительная стирка	White	49990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
77	300	7	/uploads/products/7.77.jpg	Стиральная машина	WFB173QWE	Класс А\nАнтибактериальная обработка паром\nБыстрая стирка 45 минут\n7 кг\nМакс. скорость отжима 1200 об/мин\nОбъем барабана 45 л\nКласс энергоэффективности A\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850х595х400\n15 программ:Спортивная одежда – Синтетика – Полоска-ние/Отжим – Быстрая 60 мин – Быстрая 15 мин – Смешанное белье – По-стельное белье – Дет-ская одежда – Джинсы – Шерсть – ЭКО 40-60 – Отжим - Хлопок – Анти-бактериальная – 20°С\nОпции: Очистка барабана - Отложенный запуск – Предварительная стирка – Полоскание+	White	46990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
78	305	7	/uploads/products/7.78.jpg	Стирально-сушильная машина	WD184QWE	8/6 кг\nСтирка и сушка за 1 час\nТишина работы и пониженный расход электроэнергии\nМакс. скорость отжима 1400 об/мин\nОбъем барабана 52,7 л\nКласс энергоэффективности B\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 850X595X475\n16 программ: 20°C - Синтетика - Сушка - Быстрая 45 мин - Машинная чистка - Смешанная - Стирка + сушка - Стирка + сушка 60 мин - Шерсть - Флэш 15 мин - Гигиена - Интенсивная - Отжим - Эко 40-60 - Пуховик - Хлопок\nОпции: Предварительная стирка - Полоскание+ - Бережная сушка - Интенсивная сушка - Нормальная сушка - Отложенный старт - Добавить белье	White	78990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
79	302	7	/uploads/products/7.79.jpg	Сушильная машина	WFB106QWE	Класс A+++\nПрограммы для различных типов тканей\nПодсветка барабана\n10 кг\nОбъем барабана 125 л\nОтложенный запуск 24 ч\nРазмеры прибора (ВхШхГ): 845X595X675\n14 программ: Рубашки; Памятка; Постельное белье; Детская одежда; Спорт; Свежесть; Хлопок cupboarddry; Хлопок готовый к глажке; Экстра-сухой хлопок; Шерсть; Смешанное; Синтетика  cupboarddry; Экстра-сухая синтетика\nОпции: Подсветка; Уровень сушки; Блокировка от детей; Время; Отложенный старт; Против сминания; Звуковой сигнал; Гигиена; Тихая сушка	White	84990.00	Доступно пока есть на складе	2026-05-15 13:41:44.421735	2026-05-15 13:41:44.421735
\.


--
-- Data for Name: products_dedietrich; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_dedietrich (id, category_id, brand_id, main_image, model, name, line, specifications, color, price_public, comment, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products_homeier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_homeier (id, sku, name, price, category_id, brand_id, group_level_1, group_level_2, main_image, comment, description, color, width, height, depth, volume, net_weight, gross_weight, created_at, updated_at) FROM stdin;
1	SKSCF1831P  (SKSCF1811P)	Встраиваемая морозильная камера Signature Kitchen Suite, ширина 45 см, под навеску фасадов	1066990.00	291	4	Холодильная/морозильная камера	встраиваемый морозильник	/uploads/products/4.1.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности E\nПолезный объем, всего 274 л\nМаксимальный уровень шума < 39 дБ\nЭнергопотребление за год (кВт/ч) 323\nNo-Frost\nИнверторный линейный компрессор\nАвтоматическое размораживание\nРежимы Ice Plus, Деморежим, Вкл / выкл льдогенератора, Контроль температуры, Переустановка водяного фильтра, Диагностика\nБыстрая заморозка\nПодключение к водопроводу \nФильтр для воды (6 месяцев) \nПолки 3 регулируемые\nЯщик для льда Lift and Go™ 1 с телескопическими направляющими, с доводчиком\nЯщики для хранения Lift and Go™ 2 с телескопическими направляющими, с доводчиком\nАлюминиевые дверные полки со съемными контейнерами 4\nСъемное ведерко для льда, объем 2 кг\nЦифровое управление с белым светодиодным дисплеем\nИндикатор фильтра для воды\nПриготовление льда (24 ч) 1,6 кг\nЛед вкл. / выкл \nТемпературы от -24 до -16°C\nПеренавешиваемая дверь \n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.504	2.290	0.678	0.783000	138.000	159.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
2	SKSCF2431P  (SKSCF2411P)	Встраиваемая морозильная камера Signature Kitchen Suite, ширина 60 см, под навеску фасадов	1216990.00	291	4	Холодильная/морозильная камера	встраиваемый морозильник	/uploads/products/4.2.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности E\nПолезный объем, всего 396 л\nМаксимальный уровень шума < 39 дБ\nЭнергопотребление за год (кВт/ч) 379\nNo-Frost\nИнверторный линейный компрессор\nРежимы Ice Plus, Деморежим, Вкл / выкл льдогенератора, Контроль температуры, Переустановка водяного фильтра, Диагностика\nБыстрая заморозка\nПодключение к водопроводу \nФильтр для воды (6 месяцев) \nПолки 3 регулируемые\nЯщик для льда Lift and Go™ 1 с телескопическими направляющими, с доводчиком\nЯщики для хранения Lift and Go™ 2 с телескопическими направляющими, с доводчиком\nАлюминиевые дверные полки со съемными контейнерами 4\nСъемное ведерко для льда, объем 2,5 кг\nЦифровое управление с белым светодиодным дисплеем\nИндикатор фильтра для воды\nПриготовление льда (24 ч) 1,6 кг\nЛед вкл. / выкл\nТемпературы от -24 до -16°C\nПеренавешиваемая дверь \n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.663	2.290	0.678	1.029000	159.000	180.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
3	SKSCR2431P  (SKSCR2411P)	Встраиваемый холодильная камера, Signature Kitchen Suite, ширина 60 см, под навеску фасадов	1216990.00	292	4	Холодильная/морозильная камера	встраиваемый холодильник	/uploads/products/4.3.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности E\nПолезный объем, всего 397 л\nМаксимальный уровень шума < 39 дБ\nЭнергопотребление за год (кВт/ч) 123\nNo-Frost \nИнверторный линейный компрессор \nРежимы Ice Plus, Деморежим, Вкл / выкл льдогенератора, Контроль температуры, Переустановка водяного фильтра, Диагностика\nБыстрое охлаждение\nВстроенный диспенсер для воды \nПодключение к водопроводу \nФильтр для воды (6 месяцев) \nПолки 3 регулируемые\nЯщики 3 с телескопическими направляющими, с доводчиком\nАлюминиевые дверные полки со съемными контейнерами 4\nЦифровое управление с белым светодиодным дисплеем \nИндикатор фильтра для воды \nТемпературы от 0 до 6°C\nПеренавешиваемая дверь \n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.663	2.290	0.678	1.029000	160.000	180.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
4	SKSFD3634P (SKSFD3614P)	Встраиваемый холодильник Signature Kitchen Suite, French Door, ширина 90 см, под навеску фасадов	1486990.00	294	4	Холодильная/морозильная камера	встраиваемый холодильник с морозильной камерой	/uploads/products/4.4.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности E\nПолезный объем, всего 545 л\n- холодильная камера 383\n- морозильная камера 162\nМаксимальный уровень шума < 39 дБ\nЭнергопотребление за год (кВт/ч) 411\nNo-Frost \nИнверторный линейный компрессор \n2 независимые системы охлаждения 2 компрессора\nРежимы Ice Plus, Деморежим, Вкл / выкл льдогенератора, Контроль температуры, Переустановка водяного фильтра, Диагностика\nБыстрое охлаждение\nВстроенный диспенсер для воды\nПодключение к водопроводу \nФильтр для воды (6 месяцев) \nВыдвижной ящик морозильной камеры С доводчиком\nРежимы конвертируемого ящика: Морозильник, Холодильник, Рыба и мясо (-1°C), Охлаждение напитков (1°C), Мягкое охлаждение (3°C), Охлаждение вина(5°C)\nПолки 2 регулируемые, 1 фиксированная\nЯщики 2 с телескопическими направляющими, с доводчиком\nОсвещение True-View®\nАлюминиевые дверные полки со съемными контейнерами 6\nСъемное ведерко для льда, объем 2,3 кг\nЦифровое управление с белым светодиодным дисплеем\nИндикатор фильтра для воды\nПриготовление льда (24 ч) 1,6 кг\nЛед вкл. / выкл. \nТемпература Холодильная камера: от 0 до 6°C / Средний ящик: 4 температурных\nрежима / Морозильная камера: от -24 до -16°C\n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.968	2.290	0.678	1.503000	231.000	255.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
14	SKSOV2421MS	Духовой шкаф с паром Signature Kitchen Suite, 60 см, серебро	661990.00	204	4	Духовой шкаф	с паром	/uploads/products/4.14.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Внутреннее покрытие Синяя фарфоровая эмаль\nДисплей 7-дюймовый цветной ЖК-дисплей с активной матрицей\nРежимы приготовления\n(18 режимов) Обдув горячим воздухом, Пицца, Обжаривание, Легкое обжаривание, Быстрое обжаривание +, Малый гриль, Большой гриль, Поддержание тепла, Разморозка, Подогрев, Нижний нагрев, 100%-й пар, Су-вид\nАвтоматические программы «шеф-повар»:  20 \nАвтоматически открывающаяся дверь без ручек\nСистема плавного открывания\nДатчик движения - НЕТ\nДекоративная подсветка (красный)\nВнешнее производство пара \nПриготовление на 100% пара с регулированием температуры до °C \nСу-вид \nУдаление накипи \nСушка \nЕмкость контейнера для воды 1 л\nВнутреннее светодиодное освещение \nБыстрая очистка \nМатериал двери Тонированное стекло\nАксессуары в комплекте 2 телескопические направляющие, 1 решетка, 1 глубокий противень,\n1 противень для выпечки, 1 перфорированный противень\nДатчик температуры\nКласс энергоэффективности A+\nПолезный объем шкафа 70 л	Серебро	\N	\N	\N	\N	\N	57.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
5	SKSCR3031P  (SKSCR3011P )	Встраиваемый холодильная камера Signature Kitchen Suite, ширина 75 см, под навеску фасадов	1366990.00	292	4	Холодильная/морозильная камера	встраиваемый холодильник	/uploads/products/4.5.jpg	\N	Класс энергоэффективности E\nПолезный объем, всего 516 л\nМаксимальный уровень шума < 39 дБ\nЭнергопотребление за год (кВт/ч) 125\nNo-Frost \nИнверторный линейный компрессор \nРежимы Ice Plus, Деморежим, Вкл / выкл льдогенератора, Контроль температуры, Переустановка водяного фильтра, Диагностика\nБыстрое охлаждение\nВстроенный диспенсер для воды \nПодключение к водопроводу \nФильтр для воды (6 месяцев) \nПолки 3 регулируемые\nЯщики 3 с телескопическими направляющими, с доводчиком\nАлюминиевые дверные полки со съемными контейнерами 4 Cantilever\nЦифровое управление с белым светодиодным дисплеем \nИндикатор фильтра для воды \nТемпературы от 0 до 6°C\nПеренавешиваемая дверь\n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.809	2.290	0.678	1.256000	183.000	207.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
6	SKSUD2402E	Конвертируемый холодильник, встраиваемый под столешницу Signature Kitchen Suite, 60 см, под фасад	631990.00	292	4	Холодильная/морозильная камера	встраиваемый холодильник	/uploads/products/4.6.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности F                                                         \nПолезный объем, всего 89 л\nМаксимальный уровень шума < 37 дБ\nNo-Frost\nИнверторный линейный компрессор\nАвтоматическое размораживание\nРежимы Морозильная камера (от -21 до -15°C), Мясо и морепродукты (-1°C), Бар (1°C), Холодильник (от 2 до 6°C), Напитки (10°C)\nБыстрая заморозка\nЦифровое управление с белым светодиодным дисплеем \nТемпературы от -23 до 10°C\n\nДверные панели заказываются отдельно	\N	0.650	0.970	0.650	0.410000	65.000	69.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
7	SKSUW2401G	Винный шкаф, встраиваемый под столешницу Signature Kitchen Suite, ширина 60 см, черный, Push to Open	736990.00	270	4	Винный шкаф	\N	/uploads/products/4.7.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Вместимость (бутылки 750 мл) 41\nNo-Frost \nИнверторный линейный компрессор \nОкно InstaView™ (постучать дважды, чтобы увидеть содержимое) \nWine Cave Technology™ \nТемпературные зоны 2\nТемпературы от 4 до 18°C\nРежимы Деморежим, Контроль температуры, Диагностика, Шаббат\nКонтроль влажности \nСовместимость с большой высотой \nДемпферный двигатель \nЗащита от ультрафиолетовых лучей \nПолки для хранения 4\nМатериал полок Натуральный бук с металлическими элементами\nДемонстрационные полки \nОсвещение демонстрационных полок \nПеренавешиваемая дверь	\N	0.650	0.970	0.650	0.410000	67.000	71.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
8	SKSCW243RP (SKSCW242RP)	Встраиваемый винный шкаф Signature Kitchen Suite, ширина 60 см, под навеску фасадов	1216990.00	270	4	Винный шкаф	\N	/uploads/products/4.8.jpg	\N	Класс энергоэффективности E\nВместимость (бутылки 750 мл) 113\nМаксимальный уровень шума < 37 дБ\nЭнергопотребление за год (кВт/ч) 169\nNo-Frost\nИнверторный линейный компрессор\nОкно InstaView™ (постучать дважды, чтобы увидеть содержимое) \nWine Cave Technology™ \nТемпературные зоны 3\nТемпературы от 5 до 18°C\nРежимы Деморежим, Контроль температуры, Диагностика\nКонтроль влажности \nСовместимость с большой высотой \nДемпферный двигатель \nЗащита от ультрафиолетовых лучей \nПолки для хранения 10\nМатериал полок Натуральный бук с металлическими элементами\nДемонстрационные полки 2\nОсвещение демонстрационных полок \n\n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.663	2.290	0.678	1.029000	162.000	182.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
9	SKSCW183RP  (SKSCW182RP)	Встраиваемый винный шкаф Signature Kitchen Suite, ширина 45 см, под навеску фасадов	1066990.00	270	4	Винный шкаф	\N	/uploads/products/4.9.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Класс энергоэффективности E\nВместимость (бутылки 750 мл) 71\nМаксимальный уровень шума < 37 дБ\nЭнергопотребление за год (кВт/ч) 165\nNo-Frost \nИнверторный линейный компрессор \nОкно InstaView™ (постучать дважды, чтобы увидеть содержимое) \nWine Cave Technology™ \nТемпературные зоны 2\nТемпературы от 5 до 18°C\nРежимы Деморежим, Контроль температуры, Диагностика\nКонтроль влажности\nСовместимость с большой высотой \nДемпферный двигатель \nЗащита от ультрафиолетовых лучей \nПолки для хранения 10\nМатериал полок Натуральный бук с металлическими элементами\nДемонстрационные полки 1\nОсвещение демонстрационных полок \n\nДверные панели заказываются отдельно\nПри установке незаподлицо необходимо заказать боковые панели	\N	0.504	2.290	0.678	0.783000	139.000	161.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
10	SKSDW2402P	Посудомоечная машина полновстраиваемая Signature Kitchen Suite	241990.00	280	4	Посудомоечная машина	\N	/uploads/products/4.10.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Комплекты посуды 14\nИнверторный двигатель с прямым приводом \nTrueSteam™\nQuadWash™ \nПрограммы\n(10) Автоматический, Глубокая очистка, Деликатная очистка, Обновление, Эко, Турбо, Цикл загрузки, Машинная очистка, Полоскание, Экспресс\nОпции\n(8) Двойная зона, половинная загрузка, энергосбережение, пар, высокая температура, экстрасушка, блокировка управления, отложенный старт\nЗащита от протечек \nТип сушки Конденсационная / Автоматически открывающаяся дверь\nСистема мойки Vario Plus \nРегулировка высоты третьей корзины \nАвтоматически открывающаяся дверь \nИндикатор времени работы \nИндикатор соли \nИндикатор ополаскивателя \nКласс энергоэффективности D\nУровень шума экопрограммы 43 дБ\nВремя экспресс-цикла 56 мин	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
11	SKSLV2403S (SKSLV2401S)	Духовой шкаф с микроволнами и паром  Signature Kitchen Suite, 45 см, черный	511990.00	203	4	Духовой шкаф	компактный 3в1	/uploads/products/4.11.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Внутреннее покрытие: Сталь\nДисплей 7-дюймовый цветной ЖК-дисплей\nРежимы приготовления: Микроволны, Обдув горячим воздухом, Жарка, Автообжарка, Пицца,\nГриль, Хрустящий гриль, Разморозка, Нижний нагрев, Пар\nКомбинированный режим приготовления в микроволновой печи: Обдув горячим воздухом, Обжарка, Автообжарка, Гриль, Пар\nАвтоматические программы «Шеф-повар» 30\nАвтоматически открывающаяся дверь без ручек \nСистема плавного открывания \nДатчик движения - ДА\nДекоративная подсветка (красный) \nМикроволновый инвертор \nМощность микроволн 1000 В\nВнешнее производство пара \nУдаление накипи \nСушка \nЕмкость контейнера для воды 1 л\nВнутреннее светодиодное освещение \nБыстрая очистка \nМатериал двери Тонированное стекло\nАксессуары в комплекте Металлический противень/Перфорированный противень/Решетка\nПолезный объем шкафа 32 л	Черный	\N	\N	\N	\N	\N	32.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
12	SKSLV2423MS (SKSLV2421MS)	Духовой шкаф с микроволнами и паром  Signature Kitchen Suite, 45 см, серебро	511990.00	203	4	Духовой шкаф	компактный 3в1	/uploads/products/4.12.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Внутреннее покрытие: Сталь\nДисплей 7-дюймовый цветной ЖК-дисплей\nРежимы приготовления: Микроволны, Обдув горячим воздухом, Жарка, Автообжарка, Пицца,\nГриль, Хрустящий гриль, Разморозка, Нижний нагрев, Пар\nКомбинированный режим приготовления в микроволновой печи: Обдув горячим воздухом, Обжарка, Автообжарка, Гриль, Пар\nАвтоматические программы «Шеф-повар» 30\nАвтоматически открывающаяся дверь без ручек \nСистема плавного открывания \nДатчик движения - НЕТ\nДекоративная подсветка (красный) \nМикроволновый инвертор \nМощность микроволн 1000 В\nВнешнее производство пара \nУдаление накипи \nСушка \nЕмкость контейнера для воды 1 л\nВнутреннее светодиодное освещение \nБыстрая очистка \nМатериал двери Тонированное стекло\nАксессуары в комплекте Металлический противень/Перфорированный противень/Решетка\nПолезный объем шкафа 32 л	Серебро	\N	\N	\N	\N	\N	32.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
13	SKSOV2411S	Духовой шкаф с паром Signature Kitchen Suite, 60 см, черный	661990.00	204	4	Духовой шкаф	с паром	/uploads/products/4.13.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Внутреннее покрытие Синяя фарфоровая эмаль\nДисплей 7-дюймовый цветной ЖК-дисплей с активной матрицей\nРежимы приготовления\n(18 режимов) Обдув горячим воздухом, Пицца, Обжаривание, Легкое обжаривание, Быстрое обжаривание +, Малый гриль, Большой гриль, Поддержание тепла, Разморозка, Подогрев, Нижний нагрев, 100%-й пар, Су-вид\nАвтоматические программы «шеф-повар»:  20 \nАвтоматически открывающаяся дверь без ручек\nСистема плавного открывания\nДатчик движения -ДА\nДекоративная подсветка (красный)\nВнешнее производство пара \nПриготовление на 100% пара с регулированием температуры до °C \nСу-вид \nУдаление накипи \nСушка \nЕмкость контейнера для воды 1 л\nВнутреннее светодиодное освещение \nБыстрая очистка \nМатериал двери Тонированное стекло\nАксессуары в комплекте 2 телескопические направляющие, 1 решетка, 1 глубокий противень,\n1 противень для выпечки, 1 перфорированный противень\nДатчик температуры\nКласс энергоэффективности A+\nПолезный объем шкафа 70 л	Черный	\N	\N	\N	\N	\N	57.000	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
15	SKSIT3601G	Индукционная варочная панель Signature Kitchen Suite,  ширина 93 см	465990.00	210	4	Варочная поверхность	индукционная	/uploads/products/4.15.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Управление 7-дюймовый ЖК-дисплей с активной матрицей   Монтаж: Стандарт / заподлицо\nЛоготип Термопечать под стеклом\nСветовая индикация (красный) \nПриготовление на медленном огне \nРежим Melt \nРежим Boost \nУровни мощности 17\nБлокировка экрана \nЯркость дисплея 5 уровней\nЧасы \nАвтоматическое распознавание посуды \nТаймер \nТехнология нагрева Индукционные конфорки и варочные зоны\nКоличество конфорок и/или зон 5\nПотребляемая мощность 10,200 В	Черный	\N	\N	\N	\N	22.900	26.600	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
16	SKSIT3621MS	Индукционная варочная панель Signature Kitchen Suite, ширина 93 см, серебро	465990.00	210	4	Варочная поверхность	индукционная	/uploads/products/4.16.jpg	\N	Управление 7-дюймовый ЖК-дисплей с активной матрицей   Монтаж: Стандарт / заподлицо\nЛоготип Термопечать под стеклом\nСветовая индикация (красный) \nПриготовление на медленном огне \nРежим Melt \nРежим Boost \nУровни мощности 17\nБлокировка экрана \nЯркость дисплея 5 уровней\nЧасы \nАвтоматическое распознавание посуды \nТаймер \nТехнология нагрева Индукционные конфорки и варочные зоны\nКоличество конфорок и/или зон 5\nПотребляемая мощность 10,200 В	Серебро	\N	\N	\N	\N	22.900	26.600	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
17	SKSWD2401S	Шкаф для подогрева посуды Signature Kitchen Suite, черный	143990.00	260	4	Подогреватель посуды	\N	/uploads/products/4.17.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Фасад: черный\nНастройки температуры: 40°C - 55°C - 70°C - 80°C\nИндикатор работы\nПоддержание тепла\nЗащита\nРазмер камеры духовки: 19 л	Черный	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
18	SKSWD2421MS	Шкаф для подогрева посуды Signature Kitchen Suite, серебро	143990.00	260	4	Подогреватель посуды	\N	/uploads/products/4.18.jpg	В наличии на складе. Свободный остаток уточняйте у менеджера.	Фасад: серебро\nНастройки температуры: 40°C - 55°C - 70°C - 80°C\nИндикатор работы\nПоддержание тепла\nЗащита\nРазмер камеры духовки: 19 л	Серебро	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
19	SKSFK800CS	Комплект боковых панелей Signature Kitchen Suite при установке не заподлицо	20990.00	293	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
20	SKSPK185CS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCF1831P / SKSCF1811P	97990.00	291	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
21	SKSPK245CS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCR2431P / SKSCR2411P / SKSCF2431P / SKSCF2411P	97990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
22	SKSPK305CS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCR3031P / SKSCR3011P	97990.00	292	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
23	SKSWK185LS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCW182 / SKSCW183	95990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
24	SKSWK185RS	Комплект панелей/ручек/цоколей из нержавеющей стали Signature Kitchen Suite для модели SKSCW182 / SKSCW183	95990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
25	SKSWK245LS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCW243RP/ SKSCW242RP (LS)	95990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
26	SKSWK245RS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSCW243RP / SKSCW242RP (RP)	95990.00	292	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
27	SKSPK360FS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite для модели SKSFD3634P / SKSFD3614P	244990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
28	SKSUK240DS	Комплект дверных панелей из нержавеющей стали Signature Kitchen Suite, для модели SKSUD2402E	88990.00	292	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
29	SKSHK480HS	Ручка из полированного алюминия Signature Kitchen Suite, 121.8 см	25990.00	291	4	\N	\N	\N	В наличии на складе. Свободный остаток уточняйте у менеджера.	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
30	SKSHK310HS	Ручка из полированного алюминия Signature Kitchen Suite, 80.5 см	20990.00	291	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
31	SKSFJ800P	Соединительный комплект для двойной установки Signature Kitchen Suite	20990.00	291	4	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2026-05-15 12:06:02.017848	2026-05-15 12:06:02.017848
\.


--
-- Data for Name: products_liebherr; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_liebherr (id, category_id, brand_id, model, ean, status, name, category_name, production_start, factory, warranty, price_public, price_wholesale, promo_price_public, promo_price_wholesale, created_at, updated_at) FROM stdin;
1	292	8	ICd 5103-22 001	4016803116677.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	124000.00	116000.00	93000.00	87000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
2	292	8	ICf 5103-22 001	4016803149118.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	112000.00	104500.00	82000.00	76500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
3	292	8	ICNd 5103-22 001	4016803116851.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	143000.00	133500.00	123000.00	115000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
4	292	8	ICNd 5603-20 001	4016803137375.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	10	173000.00	161500.00	133000.00	124000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
5	292	8	ICNSd 5603-20 001	4016803137399.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	10	163000.00	152500.00	133000.00	124500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
6	292	8	ICNe 5103-22 001	4016803116875.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	143000.00	133500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
7	292	8	ICNSe 5103-22 001	4016803117179.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	146000.00	136500.00	133000.00	124500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
8	292	8	ICNSf 5103-22 001	4016803149194.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	138000.00	129000.00	113000.00	105500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
9	292	8	ICSd 5102-22 001	4016803117315.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	130000.00	121500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
10	292	8	ICSe 5103-22 001	4016803117391.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	115000.00	107500.00	82000.00	76500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
11	292	8	ICBc 5122-22 001	4016803114932.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	179000.00	158500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
12	292	8	ICBNdi 5123-22 001	4016803115014.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	10	219000.00	194000.00	163000.00	144500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
13	292	8	ICBNSd 5123-22 001	4016803115038.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	208000.00	184000.00	153000.00	135500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
14	292	8	ICBNSd 5623-20 001	4016803137436.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	10	224000.00	209500.00	174000.00	162500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
15	292	8	ICBSd 5122-22 001	4016803115076.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	168000.00	148500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
16	292	8	ICc 5123-22 001	4016803117452.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
17	292	8	ICNd 5123-22 001	4016803117490.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	174000.00	154000.00	143000.00	126500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
18	292	8	ICNd 5133-22 001	4016803117551.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	208000.00	184000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
19	292	8	ICNSd 5123-22 001	4016803117735.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	168000.00	148500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
20	292	8	IRCe 5121-22 001	4016803116639.0	\N	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	186000.00	164500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
21	292	8	SICNdi 5153-22 001	4016803117773.0	New 2026	Холодильник-морозильник	Встраиваемая техника	\N	Ochsenhausen	5	200000.00	187000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
22	292	8	ICBNci 5153-22 001	4016803115113.0	New 2026	Холодильник-морозильник	Встраиваемая техника	2026	Ochsenhausen	5	250000.00	233500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
23	292	8	ICBNd 5653-20 001	4016803174011.0	New 2026	Холодильник-морозильник	Встраиваемая техника	2026	Ochsenhausen	10	280000.00	261500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
24	292	8	ICNbsd 5173	4016803174134.0	New 2026	Холодильник-морозильник	Встраиваемая техника	2026	Ochsenhausen	10	250000.00	233500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
25	292	8	ICBNbsd 5173	4016803174158.0	New 2026	Холодильник-морозильник	Встраиваемая техника	2026	Ochsenhausen	10	300000.00	280500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
26	292	8	IRe 3900-22 001	4016803113096.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	112000.00	104500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
27	292	8	IRe 3901-22 001	4016803113119.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	122000.00	114000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
28	292	8	IRbi 3951-22 001	4016803114253.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
29	292	8	IRci 3950-62 001	4016803114277.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
30	292	8	IRd 4020-62 001	4016803114314.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	146000.00	136500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
31	292	8	IRd 4021-22 001	4016803114611.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	146000.00	136500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
32	292	8	IRBbi 4050-22 001	4016803113218.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	191000.00	178500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
33	292	8	IRe 4100-22 001	4016803116011.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
34	292	8	IRe 4101-22 001	4016803116059.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
35	292	8	IRd 4520-22 001	4016803116295.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	172000.00	160500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
36	292	8	IRd 4521-22 001	4016803116332.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	172000.00	160500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
37	292	8	IRBd 4551-22 001	\N	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	2	134200.00	122000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
38	292	8	IRBci 4550-22 001	4016803113478.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	224000.00	209500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
39	292	8	IRd 5100-22 001	4016803116356.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	138000.00	129000.00	118000.00	110500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
40	292	8	IRd 5101-22 001	4016803116370.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
41	292	8	IRe 5100-22 001	4016803116394.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	138000.00	129000.00	113000.00	105500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
42	292	8	IRe 5101-22 001	4016803116493.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	146000.00	136500.00	123000.00	115000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
43	292	8	IRBSd 5120-22 001	4016803114338.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	174000.00	162500.00	153000.00	143000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
44	292	8	IRBSd 5121-22 001	4016803114376.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	180000.00	168000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
45	292	8	IRDdi 5120-22 001	4016803116592.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	179000.00	167500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
46	292	8	IRDdi 5121-22 001	4016803116615.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	186000.00	174000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
47	292	8	IRBci 5150-22 001	4016803114413.0	\N	Встраиваемый холодильник	Встраиваемая техника	\N	Ochsenhausen	5	247000.00	231000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
48	292	8	IRBbsci 5170	4016803120919.0	New 2026	Встраиваемый холодильник	Встраиваемая техника	2026	Ochsenhausen	10	300000.00	280500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
49	291	8	IFNd 3503-22 001	4016803115311.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	103000.00	96500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
50	291	8	IFNbi 3553-22 001	4016803115335.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	149000.00	139500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
51	291	8	IFd 3904-22 001	4016803115373.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	96000.00	89500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
52	291	8	IFSd 3904-22 001	4016803115397.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	90000.00	84000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
53	291	8	IFNd 3924-22 001	4016803115410.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	107000.00	100000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
54	291	8	IFNci 3954-22 001	4016803115458.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
55	291	8	SIFNci 3954-22 001	4016803115472.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	168000.00	157000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
56	291	8	SIFNdi 4155-22 001	4016803115496.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	219000.00	204500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
57	291	8	SIFNdi 4556-22 001	4016803115519.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	247000.00	231000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
58	291	8	SIFNf 5108-22 001	4016803149156.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	138000.00	129000.00	120000.00	112000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
59	291	8	SIFNe 5128-22 001	4016803115571.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	164000.00	153500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
60	291	8	SIFNSe 5128-22 001	4016803115656.0	\N	Встраиваемый морозильник	Встраиваемая техника	\N	Ochsenhausen	5	164000.00	153500.00	133000.00	124500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
61	270	8	WKEes 553-26 001	9005382279595.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	124000.00	116000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
62	270	8	WKEgb 582-26 001	9005382279618.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	264000.00	246500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
63	270	8	WKEgw 582-26 001	9005382279632.0	Stock	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	264000.00	246500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
64	270	8	EWTdf 1653-26 001	9005382278918.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	325000.00	303500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
65	270	8	EWTgb 1683-26 001	9005382278994.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	370000.00	346000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
66	270	8	EWTgw 1683-26 001	9005382279052.0	Stock	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	370000.00	346000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
67	270	8	EWTdf 2353-26 001	9005382278932.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	364000.00	340000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
68	270	8	EWTgb 2383-26 001	9005382279014.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	425000.00	397000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
69	270	8	EWTdf 3553-26 001	9005382278956.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	432000.00	403500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
70	270	8	EWTgb 3583-26 001	9005382279038.0	\N	Встраиваемый винный шкаф	Встраиваемая техника	\N	Lienz	5	510000.00	476500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
71	292	8	IXRFS 5125-22 001	4016803143253.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	338000.00	316000.00	286000.00	267500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
72	292	8	SIFNSe 5128-22 001	4016803115656.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	164000.00	153500.00	133000.00	124500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
73	292	8	IRBSd 5120-22 001	4016803114338.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	174000.00	162500.00	153000.00	143000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
74	292	8	IXRF 4555-22 001	4016803142959.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	471000.00	440000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
75	292	8	SIFNdi 4556-22 001	4016803115519.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	247000.00	231000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
76	292	8	IRBci 4550-22 001	4016803113478.0	\N	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	224000.00	209500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
77	292	8	IXCC 5155-22 001	4016803142898.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	2026	Ochsenhausen	5	450000.00	420500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
78	292	8	SICNdi 5153-22 001	4016803117773.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Ochsenhausen	5	200000.00	187000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
79	292	8	ICBNci 5153-22 001	4016803115113.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	2026	Ochsenhausen	5	250000.00	233500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
80	292	8	IXRW 5173-22 BS0	4016803144892.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	2026	Ochsenhausen/Lienz	5	810000.00	757000.00	810000.00	757000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
81	292	8	EWTgb 3583-26 001	9005382279038.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	\N	Lienz	5	510000.00	476500.00	510000.00	476500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
82	292	8	IRBbsci 5170	4016803120919.0	New 2026	Встраиваемый холодильник Side‑by‑Side	Встраиваемая техника	2026	Ochsenhausen	10	300000.00	280500.00	300000.00	280500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
83	292	8	UIK 1510-26 001	4016803135395.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Marica	5	103000.00	96500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
84	292	8	UIK 1514-26 001	4016803135470.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Marica	5	103000.00	96500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
85	292	8	URc 3700-20 001	9005382259870.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	122000.00	104500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
86	292	8	URc 3701-20 001	9005382259856.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	122000.00	104500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
87	292	8	URd 3600-20 001	9005382258279.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	112000.00	95500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
88	292	8	URd 3601-20 001	9005382259559.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	112000.00	95500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
89	292	8	UBCgb 3731-20 001	9005382260616.0	New 2026	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	2026	Lienz	5	180000.00	154000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
90	292	8	URd 365i-20 001	9005382259757.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	143000.00	133500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
91	292	8	URPd 365i-20 001	9005382259795.0	\N	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	163000.00	152500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
92	292	8	OKes 1750-26 001	9005382279397.0	Stock	Встраиваемый под столешницу холодильник	Встраиваемая под столешницу	\N	Lienz	5	326000.00	304500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
93	292	8	SUIG 1514-26 001	4016803135319.0	\N	Встраиваемый под столешницу морозильник	Встраиваемая под столешницу	\N	Marica	5	100000.00	93500.00	87000.00	81500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
94	292	8	SUIGN 1554-26 001	4016803135357.0	Stock	Встраиваемый под столешницу морозильник	Встраиваемая под столешницу	\N	Marica	5	118000.00	110500.00	102000.00	95500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
95	292	8	SUFc 3703-20 001	9005382254899.0	\N	Встраиваемый под столешницу морозильник	Встраиваемая под столешницу	\N	Lienz	5	122000.00	104500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
96	292	8	SUFd 3603-20 001	9005382259955.0	\N	Встраиваемый под столешницу морозильник	Встраиваемая под столешницу	\N	Lienz	5	112000.00	95500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
97	292	8	SUFNd 365i-20 001	9005382259979.0	\N	Встраиваемый под столешницу морозильник	Встраиваемая под столешницу	\N	Lienz	5	143000.00	133500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
98	292	8	UWTes 1672-22 001	9005382235256.0	Stock	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	278000.00	260000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
99	292	8	UWgb 3631-20 001	9005382260234.0	\N	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	224000.00	209500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
100	292	8	UWgb 3632-20 001	9005382260319.0	\N	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	275000.00	257000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
101	292	8	EWT 9175-23 001	9005382274057.0	Stock	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	1322000.00	925500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
102	292	8	EWT 9175-23 617	9005382274118.0	Stock	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	1322000.00	925500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
103	292	8	EWT 9275-23 001	9005382274132.0	Stock	Встраиваемый под столешницу винный шкаф	Встраиваемая под столешницу	\N	Lienz	5	1627000.00	1139000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
104	293	8	CNbed 5203-22 001	4016803126935.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	87000.00	79000.00	77000.00	70000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
105	293	8	CNbed 5703-22 001	4016803126379.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	109000.00	99000.00	82000.00	74500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
106	293	8	CNc 5203-22 001	4016803126553.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	93000.00	84500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
107	293	8	CNc 5703-22 001	4016803126171.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	98000.00	89000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
108	293	8	CNd 5704-22 001	4016803126010.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	108000.00	98000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
109	293	8	CNf 5203-22 001	4016803150138.0	Stock	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	87000.00	79000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
110	293	8	CNsdc 5203-22 001	4016803126478.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	101000.00	92000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
111	293	8	CNsfd 5203-22 001	4016803126638.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	96000.00	87500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
112	293	8	CNsfd 5704-22 001	4016803125952.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	105000.00	95500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
113	293	8	CNc 5213-20 001	4016803171638.0	New 2026	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	100000.00	91000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
114	293	8	CNc 5713-20 001	4016803171713.0	New 2026	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	105000.00	95500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
115	293	8	CBNbda 5223-22 001	4016803128953.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	179000.00	158500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
116	293	8	CBNbdc 573i-22 001	4016803129271.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	191000.00	169000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
117	293	8	CBNc 5223-22 001	4016803128854.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	135000.00	119500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
118	293	8	CBNc 5723-22 001	4016803128977.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	146000.00	129000.00	113000.00	100000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
119	293	8	CBNsfc 5223-22 001	4016803128878.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
120	293	8	CBNsfc 572i-22 001	4016803129158.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	10	168000.00	148500.00	123000.00	108500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
121	293	8	CNbdb 5223-22 001	4016803127031.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	135000.00	119500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
122	293	8	CNbdc 573i-22 001	4016803127277.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
123	293	8	CNgbc 5723-22 001	4016803127079.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
124	293	8	CNgwc 5723-22 001	4016803127055.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
125	293	8	CNsfc 573i-22 001	4016803127253.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	135000.00	119500.00	113000.00	100000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
126	293	8	CNsfc 574i-22 001	4016803127215.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	168000.00	148500.00	128000.00	113000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
127	293	8	CNsdd 775i-20 001	4016803124870.0	Stock	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	255000.00	238500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
128	293	8	CBNsdc 765i-20 001	4016803108795.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	280000.00	261500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
129	293	8	CBNstd 5783-20 001	4016803086659.0	Stock	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	448000.00	418500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
130	293	8	RBc 5220-22 001	4016803123491.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	130000.00	115000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
131	293	8	RBsfc 5220-22 001	4016803130659.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	138000.00	122000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
132	293	8	RBsfd 5221-22 001	4016803130611.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	138000.00	122000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
133	293	8	Rd 5220-22 001	4016803123439.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	121000.00	107000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
134	293	8	RDsfd 5220-22 001	4016803130598.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	121000.00	107000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
135	293	8	Rsfd 5220-22 001	4016803130536.0	\N	Отдельностоящий холодильник-морозильник с морозильной камерой	Отдельностоящая	\N	Marica	5	131000.00	116000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
136	293	8	FNe 4204-22 001	4016803130277.0	\N	Отдельностоящий морозильник	Отдельностоящая	\N	Ochsenhausen	10	101000.00	92000.00	82000.00	74500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
137	293	8	FNe 4605-22 001	4016803130338.0	\N	Отдельностоящий морозильник	Отдельностоящая	\N	Ochsenhausen	10	112000.00	102000.00	92000.00	84000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
138	293	8	FNe 5006-22 001	4016803130390.0	\N	Отдельностоящий морозильник	Отдельностоящая	\N	Ochsenhausen	10	124000.00	112500.00	103000.00	93500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
139	293	8	FNe 5207-22 001	4016803130451.0	\N	Отдельностоящий морозильник	Отдельностоящая	\N	Ochsenhausen	10	135000.00	122500.00	113000.00	102500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
140	293	8	FNc 727i-22 001	4016803131731.0	\N	Отдельностоящий морозильник	Отдельностоящая	\N	Ochsenhausen	5	336000.00	297500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
141	293	8	XRF 5220-22 001	4016803143673.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	10	258000.00	228500.00	205000.00	181500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
142	293	8	SRd 5220-22 001	4016803129998.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	10	112000.00	99000.00	92000.00	81500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
143	293	8	SFNd 5227-22 001	4016803131878.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	10	146000.00	129000.00	113000.00	100000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
144	293	8	XRFbd 5220-22 001	4016803143697.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	5	316000.00	279500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
145	293	8	SRbdd 5220-22 001	4016803130512.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	5	148000.00	131000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
146	293	8	SFNbdd 5227-22 001	4016803131854.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	5	168000.00	148500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
147	293	8	XRFsd 5230-22 001	4016803143833.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	5	320000.00	283000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
148	293	8	SRsdd 5230-22 001	4016803130055.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	5	146000.00	129000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
149	293	8	SFNsdd 5237-22 001	4016803131830.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	5	174000.00	154000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
150	293	8	XRFsf 5220-22 001	4016803143994.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	10	292000.00	258500.00	226000.00	200000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
151	293	8	SRsfd 5220-22 001	4016803130017.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	10	135000.00	119500.00	103000.00	91000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
152	293	8	SFNsfd 5227-22 001	4016803131892.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	10	157000.00	139000.00	123000.00	109000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
153	293	8	XRFsf 5225-22 001	4016803144014.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	5	314000.00	278000.00	280000.00	248000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
154	293	8	SRBsfc 5220-22 001	4016803123538.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	5	157000.00	139000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
155	293	8	SFNsfd 5227-22 001	4016803131892.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	10	157000.00	139000.00	123000.00	109000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
156	293	8	XRFsf 5240-22 001	4016803144038.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	10	314000.00	278000.00	282000.00	249500.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
157	293	8	SRsfd 5220-22 001	4016803130017.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	10	135000.00	119500.00	103000.00	91000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
158	293	8	SFNsfd 5247-22 001	4016803131915.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	5	179000.00	158500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
159	293	8	XRFsf 5245-22 001	4016803144052.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen/Marica	5	336000.00	297500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
160	293	8	SRBsfc 5220-22 001	4016803123538.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Marica	5	157000.00	139000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
161	293	8	SFNsfd 5247-22 001	4016803131915.0	\N	Отдельностоящий холодильник Side-by-Side	Отдельностоящая	\N	Ochsenhausen	5	179000.00	158500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
162	271	8	WPbl 4201-20 001	9005382243879.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	168000.00	157000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
163	271	8	WPbl 4601-20 001	9005382243978.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	179000.00	167500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
164	271	8	WPbl 5001-20 001	9005382243916.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	210000.00	196500.00	153000.00	143000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
165	271	8	WSbl 4201-20 001	9005382243893.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	157000.00	146500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
166	271	8	WSbl 4601-20 001	9005382244258.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	168000.00	157000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
167	271	8	WSbl 5001-20 001	9005382243930.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	179000.00	167500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
168	271	8	WPbli 5031-20 001	9005382243992.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	258000.00	241000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
169	271	8	WPbli 5231-20 001	9005382244050.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	280000.00	261500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
170	271	8	WSbli 5031-20 001	9005382244036.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	247000.00	231000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
171	271	8	WSbli 5231-20 001	9005382244111.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	269000.00	251500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
172	271	8	WSbli 7731-20 001	9005382244173.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	392000.00	366500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
173	271	8	WFbli 5041-20 001	9005382244012.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	280000.00	261500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
174	271	8	WFbli 5241-20 001	9005382244074.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	302000.00	282000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
175	271	8	WFbli 7741-20 001	9005382244159.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	370000.00	346000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
176	271	8	WPbsi 5052-20 001	4016803088059.0	Stock	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	364000.00	340000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
177	271	8	WPbsi 5252-20 001	4016803088073.0	Stock	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	448000.00	418500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
178	271	8	WPsd 4652-20 001	4016803087953.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	336000.00	314000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
179	271	8	WPsd 5252-20 001	4016803087977.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	392000.00	366500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
180	271	8	WSbsi 5252-20 001	4016803088097.0	Stock	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	392000.00	366500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
181	271	8	WPbsi 5052-21 001	4016803170891.0	New 2026	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	364000.00	340000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
182	271	8	WPbsi 5252-21 001	4016803170914.0	New 2026	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	448000.00	418500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
183	271	8	WSbsi 5252-21 001	4016803170938.0	New 2026	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	392000.00	366500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
184	271	8	WPgbi 5272-20 001	4016803088110.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	616000.00	575500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
185	271	8	WPgbi 5273-20 001	4016803106333.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	638000.00	596500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
186	271	8	WPgbi 5283-20 001	4016803088158.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	649000.00	606500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
187	271	8	WPgbi 7472-20 001	4016803088134.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	672000.00	628000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
188	271	8	WPgbi 7473-20 001	4016803106319.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	727000.00	679500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
189	271	8	WPgbi 7483-20 001	4016803088172.0	\N	Отдельностоящий винный шкаф	Отдельностоящая	\N	Marica	5	783000.00	732000.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
190	270	8	WKb 1812-22 001	9005382235331.0	Stock	Настольный отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	148000.00	138500.00	\N	\N	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
191	270	8	WKes 653-26 001	9005382279656.0	\N	Настольный отдельностоящий винный шкаф	Отдельностоящая	\N	Lienz	5	266000.00	248500.00	153000.00	143000.00	2026-05-15 19:30:25.89385+03	2026-05-15 19:30:25.89385+03
\.


--
-- Data for Name: products_nivona; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products_nivona (id, category_id, brand_id, main_image, sku, model, name, description, price_public, comment, created_at, updated_at) FROM stdin;
1	231	12	/uploads/products/12.1.jpg	NICR 970	Кофемашина Nivona CafeRomatica NICR 970	NICR 970	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  4 уровня. Количество степеней помола - 5 уровней. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUO - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 4 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 и контейнер для молока NIMC 1000 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - 8 цветов. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 270 гр. Ёмкость резервуара для воды 2.2 л. Вес без упаковки 11,4 кг. Габариты кофемашины (Ш xВ xГ), см - 28х36х50. Цвет: Титан, хром. Производство: Швейцария	114990.00	\N	2026-05-15 19:01:57.713041+03	\N
2	231	12	/uploads/products/12.2.jpg	NICR 960	Кофемашина Nivona CafeRomatica NICR 960	NICR 960	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  4 уровня. Количество степеней помола - 5 уровней. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUO - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 4 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 и контейнер для молока NIMC 1000 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - 8 цветов. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 270 гр. Ёмкость резервуара для воды 2.2 л. Вес без упаковки 11,4 кг. Габариты кофемашины (Ш xВ xГ), см - 28х36х50. Цвет: Черный, хром. Производство: Швейцария	129990.00	\N	2026-05-15 19:01:57.713041+03	\N
3	231	12	/uploads/products/12.3.jpg	NICR 930	Кофемашина Nivona CafeRomatica NICR 930	NICR 930	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  4 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUO - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 4 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 и контейнер для молока NIMC 1000 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 270 гр. Ёмкость резервуара для воды 2.2 л. Вес без упаковки 11,6 кг. Габариты кофемашины (Ш xВ xГ), см - 28х36х50. Цвет: Черный, хром. Производство: Швейцария	94990.00	\N	2026-05-15 19:01:57.713041+03	\N
4	231	12	/uploads/products/12.4.jpg	NICR 825	Кофемашина Nivona CafeRomatica NICR 825	NICR 825	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 10. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUOplus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 1,8 л. Вес без упаковки 9,7 кг. Габариты кофемашины (Ш xВ xГ), см - 24х33х48. Цвет: Нержавеющая сталь, хром. Производство: Швейцария	108990.00	\N	2026-05-15 19:01:57.713041+03	\N
25	411	12	/uploads/products/12.25.jpg	NIRF 701	Фильтр для воды Nivona NIRF 701	NIRF 701	Фильтр для воды. Заполняется исключительно органическими материалами,\nне содержит химических добавок,\nзащищает кофемашину и продлевает срок ее службы,\nменьший уровень накипи, 1 шт.	2690.00	\N	2026-05-15 19:01:57.713041+03	\N
26	411	12	/uploads/products/12.26.jpg	NIRT 701	Таблетки для чистки гидросистемы Nivona NIRT 701	NIRT 701	Таблетки для очистки гидросистемы. Подходят для всех моделей кофемашин NIVONA,\nэффективно растворяют примеси, например, остатки кофе и липиды,\nчистка машины на регулярной основе продлевает срок службы и обеспечивает полноценный аромат кофе, 10 шт.	2390.00	\N	2026-05-15 19:01:57.713041+03	\N
5	231	12	/uploads/products/12.5.jpg	NICR 820	Кофемашина Nivona CafeRomatica NICR 820	NICR 820	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 10. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUOplus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 1,8 л. Вес без упаковки 9,7 кг. Габариты кофемашины (Ш xВ xГ), см - 24х33х48. Цвет: Черный, хром. Производство: Швейцария	99990.00	\N	2026-05-15 19:01:57.713041+03	\N
6	231	12	/uploads/products/12.6.jpg	NICR 799	Кофемашина Nivona CafeRomatica NICR 799	NICR 799	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch plus- капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 1 цвет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,8 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Нержавеющая сталь, хром. Производство: Португалия	94990.00	\N	2026-05-15 19:01:57.713041+03	\N
7	231	12	/uploads/products/12.7.jpg	NICR 796	Кофемашина Nivona CafeRomatica NICR 796	NICR 796	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch plus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 1 цвет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,8 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Белый, хром. Производство: Португалия	89990.00	\N	2026-05-15 19:01:57.713041+03	\N
8	231	12	/uploads/products/12.8.jpg	NICR 795	Кофемашина Nivona CafeRomatica NICR 795	NICR 795	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch plus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 1 цвет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,8 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Титан, хром. Производство: Португалия	81990.00	\N	2026-05-15 19:01:57.713041+03	\N
27	411	12	/uploads/products/12.27.jpg	NIRK 703	Жидкость для удаления накипи Nivona NIRK 703	NIRK 703	Жидкость для удаления накипи                                                                                                                                                                                         500 мл, для очистки любой модели кофемашины NIVONA от накипи,\nнадежно удаляет накипь,\nсохраняет машину в надлежащем состоянии и обеспечивает полноценный кофейный аромат	2390.00	\N	2026-05-15 19:01:57.713041+03	\N
28	411	12	/uploads/products/12.28.jpg	NICC 705	Чистящее средство для капучинатора Nivona Cream Cleaner NICC 705	NICC 705	Чистящее средство для капучинатора                                                                                                                                                                                    500 мл, для очистки устройства взбивателя пены Spumatore,\nспециально разработано для очистки взбивателя пены,\nрегулярная очистка взбивателя пены, обеспечивает полноценный кофейный аромат и чистоту	2390.00	\N	2026-05-15 19:01:57.713041+03	\N
9	231	12	/uploads/products/12.9.jpg	NICR 793	Кофемашина Nivona CafeRomatica NICR 793	NICR 793	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch plus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,8 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Серый, хром. Производство: Португалия	79990.00	\N	2026-05-15 19:01:57.713041+03	\N
10	231	12	/uploads/products/12.10.jpg	NICR 790	Кофемашина Nivona CafeRomatica NICR 790	NICR 790	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch plus- капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,8 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Черный, хром. Производство: Португалия	79990.00	\N	2026-05-15 19:01:57.713041+03	\N
11	231	12	/uploads/products/12.11.jpg	NICR 759	Кофемашина Nivona CafeRomatica NICR 759	NICR 759	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 1. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор - нет. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,6 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Черный, хром. Производство: Португалия	63990.00	\N	2026-05-15 19:01:57.713041+03	\N
12	231	12	/uploads/products/12.12.jpg	NICR 756	Кофемашина Nivona CafeRomatica NICR 756	NICR 756	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 1. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор - нет. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,6 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Черный, хром. Производство: Португалия	67990.00	\N	2026-05-15 19:01:57.713041+03	\N
29	411	12	/uploads/products/12.29.jpg	NICB 301 (CLEAN BOX)	Набор чистящих средств для кофемашин (3 в 1) Nivona Clean Box NICB 301	NICB 301 (CLEAN BOX)	Набор чистящих средств                                                                                                                                                                                                                                     500 мл, для очистки устройства взбивателя пены Spumatore  500 мл                                                                                                      для очистки от накипи, надежно удаляет накипь                                                                                                                                                                                                                                                                                         10  таблеток для очистки от остатков кофе и лириды, эффективно растворяют примеси	5890.00	\N	2026-05-15 19:01:57.713041+03	\N
30	411	12	/uploads/products/12.30.jpg	NIMA 330	Набор трубок для молока Nivona NIMA 330	NIMA 330	Запасной молочный шланг для всех моделей NIVONA с функцией OneTouch Spumatore, 3 штуки в упаковке	2390.00	\N	2026-05-15 19:01:57.713041+03	\N
13	231	12	/uploads/products/12.13.jpg	NICR 695	Кофемашина Nivona CafeRomatica NICR 695	NICR 695	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE - нет. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,4 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Титан, хром. Производство: Португалия	61990.00	\N	2026-05-15 19:01:57.713041+03	\N
14	231	12	/uploads/products/12.14.jpg	NICR 690	Кофемашина Nivona CafeRomatica NICR 690	NICR 690	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 3 профиля. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 5. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE - нет. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,4 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Черный, хром. Производство: Португалия	61990.00	\N	2026-05-15 19:01:57.713041+03	\N
15	231	12	/uploads/products/12.15.jpg	NICR 560	Кофемашина Nivona CafeRomatica NICR 560	NICR 560	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System - нет.. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 3 уровня. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе -нет. Регулировка настроек во время приготовления - нет. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE - нет. Фильтр CLARIS NIRF 700 - нет. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,2 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Белый, хром. Производство: Португалия	47990.00	\N	2026-05-15 19:01:57.713041+03	\N
16	231	12	/uploads/products/12.16.jpg	NICR 555	Кофемашина Nivona CafeRomatica NICR 555	NICR 555	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System - нет.. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 3 уровня. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе -нет. Регулировка настроек во время приготовления - нет. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE - нет. Фильтр CLARIS NIRF 700 - нет. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,2 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Серый, хром. Производство: Португалия	37990.00	\N	2026-05-15 19:01:57.713041+03	\N
17	231	12	/uploads/products/12.17.jpg	NICR 550	Кофемашина Nivona CafeRomatica NICR 550	NICR 550	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1455 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System - нет.. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока - нет. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 3 уровня. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе -нет. Регулировка настроек во время приготовления - нет. Редактирование встроенных рецептов. SPUMATORE OneTouch - капучино одним нажатием - нет. Автоматический капучинатор. Одновременное приготовление 2-х чашек кофе без молока. Регулировка температуры подачи горячей воды. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения - нет. Автоополаскиватель для OneTouch SPUMATORE - нет. Фильтр CLARIS NIRF 700 - нет. Подсветка чашек - нет. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен - нет. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA - нет. Дополнительная шумоизоляция - нет. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 2,2 л. Вес без упаковки 8,2 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х46. Цвет: Черный, хром. Производство: Португалия	47990.00	\N	2026-05-15 19:01:57.713041+03	\N
18	231	12	/uploads/products/12.18.jpg	NIVO 8101	Кофемашина Nivona NIVO 8101	NIVO 8101	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 5 профилей. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUOplus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 1,8 л. Вес без упаковки 9,9 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х48. Цвет: Черный, хром. Производство: Португалия	111990.00	\N	2026-05-15 19:01:57.713041+03	\N
19	231	12	/uploads/products/12.19.jpg	NIVO 8103	Кофемашина Nivona NIVO 8103	NIVO 8103	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 5 профилей. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды - нет. Cold brew - холодное заваривание - нет. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUOplus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 1,8 л. Вес без упаковки 9,9 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х48. Цвет: Титан, хром. Производство: Португалия	119990.00	\N	2026-05-15 19:01:57.713041+03	\N
20	231	12	/uploads/products/12.20.jpg	NIVO 8107	Кофемашина Nivona CafeRomatica NIVO 8107	NIVO 8107	Давление помпы 15 бар. Напряжение 230 Вт. Максимальная мощность 1465 Вт. ЭКО режим. Система предварительного заваривания. Регулировка количества кофе от 20 мл до 240 мл. Отсек для молотого кофе. Отделение для хранения шнура. Съёмный варочный блок. Контрольный индикатор замены фильтра. Регулировка жёсткости воды. Программа суперлёгкой очистки EasyClean. Автоматическая программа очистки от кофейных масел. Автоматическая программа декальцинации. Кофемолка с коническими жерновами из закалённой стали. Aroma Balance System 5 профилей. Cappuccino-Connaisseur -выбор очерёдности подачи кофе и молока. Americano-Connaisseur - выбор очерёдности подачи кофе и воды. Cold brew - холодное заваривание. Выбор крепости кофе - 5 уровней. Регулируемая температура кофе -  3 уровня. Количество степеней помола - 3 уровня. Количество программируемых рецептов Мой Кофе - 9. Регулировка настроек во время приготовления. Редактирование встроенных рецептов. SPUMATORE OneTouch DUOplus - капучино одним нажатием. Автоматический капучинатор. Одновременное приготовление 2-х капучино/латте/черного кофе. Регулировка температуры подачи горячей воды - 3 уровня. Регулировка дозатора под высоту чашки до 14 см. Задние ролики для перемещения. Автоополаскиватель для OneTouch SPUMATORE. Фильтр CLARIS NIRF 700 в комплекте. Подсветка чашек - 2 цвета. Подсветка резервуара для воды - нет. Активный подогрев чашек - нет. Датчик наличия кофейных зёрен. Дисплей цветной, не сенсорный. Управление по Bluetooth через приложение NIVONA. Дополнительная шумоизоляция. Ёмкость контейнера для зёрен 250 гр. Ёмкость резервуара для воды 1,8 л. Вес без упаковки 9,9 кг. Габариты кофемашины (Ш xВ xГ), см - 24х34х48. Цвет: Жемчужно-синий, хром. Производство: Португалия	115990.00	\N	2026-05-15 19:01:57.713041+03	\N
21	411	12	/uploads/products/12.21.jpg	NICG 130	Кофемолка Nivona CafeGrano NICG 130	NICG 130	Кофемолка NIVONA. Закаленные стальные конические жернова для достижения уровней помола от очень тонкого до грубого. В зависимости от способа приготовления и предпочтений, выберите степень помола кофе от очень грубого до сверх тонкого. При помощи поворотного регулятора, вы можете настроить необходимое время измельчения, а тем самым и количество измельченного кофе. Потребляемая мощность: 100 Вт. Ёмкость контейнера для зёрен: 200 г. Система помола: Конические жернова. Дозатор кофе: от 1 до 10 чашек. Питающее напряжение: 230 В. Ёмкость контейнера для молотого кофе: 90 г.	13600.00	\N	2026-05-15 19:01:57.713041+03	\N
22	411	12	/uploads/products/12.22.jpg	NICO 100	Охладитель для молока NIVONA Cooler NICO 100	NICO 100	Охладитель для молока. Потребляемая мощность: 23 Вт. Температурный диапазон: Охлаждение до 22 °C ниже температуры окружающей среды, но не ниже 3 °C. Питающее напряжение: 100-240 В 50/60 Гц через адаптер источника питания. Объём: 1 л. Контейнер: да. Вес: 2.6 кг. Размер (ШхВхГ): 15x31.5x27 см. Гарантия: 2 года. В комплекте: адаптер источника питания, силиконовый шланг для молока, шланговый штуцер, инструкция в бумажном виде	29990.00	\N	2026-05-15 19:01:57.713041+03	\N
23	411	12	/uploads/products/12.23.jpg	NIMC 1000	Контейнер для молока Nivona NIMC 1000	NIMC 1000	Контейнер для молока. Объём: 1 л. Материал корпуса: прозрачный пластик. В комплекте: инструкция в бумажном виде. Вес: 0.3 кг. Размер (ШхВхГ): 11x22x11 см. Гарантия: Не распространяется.	4490.00	\N	2026-05-15 19:01:57.713041+03	\N
24	411	12	/uploads/products/12.24.jpg	NIML 220	Молочный ланцет Nivona NIML 220	NIML 220	Молочный ланцет\n\nМолочный ланцет NIVONA - это практичный способ подачи молока непосредственно в кофемашину NIVONA.\nВес (без упаковки): 70 г\nРазмер упаковки (ШхВхГсм): 6.9 x 28 x 2.3 см	3190.00	\N	2026-05-15 19:01:57.713041+03	\N
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password_hash, is_active, is_admin, created_at, updated_at, phone, address) FROM stdin;
f5ac891f-0122-4d96-a7c6-c68fc89a35d9	string	user@example.com	$2b$12$CIK1hMmnJL4wJpnRgZeSn.RyLPvo5.jKATSxv5d.Mk9aGTH92MwT.	t	f	2026-05-12 12:16:05.931057+03	\N	\N	\N
ab1016b4-02fd-4389-b428-6c64a7b3d00b	Test User	test@example.com	$2b$12$fS51V5X8COvIau6Hu5BZlujljud//8JnjVoelrJwT1lqgodSO3Qvq	t	f	2026-05-12 12:19:46.511977+03	\N	\N	\N
09ed32b1-bd4a-430e-9716-918d2752adbe	Admin	admin@sofia.com	$2b$12$JxRkXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXqXq	t	t	2026-05-12 12:38:42.779632+03	\N	\N	\N
59c40195-c637-4c96-a761-22375ff97f92	Test User	testt@example.com	$2b$12$S/w5ozW7RzJ7Off2jfixAuygzoZCHjqkmtdVMFYubTK8bKiyAmkDS	t	t	2026-05-12 12:24:30.090012+03	\N	\N	\N
\.


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brands_id_seq', 2, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 1, false);


--
-- Name: products_brandt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_brandt_id_seq', 79, true);


--
-- Name: products_dedietrich_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_dedietrich_id_seq', 1, false);


--
-- Name: products_homeier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_homeier_id_seq', 31, true);


--
-- Name: products_liebherr_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_liebherr_id_seq', 191, true);


--
-- Name: products_nivona_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_nivona_id_seq', 30, true);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_key UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products_brandt products_brandt_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_brandt
    ADD CONSTRAINT products_brandt_pkey PRIMARY KEY (id);


--
-- Name: products_dedietrich products_dedietrich_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_dedietrich
    ADD CONSTRAINT products_dedietrich_pkey PRIMARY KEY (id);


--
-- Name: products_homeier products_homeier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_homeier
    ADD CONSTRAINT products_homeier_pkey PRIMARY KEY (id);


--
-- Name: products_homeier products_homeier_sku_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_homeier
    ADD CONSTRAINT products_homeier_sku_key UNIQUE (sku);


--
-- Name: products_liebherr products_liebherr_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_liebherr
    ADD CONSTRAINT products_liebherr_pkey PRIMARY KEY (id);


--
-- Name: products_nivona products_nivona_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_nivona
    ADD CONSTRAINT products_nivona_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_liebherr_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liebherr_brand ON public.products_liebherr USING btree (brand_id);


--
-- Name: idx_liebherr_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liebherr_category ON public.products_liebherr USING btree (category_id);


--
-- Name: idx_liebherr_ean; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liebherr_ean ON public.products_liebherr USING btree (ean);


--
-- Name: idx_liebherr_model; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liebherr_model ON public.products_liebherr USING btree (model);


--
-- Name: idx_liebherr_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_liebherr_name ON public.products_liebherr USING btree (name);


--
-- Name: idx_nivona_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nivona_brand ON public.products_nivona USING btree (brand_id);


--
-- Name: idx_nivona_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nivona_category ON public.products_nivona USING btree (category_id);


--
-- Name: idx_nivona_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nivona_sku ON public.products_nivona USING btree (sku);


--
-- Name: idx_products_brandt_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_brandt_brand ON public.products_brandt USING btree (brand_id);


--
-- Name: idx_products_brandt_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_brandt_category ON public.products_brandt USING btree (category_id);


--
-- Name: idx_products_brandt_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_brandt_name ON public.products_brandt USING btree (name);


--
-- Name: idx_products_homeier_brand; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_homeier_brand ON public.products_homeier USING btree (brand_id);


--
-- Name: idx_products_homeier_category; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_homeier_category ON public.products_homeier USING btree (category_id);


--
-- Name: idx_products_homeier_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_homeier_sku ON public.products_homeier USING btree (sku);


--
-- Name: ix_brands_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_brands_id ON public.brands USING btree (id);


--
-- Name: ix_brands_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_brands_name ON public.brands USING btree (name);


--
-- Name: ix_categories_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_categories_id ON public.categories USING btree (id);


--
-- Name: ix_categories_slug; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX ix_categories_slug ON public.categories USING btree (slug);


--
-- Name: ix_products_dedietrich_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX ix_products_dedietrich_id ON public.products_dedietrich USING btree (id);


--
-- Name: categories categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products_brandt products_brandt_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_brandt
    ADD CONSTRAINT products_brandt_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_brandt products_brandt_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_brandt
    ADD CONSTRAINT products_brandt_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products_dedietrich products_dedietrich_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_dedietrich
    ADD CONSTRAINT products_dedietrich_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_dedietrich products_dedietrich_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_dedietrich
    ADD CONSTRAINT products_dedietrich_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products_homeier products_homeier_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_homeier
    ADD CONSTRAINT products_homeier_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_homeier products_homeier_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_homeier
    ADD CONSTRAINT products_homeier_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products_liebherr products_liebherr_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_liebherr
    ADD CONSTRAINT products_liebherr_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_liebherr products_liebherr_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_liebherr
    ADD CONSTRAINT products_liebherr_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- Name: products_nivona products_nivona_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_nivona
    ADD CONSTRAINT products_nivona_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE SET NULL;


--
-- Name: products_nivona products_nivona_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products_nivona
    ADD CONSTRAINT products_nivona_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 0DhbdxcCuveEdsgSiyE5Wt9uTfX5xFs74NRgXNewaX7uaU6836DlEEpE0A6B578

