--
-- PostgreSQL database dump
--

\restrict BkurHc3mODlsvUj2YeKEzrXsRA1lKyBal4sWNuJzdFfBM9eFiljdpbd9CG2pkvh

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: availability_slots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.availability_slots (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    day_of_week smallint NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    timezone character varying(60) NOT NULL,
    is_active boolean
);


ALTER TABLE public.availability_slots OWNER TO postgres;

--
-- Name: course_payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course_payments (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    language_id integer NOT NULL,
    level character varying(3) NOT NULL,
    total_hours integer NOT NULL,
    price_per_hour numeric(6,2) NOT NULL,
    total_amount numeric(8,2) NOT NULL,
    amount_paid numeric(8,2),
    amount_left numeric(8,2) NOT NULL,
    no_refund boolean,
    status character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    payment_plan character varying(20),
    installment_1_paid boolean,
    installment_2_paid boolean
);


ALTER TABLE public.course_payments OWNER TO postgres;

--
-- Name: exam_answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_answers (
    id uuid NOT NULL,
    attempt_id uuid NOT NULL,
    question_id uuid NOT NULL,
    answer character varying(1) NOT NULL,
    is_correct boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exam_answers OWNER TO postgres;

--
-- Name: exam_attempts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_attempts (
    id uuid NOT NULL,
    exam_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    score integer,
    total integer,
    passed boolean,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exam_attempts OWNER TO postgres;

--
-- Name: exam_questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exam_questions (
    id uuid NOT NULL,
    exam_id uuid NOT NULL,
    question_text text NOT NULL,
    option_a character varying(200) NOT NULL,
    option_b character varying(200) NOT NULL,
    option_c character varying(200) NOT NULL,
    option_d character varying(200) NOT NULL,
    correct_answer character varying(1) NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exam_questions OWNER TO postgres;

--
-- Name: exams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.exams (
    id uuid NOT NULL,
    language_id integer NOT NULL,
    level character varying(3) NOT NULL,
    title character varying(100) NOT NULL,
    created_by uuid NOT NULL,
    is_active boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.exams OWNER TO postgres;

--
-- Name: languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.languages (
    id integer NOT NULL,
    name character varying(60) NOT NULL,
    code character varying(10) NOT NULL
);


ALTER TABLE public.languages OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.languages_id_seq OWNER TO postgres;

--
-- Name: languages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.languages_id_seq OWNED BY public.languages.id;


--
-- Name: lesson_materials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lesson_materials (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    language_id integer NOT NULL,
    level character varying(3) NOT NULL,
    title character varying(100) NOT NULL,
    type character varying(30) NOT NULL,
    file_path character varying(255),
    description text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.lesson_materials OWNER TO postgres;

--
-- Name: level_hours; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.level_hours (
    level character varying(3) NOT NULL,
    hours_min integer NOT NULL,
    hours_max integer NOT NULL
);


ALTER TABLE public.level_hours OWNER TO postgres;

--
-- Name: level_pricing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.level_pricing (
    level character varying(3) NOT NULL,
    price_min numeric(5,2) NOT NULL,
    price_max numeric(5,2) NOT NULL
);


ALTER TABLE public.level_pricing OWNER TO postgres;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.messages (
    id uuid NOT NULL,
    sender_id uuid NOT NULL,
    receiver_id uuid NOT NULL,
    content text NOT NULL,
    liked boolean,
    is_read boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.messages OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    course_payment_id uuid NOT NULL,
    amount numeric(8,2) NOT NULL,
    platform_fee numeric(8,2) NOT NULL,
    teacher_payout numeric(8,2) NOT NULL,
    both_reviewed boolean,
    status character varying(20),
    paid_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: paypal_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.paypal_transactions (
    id uuid NOT NULL,
    course_payment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    paypal_order_id character varying(100) NOT NULL,
    paypal_status character varying(50) NOT NULL,
    amount numeric(8,2) NOT NULL,
    currency character varying(10),
    installment integer,
    created_at timestamp with time zone DEFAULT now(),
    completed_at timestamp with time zone
);


ALTER TABLE public.paypal_transactions OWNER TO postgres;

--
-- Name: reschedule_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reschedule_requests (
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    requested_by uuid NOT NULL,
    new_time timestamp with time zone NOT NULL,
    status character varying(20) NOT NULL,
    reason text,
    created_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone
);


ALTER TABLE public.reschedule_requests OWNER TO postgres;

--
-- Name: review_flags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.review_flags (
    id uuid NOT NULL,
    flagged_user uuid NOT NULL,
    flagged_by uuid NOT NULL,
    reason text NOT NULL,
    status character varying(20),
    created_at timestamp with time zone DEFAULT now(),
    reviewed_at timestamp with time zone
);


ALTER TABLE public.review_flags OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    student_id uuid NOT NULL,
    written_by uuid NOT NULL,
    role character varying(20) NOT NULL,
    rating smallint NOT NULL,
    comment text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: session_attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.session_attendance (
    id uuid NOT NULL,
    session_id uuid NOT NULL,
    student_id uuid NOT NULL,
    was_present boolean,
    marked_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.session_attendance OWNER TO postgres;

--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    student_id uuid NOT NULL,
    course_payment_id uuid NOT NULL,
    language_id integer NOT NULL,
    level character varying(3) NOT NULL,
    scheduled_at timestamp with time zone NOT NULL,
    duration_minutes integer NOT NULL,
    status character varying(20) NOT NULL,
    videocall_url text,
    rescheduled boolean,
    teacher_review_done boolean,
    student_review_done boolean,
    payment_released boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: student_languages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.student_languages (
    id uuid NOT NULL,
    student_id uuid NOT NULL,
    language_id integer NOT NULL,
    level character varying(3) NOT NULL,
    started_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.student_languages OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    current_level character varying(3) NOT NULL,
    reschedule_count integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Name: suspensions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suspensions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    teacher_id uuid,
    student_id uuid,
    role character varying(20) NOT NULL,
    reason character varying(50) NOT NULL,
    no_refund boolean,
    is_active boolean,
    notes text,
    suspended_at timestamp with time zone DEFAULT now(),
    lifted_at timestamp with time zone
);


ALTER TABLE public.suspensions OWNER TO postgres;

--
-- Name: teacher_certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_certificates (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    name character varying(100) NOT NULL,
    file_path character varying(255) NOT NULL,
    is_notarized boolean,
    is_verified boolean,
    uploaded_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.teacher_certificates OWNER TO postgres;

--
-- Name: teacher_noshow; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_noshow (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    session_id uuid NOT NULL,
    notified boolean,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.teacher_noshow OWNER TO postgres;

--
-- Name: teacher_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teacher_verifications (
    id uuid NOT NULL,
    teacher_id uuid NOT NULL,
    verified_by uuid,
    verification_type character varying(30) NOT NULL,
    level_tested character varying(3) NOT NULL,
    result character varying(20) NOT NULL,
    notes text,
    tested_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.teacher_verifications OWNER TO postgres;

--
-- Name: teachers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teachers (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    language_id integer NOT NULL,
    is_native boolean,
    is_certified boolean,
    has_experience boolean,
    max_level character varying(3) NOT NULL,
    is_verified boolean,
    passed_exam boolean,
    bio text,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.teachers OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    full_name character varying(200) NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role character varying(50) NOT NULL,
    timezone character varying(60),
    profile_photo text,
    is_active boolean,
    is_suspended boolean,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone character varying(20)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: languages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages ALTER COLUMN id SET DEFAULT nextval('public.languages_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
0a0c3c23dd59
\.


--
-- Data for Name: availability_slots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.availability_slots (id, teacher_id, day_of_week, start_time, end_time, timezone, is_active) FROM stdin;
622c2783-ffeb-4f36-b2e7-6f52b5771e1e	866a5c25-7094-4926-9cc9-2189bea942cd	0	09:00:00	10:00:00	Europe/Istanbul	t
0714d76f-d3a1-4f49-80db-0d564bb3a932	866a5c25-7094-4926-9cc9-2189bea942cd	4	17:00:00	18:00:00	Europe/Istanbul	t
db96c580-0737-46d7-8438-72d344167e42	01445742-612c-40ce-a8ef-d18d2ac6dc04	0	09:00:00	10:00:00	Europe/London	t
932246a8-0f61-488d-93a1-2e6135c9d389	01445742-612c-40ce-a8ef-d18d2ac6dc04	2	14:00:00	15:00:00	Europe/London	t
bb45aeba-acdc-4809-bdc4-e6399b6f0024	01445742-612c-40ce-a8ef-d18d2ac6dc04	4	17:00:00	18:00:00	Europe/London	t
b27ef9be-ac22-446c-8705-134afb0994f8	154f1c2b-e807-4829-bd43-764781ff83a5	0	09:00:00	10:00:00	Europe/Rome	t
cf479d8e-9fbe-468a-b9cf-c0727d2d493a	154f1c2b-e807-4829-bd43-764781ff83a5	2	14:00:00	15:00:00	Europe/Rome	t
f588b5da-258c-44f3-abcf-c1d5fac756c3	154f1c2b-e807-4829-bd43-764781ff83a5	4	17:00:00	18:00:00	Europe/Rome	t
b58ccc71-3377-4725-aca3-072493ecbacf	236f7d03-c021-403a-9359-1f17623569c6	0	09:00:00	10:00:00	Europe/Berlin	t
df0ea218-7cab-49fe-8e08-ad34d79433cb	236f7d03-c021-403a-9359-1f17623569c6	2	14:00:00	15:00:00	Europe/Berlin	t
06b8226b-703d-4b8f-871a-4b837bef3847	236f7d03-c021-403a-9359-1f17623569c6	4	17:00:00	18:00:00	Europe/Berlin	t
8d9d0010-385e-45f5-a4e3-d1bb1845c0b8	bac7e754-01ed-4610-806d-9e089afb7035	0	09:00:00	10:00:00	Europe/Paris	t
374c4ed5-8d82-4ac4-accd-5ee43ce223c2	bac7e754-01ed-4610-806d-9e089afb7035	2	14:00:00	15:00:00	Europe/Paris	t
d86e6237-58f3-4091-aa1c-b5f939080b16	bac7e754-01ed-4610-806d-9e089afb7035	4	17:00:00	18:00:00	Europe/Paris	t
3fa58cd6-2b1c-4e8a-8260-515c06da5fae	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	0	09:00:00	10:00:00	Europe/Madrid	t
3ecdc805-0e19-43b4-bd41-e04eac8d4fdf	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	2	14:00:00	15:00:00	Europe/Madrid	t
b1bd744f-0607-450b-9d97-931df95ccbbe	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	4	17:00:00	18:00:00	Europe/Madrid	t
ca2aeb6f-1c93-46d7-bb4d-c62596392241	f9a1c61b-4904-409f-b235-6ad25703bd18	0	09:00:00	10:00:00	Europe/Sofia	t
6c920037-5041-4747-90f8-cff97db25dce	f9a1c61b-4904-409f-b235-6ad25703bd18	2	14:00:00	15:00:00	Europe/Sofia	t
882a329f-3d31-44b3-8094-7cec12d020ff	f9a1c61b-4904-409f-b235-6ad25703bd18	4	17:00:00	18:00:00	Europe/Sofia	t
08eeaa50-d1b1-49c6-9e65-6c73940906f5	d6658ccc-5624-4270-9342-3570ba32a3c7	0	09:00:00	10:00:00	Europe/Athens	t
13234d07-bfe4-4e4a-8eff-a07996edfeb9	d6658ccc-5624-4270-9342-3570ba32a3c7	2	14:00:00	15:00:00	Europe/Athens	t
533432ab-2652-4193-a626-3146c214626d	d6658ccc-5624-4270-9342-3570ba32a3c7	4	17:00:00	18:00:00	Europe/Athens	t
07fd3947-68ae-455e-8098-216fefcafaa2	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	0	09:00:00	10:00:00	Asia/Seoul	t
ffaa2693-4a64-4d3f-b386-74d1040c1510	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	2	14:00:00	15:00:00	Asia/Seoul	t
909c4029-a0a7-4a40-88ec-f5cb6c90f7f8	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	4	17:00:00	18:00:00	Asia/Seoul	t
0423ddf4-b344-442e-a3dc-845267ff61ca	7cba5a5b-d745-4bae-842a-59af71545e2a	0	09:00:00	10:00:00	Europe/Moscow	t
1c65cd5b-ebd6-4feb-aa2f-4b73353aa191	7cba5a5b-d745-4bae-842a-59af71545e2a	2	14:00:00	15:00:00	Europe/Moscow	t
53fd5674-0868-4459-afc2-8769a86f8c1f	7cba5a5b-d745-4bae-842a-59af71545e2a	4	17:00:00	18:00:00	Europe/Moscow	t
57097caf-b3d0-4b32-a629-6044b87e3591	866a5c25-7094-4926-9cc9-2189bea942cd	0	20:21:13.036	20:21:13.036	Europe/Istanbul	f
\.


--
-- Data for Name: course_payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.course_payments (id, student_id, teacher_id, language_id, level, total_hours, price_per_hour, total_amount, amount_paid, amount_left, no_refund, status, created_at, payment_plan, installment_1_paid, installment_2_paid) FROM stdin;
cd02d535-398b-4e76-954c-7c549ae7172b	0210b7bd-f439-45f6-9dd2-fc97e93bb145	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.062173+02	hour_by_hour	t	t
1cb00648-6b75-4d56-97ce-cfb752bc4cb9	0210b7bd-f439-45f6-9dd2-fc97e93bb145	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.18899+02	hour_by_hour	t	t
6aaf1dbe-621d-4067-9256-f33503af1350	0210b7bd-f439-45f6-9dd2-fc97e93bb145	154f1c2b-e807-4829-bd43-764781ff83a5	2	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.224447+02	hour_by_hour	t	t
036ac251-defc-4b35-8016-8e012ddc074f	0210b7bd-f439-45f6-9dd2-fc97e93bb145	236f7d03-c021-403a-9359-1f17623569c6	3	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.259849+02	hour_by_hour	t	t
417c9cdb-7d34-4e24-a6cf-18951a36901b	e5237185-84d8-47a3-858e-9a7ec21fa5ed	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-14 21:14:00.295275+02	hour_by_hour	t	t
4fcb7f68-2148-460b-ab33-55cc3bf2bd31	e5237185-84d8-47a3-858e-9a7ec21fa5ed	bac7e754-01ed-4610-806d-9e089afb7035	4	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-14 21:14:00.329939+02	hour_by_hour	t	t
ac5976d1-cc30-4ff3-bf7f-5a6812ffe7bc	e5237185-84d8-47a3-858e-9a7ec21fa5ed	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	5	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-14 21:14:00.364606+02	hour_by_hour	t	t
853e62c9-c19c-47d8-9a2b-0051cbf250fc	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-14 21:14:00.404901+02	hour_by_hour	t	t
99bd7b5a-b42a-441a-862f-53dc3f0b549f	2ace945a-88fe-4d4c-9d19-e321a1bf8260	866a5c25-7094-4926-9cc9-2189bea942cd	8	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-14 21:14:00.443326+02	hour_by_hour	t	t
bcc41fd0-5fa3-4dc9-a9b7-2cae9f1ec949	2ace945a-88fe-4d4c-9d19-e321a1bf8260	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-14 21:14:00.489795+02	hour_by_hour	t	t
c196699f-1c6e-41db-aad4-02ed3f214b3d	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f9a1c61b-4904-409f-b235-6ad25703bd18	6	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-14 21:14:00.530641+02	hour_by_hour	t	t
5653d7fc-0e3a-4823-9001-ce05879e2c98	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d6658ccc-5624-4270-9342-3570ba32a3c7	7	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-14 21:14:00.573634+02	hour_by_hour	t	t
897dd33a-c5a9-488f-baf5-39b1a064022e	d26e0955-9734-4501-8ce5-2a7f67fb73a1	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-14 21:14:00.617055+02	hour_by_hour	t	t
90b92986-e8c1-47ed-a694-de5e11a1613d	d26e0955-9734-4501-8ce5-2a7f67fb73a1	236f7d03-c021-403a-9359-1f17623569c6	3	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-14 21:14:00.65242+02	hour_by_hour	t	t
f018b812-b5dd-4720-ae5a-9fb4aa0919bf	d26e0955-9734-4501-8ce5-2a7f67fb73a1	bac7e754-01ed-4610-806d-9e089afb7035	4	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-14 21:14:00.687475+02	hour_by_hour	t	t
36e0f768-6408-41e4-badc-821619e179ab	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7cba5a5b-d745-4bae-842a-59af71545e2a	10	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-14 21:14:00.721305+02	hour_by_hour	t	t
43d06d9c-4d8a-4525-b163-ddf9820c8bea	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.754976+02	hour_by_hour	t	t
952ffc75-08b0-40b5-bfed-0556cad89c34	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.798665+02	hour_by_hour	t	t
4b7c30ae-49b9-4d18-8a2b-7f407e28c434	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.832763+02	hour_by_hour	t	t
8b6834c6-866e-43a5-9e2d-8528bfd3807f	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	7cba5a5b-d745-4bae-842a-59af71545e2a	10	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-14 21:14:00.870201+02	hour_by_hour	t	t
2d2181c9-f265-4f43-951e-ec803605c033	0210b7bd-f439-45f6-9dd2-fc97e93bb145	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:06.49159+02	hour_by_hour	t	t
11b57def-f9a1-4df8-bbe4-8531b7fcc871	0210b7bd-f439-45f6-9dd2-fc97e93bb145	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:08.880427+02	hour_by_hour	t	t
c9d894f3-95e2-4122-a7f0-cdf8fcd90013	0210b7bd-f439-45f6-9dd2-fc97e93bb145	154f1c2b-e807-4829-bd43-764781ff83a5	2	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:08.988554+02	hour_by_hour	t	t
2e56d25e-e965-4612-be00-c540fc146612	0210b7bd-f439-45f6-9dd2-fc97e93bb145	236f7d03-c021-403a-9359-1f17623569c6	3	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:09.054842+02	hour_by_hour	t	t
c7c7d43f-10fd-4ea9-b7fd-b3cc6968e26d	e5237185-84d8-47a3-858e-9a7ec21fa5ed	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-17 09:47:09.216909+02	hour_by_hour	t	t
aa44c099-fe97-4d62-b819-66e5332af77d	e5237185-84d8-47a3-858e-9a7ec21fa5ed	bac7e754-01ed-4610-806d-9e089afb7035	4	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-17 09:47:09.33405+02	hour_by_hour	t	t
eeddfa3d-1687-4d91-af94-72f326966892	e5237185-84d8-47a3-858e-9a7ec21fa5ed	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	5	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-17 09:47:09.371873+02	hour_by_hour	t	t
f6abd546-c018-4ec7-bae2-a60ea2479dc5	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-17 09:47:09.472917+02	hour_by_hour	t	t
2a4def47-0084-411c-a4f4-c2ced07a7156	2ace945a-88fe-4d4c-9d19-e321a1bf8260	866a5c25-7094-4926-9cc9-2189bea942cd	8	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-17 09:47:09.589158+02	hour_by_hour	t	t
540c34c5-7ce0-4829-b7f9-1bf1ba985405	2ace945a-88fe-4d4c-9d19-e321a1bf8260	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-17 09:47:09.71296+02	hour_by_hour	t	t
4a9e4a92-7fd4-478a-8642-88a09acb40ea	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f9a1c61b-4904-409f-b235-6ad25703bd18	6	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-17 09:47:09.929701+02	hour_by_hour	t	t
c5419051-82ac-4216-b1d0-3ebcbdd945c1	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d6658ccc-5624-4270-9342-3570ba32a3c7	7	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-17 09:47:10.201506+02	hour_by_hour	t	t
e3153ab9-12de-435f-a348-7ef7c7fb2246	d26e0955-9734-4501-8ce5-2a7f67fb73a1	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-17 09:47:10.30558+02	hour_by_hour	t	t
7b741013-74f0-4a9d-b053-fd937db0638f	d26e0955-9734-4501-8ce5-2a7f67fb73a1	236f7d03-c021-403a-9359-1f17623569c6	3	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-17 09:47:10.413326+02	hour_by_hour	t	t
b085d1b5-b517-4cae-9da8-56a3ee4cf9c1	d26e0955-9734-4501-8ce5-2a7f67fb73a1	bac7e754-01ed-4610-806d-9e089afb7035	4	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-17 09:47:10.487357+02	hour_by_hour	t	t
3271cab9-5977-436b-a2b2-3e6abcf6fbf9	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7cba5a5b-d745-4bae-842a-59af71545e2a	10	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-17 09:47:10.588339+02	hour_by_hour	t	t
d7059ac6-40e4-477d-b962-b63a2e71953d	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:10.69053+02	hour_by_hour	t	t
dcff4f1d-6f2e-459c-888a-7aebea3a300d	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:10.777842+02	hour_by_hour	t	t
49e5376f-cabe-44bf-9591-aff9ad168c00	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:10.870872+02	hour_by_hour	t	t
78ace17c-e54f-4196-bc21-e2901ba28c66	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	7cba5a5b-d745-4bae-842a-59af71545e2a	10	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-17 09:47:11.025584+02	hour_by_hour	t	t
794d07af-eead-4053-8c7a-1719b3a56736	0210b7bd-f439-45f6-9dd2-fc97e93bb145	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.451216+02	hour_by_hour	t	t
472b580f-1030-40c3-a6a0-b7fbb9b170d7	0210b7bd-f439-45f6-9dd2-fc97e93bb145	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.573233+02	hour_by_hour	t	t
58377943-b07a-478d-ad7b-29f2510a3cf6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	154f1c2b-e807-4829-bd43-764781ff83a5	2	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.590259+02	hour_by_hour	t	t
8d3b77e4-bc61-401c-9824-554182175480	0210b7bd-f439-45f6-9dd2-fc97e93bb145	236f7d03-c021-403a-9359-1f17623569c6	3	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.607523+02	hour_by_hour	t	t
18292581-aa42-446e-b35e-93ecc53b000d	e5237185-84d8-47a3-858e-9a7ec21fa5ed	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-27 23:18:12.624516+02	hour_by_hour	t	t
f94a268c-a330-4680-a843-8fab11096af1	e5237185-84d8-47a3-858e-9a7ec21fa5ed	bac7e754-01ed-4610-806d-9e089afb7035	4	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-27 23:18:12.641555+02	hour_by_hour	t	t
d6b1a225-c3de-454d-baf0-01257912bf84	e5237185-84d8-47a3-858e-9a7ec21fa5ed	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	5	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-27 23:18:12.659384+02	hour_by_hour	t	t
5b15cec9-3b90-4c41-9458-117c36590b0c	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-04-27 23:18:12.6757+02	hour_by_hour	t	t
5da072d8-d219-460e-9f55-90ddac979ac0	2ace945a-88fe-4d4c-9d19-e321a1bf8260	866a5c25-7094-4926-9cc9-2189bea942cd	8	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-27 23:18:12.692047+02	hour_by_hour	t	t
7af6d21c-0a6f-4985-b533-2ddfd2038c52	2ace945a-88fe-4d4c-9d19-e321a1bf8260	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-27 23:18:12.706998+02	hour_by_hour	t	t
d3ead67f-7bdb-4aa7-87e8-a2ed169c9b24	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f9a1c61b-4904-409f-b235-6ad25703bd18	6	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-27 23:18:12.722648+02	hour_by_hour	t	t
b73096d3-3864-4021-bb58-ebffac447678	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d6658ccc-5624-4270-9342-3570ba32a3c7	7	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-04-27 23:18:12.737631+02	hour_by_hour	t	t
d528b2a4-7b23-43b9-903e-eab4f99fb480	d26e0955-9734-4501-8ce5-2a7f67fb73a1	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-27 23:18:12.752988+02	hour_by_hour	t	t
b300d982-d665-4b75-9b81-0e49f000ff37	d26e0955-9734-4501-8ce5-2a7f67fb73a1	236f7d03-c021-403a-9359-1f17623569c6	3	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-27 23:18:12.767486+02	hour_by_hour	t	t
0091cb36-a93d-4ada-b085-761c76265449	d26e0955-9734-4501-8ce5-2a7f67fb73a1	bac7e754-01ed-4610-806d-9e089afb7035	4	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-27 23:18:12.782128+02	hour_by_hour	t	t
3dfc0b01-e2c3-456c-885d-639aab5c826f	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7cba5a5b-d745-4bae-842a-59af71545e2a	10	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-04-27 23:18:12.799535+02	hour_by_hour	t	t
77f25768-1188-4040-8c6f-b78ce17db193	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.815659+02	hour_by_hour	t	t
120f6174-024c-494d-b4fa-22f3842c3500	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.8297+02	hour_by_hour	t	t
78464575-649c-493c-99f8-f68993752592	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.844433+02	hour_by_hour	t	t
40e61385-da5f-4441-99b5-1526aadb213b	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	7cba5a5b-d745-4bae-842a-59af71545e2a	10	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-04-27 23:18:12.859172+02	hour_by_hour	t	t
b4b49331-3cf6-4155-9b30-141e1ee181c3	0210b7bd-f439-45f6-9dd2-fc97e93bb145	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:25.703447+02	hour_by_hour	t	t
a942b38b-3984-4f63-8255-ef2eb69e29c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:25.925776+02	hour_by_hour	t	t
c81fea39-2fe0-411e-a306-f2828516a3ba	0210b7bd-f439-45f6-9dd2-fc97e93bb145	154f1c2b-e807-4829-bd43-764781ff83a5	2	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:25.95613+02	hour_by_hour	t	t
8bf87e6e-ee33-47a4-bd14-016767426021	0210b7bd-f439-45f6-9dd2-fc97e93bb145	236f7d03-c021-403a-9359-1f17623569c6	3	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:25.986494+02	hour_by_hour	t	t
2bc36fc5-74cd-4bd1-a3a2-399088108d70	e5237185-84d8-47a3-858e-9a7ec21fa5ed	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:26.016254+02	hour_by_hour	t	t
7a16967f-f866-4b7b-b336-8c7489943f37	e5237185-84d8-47a3-858e-9a7ec21fa5ed	bac7e754-01ed-4610-806d-9e089afb7035	4	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:26.088034+02	hour_by_hour	t	t
e704d8f8-6733-46c7-b33d-11702a388f51	e5237185-84d8-47a3-858e-9a7ec21fa5ed	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	5	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:26.130607+02	hour_by_hour	t	t
e4276320-c07a-4e79-b757-8132261a39f9	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:26.171415+02	hour_by_hour	t	t
8f494d43-927f-4c4d-9d21-2b9de7b5f1d3	2ace945a-88fe-4d4c-9d19-e321a1bf8260	866a5c25-7094-4926-9cc9-2189bea942cd	8	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:26.20887+02	hour_by_hour	t	t
ca965ed4-69e3-484a-b0e4-2d20f10aa4e7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:26.247561+02	hour_by_hour	t	t
b95d6550-1d91-404a-9f06-d64f944d7ac9	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f9a1c61b-4904-409f-b235-6ad25703bd18	6	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:26.283754+02	hour_by_hour	t	t
38040530-1b91-46fe-8604-f4d4efeeae33	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d6658ccc-5624-4270-9342-3570ba32a3c7	7	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:26.327758+02	hour_by_hour	t	t
d11b7443-c136-4514-846f-cb62c6b4dd40	d26e0955-9734-4501-8ce5-2a7f67fb73a1	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:26.371701+02	hour_by_hour	t	t
b19ad777-8180-4134-b97f-243f49dd2482	d26e0955-9734-4501-8ce5-2a7f67fb73a1	236f7d03-c021-403a-9359-1f17623569c6	3	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:26.431992+02	hour_by_hour	t	t
b9a9ee67-5656-4d22-ae65-3b84c6d1b1bb	d26e0955-9734-4501-8ce5-2a7f67fb73a1	bac7e754-01ed-4610-806d-9e089afb7035	4	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:26.497285+02	hour_by_hour	t	t
11218ade-13a4-45f3-a8dc-b334f586ab67	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7cba5a5b-d745-4bae-842a-59af71545e2a	10	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:26.559636+02	hour_by_hour	t	t
e4848421-2d78-4aa1-9fc3-477071869565	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:26.620962+02	hour_by_hour	t	t
f9052706-830f-4ac8-9425-df2a7ff929b5	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:26.684569+02	hour_by_hour	t	t
1e220982-2d99-456c-9219-e6577fdbd948	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:26.753074+02	hour_by_hour	t	t
5f06571c-cf65-4540-8d8b-85a02f9141e0	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	7cba5a5b-d745-4bae-842a-59af71545e2a	10	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:26.818863+02	hour_by_hour	t	t
098598ed-9646-4f05-b4fc-5c3f1b3564bb	0210b7bd-f439-45f6-9dd2-fc97e93bb145	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:58.951737+02	hour_by_hour	t	t
d5f695bf-42e0-4ab6-998d-79d1af600949	0210b7bd-f439-45f6-9dd2-fc97e93bb145	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:59.132745+02	hour_by_hour	t	t
04464ec1-16ce-4d22-9a13-1512f3b38094	0210b7bd-f439-45f6-9dd2-fc97e93bb145	154f1c2b-e807-4829-bd43-764781ff83a5	2	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:59.198464+02	hour_by_hour	t	t
88cae54a-93d7-4423-a2bf-955d3ad5929e	0210b7bd-f439-45f6-9dd2-fc97e93bb145	236f7d03-c021-403a-9359-1f17623569c6	3	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:59.264876+02	hour_by_hour	t	t
1a04caed-f75b-4e77-91af-fdbdd723d600	e5237185-84d8-47a3-858e-9a7ec21fa5ed	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:59.332093+02	hour_by_hour	t	t
37d12ccc-6ecd-4027-9f10-e41c289710dd	e5237185-84d8-47a3-858e-9a7ec21fa5ed	bac7e754-01ed-4610-806d-9e089afb7035	4	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:59.394124+02	hour_by_hour	t	t
b1920b5e-c7b2-4b36-8df8-9f33fb0576bc	e5237185-84d8-47a3-858e-9a7ec21fa5ed	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	5	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:59.459208+02	hour_by_hour	t	t
901764d2-616e-49e0-b646-08ab351ce34f	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	B1	35	6.00	210.00	210.00	0.00	f	completed	2026-05-05 21:56:59.51891+02	hour_by_hour	t	t
d9e5f009-8c84-4ee2-9f02-026f796d8ae0	2ace945a-88fe-4d4c-9d19-e321a1bf8260	866a5c25-7094-4926-9cc9-2189bea942cd	8	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:59.583235+02	hour_by_hour	t	t
1254fccc-3042-4e5a-ae83-dccbabadac4b	2ace945a-88fe-4d4c-9d19-e321a1bf8260	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:59.642714+02	hour_by_hour	t	t
f3c58c88-5f47-4219-abca-bc2526cc67a7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f9a1c61b-4904-409f-b235-6ad25703bd18	6	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:59.717195+02	hour_by_hour	t	t
9bd505c8-3289-487e-ad30-2d485483f09b	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d6658ccc-5624-4270-9342-3570ba32a3c7	7	A2	32	5.00	160.00	160.00	0.00	f	completed	2026-05-05 21:56:59.795212+02	hour_by_hour	t	t
00247154-c6dd-4bdd-8437-942c7617be93	d26e0955-9734-4501-8ce5-2a7f67fb73a1	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:59.83127+02	hour_by_hour	t	t
7be6ed4d-34e4-40c2-bdaa-f15604507df3	d26e0955-9734-4501-8ce5-2a7f67fb73a1	236f7d03-c021-403a-9359-1f17623569c6	3	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:59.863459+02	hour_by_hour	t	t
053a87aa-e0b9-4eb1-8c18-ca67a90318bb	d26e0955-9734-4501-8ce5-2a7f67fb73a1	bac7e754-01ed-4610-806d-9e089afb7035	4	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:59.891891+02	hour_by_hour	t	t
5a4aefbf-d58d-4c1b-a8c5-2442066f56e7	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7cba5a5b-d745-4bae-842a-59af71545e2a	10	B2	40	7.00	280.00	280.00	0.00	f	completed	2026-05-05 21:56:59.925097+02	hour_by_hour	t	t
2d9dca4d-2fec-47e2-b38e-2e0c75ab4f3f	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	866a5c25-7094-4926-9cc9-2189bea942cd	8	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:56:59.99491+02	hour_by_hour	t	t
1237c4bd-eecf-4ca5-b341-9c5f355172dd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:57:00.04534+02	hour_by_hour	t	t
5916d8ae-b019-4a53-86a8-5f970d24753c	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	9	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:57:00.085705+02	hour_by_hour	t	t
e62c0d19-c5a2-4c4c-a8ad-f58b21da6693	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	7cba5a5b-d745-4bae-842a-59af71545e2a	10	A1	30	4.00	120.00	120.00	0.00	f	completed	2026-05-05 21:57:00.121297+02	hour_by_hour	t	t
4a2c6b93-60b4-4cdc-bea2-9a97dba91033	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	01445742-612c-40ce-a8ef-d18d2ac6dc04	1	A1	30	4.00	120.00	0.00	120.00	f	active	2026-05-05 22:28:45.039857+02	hour_by_hour	f	f
\.


--
-- Data for Name: exam_answers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_answers (id, attempt_id, question_id, answer, is_correct, created_at) FROM stdin;
\.


--
-- Data for Name: exam_attempts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_attempts (id, exam_id, teacher_id, score, total, passed, completed_at, created_at) FROM stdin;
\.


--
-- Data for Name: exam_questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exam_questions (id, exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer, created_at) FROM stdin;
\.


--
-- Data for Name: exams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.exams (id, language_id, level, title, created_by, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.languages (id, name, code) FROM stdin;
1	Anglisht	en
2	Italisht	it
3	Gjermanisht	de
4	Frengjisht	fr
5	Spanjisht	es
6	Bullgarisht	bg
7	Greqisht	el
8	Turqisht	tr
9	Koreane	ko
10	Rusisht	ru
\.


--
-- Data for Name: lesson_materials; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lesson_materials (id, teacher_id, language_id, level, title, type, file_path, description, created_at) FROM stdin;
6c46e838-3fe1-4d43-a172-700b822aa84f	866a5c25-7094-4926-9cc9-2189bea942cd	1	A1	Multithreading	vocabulary_list	uploads/materials/0a4c52b7-4aec-4772-80e7-a63cf2b0d674_CEN350_ Lecture_2 Mathematical Preliminaries and Notations.pdf	vocabulary_list	2026-05-05 22:49:33.048762+02
\.


--
-- Data for Name: level_hours; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.level_hours (level, hours_min, hours_max) FROM stdin;
A1	30	50
A2	30	50
B1	30	50
B2	30	50
C1	30	50
C2	30	50
\.


--
-- Data for Name: level_pricing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.level_pricing (level, price_min, price_max) FROM stdin;
A1	3.00	5.00
A2	4.00	6.00
B1	5.00	7.00
B2	6.00	8.00
C1	7.00	9.00
C2	7.00	9.00
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.messages (id, sender_id, receiver_id, content, liked, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, session_id, course_payment_id, amount, platform_fee, teacher_payout, both_reviewed, status, paid_at, created_at) FROM stdin;
8e6664f3-2e0a-456b-8425-6ec63665514a	f44c588e-aaea-4ff1-b92a-f3ddee52fcb8	cd02d535-398b-4e76-954c-7c549ae7172b	4.00	0.40	3.60	t	paid	2026-03-15 22:14:00.085252+01	2026-04-14 21:14:00.127655+02
65a6d41c-b0a9-4d03-b7f9-e62637880c3e	03583243-51f9-4b40-91d6-9f392dcfce3e	1cb00648-6b75-4d56-97ce-cfb752bc4cb9	4.00	0.40	3.60	t	paid	2026-03-20 22:14:00.187938+01	2026-04-14 21:14:00.204871+02
def67365-5626-4e37-b2d2-dee89f49fa5b	a8453f4c-edf4-4ee7-aa1a-f40d1e4e47da	6aaf1dbe-621d-4067-9256-f33503af1350	4.00	0.40	3.60	t	paid	2026-03-25 22:14:00.223515+01	2026-04-14 21:14:00.239956+02
693029c9-5ec8-4d52-a3a8-0cf6ff8971d1	8550aedb-8e3d-426c-9d7d-d1eb27cb76cb	036ac251-defc-4b35-8016-8e012ddc074f	4.00	0.40	3.60	t	paid	2026-03-30 23:14:00.258926+02	2026-04-14 21:14:00.27562+02
0580e4d3-040f-4dfe-9f5b-fc0128d09c69	b96ecb64-53cb-43e7-83fb-1283d46a69bd	417c9cdb-7d34-4e24-a6cf-18951a36901b	6.00	0.60	5.40	t	paid	2026-03-17 22:14:00.294341+01	2026-04-14 21:14:00.310913+02
550ee690-3a6e-440d-bbf0-d08f26faec7b	1d6d44b2-f25a-443b-9faa-29591cb18dd3	4fcb7f68-2148-460b-ab33-55cc3bf2bd31	6.00	0.60	5.40	t	paid	2026-03-23 22:14:00.329063+01	2026-04-14 21:14:00.345313+02
3f136d34-7c1a-4bcd-84b5-73166c1d5ec1	b4c371e5-734d-4a55-9f6a-e10b7bfc0be5	ac5976d1-cc30-4ff3-bf7f-5a6812ffe7bc	6.00	0.60	5.40	t	paid	2026-03-27 22:14:00.363702+01	2026-04-14 21:14:00.383303+02
c3a627f2-08d7-4a14-8f24-dc3a33ad0a75	42b1bfff-bb76-4d0d-a724-f3bb76dd56d9	853e62c9-c19c-47d8-9a2b-0051cbf250fc	6.00	0.60	5.40	t	paid	2026-04-04 23:14:00.40394+02	2026-04-14 21:14:00.421718+02
dcf81acd-a6f8-4387-8451-2a9cf6ba1176	b74ea5c5-f4b9-4afd-95fc-fb33125f0340	99bd7b5a-b42a-441a-862f-53dc3f0b549f	5.00	0.50	4.50	t	paid	2026-03-18 22:14:00.442295+01	2026-04-14 21:14:00.463165+02
9c5ca6d6-51d1-4acb-88a0-4bf359db35b5	e664a8e5-b108-48ed-a23d-472dea9a832e	bcc41fd0-5fa3-4dc9-a9b7-2cae9f1ec949	5.00	0.50	4.50	t	paid	2026-03-24 22:14:00.488592+01	2026-04-14 21:14:00.50808+02
c8efab31-22b9-4df7-962e-b73e3c1f650f	46d1155b-4537-4881-9175-94555c03d402	c196699f-1c6e-41db-aad4-02ed3f214b3d	5.00	0.50	4.50	t	paid	2026-03-31 23:14:00.529342+02	2026-04-14 21:14:00.549782+02
cfac4845-2ef7-4989-b894-65bad80bd3a4	c4f7f261-5bd8-4720-bfc5-11ccad4d9f99	5653d7fc-0e3a-4823-9001-ce05879e2c98	5.00	0.50	4.50	t	paid	2026-04-07 23:14:00.572595+02	2026-04-14 21:14:00.592998+02
a50355a2-8eb3-4d39-bdb8-4afeb654ea3f	24c893d3-d214-40e8-a4f4-21308dc7a9a5	897dd33a-c5a9-488f-baf5-39b1a064022e	7.00	0.70	6.30	t	paid	2026-03-10 22:14:00.615983+01	2026-04-14 21:14:00.633926+02
aad7ea9a-df98-4385-8dac-403a0946e867	cd7e3d63-eeb2-4ae9-9337-534e9662f1a1	90b92986-e8c1-47ed-a694-de5e11a1613d	7.00	0.70	6.30	t	paid	2026-03-16 22:14:00.651449+01	2026-04-14 21:14:00.668007+02
c4418ff7-0ab4-4820-a74d-75cde596425e	43473a59-8d3b-4c1e-8df6-16b4866b9c44	f018b812-b5dd-4720-ae5a-9fb4aa0919bf	7.00	0.70	6.30	t	paid	2026-03-22 22:14:00.686423+01	2026-04-14 21:14:00.702444+02
040ee2ab-3ea2-4c0b-971c-d3cd93cf974f	86eec2f4-7b3d-415f-ad61-f917974c106e	36e0f768-6408-41e4-badc-821619e179ab	7.00	0.70	6.30	t	paid	2026-04-02 23:14:00.720281+02	2026-04-14 21:14:00.736384+02
1a9125cd-2682-4b93-aa24-4d4e582da797	30cff6a9-8a0f-4882-ba3a-5044c1681e60	43d06d9c-4d8a-4525-b163-ddf9820c8bea	4.00	0.40	3.60	t	paid	2026-03-25 22:14:00.753956+01	2026-04-14 21:14:00.77066+02
bc834255-7d19-4a7f-b860-2eb97fd880e5	228659c2-dee9-4703-b4c5-fb038eb2f577	952ffc75-08b0-40b5-bfed-0556cad89c34	4.00	0.40	3.60	t	paid	2026-03-29 23:14:00.797743+02	2026-04-14 21:14:00.813419+02
2c2eae7f-48ce-4259-b142-6a7a22f60174	fd88c8b1-b453-4a25-9b7f-cf726b840fe3	4b7c30ae-49b9-4d18-8a2b-7f407e28c434	4.00	0.40	3.60	t	paid	2026-04-04 23:14:00.831826+02	2026-04-14 21:14:00.848128+02
a220fec8-47a1-4b9e-a45e-e56b87a419ee	2b105892-15d4-477c-9a2f-188622ef0b97	8b6834c6-866e-43a5-9e2d-8528bfd3807f	4.00	0.40	3.60	t	paid	2026-04-09 23:14:00.869173+02	2026-04-14 21:14:00.888013+02
12b95d7e-df32-4081-bcea-c3c27147ff8a	af2da89a-1425-4080-b626-c9e59024d238	2d2181c9-f265-4f43-951e-ec803605c033	4.00	0.40	3.60	t	paid	2026-03-18 10:47:06.522339+01	2026-04-17 09:47:06.699744+02
da1729d9-a769-44ea-b9ec-b2bdd41beaef	28766c16-13fd-41f1-acf9-477508c5df83	11b57def-f9a1-4df8-bbe4-8531b7fcc871	4.00	0.40	3.60	t	paid	2026-03-23 10:47:08.877038+01	2026-04-17 09:47:08.926029+02
75a556ee-4520-4dd8-af56-ebd7677615c1	88faff61-d182-4bae-ba93-50fb67f339e7	c9d894f3-95e2-4122-a7f0-cdf8fcd90013	4.00	0.40	3.60	t	paid	2026-03-28 10:47:08.985556+01	2026-04-17 09:47:09.02498+02
590ab91b-854e-4048-93df-d4a9ac6735ae	24ef1ad0-e98d-4874-89e0-2ac7944d3ef6	2e56d25e-e965-4612-be00-c540fc146612	4.00	0.40	3.60	t	paid	2026-04-02 11:47:09.053821+02	2026-04-17 09:47:09.072395+02
1bcfd084-0ad4-4154-95b7-0e0d4db14f05	2b067f33-0dc3-4002-b907-c9e272c94e32	c7c7d43f-10fd-4ea9-b7fd-b3cc6968e26d	6.00	0.60	5.40	t	paid	2026-03-20 10:47:09.213686+01	2026-04-17 09:47:09.279134+02
85f43ac9-e979-45e3-b6fb-addc6352800f	d871afdb-2dc1-40db-9289-65a7a0014587	aa44c099-fe97-4d62-b819-66e5332af77d	6.00	0.60	5.40	t	paid	2026-03-26 10:47:09.3327+01	2026-04-17 09:47:09.354716+02
7ebd007f-0514-4438-9119-a7b5b3b39c38	2518b0de-abaa-46b7-9ef5-f987594325c7	eeddfa3d-1687-4d91-af94-72f326966892	6.00	0.60	5.40	t	paid	2026-03-30 11:47:09.371246+02	2026-04-17 09:47:09.407986+02
2e9f36c3-71d5-47d8-a171-f31ad5c1ac40	02058aa2-373a-4041-abac-ce2feb4e18df	f6abd546-c018-4ec7-bae2-a60ea2479dc5	6.00	0.60	5.40	t	paid	2026-04-07 11:47:09.470056+02	2026-04-17 09:47:09.528521+02
a04122b0-d712-4105-8eb4-8ad53002aaa8	b87558fa-78a2-4a65-abc1-11c29224a76e	2a4def47-0084-411c-a4f4-c2ced07a7156	5.00	0.50	4.50	t	paid	2026-03-21 10:47:09.586327+01	2026-04-17 09:47:09.651317+02
a6f801a8-8102-4b55-b974-40e774ec80fd	3bfd71d1-d1e7-4aec-a1b8-a70ef4a4bdc4	540c34c5-7ce0-4829-b7f9-1bf1ba985405	5.00	0.50	4.50	t	paid	2026-03-27 10:47:09.711013+01	2026-04-17 09:47:09.832071+02
11faffd7-7bd9-4e93-a7e5-17a672cd87d5	0284d917-b9c7-420d-a2d7-1bb479b853fd	4a9e4a92-7fd4-478a-8642-88a09acb40ea	5.00	0.50	4.50	t	paid	2026-04-03 11:47:09.927056+02	2026-04-17 09:47:10.146464+02
8a0d273b-94ac-48dd-ab07-1249322de8d0	850b2e02-b353-4cd0-b016-4213b3550903	c5419051-82ac-4216-b1d0-3ebcbdd945c1	5.00	0.50	4.50	t	paid	2026-04-10 11:47:10.198722+02	2026-04-17 09:47:10.247576+02
94005cad-2ad2-4636-a1a8-793f853859ba	65fa817b-e362-49cd-9c0c-ab02263b0083	e3153ab9-12de-435f-a348-7ef7c7fb2246	7.00	0.70	6.30	t	paid	2026-03-13 10:47:10.302641+01	2026-04-17 09:47:10.359668+02
0bbbae08-8520-4203-a1e3-382484cda382	09adb82c-12aa-4b45-a9e8-4e820fffd23a	7b741013-74f0-4a9d-b053-fd937db0638f	7.00	0.70	6.30	t	paid	2026-03-19 10:47:10.41044+01	2026-04-17 09:47:10.443555+02
b7643f38-1121-4ebf-91cb-b5248cfd3779	8326d36e-6b0b-4dd6-a6a9-066bdd105b10	b085d1b5-b517-4cae-9da8-56a3ee4cf9c1	7.00	0.70	6.30	t	paid	2026-03-25 10:47:10.48495+01	2026-04-17 09:47:10.547516+02
4eb88e4f-8069-4226-93ce-b1c9b7affa7d	286b9584-555b-46e8-82a7-3c5f830924b0	3271cab9-5977-436b-a2b2-3e6abcf6fbf9	7.00	0.70	6.30	t	paid	2026-04-05 11:47:10.586576+02	2026-04-17 09:47:10.653124+02
c2b08546-ab44-4d6a-9f59-ddf394e600c2	3adff0c0-f63d-4206-9ace-1014f2e20d7e	d7059ac6-40e4-477d-b962-b63a2e71953d	4.00	0.40	3.60	t	paid	2026-03-28 10:47:10.688778+01	2026-04-17 09:47:10.731161+02
1fed45cc-39dd-495e-9943-b53ca51642cc	ab76e722-1d81-43ac-962c-6f5dffe76dc3	dcff4f1d-6f2e-459c-888a-7aebea3a300d	4.00	0.40	3.60	t	paid	2026-04-01 11:47:10.775995+02	2026-04-17 09:47:10.826004+02
83f98cf4-4e1d-46cf-9899-c84afadfc9d5	664ac6f3-e7ee-4084-b2a8-423edb6e9a0a	49e5376f-cabe-44bf-9591-aff9ad168c00	4.00	0.40	3.60	t	paid	2026-04-07 11:47:10.869121+02	2026-04-17 09:47:10.955693+02
a5d66bbe-e5b1-4ed6-8e4e-7b44b4729b4a	909fb14f-88cf-44ef-9105-84e6dc1aeb04	78ace17c-e54f-4196-bc21-e2901ba28c66	4.00	0.40	3.60	t	paid	2026-04-12 11:47:11.022723+02	2026-04-17 09:47:11.154222+02
e99b7137-163c-4cbf-9658-fd0563991d4d	1e13ffaf-43dd-4428-ad0a-b166e049b6bb	794d07af-eead-4053-8c7a-1719b3a56736	4.00	0.40	3.60	t	paid	2026-03-29 00:18:12.464998+01	2026-04-27 23:18:12.518374+02
e9e1db99-6db1-4324-b5da-b8e80909f9ca	3aa6d878-d882-4f37-9588-90aa8ca50bd8	472b580f-1030-40c3-a6a0-b7fbb9b170d7	4.00	0.40	3.60	t	paid	2026-04-03 01:18:12.57278+02	2026-04-27 23:18:12.581227+02
f3f23c7f-b814-47ea-a2dc-ba308f6f4f10	f37e9b03-a267-4245-be73-ca3662ded21e	58377943-b07a-478d-ad7b-29f2510a3cf6	4.00	0.40	3.60	t	paid	2026-04-08 01:18:12.589846+02	2026-04-27 23:18:12.598111+02
ef8884fc-3f95-4e8a-95ba-5bbfaa0467a9	83911cad-d56b-44cb-92c2-93e898e4f17c	8d3b77e4-bc61-401c-9824-554182175480	4.00	0.40	3.60	t	paid	2026-04-13 01:18:12.607037+02	2026-04-27 23:18:12.615377+02
a94c88d8-d28e-4906-8c2f-bca8e3f755cc	e15ee4cf-c87d-49d4-b989-d8661f82db89	18292581-aa42-446e-b35e-93ecc53b000d	6.00	0.60	5.40	t	paid	2026-03-31 01:18:12.624092+02	2026-04-27 23:18:12.632159+02
8f3f6be5-0f25-4c46-a61f-212ad2965712	18bd70ed-acae-45ec-8223-2ce3d227f7a6	f94a268c-a330-4680-a843-8fab11096af1	6.00	0.60	5.40	t	paid	2026-04-06 01:18:12.641085+02	2026-04-27 23:18:12.649296+02
38340359-ade4-4bf4-9aac-0ed55c1eeb9e	c916cdf4-7af5-4e8d-8276-9dec61d0ed37	d6b1a225-c3de-454d-baf0-01257912bf84	6.00	0.60	5.40	t	paid	2026-04-10 01:18:12.658925+02	2026-04-27 23:18:12.666777+02
801c9ab3-9f83-4856-aa32-3f6dd3858da3	2463404c-30d2-4139-8fac-1e71d1c37249	5b15cec9-3b90-4c41-9458-117c36590b0c	6.00	0.60	5.40	t	paid	2026-04-18 01:18:12.675229+02	2026-04-27 23:18:12.682836+02
ff2adb33-03fc-4440-8a16-575e5e8ab38c	f75f25e4-2ac2-4283-b856-7cbb3536a22e	5da072d8-d219-460e-9f55-90ddac979ac0	5.00	0.50	4.50	t	paid	2026-04-01 01:18:12.691634+02	2026-04-27 23:18:12.698915+02
b5a2ff36-653d-4399-80c1-6bfceba37a2d	f3c7eeb8-7d59-4395-bbb5-c84c09ab7e17	7af6d21c-0a6f-4985-b533-2ddfd2038c52	5.00	0.50	4.50	t	paid	2026-04-07 01:18:12.706575+02	2026-04-27 23:18:12.713365+02
75b624b4-ea63-4890-8b39-2116e6afb878	681ce321-1781-4d41-bba2-67cccaae92f1	d3ead67f-7bdb-4aa7-87e8-a2ed169c9b24	5.00	0.50	4.50	t	paid	2026-04-14 01:18:12.722197+02	2026-04-27 23:18:12.72902+02
9dd2e3ad-480a-47ce-b5b0-b2bf70455597	2b482b8d-3a10-44b0-b1d4-e04577f8a9d5	b73096d3-3864-4021-bb58-ebffac447678	5.00	0.50	4.50	t	paid	2026-04-21 01:18:12.73722+02	2026-04-27 23:18:12.74409+02
29281856-ef9b-4b44-a544-34e54c424816	ee33039a-b81a-4bf1-b151-c93e0700e9d9	d528b2a4-7b23-43b9-903e-eab4f99fb480	7.00	0.70	6.30	t	paid	2026-03-24 00:18:12.752564+01	2026-04-27 23:18:12.759753+02
37c3571b-6be3-4e46-a66c-aa6f0d0baab9	37853221-73e6-4d9b-b2fb-9a478cdb4152	b300d982-d665-4b75-9b81-0e49f000ff37	7.00	0.70	6.30	t	paid	2026-03-30 01:18:12.767085+02	2026-04-27 23:18:12.773981+02
068c8e29-e1b1-47af-8c17-c30a53118ab5	e642dfd6-441b-49cd-b823-a9fc164c8d5c	0091cb36-a93d-4ada-b085-761c76265449	7.00	0.70	6.30	t	paid	2026-04-05 01:18:12.781725+02	2026-04-27 23:18:12.788882+02
1f7288a2-112d-4bad-9e02-33dd91085b6f	816bb441-6bbc-4a05-8b2c-90845b41ba05	3dfc0b01-e2c3-456c-885d-639aab5c826f	7.00	0.70	6.30	t	paid	2026-04-16 01:18:12.799141+02	2026-04-27 23:18:12.807777+02
35a35f21-c0f8-45ba-90da-bf3120a9d932	a4d7d7dd-abc0-45a0-937b-78adca03a79e	77f25768-1188-4040-8c6f-b78ce17db193	4.00	0.40	3.60	t	paid	2026-04-08 01:18:12.815235+02	2026-04-27 23:18:12.82201+02
ab3a112f-113b-4555-9ee3-653a79c83801	f67400d5-ba43-47a6-ad40-aa72c3478755	120f6174-024c-494d-b4fa-22f3842c3500	4.00	0.40	3.60	t	paid	2026-04-12 01:18:12.829308+02	2026-04-27 23:18:12.836164+02
f7940045-327c-4d66-bd11-d58cd76cb8ef	c1e5e93d-48f4-4cda-a7a0-cf7015fbe43c	78464575-649c-493c-99f8-f68993752592	4.00	0.40	3.60	t	paid	2026-04-18 01:18:12.844026+02	2026-04-27 23:18:12.850892+02
7bb02321-7116-4ae2-a2b9-2733612a7b7c	9cbabc65-75cc-4fd8-bb95-a0ce2c15b8de	40e61385-da5f-4441-99b5-1526aadb213b	4.00	0.40	3.60	t	paid	2026-04-23 01:18:12.858759+02	2026-04-27 23:18:12.865766+02
f399c0e7-eb0b-4627-b37b-ccc848a77eb5	378c5a83-233f-4026-af5b-b62971f9ceeb	b4b49331-3cf6-4155-9b30-141e1ee181c3	4.00	0.40	3.60	t	paid	2026-04-05 23:56:25.730306+02	2026-05-05 21:56:25.837894+02
2feebabd-cf0d-4684-8ef2-2e6e7c709e5e	756fb388-e044-4044-b68b-92c43d083bde	a942b38b-3984-4f63-8255-ef2eb69e29c6	4.00	0.40	3.60	t	paid	2026-04-10 23:56:25.924594+02	2026-05-05 21:56:25.940942+02
d9c0f242-7846-4abf-85cc-8e357c14f5d8	f00a7780-495e-494a-8929-a37f2c8ec6bf	c81fea39-2fe0-411e-a306-f2828516a3ba	4.00	0.40	3.60	t	paid	2026-04-15 23:56:25.955401+02	2026-05-05 21:56:25.970152+02
771ec087-5f01-492d-bd13-8d0ace10b7c0	eedd3249-3e00-4394-bc3e-b92efbfaad7c	8bf87e6e-ee33-47a4-bd14-016767426021	4.00	0.40	3.60	t	paid	2026-04-20 23:56:25.9857+02	2026-05-05 21:56:25.998697+02
6f5f5d3d-5596-4d36-a643-dadf5c1360cc	d70ab14e-7d43-4db2-a5e9-b21f9f05cf68	2bc36fc5-74cd-4bd1-a3a2-399088108d70	6.00	0.60	5.40	t	paid	2026-04-07 23:56:26.015287+02	2026-05-05 21:56:26.035364+02
1b961719-d230-4ff2-b0d1-7a516e424c35	240fae2e-49b3-451e-96fc-707b21054b9d	7a16967f-f866-4b7b-b336-8c7489943f37	6.00	0.60	5.40	t	paid	2026-04-13 23:56:26.087025+02	2026-05-05 21:56:26.106108+02
ef038a15-15ac-4f3f-b63f-399d08b98913	5ce0090b-1c0d-43d0-b71b-31773652763b	e704d8f8-6733-46c7-b33d-11702a388f51	6.00	0.60	5.40	t	paid	2026-04-17 23:56:26.129582+02	2026-05-05 21:56:26.148566+02
5dbf2527-6cd7-44c7-9c16-66d24517a4a5	e1ed1c49-1282-446b-9b09-0a98d2f32841	e4276320-c07a-4e79-b757-8132261a39f9	6.00	0.60	5.40	t	paid	2026-04-25 23:56:26.169578+02	2026-05-05 21:56:26.188382+02
a0cfdb94-c436-4b49-b1f2-e684b7164d05	94174d80-ebd0-457d-b809-afd64ecfb49d	8f494d43-927f-4c4d-9d21-2b9de7b5f1d3	5.00	0.50	4.50	t	paid	2026-04-08 23:56:26.207897+02	2026-05-05 21:56:26.225527+02
e3f4ff05-99f7-4966-a310-f15464ba2590	e3626e99-0b9f-40ec-99bf-2b862feb8782	ca965ed4-69e3-484a-b0e4-2d20f10aa4e7	5.00	0.50	4.50	t	paid	2026-04-14 23:56:26.246617+02	2026-05-05 21:56:26.263854+02
1d33d64c-0f20-428b-b3da-212a2a20f348	578486b4-cee2-449f-bb62-7add8b7bf367	b95d6550-1d91-404a-9f06-d64f944d7ac9	5.00	0.50	4.50	t	paid	2026-04-21 23:56:26.282807+02	2026-05-05 21:56:26.301427+02
a5f39f5a-a6f4-4bf3-8c12-da76141acfb6	a95a8050-4c22-4f17-a504-c5a91c54e074	38040530-1b91-46fe-8604-f4d4efeeae33	5.00	0.50	4.50	t	paid	2026-04-28 23:56:26.32636+02	2026-05-05 21:56:26.346715+02
e57fb139-79fa-4234-aa4c-6ef14c0598d4	1b1ca854-6eff-4711-aa21-850037cf4121	d11b7443-c136-4514-846f-cb62c6b4dd40	7.00	0.70	6.30	t	paid	2026-03-31 23:56:26.370482+02	2026-05-05 21:56:26.395122+02
d2c715dd-d4e5-4cad-8879-d13e4c55a5fb	7924ab60-234b-40c9-9605-8740b9ffedc5	b19ad777-8180-4134-b97f-243f49dd2482	7.00	0.70	6.30	t	paid	2026-04-06 23:56:26.430275+02	2026-05-05 21:56:26.462118+02
50dfd319-9e74-495b-807f-a3e3e80b9f48	1da920eb-2406-4be9-b27a-856c8fb2c0ec	b9a9ee67-5656-4d22-ae65-3b84c6d1b1bb	7.00	0.70	6.30	t	paid	2026-04-12 23:56:26.495637+02	2026-05-05 21:56:26.526032+02
f54607ae-2764-45b8-8d9b-aad81ced5a11	2b8885c6-35a3-46df-83a7-7994f57064c4	11218ade-13a4-45f3-a8dc-b334f586ab67	7.00	0.70	6.30	t	paid	2026-04-23 23:56:26.557942+02	2026-05-05 21:56:26.587415+02
f7eb69dd-44bd-4631-b335-10d6d12105df	bdd46688-87dc-4c06-9017-24b88a75dbfe	e4848421-2d78-4aa1-9fc3-477071869565	4.00	0.40	3.60	t	paid	2026-04-15 23:56:26.619354+02	2026-05-05 21:56:26.648921+02
85fd6803-1005-4565-abec-c8366a35b9de	b4d9c177-ff1b-44ad-b174-6263ed524466	f9052706-830f-4ac8-9425-df2a7ff929b5	4.00	0.40	3.60	t	paid	2026-04-19 23:56:26.682978+02	2026-05-05 21:56:26.714489+02
edae9ce8-5c9f-4ab4-903b-5ae21e8f9826	26dfa9af-6220-48b0-9610-660a8ff86b6d	1e220982-2d99-456c-9219-e6577fdbd948	4.00	0.40	3.60	t	paid	2026-04-25 23:56:26.751429+02	2026-05-05 21:56:26.783327+02
785fc9c6-569c-460e-9436-24bd5ad50de1	e8924212-0d59-4076-b424-df796f2fc01c	5f06571c-cf65-4540-8d8b-85a02f9141e0	4.00	0.40	3.60	t	paid	2026-04-30 23:56:26.817153+02	2026-05-05 21:56:26.846141+02
9539b681-f053-45c3-a74a-f25af1bca5ef	d183681b-9542-405c-b931-8897bf701fd5	098598ed-9646-4f05-b4fc-5c3f1b3564bb	4.00	0.40	3.60	t	paid	2026-04-05 23:56:58.998379+02	2026-05-05 21:56:59.051668+02
792eef8d-c8c2-44a1-8abc-cd2edfa3a619	f44e57b7-78c6-4928-8c01-5f5a6231e7b4	d5f695bf-42e0-4ab6-998d-79d1af600949	4.00	0.40	3.60	t	paid	2026-04-10 23:56:59.131099+02	2026-05-05 21:56:59.162254+02
f2f78632-ef9c-4b93-950a-fce1644b02d5	4de9e25d-2d81-45dc-99b0-5c88d4c1d030	04464ec1-16ce-4d22-9a13-1512f3b38094	4.00	0.40	3.60	t	paid	2026-04-15 23:56:59.196907+02	2026-05-05 21:56:59.226455+02
f0767048-4c9e-478c-b3fb-b714eeeef0f3	48eddce6-619d-4105-a990-6447982bf2e1	88cae54a-93d7-4423-a2bf-955d3ad5929e	4.00	0.40	3.60	t	paid	2026-04-20 23:56:59.263134+02	2026-05-05 21:56:59.29688+02
c4d7443c-da94-44c3-954d-ec668870664d	d7530ebe-7467-4fe7-9e30-dd8c59d9c528	1a04caed-f75b-4e77-91af-fdbdd723d600	6.00	0.60	5.40	t	paid	2026-04-07 23:56:59.330542+02	2026-05-05 21:56:59.359873+02
4ffdcba3-1305-4c87-84d9-f0fafeaa29f6	126b0094-8bdc-4125-bb99-a5a099a92419	37d12ccc-6ecd-4027-9f10-e41c289710dd	6.00	0.60	5.40	t	paid	2026-04-13 23:56:59.392678+02	2026-05-05 21:56:59.426594+02
dd6f93e1-59bf-420b-9439-51e5a3b40ad4	1c064f71-5f1d-422c-bee6-8269170197b1	b1920b5e-c7b2-4b36-8df8-9f33fb0576bc	6.00	0.60	5.40	t	paid	2026-04-17 23:56:59.457657+02	2026-05-05 21:56:59.48545+02
2d999f81-656d-44a0-b20a-40d533468675	298d4da5-7229-4696-9373-bb87791f2417	901764d2-616e-49e0-b646-08ab351ce34f	6.00	0.60	5.40	t	paid	2026-04-25 23:56:59.517265+02	2026-05-05 21:56:59.550243+02
13644e11-aa6c-427b-9515-e46941b3ad32	a5144886-01c1-41e8-8269-be0a085ac274	d9e5f009-8c84-4ee2-9f02-026f796d8ae0	5.00	0.50	4.50	t	paid	2026-04-08 23:56:59.581697+02	2026-05-05 21:56:59.609882+02
187a449e-fac4-474c-8491-360c29955759	21b60411-0a4e-4b4a-9b0c-0ef55c1f24fb	1254fccc-3042-4e5a-ae83-dccbabadac4b	5.00	0.50	4.50	t	paid	2026-04-14 23:56:59.641114+02	2026-05-05 21:56:59.673127+02
2a9c37ae-5585-4852-9365-4a5b424653c4	59a435b7-3076-4d2a-9ed5-2f9e42431799	f3c58c88-5f47-4219-abca-bc2526cc67a7	5.00	0.50	4.50	t	paid	2026-04-21 23:56:59.715005+02	2026-05-05 21:56:59.76102+02
d9d29ef0-37bf-4f13-add5-05942894293f	99ec0d21-38d0-4398-92ef-964aa6f5dd81	9bd505c8-3289-487e-ad30-2d485483f09b	5.00	0.50	4.50	t	paid	2026-04-28 23:56:59.794286+02	2026-05-05 21:56:59.811994+02
8c0d7aad-577c-4e2a-9ca4-b6612594e600	b22d4916-5ff3-4ece-8b22-4e9146c69015	00247154-c6dd-4bdd-8437-942c7617be93	7.00	0.70	6.30	t	paid	2026-03-31 23:56:59.830408+02	2026-05-05 21:56:59.846492+02
51cf6d29-2d02-4c61-aaac-8aa34e37f2fc	01748f26-ec0d-4b38-99a3-ce799336f934	7be6ed4d-34e4-40c2-bdaa-f15604507df3	7.00	0.70	6.30	t	paid	2026-04-06 23:56:59.862707+02	2026-05-05 21:56:59.876243+02
bf8746f9-1683-4967-a40a-1fe75a9b29b1	b85fc674-3c40-428e-9f41-654491f3c320	053a87aa-e0b9-4eb1-8c18-ca67a90318bb	7.00	0.70	6.30	t	paid	2026-04-12 23:56:59.89104+02	2026-05-05 21:56:59.905825+02
90beec2a-e447-4565-a062-40301e4f02ca	db3c239b-001f-4e26-aede-1a34ef1c5a84	5a4aefbf-d58d-4c1b-a8c5-2442066f56e7	7.00	0.70	6.30	t	paid	2026-04-23 23:56:59.924158+02	2026-05-05 21:56:59.942157+02
40a649ea-e9da-4bc6-a75e-d48b610cd7ce	fd6fe457-d4cf-4ac6-a743-fb4c50af4459	2d9dca4d-2fec-47e2-b38e-2e0c75ab4f3f	4.00	0.40	3.60	t	paid	2026-04-15 23:56:59.993775+02	2026-05-05 21:57:00.015208+02
0e2450cf-d76d-4156-b730-9be8f0ee1cc2	7fa94a1d-5f2b-43be-bc4a-d90f60f1797d	1237c4bd-eecf-4ca5-b341-9c5f355172dd	4.00	0.40	3.60	t	paid	2026-04-19 23:57:00.043517+02	2026-05-05 21:57:00.063848+02
7db9ee5e-cdcf-4ac7-ad77-449639864ff5	53be8711-a392-4e66-94ac-97826295bea0	5916d8ae-b019-4a53-86a8-5f970d24753c	4.00	0.40	3.60	t	paid	2026-04-25 23:57:00.084744+02	2026-05-05 21:57:00.101725+02
98fb8d44-a2d0-4790-a829-ffdd108d2ef8	bfd930f2-7a77-4dc5-9103-0efbe067c01f	e62c0d19-c5a2-4c4c-a8ad-f58b21da6693	4.00	0.40	3.60	t	paid	2026-04-30 23:57:00.120461+02	2026-05-05 21:57:00.135636+02
\.


--
-- Data for Name: paypal_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.paypal_transactions (id, course_payment_id, student_id, paypal_order_id, paypal_status, amount, currency, installment, created_at, completed_at) FROM stdin;
\.


--
-- Data for Name: reschedule_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reschedule_requests (id, session_id, requested_by, new_time, status, reason, created_at, resolved_at) FROM stdin;
\.


--
-- Data for Name: review_flags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.review_flags (id, flagged_user, flagged_by, reason, status, created_at, reviewed_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, session_id, teacher_id, student_id, written_by, role, rating, comment, created_at) FROM stdin;
97374ab7-c67c-4b4d-915f-3018c0261201	f44c588e-aaea-4ff1-b92a-f3ddee52fcb8	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-14 21:14:00.144933+02
c0e95c2a-3e3f-4da7-bb5c-636aef24da6f	f44c588e-aaea-4ff1-b92a-f3ddee52fcb8	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Student is very motivated and learns quickly.	2026-04-14 21:14:00.144933+02
0b505846-c5f3-4c65-a1db-bb1d35a38306	03583243-51f9-4b40-91d6-9f392dcfce3e	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Great session, learned a lot of new vocabulary.	2026-04-14 21:14:00.211529+02
37c8df4d-ce05-4a17-a6d7-558fe18eec3e	03583243-51f9-4b40-91d6-9f392dcfce3e	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-14 21:14:00.211529+02
21cdd54a-03ff-45b6-8f6d-e0c20ac546a6	a8453f4c-edf4-4ee7-aa1a-f40d1e4e47da	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	4	Very professional, always on time. Highly recommend!	2026-04-14 21:14:00.246863+02
541e33d0-9756-424e-a3fa-ff392fb9ac6d	a8453f4c-edf4-4ee7-aa1a-f40d1e4e47da	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	efc046ef-c47c-4010-b015-a383e5561459	teacher	5	Excellent student, always prepared and engaged.	2026-04-14 21:14:00.246863+02
5e208ae2-752a-456e-8731-50538e9a40e3	8550aedb-8e3d-426c-9d7d-d1eb27cb76cb	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Excellent pronunciation coaching, really helpful.	2026-04-14 21:14:00.282276+02
c6190a40-38ac-4503-b893-d8aff16c262b	8550aedb-8e3d-426c-9d7d-d1eb27cb76cb	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-14 21:14:00.282276+02
76a2b6bd-c394-4953-8d1f-95d3a76d1ca7	b96ecb64-53cb-43e7-83fb-1283d46a69bd	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	3	Good teacher but sometimes speaks too fast.	2026-04-14 21:14:00.317535+02
5b592800-bd3b-4ec8-af91-32e2e103ceb1	b96ecb64-53cb-43e7-83fb-1283d46a69bd	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Very attentive, asks great questions.	2026-04-14 21:14:00.317535+02
f50e2e17-15ca-4676-bf3e-6abe0cc4d048	1d6d44b2-f25a-443b-9faa-29591cb18dd3	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	5	Wonderful experience, the conversation practice was great.	2026-04-14 21:14:00.352367+02
455c5016-351f-4a61-8f3f-f4e1486599c1	1d6d44b2-f25a-443b-9faa-29591cb18dd3	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1adec7fd-4730-4899-951b-add7dd2003df	teacher	3	Student needs to practice more outside of sessions.	2026-04-14 21:14:00.352367+02
2e9d7f38-5ff4-460f-8447-d4876742076f	b4c371e5-734d-4a55-9f6a-e10b7bfc0be5	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-14 21:14:00.391967+02
73b1ceb9-6730-4483-8b77-4360bf1cc919	b4c371e5-734d-4a55-9f6a-e10b7bfc0be5	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b54f8048-77ac-4fe8-86b0-803bb03d146c	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-14 21:14:00.391967+02
13b26f66-3d89-4847-95fa-b3a067f3239a	42b1bfff-bb76-4d0d-a724-f3bb76dd56d9	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Good explanations but could use more exercises.	2026-04-14 21:14:00.429127+02
b71c79d1-c396-44ff-b15c-8ba36240f955	42b1bfff-bb76-4d0d-a724-f3bb76dd56d9	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c8a102a6-1412-441b-8204-76a4111e9887	teacher	4	Student shows strong potential, very dedicated.	2026-04-14 21:14:00.429127+02
db96731b-bd49-4538-92ff-13e426a826e4	b74ea5c5-f4b9-4afd-95fc-fb33125f0340	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-14 21:14:00.471832+02
0a7c1305-1779-44bd-8bd4-5953298be6b9	b74ea5c5-f4b9-4afd-95fc-fb33125f0340	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Good participation, vocabulary is growing well.	2026-04-14 21:14:00.471832+02
b3f85253-8860-4f74-8066-77c6a7a4c067	e664a8e5-b108-48ed-a23d-472dea9a832e	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-14 21:14:00.515798+02
7100f790-8ab4-4b97-90ed-e2a7e848b7ff	e664a8e5-b108-48ed-a23d-472dea9a832e	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student is consistent and hardworking.	2026-04-14 21:14:00.515798+02
aa15d9a3-044b-4676-89c0-658f5cff3dc7	46d1155b-4537-4881-9175-94555c03d402	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-14 21:14:00.559439+02
a856a668-74d1-4d0d-90d3-a5197bfd9a15	46d1155b-4537-4881-9175-94555c03d402	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	teacher	5	Student is very motivated and learns quickly.	2026-04-14 21:14:00.559439+02
91113cfe-d020-4efd-a8a1-20e79f8e85e7	c4f7f261-5bd8-4720-bfc5-11ccad4d9f99	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Great session, learned a lot of new vocabulary.	2026-04-14 21:14:00.602702+02
baeb6ab0-aa59-44d5-ada8-cb1dc4ddb040	c4f7f261-5bd8-4720-bfc5-11ccad4d9f99	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	23a5d34e-e282-485b-b9cd-2b2c3d42371b	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-14 21:14:00.602702+02
fdd55bc1-c59b-4dd4-8e60-1ac723744dfd	24c893d3-d214-40e8-a4f4-21308dc7a9a5	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	4	Very professional, always on time. Highly recommend!	2026-04-14 21:14:00.640575+02
bb6c547f-3a51-4d92-80f5-5ec9b483f073	24c893d3-d214-40e8-a4f4-21308dc7a9a5	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Excellent student, always prepared and engaged.	2026-04-14 21:14:00.640575+02
76eebae1-9301-4f10-8fa5-a90904ca7a42	cd7e3d63-eeb2-4ae9-9337-534e9662f1a1	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Excellent pronunciation coaching, really helpful.	2026-04-14 21:14:00.674896+02
9aa9f373-5102-4209-9770-88a7486b71b8	cd7e3d63-eeb2-4ae9-9337-534e9662f1a1	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-14 21:14:00.674896+02
245d8145-40ec-4c32-bc4f-28187706f3b7	43473a59-8d3b-4c1e-8df6-16b4866b9c44	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	3	Good teacher but sometimes speaks too fast.	2026-04-14 21:14:00.709168+02
55c027f3-461f-4eab-8966-a67f9249c3c3	43473a59-8d3b-4c1e-8df6-16b4866b9c44	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	1adec7fd-4730-4899-951b-add7dd2003df	teacher	5	Very attentive, asks great questions.	2026-04-14 21:14:00.709168+02
7720b6cc-6e19-43a1-87ef-3e2355aa8bbb	86eec2f4-7b3d-415f-ad61-f917974c106e	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Wonderful experience, the conversation practice was great.	2026-04-14 21:14:00.742973+02
6bf9eb64-1925-43fd-93cc-01097f83e7c1	86eec2f4-7b3d-415f-ad61-f917974c106e	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	3	Student needs to practice more outside of sessions.	2026-04-14 21:14:00.742973+02
25d0c716-29cb-4b11-bbc7-7878eac1d225	30cff6a9-8a0f-4882-ba3a-5044c1681e60	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-14 21:14:00.78597+02
ae510a1f-6344-4882-a2c9-ae24edffc242	30cff6a9-8a0f-4882-ba3a-5044c1681e60	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-14 21:14:00.78597+02
9f659f78-1926-48e8-a9b3-009057fb847e	228659c2-dee9-4703-b4c5-fb038eb2f577	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Good explanations but could use more exercises.	2026-04-14 21:14:00.82056+02
27906dc3-6e64-4139-b05e-54f37aa16632	228659c2-dee9-4703-b4c5-fb038eb2f577	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student shows strong potential, very dedicated.	2026-04-14 21:14:00.82056+02
00244020-86d7-4e51-ac31-cbe624d6bf8e	fd88c8b1-b453-4a25-9b7f-cf726b840fe3	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-14 21:14:00.855827+02
b44dd68c-17da-4ae4-9d28-cb0bb63527cc	fd88c8b1-b453-4a25-9b7f-cf726b840fe3	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	c8a102a6-1412-441b-8204-76a4111e9887	teacher	5	Good participation, vocabulary is growing well.	2026-04-14 21:14:00.855827+02
97d613fd-c1d4-4d20-9cab-fa4a3900759e	2b105892-15d4-477c-9a2f-188622ef0b97	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-14 21:14:00.895322+02
1dec8535-5348-4c01-989a-0991931805c5	2b105892-15d4-477c-9a2f-188622ef0b97	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	4	Student is consistent and hardworking.	2026-04-14 21:14:00.895322+02
46a2cc2a-f6dc-43d5-a119-2f5049897299	af2da89a-1425-4080-b626-c9e59024d238	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-17 09:47:06.925869+02
2005ddc6-1fd6-49ef-ac27-2cedc8dce2b3	af2da89a-1425-4080-b626-c9e59024d238	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Student is very motivated and learns quickly.	2026-04-17 09:47:06.925869+02
27b5040e-0cc2-45d4-9f48-67b4f2ae7fbf	28766c16-13fd-41f1-acf9-477508c5df83	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Great session, learned a lot of new vocabulary.	2026-04-17 09:47:08.947406+02
cc7bb7c8-4189-40b5-9f20-1caad5d9ad55	28766c16-13fd-41f1-acf9-477508c5df83	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-17 09:47:08.947406+02
9d882419-c273-4b55-9b7e-7ab1b5a11a6a	88faff61-d182-4bae-ba93-50fb67f339e7	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	4	Very professional, always on time. Highly recommend!	2026-04-17 09:47:09.036029+02
433f6998-a0f6-4c27-ba6a-12c9bc4a0280	88faff61-d182-4bae-ba93-50fb67f339e7	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	efc046ef-c47c-4010-b015-a383e5561459	teacher	5	Excellent student, always prepared and engaged.	2026-04-17 09:47:09.036029+02
69492e15-25bd-4532-af87-a096d73b346d	24ef1ad0-e98d-4874-89e0-2ac7944d3ef6	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Excellent pronunciation coaching, really helpful.	2026-04-17 09:47:09.182794+02
ab3a9d5b-c8fe-4ed8-b66e-2d14f4d7247d	24ef1ad0-e98d-4874-89e0-2ac7944d3ef6	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-17 09:47:09.182794+02
a3231b3f-0654-42f0-bf6c-71ba4d0bb5ff	2b067f33-0dc3-4002-b907-c9e272c94e32	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	3	Good teacher but sometimes speaks too fast.	2026-04-17 09:47:09.302977+02
33e41b22-c5fd-46f6-a991-f2f8e9368590	2b067f33-0dc3-4002-b907-c9e272c94e32	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Very attentive, asks great questions.	2026-04-17 09:47:09.302977+02
f1846778-2750-4199-890f-fe8043497dc7	d871afdb-2dc1-40db-9289-65a7a0014587	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	5	Wonderful experience, the conversation practice was great.	2026-04-17 09:47:09.362952+02
cda8b236-4aca-40f8-ac82-4e93081d5190	d871afdb-2dc1-40db-9289-65a7a0014587	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1adec7fd-4730-4899-951b-add7dd2003df	teacher	3	Student needs to practice more outside of sessions.	2026-04-17 09:47:09.362952+02
f9f4606e-fca2-44fc-a94f-32cfe8af4bdd	2518b0de-abaa-46b7-9ef5-f987594325c7	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-17 09:47:09.420066+02
52844bd4-51d4-4a26-a8cb-edc8920ae1c6	2518b0de-abaa-46b7-9ef5-f987594325c7	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b54f8048-77ac-4fe8-86b0-803bb03d146c	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-17 09:47:09.420066+02
437fe4f4-3167-4a6d-a751-610bde9b5671	02058aa2-373a-4041-abac-ce2feb4e18df	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Good explanations but could use more exercises.	2026-04-17 09:47:09.549224+02
0f98a40d-2c14-44c6-b1f6-bbdf850856ce	02058aa2-373a-4041-abac-ce2feb4e18df	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c8a102a6-1412-441b-8204-76a4111e9887	teacher	4	Student shows strong potential, very dedicated.	2026-04-17 09:47:09.549224+02
836c8f5a-3514-4431-8560-cd23c8e17020	b87558fa-78a2-4a65-abc1-11c29224a76e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-17 09:47:09.688896+02
bf07185a-8030-4772-a12e-f21180e45af3	b87558fa-78a2-4a65-abc1-11c29224a76e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Good participation, vocabulary is growing well.	2026-04-17 09:47:09.688896+02
2e044409-b083-4e81-9245-353a38654f9b	3bfd71d1-d1e7-4aec-a1b8-a70ef4a4bdc4	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-17 09:47:09.894426+02
bfc12350-1a42-432a-b91d-90d3126af89a	3bfd71d1-d1e7-4aec-a1b8-a70ef4a4bdc4	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student is consistent and hardworking.	2026-04-17 09:47:09.894426+02
a08ed850-74e4-4822-aec2-62776c91425b	0284d917-b9c7-420d-a2d7-1bb479b853fd	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-17 09:47:10.163712+02
5e555ef1-7df3-4505-8cd7-ed04e8aeb10f	0284d917-b9c7-420d-a2d7-1bb479b853fd	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	teacher	5	Student is very motivated and learns quickly.	2026-04-17 09:47:10.163712+02
482edb5d-3add-4b19-8ad2-5281e1920b90	850b2e02-b353-4cd0-b016-4213b3550903	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Great session, learned a lot of new vocabulary.	2026-04-17 09:47:10.267847+02
66b3e599-d350-4e68-b8af-701d0bd18bca	850b2e02-b353-4cd0-b016-4213b3550903	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	23a5d34e-e282-485b-b9cd-2b2c3d42371b	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-17 09:47:10.267847+02
423c3772-752c-40da-a0ee-72e3f533ff36	65fa817b-e362-49cd-9c0c-ab02263b0083	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	4	Very professional, always on time. Highly recommend!	2026-04-17 09:47:10.380501+02
c66eee99-d01a-4ace-bb8e-e737fa1b3cf5	65fa817b-e362-49cd-9c0c-ab02263b0083	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Excellent student, always prepared and engaged.	2026-04-17 09:47:10.380501+02
ca15bbf4-08ba-4e4a-97e9-c7d092af3dcb	09adb82c-12aa-4b45-a9e8-4e820fffd23a	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Excellent pronunciation coaching, really helpful.	2026-04-17 09:47:10.458972+02
22f23619-b23f-4898-ad89-43252b67552b	09adb82c-12aa-4b45-a9e8-4e820fffd23a	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-17 09:47:10.458972+02
d5d1fdd1-c1ad-4bb5-aa4c-563f389e3bf0	8326d36e-6b0b-4dd6-a6a9-066bdd105b10	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	3	Good teacher but sometimes speaks too fast.	2026-04-17 09:47:10.562114+02
62f311fe-6948-4bee-a431-96001638712c	8326d36e-6b0b-4dd6-a6a9-066bdd105b10	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	1adec7fd-4730-4899-951b-add7dd2003df	teacher	5	Very attentive, asks great questions.	2026-04-17 09:47:10.562114+02
1b999eb1-c165-426e-903b-0656a3701c6c	286b9584-555b-46e8-82a7-3c5f830924b0	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Wonderful experience, the conversation practice was great.	2026-04-17 09:47:10.666443+02
52b92a12-abdc-43ba-973b-e9d6f485283a	286b9584-555b-46e8-82a7-3c5f830924b0	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	3	Student needs to practice more outside of sessions.	2026-04-17 09:47:10.666443+02
a119901b-4f84-4d42-8590-86021d4b0b68	3adff0c0-f63d-4206-9ace-1014f2e20d7e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-17 09:47:10.750725+02
9d2deef4-fda4-41ed-90a7-e445073f1aea	3adff0c0-f63d-4206-9ace-1014f2e20d7e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-17 09:47:10.750725+02
97b112be-8217-4f00-bc4f-9e1350752f07	ab76e722-1d81-43ac-962c-6f5dffe76dc3	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Good explanations but could use more exercises.	2026-04-17 09:47:10.848167+02
10a21b2e-d787-46ed-96b8-705102058215	ab76e722-1d81-43ac-962c-6f5dffe76dc3	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student shows strong potential, very dedicated.	2026-04-17 09:47:10.848167+02
537e6017-7a6e-412d-89e6-1c9702aeeaab	664ac6f3-e7ee-4084-b2a8-423edb6e9a0a	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-17 09:47:10.979752+02
fef31af9-7c96-4eb0-a1b7-8bf842acb118	664ac6f3-e7ee-4084-b2a8-423edb6e9a0a	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	c8a102a6-1412-441b-8204-76a4111e9887	teacher	5	Good participation, vocabulary is growing well.	2026-04-17 09:47:10.979752+02
191d2615-d5d3-4fcd-b5b4-8ee761c74b18	909fb14f-88cf-44ef-9105-84e6dc1aeb04	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-17 09:47:11.270429+02
a4cef95e-9ed6-49d9-b61b-36a77d24c6a4	909fb14f-88cf-44ef-9105-84e6dc1aeb04	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	4	Student is consistent and hardworking.	2026-04-17 09:47:11.270429+02
3bffb8c2-3b3b-4bc9-bb1a-649b8ac5e063	1e13ffaf-43dd-4428-ad0a-b166e049b6bb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-27 23:18:12.541519+02
ef382d2e-9d39-4646-b85c-01e4320e57f9	1e13ffaf-43dd-4428-ad0a-b166e049b6bb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Student is very motivated and learns quickly.	2026-04-27 23:18:12.541519+02
9481ac28-f24e-4767-8aa4-121c16fdd88c	3aa6d878-d882-4f37-9588-90aa8ca50bd8	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Great session, learned a lot of new vocabulary.	2026-04-27 23:18:12.584399+02
29a24b6e-e0c1-4191-adf9-71a68bb99258	3aa6d878-d882-4f37-9588-90aa8ca50bd8	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-27 23:18:12.584399+02
9771fd31-cd9b-4560-99a9-6201d1fed651	f37e9b03-a267-4245-be73-ca3662ded21e	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	4	Very professional, always on time. Highly recommend!	2026-04-27 23:18:12.601461+02
e552d83e-c7bd-4c76-9a9b-1d83309f9751	f37e9b03-a267-4245-be73-ca3662ded21e	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	efc046ef-c47c-4010-b015-a383e5561459	teacher	5	Excellent student, always prepared and engaged.	2026-04-27 23:18:12.601461+02
951855bd-e903-4548-b0b0-a017f886bb4a	83911cad-d56b-44cb-92c2-93e898e4f17c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Excellent pronunciation coaching, really helpful.	2026-04-27 23:18:12.618801+02
5739af5b-d69e-4c4c-851f-7343c47cb14a	83911cad-d56b-44cb-92c2-93e898e4f17c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-27 23:18:12.618801+02
3c09156c-08e9-4d4b-961b-943293327f13	e15ee4cf-c87d-49d4-b989-d8661f82db89	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	3	Good teacher but sometimes speaks too fast.	2026-04-27 23:18:12.635447+02
cc72d528-dcb3-40ff-b175-b1b2a74186d7	e15ee4cf-c87d-49d4-b989-d8661f82db89	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Very attentive, asks great questions.	2026-04-27 23:18:12.635447+02
3dac8452-fbc6-4edd-8022-df0ea24a5248	18bd70ed-acae-45ec-8223-2ce3d227f7a6	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	5	Wonderful experience, the conversation practice was great.	2026-04-27 23:18:12.652618+02
bd2dba42-e0ae-427f-8412-0fd9f3130fe4	18bd70ed-acae-45ec-8223-2ce3d227f7a6	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1adec7fd-4730-4899-951b-add7dd2003df	teacher	3	Student needs to practice more outside of sessions.	2026-04-27 23:18:12.652618+02
ecb5b02e-9181-402f-b998-b4af98bbb8d2	c916cdf4-7af5-4e8d-8276-9dec61d0ed37	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-27 23:18:12.669935+02
c06714e5-ad56-4d39-a69c-a5245d088466	c916cdf4-7af5-4e8d-8276-9dec61d0ed37	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b54f8048-77ac-4fe8-86b0-803bb03d146c	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-27 23:18:12.669935+02
301b056c-cb40-43d4-b9f4-d914221e5f44	2463404c-30d2-4139-8fac-1e71d1c37249	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Good explanations but could use more exercises.	2026-04-27 23:18:12.686307+02
f34bb709-096a-482d-ae9e-bdfdafde32be	2463404c-30d2-4139-8fac-1e71d1c37249	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c8a102a6-1412-441b-8204-76a4111e9887	teacher	4	Student shows strong potential, very dedicated.	2026-04-27 23:18:12.686307+02
1ca979c3-3ff0-4056-97c9-f46d8f3999d6	f75f25e4-2ac2-4283-b856-7cbb3536a22e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-27 23:18:12.701828+02
3c4a9a85-b1ca-46d4-8603-73b596be38ff	f75f25e4-2ac2-4283-b856-7cbb3536a22e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Good participation, vocabulary is growing well.	2026-04-27 23:18:12.701828+02
199af092-3565-4ed2-a223-60628b2f02b9	f3c7eeb8-7d59-4395-bbb5-c84c09ab7e17	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-27 23:18:12.71632+02
fe18441c-990f-441c-b934-927470743957	f3c7eeb8-7d59-4395-bbb5-c84c09ab7e17	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student is consistent and hardworking.	2026-04-27 23:18:12.71632+02
c4b9c9b6-6cd5-4abd-87ce-078d74535eba	681ce321-1781-4d41-bba2-67cccaae92f1	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Amazing teacher! Very patient and clear explanations.	2026-04-27 23:18:12.731755+02
f803a037-da14-42df-af71-1abde6519f36	681ce321-1781-4d41-bba2-67cccaae92f1	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	teacher	5	Student is very motivated and learns quickly.	2026-04-27 23:18:12.731755+02
89c5acd5-80ba-4368-84d0-49b47cfa4162	2b482b8d-3a10-44b0-b1d4-e04577f8a9d5	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Great session, learned a lot of new vocabulary.	2026-04-27 23:18:12.746978+02
e43e5deb-2d36-45ac-8f59-f90ccf9f8b03	2b482b8d-3a10-44b0-b1d4-e04577f8a9d5	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	23a5d34e-e282-485b-b9cd-2b2c3d42371b	teacher	4	Good progress, needs to work more on pronunciation.	2026-04-27 23:18:12.746978+02
29840501-7ad6-450a-8cc6-65e814b2fafa	ee33039a-b81a-4bf1-b151-c93e0700e9d9	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	4	Very professional, always on time. Highly recommend!	2026-04-27 23:18:12.762586+02
1e63cb9c-1d80-418f-a9cb-45c28d6a599b	ee33039a-b81a-4bf1-b151-c93e0700e9d9	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Excellent student, always prepared and engaged.	2026-04-27 23:18:12.762586+02
f53b2a90-cbe5-46cf-bf01-97e5acb482ba	37853221-73e6-4d9b-b2fb-9a478cdb4152	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Excellent pronunciation coaching, really helpful.	2026-04-27 23:18:12.777085+02
46b99b87-d94d-4b2c-b608-8374d49b7fa3	37853221-73e6-4d9b-b2fb-9a478cdb4152	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-04-27 23:18:12.777085+02
99cda01e-fe6d-4a10-99b2-34e58b071d70	e642dfd6-441b-49cd-b823-a9fc164c8d5c	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	3	Good teacher but sometimes speaks too fast.	2026-04-27 23:18:12.794437+02
8661cdaa-281d-452e-a5a6-6bf61e729e67	e642dfd6-441b-49cd-b823-a9fc164c8d5c	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	1adec7fd-4730-4899-951b-add7dd2003df	teacher	5	Very attentive, asks great questions.	2026-04-27 23:18:12.794437+02
2ab32e6c-8cdb-4cb1-9227-b7edc2dd7c8d	816bb441-6bbc-4a05-8b2c-90845b41ba05	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Wonderful experience, the conversation practice was great.	2026-04-27 23:18:12.81054+02
6ae351ab-c1b3-4197-8f26-860d767cd9f9	816bb441-6bbc-4a05-8b2c-90845b41ba05	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	3	Student needs to practice more outside of sessions.	2026-04-27 23:18:12.81054+02
e4e83bd9-733a-4a21-9f05-243799eae417	a4d7d7dd-abc0-45a0-937b-78adca03a79e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Very engaging and fun lessons. I look forward to every session!	2026-04-27 23:18:12.82479+02
6e00a89c-ec26-44a5-893b-b76f5c350447	a4d7d7dd-abc0-45a0-937b-78adca03a79e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Great attitude, makes the teaching enjoyable.	2026-04-27 23:18:12.82479+02
c02bce19-3ba6-4ed3-9b3c-ec7895085820	f67400d5-ba43-47a6-ad40-aa72c3478755	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Good explanations but could use more exercises.	2026-04-27 23:18:12.839381+02
5c2c1068-05d0-48c3-940b-7d0e0db5c952	f67400d5-ba43-47a6-ad40-aa72c3478755	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student shows strong potential, very dedicated.	2026-04-27 23:18:12.839381+02
1ff40e27-227e-47b4-8747-1dd37dba9349	c1e5e93d-48f4-4cda-a7a0-cf7015fbe43c	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Fantastic teacher, very encouraging and supportive.	2026-04-27 23:18:12.853923+02
766de42e-74c4-47cd-a4f9-77a0f26f9f66	c1e5e93d-48f4-4cda-a7a0-cf7015fbe43c	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	c8a102a6-1412-441b-8204-76a4111e9887	teacher	5	Good participation, vocabulary is growing well.	2026-04-27 23:18:12.853923+02
f1f8b7e3-4ee7-48fc-8b4b-d7ac2589998f	9cbabc65-75cc-4fd8-bb95-a0ce2c15b8de	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-04-27 23:18:12.868866+02
40200b11-dc6c-4bf5-a73c-ba9fd7e76864	9cbabc65-75cc-4fd8-bb95-a0ce2c15b8de	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	4	Student is consistent and hardworking.	2026-04-27 23:18:12.868866+02
216cea80-2e97-40e2-bb1b-1105fd648540	378c5a83-233f-4026-af5b-b62971f9ceeb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Amazing teacher! Very patient and clear explanations.	2026-05-05 21:56:25.876063+02
d4142efd-c9d8-498f-aa80-aeace04a7702	378c5a83-233f-4026-af5b-b62971f9ceeb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Student is very motivated and learns quickly.	2026-05-05 21:56:25.876063+02
574adad9-3b1d-4a7c-a549-928a742b472f	756fb388-e044-4044-b68b-92c43d083bde	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Great session, learned a lot of new vocabulary.	2026-05-05 21:56:25.946071+02
98ee96f0-8d92-45f7-957b-7ca36f82b9fb	756fb388-e044-4044-b68b-92c43d083bde	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Good progress, needs to work more on pronunciation.	2026-05-05 21:56:25.946071+02
5f751cca-a144-4780-b6eb-34e31579cc3d	f00a7780-495e-494a-8929-a37f2c8ec6bf	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	4	Very professional, always on time. Highly recommend!	2026-05-05 21:56:25.9761+02
340666ae-ac75-4780-97ff-0382ef25048e	f00a7780-495e-494a-8929-a37f2c8ec6bf	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	efc046ef-c47c-4010-b015-a383e5561459	teacher	5	Excellent student, always prepared and engaged.	2026-05-05 21:56:25.9761+02
db012761-f988-40bf-881a-474139352b01	eedd3249-3e00-4394-bc3e-b92efbfaad7c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Excellent pronunciation coaching, really helpful.	2026-05-05 21:56:26.004796+02
05ea6750-e63e-47ba-bd16-083c2713e381	eedd3249-3e00-4394-bc3e-b92efbfaad7c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-05-05 21:56:26.004796+02
6dd6423b-ead3-4967-ae0c-e4fe23862568	d70ab14e-7d43-4db2-a5e9-b21f9f05cf68	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	3	Good teacher but sometimes speaks too fast.	2026-05-05 21:56:26.072238+02
2cee301d-6464-4ca0-8d6b-0d5ba2efc84e	d70ab14e-7d43-4db2-a5e9-b21f9f05cf68	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Very attentive, asks great questions.	2026-05-05 21:56:26.072238+02
e533c8a2-6809-4c5e-837b-34bcc275af35	240fae2e-49b3-451e-96fc-707b21054b9d	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	5	Wonderful experience, the conversation practice was great.	2026-05-05 21:56:26.115503+02
df11b36d-c6ac-4412-8fa7-0f6976a11d4a	240fae2e-49b3-451e-96fc-707b21054b9d	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1adec7fd-4730-4899-951b-add7dd2003df	teacher	3	Student needs to practice more outside of sessions.	2026-05-05 21:56:26.115503+02
68f7b2ae-6468-4177-bb8a-0d6d8e461958	5ce0090b-1c0d-43d0-b71b-31773652763b	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Very engaging and fun lessons. I look forward to every session!	2026-05-05 21:56:26.156814+02
5ff9a07a-b7e9-4b02-a70f-ad907111bf9c	5ce0090b-1c0d-43d0-b71b-31773652763b	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b54f8048-77ac-4fe8-86b0-803bb03d146c	teacher	5	Great attitude, makes the teaching enjoyable.	2026-05-05 21:56:26.156814+02
a7ebbbc5-ba48-47bb-8aff-b698668c54cb	e1ed1c49-1282-446b-9b09-0a98d2f32841	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Good explanations but could use more exercises.	2026-05-05 21:56:26.195234+02
aa954435-c2a0-45ed-84de-20efd133bf7c	e1ed1c49-1282-446b-9b09-0a98d2f32841	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c8a102a6-1412-441b-8204-76a4111e9887	teacher	4	Student shows strong potential, very dedicated.	2026-05-05 21:56:26.195234+02
10f24307-d472-4936-9485-b985a881dafc	94174d80-ebd0-457d-b809-afd64ecfb49d	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Fantastic teacher, very encouraging and supportive.	2026-05-05 21:56:26.234229+02
02703c34-8f18-459e-8c84-f5b47d4ed8fa	94174d80-ebd0-457d-b809-afd64ecfb49d	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Good participation, vocabulary is growing well.	2026-05-05 21:56:26.234229+02
2446c028-fe6a-4613-a60f-08074be8adcd	e3626e99-0b9f-40ec-99bf-2b862feb8782	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-05-05 21:56:26.271393+02
a15b09f9-7dc4-4b5a-98fa-e537cd8fb532	e3626e99-0b9f-40ec-99bf-2b862feb8782	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student is consistent and hardworking.	2026-05-05 21:56:26.271393+02
4df3ad26-098b-457f-b405-f3438314e976	578486b4-cee2-449f-bb62-7add8b7bf367	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Amazing teacher! Very patient and clear explanations.	2026-05-05 21:56:26.312263+02
7a064b3a-b697-4f98-af3d-9a3d0b6621c3	578486b4-cee2-449f-bb62-7add8b7bf367	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	teacher	5	Student is very motivated and learns quickly.	2026-05-05 21:56:26.312263+02
623d255d-c8b4-468c-9ec1-6e5b5ff775a4	a95a8050-4c22-4f17-a504-c5a91c54e074	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Great session, learned a lot of new vocabulary.	2026-05-05 21:56:26.354983+02
c34426a1-b982-4db6-afac-5c7c34d61792	a95a8050-4c22-4f17-a504-c5a91c54e074	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	23a5d34e-e282-485b-b9cd-2b2c3d42371b	teacher	4	Good progress, needs to work more on pronunciation.	2026-05-05 21:56:26.354983+02
5aaf61dc-ee8c-4ff8-a9f5-08214e3eb364	1b1ca854-6eff-4711-aa21-850037cf4121	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	4	Very professional, always on time. Highly recommend!	2026-05-05 21:56:26.407647+02
68b099c3-8918-4add-a756-469c091ede27	1b1ca854-6eff-4711-aa21-850037cf4121	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Excellent student, always prepared and engaged.	2026-05-05 21:56:26.407647+02
9a27b853-5e5d-4947-a689-891622a4e9c1	7924ab60-234b-40c9-9605-8740b9ffedc5	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Excellent pronunciation coaching, really helpful.	2026-05-05 21:56:26.4747+02
aaaa6623-bfcb-4045-986d-e88f70a3eb55	7924ab60-234b-40c9-9605-8740b9ffedc5	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-05-05 21:56:26.4747+02
48e5c92c-e7b6-4fa0-83ba-f1a5c860528d	1da920eb-2406-4be9-b27a-856c8fb2c0ec	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	3	Good teacher but sometimes speaks too fast.	2026-05-05 21:56:26.537734+02
5c2b2946-96ac-47d4-9196-2ff9a19f71a7	1da920eb-2406-4be9-b27a-856c8fb2c0ec	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	1adec7fd-4730-4899-951b-add7dd2003df	teacher	5	Very attentive, asks great questions.	2026-05-05 21:56:26.537734+02
96a4da7c-02c1-484d-adb7-66acabc7fcdb	2b8885c6-35a3-46df-83a7-7994f57064c4	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Wonderful experience, the conversation practice was great.	2026-05-05 21:56:26.600084+02
35bfd4c4-89ad-4df0-a521-69ed4712e40f	2b8885c6-35a3-46df-83a7-7994f57064c4	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	3	Student needs to practice more outside of sessions.	2026-05-05 21:56:26.600084+02
e6a3f027-7f15-490e-b3e5-8f8adc3ddc40	bdd46688-87dc-4c06-9017-24b88a75dbfe	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Very engaging and fun lessons. I look forward to every session!	2026-05-05 21:56:26.662396+02
0fd28112-4eb0-41fd-87cf-5ca069f3d30a	bdd46688-87dc-4c06-9017-24b88a75dbfe	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Great attitude, makes the teaching enjoyable.	2026-05-05 21:56:26.662396+02
d76f3d6e-2f79-4c80-841d-62d0d891f507	b4d9c177-ff1b-44ad-b174-6263ed524466	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Good explanations but could use more exercises.	2026-05-05 21:56:26.729155+02
0d986b65-834c-415d-844c-a65ce7198a43	b4d9c177-ff1b-44ad-b174-6263ed524466	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student shows strong potential, very dedicated.	2026-05-05 21:56:26.729155+02
911d4d04-077d-4320-85b3-97d311586cf3	26dfa9af-6220-48b0-9610-660a8ff86b6d	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Fantastic teacher, very encouraging and supportive.	2026-05-05 21:56:26.79567+02
0ad5bae9-81e9-4801-98ad-c0145c9afd86	26dfa9af-6220-48b0-9610-660a8ff86b6d	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	c8a102a6-1412-441b-8204-76a4111e9887	teacher	5	Good participation, vocabulary is growing well.	2026-05-05 21:56:26.79567+02
3d8b428e-d4ef-45b8-8876-c18365ae76a6	e8924212-0d59-4076-b424-df796f2fc01c	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-05-05 21:56:26.858567+02
ce23876c-606b-4cf2-ab20-7411c90f3287	e8924212-0d59-4076-b424-df796f2fc01c	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	4	Student is consistent and hardworking.	2026-05-05 21:56:26.858567+02
3de76d5e-c62b-4cc1-8bf8-c1316be4ee61	d183681b-9542-405c-b931-8897bf701fd5	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Amazing teacher! Very patient and clear explanations.	2026-05-05 21:56:59.084684+02
28db7213-bf55-4e70-98d6-e96a7580ec10	d183681b-9542-405c-b931-8897bf701fd5	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Student is very motivated and learns quickly.	2026-05-05 21:56:59.084684+02
6f9aa224-e8f4-41c8-ab09-64558c0a5236	f44e57b7-78c6-4928-8c01-5f5a6231e7b4	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Great session, learned a lot of new vocabulary.	2026-05-05 21:56:59.174749+02
0fea92ab-6637-4f4c-9b6c-7b1c48dc5c5d	f44e57b7-78c6-4928-8c01-5f5a6231e7b4	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Good progress, needs to work more on pronunciation.	2026-05-05 21:56:59.174749+02
9fac2a84-6d91-44e7-b741-ba07d1d9f894	4de9e25d-2d81-45dc-99b0-5c88d4c1d030	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	4	Very professional, always on time. Highly recommend!	2026-05-05 21:56:59.238701+02
5742f9a7-4165-4cc7-b27e-d3aea7e211b9	4de9e25d-2d81-45dc-99b0-5c88d4c1d030	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	efc046ef-c47c-4010-b015-a383e5561459	teacher	5	Excellent student, always prepared and engaged.	2026-05-05 21:56:59.238701+02
8d4cada0-d58e-4b1a-9402-65959fb965e0	48eddce6-619d-4105-a990-6447982bf2e1	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	student	5	Excellent pronunciation coaching, really helpful.	2026-05-05 21:56:59.309461+02
3119b4bd-8a7b-47cf-a4fc-fa02fbb40ba5	48eddce6-619d-4105-a990-6447982bf2e1	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-05-05 21:56:59.309461+02
45962d0e-dbcc-42fd-9394-b8923f6f3259	d7530ebe-7467-4fe7-9e30-dd8c59d9c528	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	3	Good teacher but sometimes speaks too fast.	2026-05-05 21:56:59.372119+02
ea746872-7ec5-405b-bbfd-f34208f5b519	d7530ebe-7467-4fe7-9e30-dd8c59d9c528	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Very attentive, asks great questions.	2026-05-05 21:56:59.372119+02
a4faa32c-14fa-4e93-9572-c58d68185965	126b0094-8bdc-4125-bb99-a5a099a92419	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	5	Wonderful experience, the conversation practice was great.	2026-05-05 21:56:59.438293+02
04fd3437-6c73-4f4f-98a3-0e0c9b34bfa0	126b0094-8bdc-4125-bb99-a5a099a92419	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1adec7fd-4730-4899-951b-add7dd2003df	teacher	3	Student needs to practice more outside of sessions.	2026-05-05 21:56:59.438293+02
b938b3ef-7ed8-4192-aae2-3bddb153f63d	1c064f71-5f1d-422c-bee6-8269170197b1	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Very engaging and fun lessons. I look forward to every session!	2026-05-05 21:56:59.496968+02
cdb9c3e3-7118-4315-98a5-4fbd2389c81c	1c064f71-5f1d-422c-bee6-8269170197b1	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b54f8048-77ac-4fe8-86b0-803bb03d146c	teacher	5	Great attitude, makes the teaching enjoyable.	2026-05-05 21:56:59.496968+02
e2710c7d-5d8e-4220-ab0a-5d380598ead2	298d4da5-7229-4696-9373-bb87791f2417	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	student	4	Good explanations but could use more exercises.	2026-05-05 21:56:59.562493+02
3ff9606a-f0d2-4e1d-b66c-15ec579b4451	298d4da5-7229-4696-9373-bb87791f2417	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c8a102a6-1412-441b-8204-76a4111e9887	teacher	4	Student shows strong potential, very dedicated.	2026-05-05 21:56:59.562493+02
96a6c7b6-56d2-46ec-adc9-92fba9e977d3	a5144886-01c1-41e8-8269-be0a085ac274	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Fantastic teacher, very encouraging and supportive.	2026-05-05 21:56:59.621071+02
661126c1-2861-4817-a228-6a2af714bb0f	a5144886-01c1-41e8-8269-be0a085ac274	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Good participation, vocabulary is growing well.	2026-05-05 21:56:59.621071+02
596fb7f8-b02d-4705-b7ec-46e294c6faa9	21b60411-0a4e-4b4a-9b0c-0ef55c1f24fb	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-05-05 21:56:59.685897+02
3a075d51-006a-4bba-b7a0-3c1433c0b171	21b60411-0a4e-4b4a-9b0c-0ef55c1f24fb	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student is consistent and hardworking.	2026-05-05 21:56:59.685897+02
750c0313-c035-43b4-b753-f775bd398733	59a435b7-3076-4d2a-9ed5-2f9e42431799	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Amazing teacher! Very patient and clear explanations.	2026-05-05 21:56:59.775876+02
0fbe1ddc-2596-47d6-99eb-05df9e6e02fc	59a435b7-3076-4d2a-9ed5-2f9e42431799	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	teacher	5	Student is very motivated and learns quickly.	2026-05-05 21:56:59.775876+02
377c3e61-acba-4c58-8fc9-413d99029fe8	99ec0d21-38d0-4398-92ef-964aa6f5dd81	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	student	5	Great session, learned a lot of new vocabulary.	2026-05-05 21:56:59.81788+02
e4fa2580-e292-4bd7-b4fb-185429bb68e4	99ec0d21-38d0-4398-92ef-964aa6f5dd81	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	23a5d34e-e282-485b-b9cd-2b2c3d42371b	teacher	4	Good progress, needs to work more on pronunciation.	2026-05-05 21:56:59.81788+02
fa4956df-5591-48d9-8db7-3f325d4f49cf	b22d4916-5ff3-4ece-8b22-4e9146c69015	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	4	Very professional, always on time. Highly recommend!	2026-05-05 21:56:59.852897+02
d0fac77e-501d-4a27-9840-11b2d403e30e	b22d4916-5ff3-4ece-8b22-4e9146c69015	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	dada9d11-4792-4660-8d30-66af9c672513	teacher	5	Excellent student, always prepared and engaged.	2026-05-05 21:56:59.852897+02
d31d5915-7655-418f-8f7a-b8f34d390c01	01748f26-ec0d-4b38-99a3-ce799336f934	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Excellent pronunciation coaching, really helpful.	2026-05-05 21:56:59.881626+02
79cf6c1a-0844-404b-b45c-df96ba498f75	01748f26-ec0d-4b38-99a3-ce799336f934	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	631ffc5e-b000-4429-88fe-51b3e75bbe11	teacher	4	Student is improving steadily, keep up the good work!	2026-05-05 21:56:59.881626+02
1b9e6860-1bfd-469f-b122-c4a2153d9fd8	b85fc674-3c40-428e-9f41-654491f3c320	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	3	Good teacher but sometimes speaks too fast.	2026-05-05 21:56:59.912053+02
e4bfe94e-0996-4b72-a580-eed6ca901904	b85fc674-3c40-428e-9f41-654491f3c320	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	1adec7fd-4730-4899-951b-add7dd2003df	teacher	5	Very attentive, asks great questions.	2026-05-05 21:56:59.912053+02
e1f5798c-ff5c-425c-9ac4-e3cc7f9c5a48	db3c239b-001f-4e26-aede-1a34ef1c5a84	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	student	5	Wonderful experience, the conversation practice was great.	2026-05-05 21:56:59.950477+02
14272e85-566e-4694-b8cc-d991c903bbad	db3c239b-001f-4e26-aede-1a34ef1c5a84	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	3	Student needs to practice more outside of sessions.	2026-05-05 21:56:59.950477+02
b20bff91-ad8e-4964-825e-c3d6bfdd8c23	fd6fe457-d4cf-4ac6-a743-fb4c50af4459	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Very engaging and fun lessons. I look forward to every session!	2026-05-05 21:57:00.026457+02
e587ae96-0cde-4f25-a733-a4dc5e2228ea	fd6fe457-d4cf-4ac6-a743-fb4c50af4459	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	85ac9d08-6445-494d-b53c-b7da9aab0b93	teacher	5	Great attitude, makes the teaching enjoyable.	2026-05-05 21:57:00.026457+02
22c26b84-ff09-4f8e-aa3d-afc306ebf073	7fa94a1d-5f2b-43be-bc4a-d90f60f1797d	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	4	Good explanations but could use more exercises.	2026-05-05 21:57:00.072076+02
8b6d8666-08bf-40a8-8e2e-b0dfb2aadf72	7fa94a1d-5f2b-43be-bc4a-d90f60f1797d	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dada9d11-4792-4660-8d30-66af9c672513	teacher	4	Student shows strong potential, very dedicated.	2026-05-05 21:57:00.072076+02
ea46898e-8dc4-403c-94b0-f678f45cdacc	53be8711-a392-4e66-94ac-97826295bea0	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Fantastic teacher, very encouraging and supportive.	2026-05-05 21:57:00.109005+02
d6cdd08d-da80-4e1e-9dfb-019c35bbb5a9	53be8711-a392-4e66-94ac-97826295bea0	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	c8a102a6-1412-441b-8204-76a4111e9887	teacher	5	Good participation, vocabulary is growing well.	2026-05-05 21:57:00.109005+02
5e236501-2d29-4df4-ad36-9c308b194e08	bfd930f2-7a77-4dc5-9103-0efbe067c01f	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	student	5	Really enjoyed the cultural insights shared during the lesson.	2026-05-05 21:57:00.142084+02
c5ef4369-f426-4d0e-8271-c5adc1e57346	bfd930f2-7a77-4dc5-9103-0efbe067c01f	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	b99a999c-9f55-4c72-80cb-85ecf795e180	teacher	4	Student is consistent and hardworking.	2026-05-05 21:57:00.142084+02
\.


--
-- Data for Name: session_attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.session_attendance (id, session_id, student_id, was_present, marked_at) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, teacher_id, student_id, course_payment_id, language_id, level, scheduled_at, duration_minutes, status, videocall_url, rescheduled, teacher_review_done, student_review_done, payment_released, created_at) FROM stdin;
f44c588e-aaea-4ff1-b92a-f3ddee52fcb8	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	cd02d535-398b-4e76-954c-7c549ae7172b	8	A1	2026-03-15 20:14:00.085252+01	60	completed	https://meet.nativetalk.com/980f4e03-4c99-425a-8dbd-3cbf6b5226ed	f	t	t	t	2026-04-14 21:14:00.103968+02
03583243-51f9-4b40-91d6-9f392dcfce3e	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	1cb00648-6b75-4d56-97ce-cfb752bc4cb9	1	A1	2026-03-20 20:14:00.187938+01	60	completed	https://meet.nativetalk.com/e80b5b8f-3c65-4f97-96ae-038f048f7111	f	t	t	t	2026-04-14 21:14:00.196096+02
a8453f4c-edf4-4ee7-aa1a-f40d1e4e47da	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	6aaf1dbe-621d-4067-9256-f33503af1350	2	A1	2026-03-25 20:14:00.223515+01	60	completed	https://meet.nativetalk.com/9bd5300e-a4ab-4215-82be-b13c7b65f02b	f	t	t	t	2026-04-14 21:14:00.231195+02
8550aedb-8e3d-426c-9d7d-d1eb27cb76cb	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	036ac251-defc-4b35-8016-8e012ddc074f	3	A1	2026-03-30 21:14:00.258926+02	60	completed	https://meet.nativetalk.com/48d66d06-faaf-4741-90dd-6a4e5046bff8	f	t	t	t	2026-04-14 21:14:00.266785+02
b96ecb64-53cb-43e7-83fb-1283d46a69bd	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	417c9cdb-7d34-4e24-a6cf-18951a36901b	1	B1	2026-03-17 20:14:00.294341+01	60	completed	https://meet.nativetalk.com/7b8b0373-e3c4-449d-be2b-b9349762f4ba	f	t	t	t	2026-04-14 21:14:00.302125+02
1d6d44b2-f25a-443b-9faa-29591cb18dd3	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	4fcb7f68-2148-460b-ab33-55cc3bf2bd31	4	B1	2026-03-23 20:14:00.329063+01	60	completed	https://meet.nativetalk.com/ab044f8b-8ef2-49a0-ab93-92caa8ad67fb	f	t	t	t	2026-04-14 21:14:00.336822+02
b4c371e5-734d-4a55-9f6a-e10b7bfc0be5	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	ac5976d1-cc30-4ff3-bf7f-5a6812ffe7bc	5	B1	2026-03-27 20:14:00.363702+01	60	completed	https://meet.nativetalk.com/b457bb0d-51a5-45db-94d2-4dc7d6d47477	f	t	t	t	2026-04-14 21:14:00.372695+02
42b1bfff-bb76-4d0d-a724-f3bb76dd56d9	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	853e62c9-c19c-47d8-9a2b-0051cbf250fc	9	B1	2026-04-04 21:14:00.40394+02	60	completed	https://meet.nativetalk.com/68021f79-175e-42b2-ae1e-269f215e38a7	f	t	t	t	2026-04-14 21:14:00.411735+02
b74ea5c5-f4b9-4afd-95fc-fb33125f0340	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	99bd7b5a-b42a-441a-862f-53dc3f0b549f	8	A2	2026-03-18 20:14:00.442295+01	60	completed	https://meet.nativetalk.com/504ca316-ee72-4a65-8faf-867504b10b6c	f	t	t	t	2026-04-14 21:14:00.453152+02
e664a8e5-b108-48ed-a23d-472dea9a832e	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	bcc41fd0-5fa3-4dc9-a9b7-2cae9f1ec949	1	A2	2026-03-24 20:14:00.488592+01	60	completed	https://meet.nativetalk.com/58cb7565-e72a-4e9c-9647-dfb4299f0b28	f	t	t	t	2026-04-14 21:14:00.498773+02
46d1155b-4537-4881-9175-94555c03d402	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	c196699f-1c6e-41db-aad4-02ed3f214b3d	6	A2	2026-03-31 21:14:00.529342+02	60	completed	https://meet.nativetalk.com/7b448939-edfd-4e7c-a07b-257442db0220	f	t	t	t	2026-04-14 21:14:00.53944+02
c4f7f261-5bd8-4720-bfc5-11ccad4d9f99	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	5653d7fc-0e3a-4823-9001-ce05879e2c98	7	A2	2026-04-07 21:14:00.572595+02	60	completed	https://meet.nativetalk.com/574f6f75-ef2e-47bf-9db4-b0e43a0b6970	f	t	t	t	2026-04-14 21:14:00.581268+02
24c893d3-d214-40e8-a4f4-21308dc7a9a5	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	897dd33a-c5a9-488f-baf5-39b1a064022e	1	B2	2026-03-10 20:14:00.615983+01	60	completed	https://meet.nativetalk.com/396a531a-54b9-4765-9ff9-f09381db16fd	f	t	t	t	2026-04-14 21:14:00.625386+02
cd7e3d63-eeb2-4ae9-9337-534e9662f1a1	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	90b92986-e8c1-47ed-a694-de5e11a1613d	3	B2	2026-03-16 20:14:00.651449+01	60	completed	https://meet.nativetalk.com/24b27ea8-a049-4da3-8dc5-db70bfd98746	f	t	t	t	2026-04-14 21:14:00.659733+02
43473a59-8d3b-4c1e-8df6-16b4866b9c44	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	f018b812-b5dd-4720-ae5a-9fb4aa0919bf	4	B2	2026-03-22 20:14:00.686423+01	60	completed	https://meet.nativetalk.com/e0ac9874-f5bb-4ea8-ac24-edbb32c88537	f	t	t	t	2026-04-14 21:14:00.694156+02
86eec2f4-7b3d-415f-ad61-f917974c106e	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	36e0f768-6408-41e4-badc-821619e179ab	10	B2	2026-04-02 21:14:00.720281+02	60	completed	https://meet.nativetalk.com/cb9ffcc4-6f24-4d4b-bd06-ebf47b696c46	f	t	t	t	2026-04-14 21:14:00.727989+02
30cff6a9-8a0f-4882-ba3a-5044c1681e60	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	43d06d9c-4d8a-4525-b163-ddf9820c8bea	8	A1	2026-03-25 20:14:00.753956+01	60	completed	https://meet.nativetalk.com/cb7a30bb-a7d1-48f3-9cc7-cbbce7fc02ac	f	t	t	t	2026-04-14 21:14:00.761761+02
228659c2-dee9-4703-b4c5-fb038eb2f577	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	952ffc75-08b0-40b5-bfed-0556cad89c34	1	A1	2026-03-29 21:14:00.797743+02	60	completed	https://meet.nativetalk.com/fdef9317-91df-4bc0-a8f8-eb684166c516	f	t	t	t	2026-04-14 21:14:00.805247+02
fd88c8b1-b453-4a25-9b7f-cf726b840fe3	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	4b7c30ae-49b9-4d18-8a2b-7f407e28c434	9	A1	2026-04-04 21:14:00.831826+02	60	completed	https://meet.nativetalk.com/f4c28fb7-922b-4491-b8f5-aed0fb4f3f4f	f	t	t	t	2026-04-14 21:14:00.839519+02
2b105892-15d4-477c-9a2f-188622ef0b97	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	8b6834c6-866e-43a5-9e2d-8528bfd3807f	10	A1	2026-04-09 21:14:00.869173+02	60	completed	https://meet.nativetalk.com/3d8f23a9-623d-4445-9b3a-a77958c537cc	f	t	t	t	2026-04-14 21:14:00.877642+02
af2da89a-1425-4080-b626-c9e59024d238	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	2d2181c9-f265-4f43-951e-ec803605c033	8	A1	2026-03-18 08:47:06.522339+01	60	completed	https://meet.nativetalk.com/f25fc808-a76a-4747-b3c4-aca0e30a5eb7	f	t	t	t	2026-04-17 09:47:06.620874+02
28766c16-13fd-41f1-acf9-477508c5df83	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	11b57def-f9a1-4df8-bbe4-8531b7fcc871	1	A1	2026-03-23 08:47:08.877038+01	60	completed	https://meet.nativetalk.com/95b29b08-3583-4c7c-aaa7-74cf7bac3774	f	t	t	t	2026-04-17 09:47:08.901751+02
88faff61-d182-4bae-ba93-50fb67f339e7	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	c9d894f3-95e2-4122-a7f0-cdf8fcd90013	2	A1	2026-03-28 08:47:08.985556+01	60	completed	https://meet.nativetalk.com/34a9b550-0c30-4d3c-8214-e51b909674b2	f	t	t	t	2026-04-17 09:47:09.008349+02
24ef1ad0-e98d-4874-89e0-2ac7944d3ef6	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	2e56d25e-e965-4612-be00-c540fc146612	3	A1	2026-04-02 09:47:09.053821+02	60	completed	https://meet.nativetalk.com/b8ad7090-6c21-4bac-8146-48dbc1a29d9f	f	t	t	t	2026-04-17 09:47:09.06399+02
2b067f33-0dc3-4002-b907-c9e272c94e32	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	c7c7d43f-10fd-4ea9-b7fd-b3cc6968e26d	1	B1	2026-03-20 08:47:09.213686+01	60	completed	https://meet.nativetalk.com/34030df2-054e-4947-b5e1-b2dbeb9862f3	f	t	t	t	2026-04-17 09:47:09.244929+02
d871afdb-2dc1-40db-9289-65a7a0014587	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	aa44c099-fe97-4d62-b819-66e5332af77d	4	B1	2026-03-26 08:47:09.3327+01	60	completed	https://meet.nativetalk.com/e2dc9ed9-e417-47c8-b6ff-e6743ac0faa3	f	t	t	t	2026-04-17 09:47:09.346512+02
2518b0de-abaa-46b7-9ef5-f987594325c7	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	eeddfa3d-1687-4d91-af94-72f326966892	5	B1	2026-03-30 09:47:09.371246+02	60	completed	https://meet.nativetalk.com/fdb3b1f2-22aa-46f6-a8da-825d4d8d4d3c	f	t	t	t	2026-04-17 09:47:09.393303+02
02058aa2-373a-4041-abac-ce2feb4e18df	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	f6abd546-c018-4ec7-bae2-a60ea2479dc5	9	B1	2026-04-07 09:47:09.470056+02	60	completed	https://meet.nativetalk.com/f1257b4a-031f-4b62-b8ee-ef9dc042eeef	f	t	t	t	2026-04-17 09:47:09.49482+02
b87558fa-78a2-4a65-abc1-11c29224a76e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	2a4def47-0084-411c-a4f4-c2ced07a7156	8	A2	2026-03-21 08:47:09.586327+01	60	completed	https://meet.nativetalk.com/ab0dd34e-7a5c-4f1d-abe4-938b8f34e719	f	t	t	t	2026-04-17 09:47:09.63527+02
3bfd71d1-d1e7-4aec-a1b8-a70ef4a4bdc4	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	540c34c5-7ce0-4829-b7f9-1bf1ba985405	1	A2	2026-03-27 08:47:09.711013+01	60	completed	https://meet.nativetalk.com/eefd1187-bea1-4150-a660-d34b0a857300	f	t	t	t	2026-04-17 09:47:09.812305+02
0284d917-b9c7-420d-a2d7-1bb479b853fd	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	4a9e4a92-7fd4-478a-8642-88a09acb40ea	6	A2	2026-04-03 09:47:09.927056+02	60	completed	https://meet.nativetalk.com/833fd6b8-cf98-45d0-9007-fcbaf5d1e1d0	f	t	t	t	2026-04-17 09:47:10.023526+02
850b2e02-b353-4cd0-b016-4213b3550903	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	c5419051-82ac-4216-b1d0-3ebcbdd945c1	7	A2	2026-04-10 09:47:10.198722+02	60	completed	https://meet.nativetalk.com/b256857b-52b5-48c2-897b-c0f1fba074e5	f	t	t	t	2026-04-17 09:47:10.228284+02
65fa817b-e362-49cd-9c0c-ab02263b0083	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	e3153ab9-12de-435f-a348-7ef7c7fb2246	1	B2	2026-03-13 08:47:10.302641+01	60	completed	https://meet.nativetalk.com/32758253-5751-46ba-bfdd-51b0ed98c8c5	f	t	t	t	2026-04-17 09:47:10.332804+02
09adb82c-12aa-4b45-a9e8-4e820fffd23a	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7b741013-74f0-4a9d-b053-fd937db0638f	3	B2	2026-03-19 08:47:10.41044+01	60	completed	https://meet.nativetalk.com/e0e8a909-6ecd-4324-83d4-ce711bedae96	f	t	t	t	2026-04-17 09:47:10.427201+02
8326d36e-6b0b-4dd6-a6a9-066bdd105b10	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b085d1b5-b517-4cae-9da8-56a3ee4cf9c1	4	B2	2026-03-25 08:47:10.48495+01	60	completed	https://meet.nativetalk.com/b1d9de5a-4ff4-4d43-9466-84ea797d4837	f	t	t	t	2026-04-17 09:47:10.515379+02
286b9584-555b-46e8-82a7-3c5f830924b0	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	3271cab9-5977-436b-a2b2-3e6abcf6fbf9	10	B2	2026-04-05 09:47:10.586576+02	60	completed	https://meet.nativetalk.com/722365c8-35d0-497a-a8cf-444be563809b	f	t	t	t	2026-04-17 09:47:10.609185+02
3adff0c0-f63d-4206-9ace-1014f2e20d7e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	d7059ac6-40e4-477d-b962-b63a2e71953d	8	A1	2026-03-28 08:47:10.688778+01	60	completed	https://meet.nativetalk.com/8b9f8b4c-a5ce-414a-b615-1f415fe2bc5c	f	t	t	t	2026-04-17 09:47:10.714408+02
ab76e722-1d81-43ac-962c-6f5dffe76dc3	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	dcff4f1d-6f2e-459c-888a-7aebea3a300d	1	A1	2026-04-01 09:47:10.775995+02	60	completed	https://meet.nativetalk.com/52b488e4-f5b3-479d-aed0-76fa1e6b2643	f	t	t	t	2026-04-17 09:47:10.801079+02
664ac6f3-e7ee-4084-b2a8-423edb6e9a0a	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	49e5376f-cabe-44bf-9591-aff9ad168c00	9	A1	2026-04-07 09:47:10.869121+02	60	completed	https://meet.nativetalk.com/01efeba9-7804-431d-a20d-69bc82f300ad	f	t	t	t	2026-04-17 09:47:10.927004+02
909fb14f-88cf-44ef-9105-84e6dc1aeb04	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	78ace17c-e54f-4196-bc21-e2901ba28c66	10	A1	2026-04-12 09:47:11.022723+02	60	completed	https://meet.nativetalk.com/981824cc-59c2-450f-b5fd-423bce1dba80	f	t	t	t	2026-04-17 09:47:11.046664+02
1e13ffaf-43dd-4428-ad0a-b166e049b6bb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	794d07af-eead-4053-8c7a-1719b3a56736	8	A1	2026-03-28 22:18:12.464998+01	60	completed	https://meet.nativetalk.com/a117c7fe-476f-44bf-8f0e-9064eafcb841	f	t	t	t	2026-04-27 23:18:12.491024+02
3aa6d878-d882-4f37-9588-90aa8ca50bd8	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	472b580f-1030-40c3-a6a0-b7fbb9b170d7	1	A1	2026-04-02 23:18:12.57278+02	60	completed	https://meet.nativetalk.com/4c78250a-0898-43c0-92ed-e8b116ba8d38	f	t	t	t	2026-04-27 23:18:12.577033+02
f37e9b03-a267-4245-be73-ca3662ded21e	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	58377943-b07a-478d-ad7b-29f2510a3cf6	2	A1	2026-04-07 23:18:12.589846+02	60	completed	https://meet.nativetalk.com/8abc64d2-c6ba-40fb-89bf-3424e8141724	f	t	t	t	2026-04-27 23:18:12.593714+02
83911cad-d56b-44cb-92c2-93e898e4f17c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	8d3b77e4-bc61-401c-9824-554182175480	3	A1	2026-04-12 23:18:12.607037+02	60	completed	https://meet.nativetalk.com/0c7896e4-37dc-4dab-805a-230ec49427c7	f	t	t	t	2026-04-27 23:18:12.611093+02
e15ee4cf-c87d-49d4-b989-d8661f82db89	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	18292581-aa42-446e-b35e-93ecc53b000d	1	B1	2026-03-30 23:18:12.624092+02	60	completed	https://meet.nativetalk.com/da95f189-2d37-477c-bcbc-87ba59ad33a1	f	t	t	t	2026-04-27 23:18:12.627988+02
18bd70ed-acae-45ec-8223-2ce3d227f7a6	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	f94a268c-a330-4680-a843-8fab11096af1	4	B1	2026-04-05 23:18:12.641085+02	60	completed	https://meet.nativetalk.com/dec321ac-b4ab-4122-8748-e9aa2c135cf1	f	t	t	t	2026-04-27 23:18:12.645136+02
c916cdf4-7af5-4e8d-8276-9dec61d0ed37	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	d6b1a225-c3de-454d-baf0-01257912bf84	5	B1	2026-04-09 23:18:12.658925+02	60	completed	https://meet.nativetalk.com/b8da8c51-90aa-439f-8dcd-cc875788b478	f	t	t	t	2026-04-27 23:18:12.662774+02
2463404c-30d2-4139-8fac-1e71d1c37249	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	5b15cec9-3b90-4c41-9458-117c36590b0c	9	B1	2026-04-17 23:18:12.675229+02	60	completed	https://meet.nativetalk.com/b1efabe2-6b19-4596-bc10-feb72ff3771b	f	t	t	t	2026-04-27 23:18:12.678949+02
f75f25e4-2ac2-4283-b856-7cbb3536a22e	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	5da072d8-d219-460e-9f55-90ddac979ac0	8	A2	2026-03-31 23:18:12.691634+02	60	completed	https://meet.nativetalk.com/feeae0a8-3e91-446c-a2ec-d815ad79e702	f	t	t	t	2026-04-27 23:18:12.695105+02
f3c7eeb8-7d59-4395-bbb5-c84c09ab7e17	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	7af6d21c-0a6f-4985-b533-2ddfd2038c52	1	A2	2026-04-06 23:18:12.706575+02	60	completed	https://meet.nativetalk.com/544d402c-e3f0-4cc4-ac9d-73a9a0777489	f	t	t	t	2026-04-27 23:18:12.709858+02
681ce321-1781-4d41-bba2-67cccaae92f1	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d3ead67f-7bdb-4aa7-87e8-a2ed169c9b24	6	A2	2026-04-13 23:18:12.722197+02	60	completed	https://meet.nativetalk.com/b9b8d415-6cb5-4e4a-b38f-05f39bdf4fe4	f	t	t	t	2026-04-27 23:18:12.725476+02
2b482b8d-3a10-44b0-b1d4-e04577f8a9d5	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	b73096d3-3864-4021-bb58-ebffac447678	7	A2	2026-04-20 23:18:12.73722+02	60	completed	https://meet.nativetalk.com/2eb184aa-a060-45ff-a8cc-7900e3358638	f	t	t	t	2026-04-27 23:18:12.74039+02
ee33039a-b81a-4bf1-b151-c93e0700e9d9	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d528b2a4-7b23-43b9-903e-eab4f99fb480	1	B2	2026-03-23 22:18:12.752564+01	60	completed	https://meet.nativetalk.com/b6ce1e6b-f7ce-46b0-8926-6fd92c6dd822	f	t	t	t	2026-04-27 23:18:12.755853+02
37853221-73e6-4d9b-b2fb-9a478cdb4152	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b300d982-d665-4b75-9b81-0e49f000ff37	3	B2	2026-03-29 23:18:12.767085+02	60	completed	https://meet.nativetalk.com/067d3f63-b406-4a15-b660-920ddf2478d0	f	t	t	t	2026-04-27 23:18:12.770288+02
e642dfd6-441b-49cd-b823-a9fc164c8d5c	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	0091cb36-a93d-4ada-b085-761c76265449	4	B2	2026-04-04 23:18:12.781725+02	60	completed	https://meet.nativetalk.com/c6adda4c-b578-498e-9212-fc69a7f69712	f	t	t	t	2026-04-27 23:18:12.785104+02
816bb441-6bbc-4a05-8b2c-90845b41ba05	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	3dfc0b01-e2c3-456c-885d-639aab5c826f	10	B2	2026-04-15 23:18:12.799141+02	60	completed	https://meet.nativetalk.com/df9da557-1fcd-49fc-b89e-9aa98ddd3274	f	t	t	t	2026-04-27 23:18:12.804015+02
a4d7d7dd-abc0-45a0-937b-78adca03a79e	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	77f25768-1188-4040-8c6f-b78ce17db193	8	A1	2026-04-07 23:18:12.815235+02	60	completed	https://meet.nativetalk.com/29c15137-bf95-4f60-bcbd-701bab4103bb	f	t	t	t	2026-04-27 23:18:12.818427+02
f67400d5-ba43-47a6-ad40-aa72c3478755	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	120f6174-024c-494d-b4fa-22f3842c3500	1	A1	2026-04-11 23:18:12.829308+02	60	completed	https://meet.nativetalk.com/bf2fae9a-c7ac-4103-9fbe-97da59346196	f	t	t	t	2026-04-27 23:18:12.832469+02
c1e5e93d-48f4-4cda-a7a0-cf7015fbe43c	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	78464575-649c-493c-99f8-f68993752592	9	A1	2026-04-17 23:18:12.844026+02	60	completed	https://meet.nativetalk.com/95ad1ae2-659f-4b64-a95d-71058e455413	f	t	t	t	2026-04-27 23:18:12.847323+02
9cbabc65-75cc-4fd8-bb95-a0ce2c15b8de	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	40e61385-da5f-4441-99b5-1526aadb213b	10	A1	2026-04-22 23:18:12.858759+02	60	completed	https://meet.nativetalk.com/e568557c-1e12-41bc-849b-079c06440475	f	t	t	t	2026-04-27 23:18:12.862002+02
378c5a83-233f-4026-af5b-b62971f9ceeb	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	b4b49331-3cf6-4155-9b30-141e1ee181c3	8	A1	2026-04-05 21:56:25.730306+02	60	completed	https://meet.nativetalk.com/b180a66e-165e-4b58-92ec-bfdd196d8862	f	t	t	t	2026-05-05 21:56:25.78659+02
756fb388-e044-4044-b68b-92c43d083bde	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	a942b38b-3984-4f63-8255-ef2eb69e29c6	1	A1	2026-04-10 21:56:25.924594+02	60	completed	https://meet.nativetalk.com/d67e2c8d-78ab-4907-9f44-a44e15228430	f	t	t	t	2026-05-05 21:56:25.93349+02
f00a7780-495e-494a-8929-a37f2c8ec6bf	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	c81fea39-2fe0-411e-a306-f2828516a3ba	2	A1	2026-04-15 21:56:25.955401+02	60	completed	https://meet.nativetalk.com/c7b4a68e-03aa-4cff-8d42-534d9c853f7f	f	t	t	t	2026-05-05 21:56:25.961441+02
eedd3249-3e00-4394-bc3e-b92efbfaad7c	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	8bf87e6e-ee33-47a4-bd14-016767426021	3	A1	2026-04-20 21:56:25.9857+02	60	completed	https://meet.nativetalk.com/78f7de89-f474-43d3-a902-c2f392c28429	f	t	t	t	2026-05-05 21:56:25.992019+02
d70ab14e-7d43-4db2-a5e9-b21f9f05cf68	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	2bc36fc5-74cd-4bd1-a3a2-399088108d70	1	B1	2026-04-07 21:56:26.015287+02	60	completed	https://meet.nativetalk.com/89cbb4bf-6760-48ab-a2a2-fbb320df99a0	f	t	t	t	2026-05-05 21:56:26.023978+02
240fae2e-49b3-451e-96fc-707b21054b9d	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	7a16967f-f866-4b7b-b336-8c7489943f37	4	B1	2026-04-13 21:56:26.087025+02	60	completed	https://meet.nativetalk.com/73dd9ee8-1e54-478f-9cbe-52ecf8609350	f	t	t	t	2026-05-05 21:56:26.095918+02
5ce0090b-1c0d-43d0-b71b-31773652763b	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	e704d8f8-6733-46c7-b33d-11702a388f51	5	B1	2026-04-17 21:56:26.129582+02	60	completed	https://meet.nativetalk.com/e310a1a4-e2d4-45c0-bb0b-d1f658a73325	f	t	t	t	2026-05-05 21:56:26.137645+02
e1ed1c49-1282-446b-9b09-0a98d2f32841	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	e4276320-c07a-4e79-b757-8132261a39f9	9	B1	2026-04-25 21:56:26.169578+02	60	completed	https://meet.nativetalk.com/cfb177a7-3cb7-4f2f-94c6-0ea03a7a1bc6	f	t	t	t	2026-05-05 21:56:26.179069+02
94174d80-ebd0-457d-b809-afd64ecfb49d	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	8f494d43-927f-4c4d-9d21-2b9de7b5f1d3	8	A2	2026-04-08 21:56:26.207897+02	60	completed	https://meet.nativetalk.com/6d58a8f2-5d09-4bc4-9260-f3247dedc9de	f	t	t	t	2026-05-05 21:56:26.215885+02
e3626e99-0b9f-40ec-99bf-2b862feb8782	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	ca965ed4-69e3-484a-b0e4-2d20f10aa4e7	1	A2	2026-04-14 21:56:26.246617+02	60	completed	https://meet.nativetalk.com/a40b1fa8-f331-4a57-86f9-8a3a4cdef98a	f	t	t	t	2026-05-05 21:56:26.255409+02
578486b4-cee2-449f-bb62-7add8b7bf367	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	b95d6550-1d91-404a-9f06-d64f944d7ac9	6	A2	2026-04-21 21:56:26.282807+02	60	completed	https://meet.nativetalk.com/63ec0afc-4ea2-4378-ad03-0a16329c053f	f	t	t	t	2026-05-05 21:56:26.290883+02
a95a8050-4c22-4f17-a504-c5a91c54e074	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	38040530-1b91-46fe-8604-f4d4efeeae33	7	A2	2026-04-28 21:56:26.32636+02	60	completed	https://meet.nativetalk.com/d7335229-2eab-4bd6-a9f9-37cfe62e5a37	f	t	t	t	2026-05-05 21:56:26.336227+02
1b1ca854-6eff-4711-aa21-850037cf4121	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	d11b7443-c136-4514-846f-cb62c6b4dd40	1	B2	2026-03-31 21:56:26.370482+02	60	completed	https://meet.nativetalk.com/6c3ccb26-ed02-414f-aa55-13499bd048e8	f	t	t	t	2026-05-05 21:56:26.38037+02
7924ab60-234b-40c9-9605-8740b9ffedc5	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b19ad777-8180-4134-b97f-243f49dd2482	3	B2	2026-04-06 21:56:26.430275+02	60	completed	https://meet.nativetalk.com/92c0af35-7aaa-46e7-a199-a8c09bab07f5	f	t	t	t	2026-05-05 21:56:26.444575+02
1da920eb-2406-4be9-b27a-856c8fb2c0ec	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	b9a9ee67-5656-4d22-ae65-3b84c6d1b1bb	4	B2	2026-04-12 21:56:26.495637+02	60	completed	https://meet.nativetalk.com/43f88342-901e-411c-aa1d-5d3b0b88542c	f	t	t	t	2026-05-05 21:56:26.510045+02
2b8885c6-35a3-46df-83a7-7994f57064c4	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	11218ade-13a4-45f3-a8dc-b334f586ab67	10	B2	2026-04-23 21:56:26.557942+02	60	completed	https://meet.nativetalk.com/662bd444-694d-44d4-a717-627325386a86	f	t	t	t	2026-05-05 21:56:26.571787+02
bdd46688-87dc-4c06-9017-24b88a75dbfe	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	e4848421-2d78-4aa1-9fc3-477071869565	8	A1	2026-04-15 21:56:26.619354+02	60	completed	https://meet.nativetalk.com/97b9be3e-50bb-44d9-810d-117650175aa5	f	t	t	t	2026-05-05 21:56:26.632901+02
b4d9c177-ff1b-44ad-b174-6263ed524466	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	f9052706-830f-4ac8-9425-df2a7ff929b5	1	A1	2026-04-19 21:56:26.682978+02	60	completed	https://meet.nativetalk.com/8be5aa29-9bf4-4e14-a5cd-1c5a19f6a409	f	t	t	t	2026-05-05 21:56:26.696542+02
26dfa9af-6220-48b0-9610-660a8ff86b6d	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	1e220982-2d99-456c-9219-e6577fdbd948	9	A1	2026-04-25 21:56:26.751429+02	60	completed	https://meet.nativetalk.com/3296cd8b-4c8c-4e38-8008-7806f7d763c7	f	t	t	t	2026-05-05 21:56:26.767172+02
e8924212-0d59-4076-b424-df796f2fc01c	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	5f06571c-cf65-4540-8d8b-85a02f9141e0	10	A1	2026-04-30 21:56:26.817153+02	60	completed	https://meet.nativetalk.com/33a60a69-10bc-4b7d-baf2-172b75a46685	f	t	t	t	2026-05-05 21:56:26.831054+02
d183681b-9542-405c-b931-8897bf701fd5	866a5c25-7094-4926-9cc9-2189bea942cd	0210b7bd-f439-45f6-9dd2-fc97e93bb145	098598ed-9646-4f05-b4fc-5c3f1b3564bb	8	A1	2026-04-05 21:56:58.998379+02	60	completed	https://meet.nativetalk.com/15bc5d74-c77c-4242-9d5b-e23ea7f6e23c	f	t	t	t	2026-05-05 21:56:59.032416+02
f44e57b7-78c6-4928-8c01-5f5a6231e7b4	01445742-612c-40ce-a8ef-d18d2ac6dc04	0210b7bd-f439-45f6-9dd2-fc97e93bb145	d5f695bf-42e0-4ab6-998d-79d1af600949	1	A1	2026-04-10 21:56:59.131099+02	60	completed	https://meet.nativetalk.com/c0db8162-6efd-4abe-8b0a-4c24d07f9f25	f	t	t	t	2026-05-05 21:56:59.145078+02
4de9e25d-2d81-45dc-99b0-5c88d4c1d030	154f1c2b-e807-4829-bd43-764781ff83a5	0210b7bd-f439-45f6-9dd2-fc97e93bb145	04464ec1-16ce-4d22-9a13-1512f3b38094	2	A1	2026-04-15 21:56:59.196907+02	60	completed	https://meet.nativetalk.com/4d1fdb14-0193-411f-ae97-a24c33e4893a	f	t	t	t	2026-05-05 21:56:59.210668+02
48eddce6-619d-4105-a990-6447982bf2e1	236f7d03-c021-403a-9359-1f17623569c6	0210b7bd-f439-45f6-9dd2-fc97e93bb145	88cae54a-93d7-4423-a2bf-955d3ad5929e	3	A1	2026-04-20 21:56:59.263134+02	60	completed	https://meet.nativetalk.com/8bc4a1cb-b02b-4e3b-bf97-170ec0775395	f	t	t	t	2026-05-05 21:56:59.27872+02
d7530ebe-7467-4fe7-9e30-dd8c59d9c528	01445742-612c-40ce-a8ef-d18d2ac6dc04	e5237185-84d8-47a3-858e-9a7ec21fa5ed	1a04caed-f75b-4e77-91af-fdbdd723d600	1	B1	2026-04-07 21:56:59.330542+02	60	completed	https://meet.nativetalk.com/c7160f86-f677-4adb-b2bc-5ebd6f75d522	f	t	t	t	2026-05-05 21:56:59.343956+02
126b0094-8bdc-4125-bb99-a5a099a92419	bac7e754-01ed-4610-806d-9e089afb7035	e5237185-84d8-47a3-858e-9a7ec21fa5ed	37d12ccc-6ecd-4027-9f10-e41c289710dd	4	B1	2026-04-13 21:56:59.392678+02	60	completed	https://meet.nativetalk.com/147b6b9d-2ec5-4826-9473-df26335fbf55	f	t	t	t	2026-05-05 21:56:59.409769+02
1c064f71-5f1d-422c-bee6-8269170197b1	74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	e5237185-84d8-47a3-858e-9a7ec21fa5ed	b1920b5e-c7b2-4b36-8df8-9f33fb0576bc	5	B1	2026-04-17 21:56:59.457657+02	60	completed	https://meet.nativetalk.com/212891e2-ddc0-4154-8fa3-59cc7e55a055	f	t	t	t	2026-05-05 21:56:59.470271+02
298d4da5-7229-4696-9373-bb87791f2417	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	e5237185-84d8-47a3-858e-9a7ec21fa5ed	901764d2-616e-49e0-b646-08ab351ce34f	9	B1	2026-04-25 21:56:59.517265+02	60	completed	https://meet.nativetalk.com/7d97250a-c493-4c10-83b0-9cff360932a9	f	t	t	t	2026-05-05 21:56:59.532177+02
a5144886-01c1-41e8-8269-be0a085ac274	866a5c25-7094-4926-9cc9-2189bea942cd	2ace945a-88fe-4d4c-9d19-e321a1bf8260	d9e5f009-8c84-4ee2-9f02-026f796d8ae0	8	A2	2026-04-08 21:56:59.581697+02	60	completed	https://meet.nativetalk.com/c7d41650-9961-47d0-a2a7-e57ac9566b61	f	t	t	t	2026-05-05 21:56:59.595024+02
21b60411-0a4e-4b4a-9b0c-0ef55c1f24fb	01445742-612c-40ce-a8ef-d18d2ac6dc04	2ace945a-88fe-4d4c-9d19-e321a1bf8260	1254fccc-3042-4e5a-ae83-dccbabadac4b	1	A2	2026-04-14 21:56:59.641114+02	60	completed	https://meet.nativetalk.com/ab7b605c-c961-48c8-9feb-374b6aa08710	f	t	t	t	2026-05-05 21:56:59.656232+02
59a435b7-3076-4d2a-9ed5-2f9e42431799	f9a1c61b-4904-409f-b235-6ad25703bd18	2ace945a-88fe-4d4c-9d19-e321a1bf8260	f3c58c88-5f47-4219-abca-bc2526cc67a7	6	A2	2026-04-21 21:56:59.715005+02	60	completed	https://meet.nativetalk.com/bccfcb0d-406a-484f-b468-414174306584	f	t	t	t	2026-05-05 21:56:59.741283+02
99ec0d21-38d0-4398-92ef-964aa6f5dd81	d6658ccc-5624-4270-9342-3570ba32a3c7	2ace945a-88fe-4d4c-9d19-e321a1bf8260	9bd505c8-3289-487e-ad30-2d485483f09b	7	A2	2026-04-28 21:56:59.794286+02	60	completed	https://meet.nativetalk.com/2312309f-4d8c-405a-8b64-fb5d7792162f	f	t	t	t	2026-05-05 21:56:59.803346+02
b22d4916-5ff3-4ece-8b22-4e9146c69015	01445742-612c-40ce-a8ef-d18d2ac6dc04	d26e0955-9734-4501-8ce5-2a7f67fb73a1	00247154-c6dd-4bdd-8437-942c7617be93	1	B2	2026-03-31 21:56:59.830408+02	60	completed	https://meet.nativetalk.com/950fb66e-90b4-4222-a1e3-0951ae738701	f	t	t	t	2026-05-05 21:56:59.837851+02
01748f26-ec0d-4b38-99a3-ce799336f934	236f7d03-c021-403a-9359-1f17623569c6	d26e0955-9734-4501-8ce5-2a7f67fb73a1	7be6ed4d-34e4-40c2-bdaa-f15604507df3	3	B2	2026-04-06 21:56:59.862707+02	60	completed	https://meet.nativetalk.com/30188890-01ab-4a56-bae2-6da62fa49085	f	t	t	t	2026-05-05 21:56:59.868949+02
b85fc674-3c40-428e-9f41-654491f3c320	bac7e754-01ed-4610-806d-9e089afb7035	d26e0955-9734-4501-8ce5-2a7f67fb73a1	053a87aa-e0b9-4eb1-8c18-ca67a90318bb	4	B2	2026-04-12 21:56:59.89104+02	60	completed	https://meet.nativetalk.com/d360ddc2-e26e-48f3-bf13-f9ff4be0bb2d	f	t	t	t	2026-05-05 21:56:59.898018+02
db3c239b-001f-4e26-aede-1a34ef1c5a84	7cba5a5b-d745-4bae-842a-59af71545e2a	d26e0955-9734-4501-8ce5-2a7f67fb73a1	5a4aefbf-d58d-4c1b-a8c5-2442066f56e7	10	B2	2026-04-23 21:56:59.924158+02	60	completed	https://meet.nativetalk.com/81da2eb2-9184-468b-915c-43e291c8b955	f	t	t	t	2026-05-05 21:56:59.931972+02
fd6fe457-d4cf-4ac6-a743-fb4c50af4459	866a5c25-7094-4926-9cc9-2189bea942cd	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	2d9dca4d-2fec-47e2-b38e-2e0c75ab4f3f	8	A1	2026-04-15 21:56:59.993775+02	60	completed	https://meet.nativetalk.com/eea6d36e-8d30-49db-912b-919c4011212b	f	t	t	t	2026-05-05 21:57:00.003526+02
7fa94a1d-5f2b-43be-bc4a-d90f60f1797d	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	1237c4bd-eecf-4ca5-b341-9c5f355172dd	1	A1	2026-04-19 21:57:00.043517+02	60	completed	https://meet.nativetalk.com/66d323be-84ca-45a8-9c2b-470386745ae0	f	t	t	t	2026-05-05 21:57:00.054748+02
53be8711-a392-4e66-94ac-97826295bea0	2d2bc4aa-cc30-4c81-9051-6939ef0016fb	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	5916d8ae-b019-4a53-86a8-5f970d24753c	9	A1	2026-04-25 21:57:00.084744+02	60	completed	https://meet.nativetalk.com/b606df84-ee8f-4662-944d-3e3699b30d3f	f	t	t	t	2026-05-05 21:57:00.093333+02
bfd930f2-7a77-4dc5-9103-0efbe067c01f	7cba5a5b-d745-4bae-842a-59af71545e2a	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	e62c0d19-c5a2-4c4c-a8ad-f58b21da6693	10	A1	2026-04-30 21:57:00.120461+02	60	completed	https://meet.nativetalk.com/dfbf289c-924a-4230-b334-4d997b30e25b	f	t	t	t	2026-05-05 21:57:00.127911+02
bbf428f2-f831-4c4c-8acd-eac2f0fc4a7a	01445742-612c-40ce-a8ef-d18d2ac6dc04	1c2e6db9-9228-4f3e-9c97-58e8bee2af81	4a2c6b93-60b4-4cdc-bea2-9a97dba91033	1	A1	2026-06-01 07:00:00+02	60	pending	https://meet.nativetalk.com/ae353334-b7d6-48ff-a8a1-fbb57a23d5df	f	f	f	f	2026-05-05 22:28:45.159306+02
\.


--
-- Data for Name: student_languages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.student_languages (id, student_id, language_id, level, started_at) FROM stdin;
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (id, user_id, current_level, reschedule_count, created_at) FROM stdin;
0210b7bd-f439-45f6-9dd2-fc97e93bb145	b1c4aa85-319e-4777-a37e-04ef731a6b9a	A1	0	2026-04-06 20:13:09.289373+02
e5237185-84d8-47a3-858e-9a7ec21fa5ed	fb27e014-2065-4386-8dce-1df7a2add481	B1	0	2026-04-13 15:56:14.671044+02
2ace945a-88fe-4d4c-9d19-e321a1bf8260	9dc32fb5-7267-4edc-b1f4-5211b263659a	A2	0	2026-04-13 15:56:15.176553+02
d26e0955-9734-4501-8ce5-2a7f67fb73a1	d30705b2-1f0e-4a11-b770-35106e9bd97e	B2	0	2026-04-13 15:56:15.707926+02
1c2e6db9-9228-4f3e-9c97-58e8bee2af81	962a9390-9992-4cc7-8ddd-4e539ed496a3	A1	0	2026-04-13 15:56:16.145954+02
d5b70b29-0472-4f42-8183-61b1062e5bc2	3c036a01-b207-444e-9dbb-ed399350a050	A1	0	2026-04-27 23:23:39.306872+02
\.


--
-- Data for Name: suspensions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.suspensions (id, user_id, teacher_id, student_id, role, reason, no_refund, is_active, notes, suspended_at, lifted_at) FROM stdin;
\.


--
-- Data for Name: teacher_certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_certificates (id, teacher_id, name, file_path, is_notarized, is_verified, uploaded_at) FROM stdin;
\.


--
-- Data for Name: teacher_noshow; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_noshow (id, teacher_id, session_id, notified, created_at) FROM stdin;
\.


--
-- Data for Name: teacher_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teacher_verifications (id, teacher_id, verified_by, verification_type, level_tested, result, notes, tested_at) FROM stdin;
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, user_id, language_id, is_native, is_certified, has_experience, max_level, is_verified, passed_exam, bio, created_at) FROM stdin;
866a5c25-7094-4926-9cc9-2189bea942cd	85ac9d08-6445-494d-b53c-b7da9aab0b93	8	t	t	f	B2	t	t	Native Turkish speaker with certificate	2026-04-06 20:13:08.659846+02
01445742-612c-40ce-a8ef-d18d2ac6dc04	dada9d11-4792-4660-8d30-66af9c672513	1	t	t	t	C2	t	t	Native English speaker, Cambridge CELTA certified.	2026-04-13 15:56:09.53532+02
154f1c2b-e807-4829-bd43-764781ff83a5	efc046ef-c47c-4010-b015-a383e5561459	2	t	t	t	C2	t	t	Native Italian speaker, university professor.	2026-04-13 15:56:10.209998+02
236f7d03-c021-403a-9359-1f17623569c6	631ffc5e-b000-4429-88fe-51b3e75bbe11	3	t	t	t	C2	t	t	Native German speaker, Goethe Institut examiner.	2026-04-13 15:56:10.752782+02
bac7e754-01ed-4610-806d-9e089afb7035	1adec7fd-4730-4899-951b-add7dd2003df	4	t	t	t	C2	t	t	Native French speaker, Alliance Française teacher.	2026-04-13 15:56:11.227262+02
74bfa18c-c0c8-4f6c-a07b-5d2e95789ca7	b54f8048-77ac-4fe8-86b0-803bb03d146c	5	t	t	t	C2	t	t	Native Spanish speaker, DELE exam preparation specialist.	2026-04-13 15:56:11.78802+02
f9a1c61b-4904-409f-b235-6ad25703bd18	cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	6	t	f	t	B2	t	t	Native Bulgarian speaker, experienced online tutor.	2026-04-13 15:56:12.408939+02
d6658ccc-5624-4270-9342-3570ba32a3c7	23a5d34e-e282-485b-b9cd-2b2c3d42371b	7	t	t	f	B2	t	t	Native Greek speaker, certified but no formal experience.	2026-04-13 15:56:13.025529+02
2d2bc4aa-cc30-4c81-9051-6939ef0016fb	c8a102a6-1412-441b-8204-76a4111e9887	9	t	t	t	C2	t	t	Native Korean speaker, TOPIK examiner.	2026-04-13 15:56:13.47906+02
7cba5a5b-d745-4bae-842a-59af71545e2a	b99a999c-9f55-4c72-80cb-85ecf795e180	10	t	t	t	C2	t	t	Native Russian speaker, Pushkin Institute certified.	2026-04-13 15:56:14.063716+02
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, full_name, email, password_hash, role, timezone, profile_photo, is_active, is_suspended, created_at, updated_at, phone) FROM stdin;
85ac9d08-6445-494d-b53c-b7da9aab0b93	Ali Yilmaz	ali@nativetalk.com	$2b$12$.Mqj.P0OqI2grbgCVxKIeutUn3Uuo5byfUJmMYbFZC7Ovf5IF6Uk2	teacher	Europe/Istanbul	\N	t	f	2026-04-06 20:13:08.634181+02	2026-04-06 20:13:08.634181+02	\N
dada9d11-4792-4660-8d30-66af9c672513	Emma Johnson	emma@nativetalk.com	$2b$12$NBhZFKkhtS7moNgYB8V5he3LL.1H1p7HocVpaBR8XJaD/ruaUkOSO	teacher	Europe/London	\N	t	f	2026-04-13 15:56:08.93259+02	2026-04-13 15:56:08.93259+02	\N
efc046ef-c47c-4010-b015-a383e5561459	Marco Rossi	marco@nativetalk.com	$2b$12$7XRlmsiLylElAj.6L5SM1eMD8oCYy.qXKFpmEuY6bYP69AjdtPQpS	teacher	Europe/Rome	\N	t	f	2026-04-13 15:56:09.582984+02	2026-04-13 15:56:09.582984+02	\N
631ffc5e-b000-4429-88fe-51b3e75bbe11	Anna Müller	anna@nativetalk.com	$2b$12$FQItvCgJ09GevfZVDKl5w.jdo0tkT6s8qf4Nr.YM7DvhvKH.mEv9a	teacher	Europe/Berlin	\N	t	f	2026-04-13 15:56:10.224289+02	2026-04-13 15:56:10.224289+02	\N
1adec7fd-4730-4899-951b-add7dd2003df	Claire Dubois	claire@nativetalk.com	$2b$12$kS0bFSYt7R0tH31wkQtunu/4MaXHideiEgES6.3xEEwaZ0e9M85ne	teacher	Europe/Paris	\N	t	f	2026-04-13 15:56:10.769654+02	2026-04-13 15:56:10.769654+02	\N
b54f8048-77ac-4fe8-86b0-803bb03d146c	Carlos García	carlos@nativetalk.com	$2b$12$MsL0pZxTcqWhoF8QCoTuiO1LHFzrwqrnKyPv4Cen9QhlMQI6oIKEC	teacher	Europe/Madrid	\N	t	f	2026-04-13 15:56:11.242981+02	2026-04-13 15:56:11.242981+02	\N
cb5e51e0-ef93-4fd8-aba1-92a5c0afccbb	Ivan Petrov	ivan@nativetalk.com	$2b$12$2jQGxdpmCBSjwK0AgHgIwezGG5OUTaI2JolRXXvtcfUEnxX66XJPK	teacher	Europe/Sofia	\N	t	f	2026-04-13 15:56:11.812843+02	2026-04-13 15:56:11.812843+02	\N
23a5d34e-e282-485b-b9cd-2b2c3d42371b	Sofia Papadaki	sofia@nativetalk.com	$2b$12$Apao97ARNfeKtZT07Lzd6uMMcLCszaGGzHKRqgAwYiBbPKEh5yMe6	teacher	Europe/Athens	\N	t	f	2026-04-13 15:56:12.433345+02	2026-04-13 15:56:12.433345+02	\N
c8a102a6-1412-441b-8204-76a4111e9887	Ji-Yeon Park	jiyeon@nativetalk.com	$2b$12$PPZNjQIgEv/Sb7Ar.3t8QO9H1OtLHC0FzZvl8OMWVxRV8sGNy3m9G	teacher	Asia/Seoul	\N	t	f	2026-04-13 15:56:13.041779+02	2026-04-13 15:56:13.041779+02	\N
b99a999c-9f55-4c72-80cb-85ecf795e180	Olga Ivanova	olga@nativetalk.com	$2b$12$UXkKT7zmwB9Z2uLPuSm/RepsddwCyYjj9DfiM9.MmsEDgkN0Yi60K	teacher	Europe/Moscow	\N	t	f	2026-04-13 15:56:13.490098+02	2026-04-13 15:56:13.490098+02	\N
fb27e014-2065-4386-8dce-1df7a2add481	Luca Bianchi	luca@nativetalk.com	$2b$12$ZDYGNeDmGdxogmiDGOHBxOsdvYA6EHDARFVkT0EBWzU9ApefI5hha	student	Europe/Rome	\N	t	f	2026-04-13 15:56:14.081362+02	2026-04-13 15:56:14.081362+02	\N
9dc32fb5-7267-4edc-b1f4-5211b263659a	Sara Ahmed	sara@nativetalk.com	$2b$12$87x26Cjj2SteQDq4Mtrl0eOLaK8bjR6KwsxcTjL8CnG4WyN0LgJGC	student	Asia/Dubai	\N	t	f	2026-04-13 15:56:14.684345+02	2026-04-13 15:56:14.684345+02	\N
d30705b2-1f0e-4a11-b770-35106e9bd97e	James Wilson	james@nativetalk.com	$2b$12$.twgbstfGVpjy/2jeJX/.uj8r.FJvOfskqWyNDinG4rFD1CFYNbQK	student	America/New_York	\N	t	f	2026-04-13 15:56:15.181534+02	2026-04-13 15:56:15.181534+02	\N
962a9390-9992-4cc7-8ddd-4e539ed496a3	Yuki Tanaka	yuki@nativetalk.com	$2b$12$1.yixxvRdxrFeEXLlkPnA.ZDNr4FXDhjoTxZu19UkW1ZAE5k3BaWi	student	Asia/Tokyo	\N	t	f	2026-04-13 15:56:15.714436+02	2026-04-13 15:56:15.714436+02	\N
b1c4aa85-319e-4777-a37e-04ef731a6b9a	string	maria@nativetalk.com	$2b$12$81cN6wLqwg.oig7tk9jkOOXvCbdMWNayuM83NOt5o0PKqj3iCyZLq	student	string	\N	t	f	2026-04-06 20:13:09.256051+02	2026-04-06 20:13:09.256051+02	\N
3c036a01-b207-444e-9dbb-ed399350a050	string	user@example.com	$2b$12$OlYgKX/.ErMVu2TGjtihru7toB80zXkuHfBaGsKpS44XnRF3e4HaO	student	string	\N	t	f	2026-04-27 23:23:39.030029+02	2026-04-27 23:23:39.030029+02	\N
\.


--
-- Name: languages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.languages_id_seq', 1, false);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: availability_slots availability_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability_slots
    ADD CONSTRAINT availability_slots_pkey PRIMARY KEY (id);


--
-- Name: course_payments course_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_payments
    ADD CONSTRAINT course_payments_pkey PRIMARY KEY (id);


--
-- Name: exam_answers exam_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_answers
    ADD CONSTRAINT exam_answers_pkey PRIMARY KEY (id);


--
-- Name: exam_attempts exam_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts
    ADD CONSTRAINT exam_attempts_pkey PRIMARY KEY (id);


--
-- Name: exam_questions exam_questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_pkey PRIMARY KEY (id);


--
-- Name: exams exams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_pkey PRIMARY KEY (id);


--
-- Name: languages languages_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_code_key UNIQUE (code);


--
-- Name: languages languages_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_name_key UNIQUE (name);


--
-- Name: languages languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.languages
    ADD CONSTRAINT languages_pkey PRIMARY KEY (id);


--
-- Name: lesson_materials lesson_materials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_pkey PRIMARY KEY (id);


--
-- Name: level_hours level_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.level_hours
    ADD CONSTRAINT level_hours_pkey PRIMARY KEY (level);


--
-- Name: level_pricing level_pricing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.level_pricing
    ADD CONSTRAINT level_pricing_pkey PRIMARY KEY (level);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: paypal_transactions paypal_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paypal_transactions
    ADD CONSTRAINT paypal_transactions_pkey PRIMARY KEY (id);


--
-- Name: reschedule_requests reschedule_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reschedule_requests
    ADD CONSTRAINT reschedule_requests_pkey PRIMARY KEY (id);


--
-- Name: review_flags review_flags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_flags
    ADD CONSTRAINT review_flags_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: session_attendance session_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_attendance
    ADD CONSTRAINT session_attendance_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: student_languages student_languages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_languages
    ADD CONSTRAINT student_languages_pkey PRIMARY KEY (id);


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (id);


--
-- Name: suspensions suspensions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suspensions
    ADD CONSTRAINT suspensions_pkey PRIMARY KEY (id);


--
-- Name: teacher_certificates teacher_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_certificates
    ADD CONSTRAINT teacher_certificates_pkey PRIMARY KEY (id);


--
-- Name: teacher_noshow teacher_noshow_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_noshow
    ADD CONSTRAINT teacher_noshow_pkey PRIMARY KEY (id);


--
-- Name: teacher_verifications teacher_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_verifications
    ADD CONSTRAINT teacher_verifications_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


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
-- Name: availability_slots availability_slots_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.availability_slots
    ADD CONSTRAINT availability_slots_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: course_payments course_payments_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_payments
    ADD CONSTRAINT course_payments_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: course_payments course_payments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_payments
    ADD CONSTRAINT course_payments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: course_payments course_payments_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course_payments
    ADD CONSTRAINT course_payments_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: exam_answers exam_answers_attempt_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_answers
    ADD CONSTRAINT exam_answers_attempt_id_fkey FOREIGN KEY (attempt_id) REFERENCES public.exam_attempts(id);


--
-- Name: exam_answers exam_answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_answers
    ADD CONSTRAINT exam_answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.exam_questions(id);


--
-- Name: exam_attempts exam_attempts_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts
    ADD CONSTRAINT exam_attempts_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: exam_attempts exam_attempts_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_attempts
    ADD CONSTRAINT exam_attempts_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: exam_questions exam_questions_exam_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exam_questions
    ADD CONSTRAINT exam_questions_exam_id_fkey FOREIGN KEY (exam_id) REFERENCES public.exams(id);


--
-- Name: exams exams_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.teachers(id);


--
-- Name: exams exams_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.exams
    ADD CONSTRAINT exams_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: lesson_materials lesson_materials_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: lesson_materials lesson_materials_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lesson_materials
    ADD CONSTRAINT lesson_materials_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id);


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id);


--
-- Name: payments payments_course_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_course_payment_id_fkey FOREIGN KEY (course_payment_id) REFERENCES public.course_payments(id);


--
-- Name: payments payments_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: paypal_transactions paypal_transactions_course_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paypal_transactions
    ADD CONSTRAINT paypal_transactions_course_payment_id_fkey FOREIGN KEY (course_payment_id) REFERENCES public.course_payments(id);


--
-- Name: paypal_transactions paypal_transactions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.paypal_transactions
    ADD CONSTRAINT paypal_transactions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: reschedule_requests reschedule_requests_requested_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reschedule_requests
    ADD CONSTRAINT reschedule_requests_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public.users(id);


--
-- Name: reschedule_requests reschedule_requests_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reschedule_requests
    ADD CONSTRAINT reschedule_requests_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id) ON DELETE CASCADE;


--
-- Name: review_flags review_flags_flagged_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_flags
    ADD CONSTRAINT review_flags_flagged_by_fkey FOREIGN KEY (flagged_by) REFERENCES public.users(id);


--
-- Name: review_flags review_flags_flagged_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.review_flags
    ADD CONSTRAINT review_flags_flagged_user_fkey FOREIGN KEY (flagged_user) REFERENCES public.users(id);


--
-- Name: reviews reviews_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: reviews reviews_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: reviews reviews_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: reviews reviews_written_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_written_by_fkey FOREIGN KEY (written_by) REFERENCES public.users(id);


--
-- Name: session_attendance session_attendance_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_attendance
    ADD CONSTRAINT session_attendance_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: session_attendance session_attendance_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.session_attendance
    ADD CONSTRAINT session_attendance_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sessions sessions_course_payment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_course_payment_id_fkey FOREIGN KEY (course_payment_id) REFERENCES public.course_payments(id);


--
-- Name: sessions sessions_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: sessions sessions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: sessions sessions_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: student_languages student_languages_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_languages
    ADD CONSTRAINT student_languages_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: student_languages student_languages_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.student_languages
    ADD CONSTRAINT student_languages_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: students students_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: suspensions suspensions_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suspensions
    ADD CONSTRAINT suspensions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.students(id);


--
-- Name: suspensions suspensions_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suspensions
    ADD CONSTRAINT suspensions_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: suspensions suspensions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suspensions
    ADD CONSTRAINT suspensions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: teacher_certificates teacher_certificates_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_certificates
    ADD CONSTRAINT teacher_certificates_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teacher_noshow teacher_noshow_session_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_noshow
    ADD CONSTRAINT teacher_noshow_session_id_fkey FOREIGN KEY (session_id) REFERENCES public.sessions(id);


--
-- Name: teacher_noshow teacher_noshow_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_noshow
    ADD CONSTRAINT teacher_noshow_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id);


--
-- Name: teacher_verifications teacher_verifications_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_verifications
    ADD CONSTRAINT teacher_verifications_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: teacher_verifications teacher_verifications_verified_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teacher_verifications
    ADD CONSTRAINT teacher_verifications_verified_by_fkey FOREIGN KEY (verified_by) REFERENCES public.teachers(id);


--
-- Name: teachers teachers_language_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_language_id_fkey FOREIGN KEY (language_id) REFERENCES public.languages(id);


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict BkurHc3mODlsvUj2YeKEzrXsRA1lKyBal4sWNuJzdFfBM9eFiljdpbd9CG2pkvh

