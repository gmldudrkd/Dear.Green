-- ============================================================
-- Dear.Green (Dear Earth) - Initial Database Schema
-- ============================================================

-- ============================================================
-- 1. ENUM TYPES
-- ============================================================

CREATE TYPE meal_level AS ENUM (
  'VEGAN',
  'OVO_LACTO',
  'PESCO',
  'POLLO',
  'FLEXITARIAN'
);

CREATE TYPE meal_type AS ENUM (
  'BREAKFAST',
  'LUNCH',
  'DINNER'
);

-- ============================================================
-- 2. TABLES
-- ============================================================

-- 2.1 profiles: 유저 프로필 (auth.users 확장)
CREATE TABLE profiles (
  id            uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname      text NOT NULL,
  avatar_emoji  text NOT NULL DEFAULT '🌱',
  total_ip      integer NOT NULL DEFAULT 0 CHECK (total_ip >= 0),
  forest_x      real NOT NULL DEFAULT 0,
  forest_y      real NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- 2.2 meal_logs: 식사 기록 (= 피드 아이템)
CREATE TABLE meal_logs (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_date             date NOT NULL DEFAULT CURRENT_DATE,
  meal_type             meal_type NOT NULL,
  meal_level            meal_level NOT NULL,
  compromise_checks     smallint NOT NULL DEFAULT 0 CHECK (compromise_checks BETWEEN 0 AND 2),
  photo_path            text,
  meditation_completed  boolean NOT NULL DEFAULT false,
  auto_message          text,
  ip_earned             integer NOT NULL DEFAULT 0 CHECK (ip_earned >= 0),
  created_at            timestamptz NOT NULL DEFAULT now(),

  UNIQUE (user_id, meal_date, meal_type)
);

-- 2.3 feed_likes: 좋아요
CREATE TABLE feed_likes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id   uuid NOT NULL REFERENCES meal_logs(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),

  UNIQUE (meal_log_id, user_id)
);

-- 2.4 feed_comments: 댓글
CREATE TABLE feed_comments (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_log_id   uuid NOT NULL REFERENCES meal_logs(id) ON DELETE CASCADE,
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  text          text NOT NULL CHECK (char_length(text) BETWEEN 1 AND 500),
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 2.5 ip_transactions: IP 변동 감사 로그
CREATE TABLE ip_transactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  meal_log_id   uuid REFERENCES meal_logs(id) ON DELETE SET NULL,
  amount        integer NOT NULL,
  reason        text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ============================================================
-- 3. INDEXES
-- ============================================================

CREATE INDEX idx_profiles_total_ip ON profiles (total_ip DESC);

CREATE INDEX idx_meal_logs_created_at ON meal_logs (created_at DESC);
CREATE INDEX idx_meal_logs_user_date ON meal_logs (user_id, meal_date DESC);

CREATE INDEX idx_feed_likes_meal_log ON feed_likes (meal_log_id);
CREATE INDEX idx_feed_likes_user_meal ON feed_likes (user_id, meal_log_id);

CREATE INDEX idx_feed_comments_meal_log ON feed_comments (meal_log_id, created_at ASC);

CREATE INDEX idx_ip_transactions_user ON ip_transactions (user_id, created_at DESC);

-- ============================================================
-- 4. HELPER FUNCTIONS
-- ============================================================

-- 4.1 IP → 나무 레벨 계산 (growth.ts getStage 포팅)
CREATE OR REPLACE FUNCTION get_tree_level(ip integer)
RETURNS smallint
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT CASE
    WHEN ip >= 3001 THEN 5
    WHEN ip >= 1501 THEN 4
    WHEN ip >= 501  THEN 3
    WHEN ip >= 101  THEN 2
    ELSE 1
  END::smallint;
$$;

-- 4.2 식사 IP 계산 (MealLogModal.tsx 로직 포팅)
CREATE OR REPLACE FUNCTION calculate_meal_ip(
  p_meal_level meal_level,
  p_compromise_checks smallint,
  p_has_photo boolean,
  p_meditation_completed boolean
)
RETURNS integer
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT
    (CASE p_meal_level
      WHEN 'VEGAN'        THEN 30
      WHEN 'OVO_LACTO'    THEN 25
      WHEN 'PESCO'        THEN 20
      WHEN 'POLLO'        THEN 15
      WHEN 'FLEXITARIAN'  THEN 10
    END)
    + (p_compromise_checks * 3)
    + (CASE WHEN p_has_photo THEN 5 ELSE 0 END)
    + (CASE WHEN p_meditation_completed THEN 5 ELSE 0 END);
$$;

-- ============================================================
-- 5. TRIGGERS
-- ============================================================

-- 5.1 식사 기록 INSERT 시 IP 자동 계산 + profiles.total_ip 갱신
CREATE OR REPLACE FUNCTION handle_meal_log_insert()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_ip integer;
BEGIN
  v_ip := calculate_meal_ip(
    NEW.meal_level,
    NEW.compromise_checks,
    NEW.photo_path IS NOT NULL,
    NEW.meditation_completed
  );

  NEW.ip_earned := v_ip;

  UPDATE profiles
  SET total_ip = total_ip + v_ip,
      updated_at = now()
  WHERE id = NEW.user_id;

  INSERT INTO ip_transactions (user_id, meal_log_id, amount, reason)
  VALUES (
    NEW.user_id,
    NEW.id,
    v_ip,
    'meal:' || NEW.meal_level::text
      || CASE WHEN NEW.compromise_checks > 0 THEN ',compromise:' || NEW.compromise_checks ELSE '' END
      || CASE WHEN NEW.photo_path IS NOT NULL THEN ',photo' ELSE '' END
      || CASE WHEN NEW.meditation_completed THEN ',meditation' ELSE '' END
  );

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_meal_log_insert
  BEFORE INSERT ON meal_logs
  FOR EACH ROW
  EXECUTE FUNCTION handle_meal_log_insert();

-- 5.2 회원가입 시 프로필 자동 생성
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, nickname, avatar_emoji, forest_x, forest_y)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nickname', '새로운 씨앗'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '🌱'),
    (random() * 16 - 8)::real,
    (random() * 10 - 5)::real
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 6. VIEWS
-- ============================================================

