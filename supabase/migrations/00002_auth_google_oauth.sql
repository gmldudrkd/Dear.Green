-- ============================================================
-- Google OAuth 지원을 위한 스키마 업데이트
-- ============================================================

-- 1. profiles 테이블에 avatar_url 컬럼 추가 (Google 프로필 사진)
ALTER TABLE profiles ADD COLUMN avatar_url text;

-- 2. handle_new_user 트리거 함수 업데이트
--    Google OAuth 메타데이터(full_name, avatar_url) 지원
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO profiles (id, nickname, avatar_emoji, avatar_url, forest_x, forest_y)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nickname',     -- 수동 가입
      NEW.raw_user_meta_data->>'full_name',     -- Google OAuth
      NEW.raw_user_meta_data->>'name',          -- Google OAuth 폴백
      '새로운 씨앗'                               -- 기본값
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_emoji', '🌱'),
    NEW.raw_user_meta_data->>'avatar_url',       -- Google 프로필 사진 (nullable)
    (random() * 16 - 8)::real,
    (random() * 10 - 5)::real
  );
  RETURN NEW;
END;
$$;
