-- Migration 000: Auth Helper Functions
-- Run this FIRST before other migrations
-- This creates helper functions needed by RLS policies

-- ============================================================================
-- HELPER FUNCTION: Get user's organization ID
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.user_organization_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id
  FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auth.user_organization_id() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_organization_id() TO service_role;

-- ============================================================================
-- HELPER FUNCTION: Get user's role
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role
  FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auth.user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.user_role() TO service_role;

-- ============================================================================
-- HELPER FUNCTION: Check if user is admin
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role IN ('admin', 'manager', 'director')
  FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auth.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.is_admin() TO service_role;

-- ============================================================================
-- HELPER FUNCTION: Check if user can manage rules
-- ============================================================================

CREATE OR REPLACE FUNCTION auth.can_manage_rules()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role IN ('admin', 'manager', 'director')
  FROM public.users
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION auth.can_manage_rules() TO authenticated;
GRANT EXECUTE ON FUNCTION auth.can_manage_rules() TO service_role;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Auth helper functions created successfully!';
  RAISE NOTICE '  - auth.user_organization_id()';
  RAISE NOTICE '  - auth.user_role()';
  RAISE NOTICE '  - auth.is_admin()';
  RAISE NOTICE '  - auth.can_manage_rules()';
  RAISE NOTICE '';
  RAISE NOTICE 'Now run migration 001_phase1_commission_rules_system.sql';
END $$;