-- 6.1 feed_view: FeedItem 인터페이스 매칭
CREATE OR REPLACE VIEW feed_view AS
SELECT
  ml.id,
  ml.user_id,
  p.nickname,
  p.avatar_emoji,
  ml.meal_type,
  ml.meal_level,
  ml.photo_path,
  ml.auto_message,
  ml.ip_earned,
  ml.created_at,
  COALESCE(lc.like_count, 0) AS likes,
  COALESCE(cc.comment_count, 0) AS comment_count
FROM meal_logs ml
JOIN profiles p ON p.id = ml.user_id
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS like_count FROM feed_likes fl WHERE fl.meal_log_id = ml.id
) lc ON true
LEFT JOIN LATERAL (
  SELECT COUNT(*) AS comment_count FROM feed_comments fc WHERE fc.meal_log_id = ml.id
) cc ON true
ORDER BY ml.created_at DESC;

-- 6.2 forest_view: ForestUser 인터페이스 매칭
CREATE OR REPLACE VIEW forest_view AS
SELECT
  p.id,
  p.nickname,
  p.avatar_emoji,
  get_tree_level(p.total_ip) AS tree_level,
  p.total_ip AS ip,
  p.forest_x AS x,
  p.forest_y AS y,
  EXTRACT(DAY FROM now() - p.created_at)::integer AS joined_days_ago,
  (
    SELECT ml.meal_level
    FROM meal_logs ml
    WHERE ml.user_id = p.id
    ORDER BY ml.created_at DESC
    LIMIT 1
  ) AS meal_level
FROM profiles p;

-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feed_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ip_transactions ENABLE ROW LEVEL SECURITY;

-- profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- meal_logs
CREATE POLICY "Meal logs are viewable by everyone"
  ON meal_logs FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own meal logs"
  ON meal_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal logs"
  ON meal_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal logs"
  ON meal_logs FOR DELETE
  USING (auth.uid() = user_id);

-- feed_likes
CREATE POLICY "Likes are viewable by everyone"
  ON feed_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON feed_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON feed_likes FOR DELETE
  USING (auth.uid() = user_id);

-- feed_comments
CREATE POLICY "Comments are viewable by everyone"
  ON feed_comments FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own comments"
  ON feed_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON feed_comments FOR DELETE
  USING (auth.uid() = user_id);

-- ip_transactions
CREATE POLICY "Users can view own transactions"
  ON ip_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- ============================================================
-- 8. STORAGE (meal-photos 버킷)
-- ============================================================
-- Note: 버킷 생성은 Supabase Dashboard 또는 아래 SQL로 수행

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'meal-photos',
  'meal-photos',
  false,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

CREATE POLICY "Users can upload own meal photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'meal-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Anyone can view meal photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'meal-photos');

CREATE POLICY "Users can delete own meal photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'meal-photos'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
