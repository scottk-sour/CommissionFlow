-- =====================================================
-- PHASE 1A: SEED DEFAULT COMMISSION RULES
-- Migration: 002
-- Description: Create default rules matching current hardcoded logic
-- =====================================================

-- This script creates default commission rules for all existing organizations
-- These rules replicate the current hardcoded behavior:
-- - Telesales: 10% of initial profit
-- - BDM/Team Lead: £3,500 monthly threshold with deficit carryover

DO $$
DECLARE
  org RECORD;
  telesales_rule_id UUID;
  team_lead_rule_id UUID;
BEGIN
  RAISE NOTICE 'Seeding default commission rules...';
  RAISE NOTICE '';

  -- Loop through all organizations
  FOR org IN SELECT id, name, bdm_threshold_amount, bdm_commission_rate FROM organizations
  LOOP
    RAISE NOTICE 'Processing organization: %', org.name;

    -- =====================================================
    -- Rule 1: Telesales Base Commission (10%)
    -- =====================================================
    INSERT INTO commission_rules (
      organization_id,
      name,
      description,
      rule_type,
      applies_to_role,
      active,
      effective_from,
      config,
      priority,
      stacking_behavior,
      is_absolute,
      created_by
    ) VALUES (
      org.id,
      'Telesales Base Commission (10%)',
      'Standard 10% commission on initial profit for all sales reps. Migrated from legacy system.',
      'percentage',
      'sales_rep',  -- Will apply after role migration (telesales → sales_rep)
      true,
      '2020-01-01',  -- Retroactive to capture all historical data
      jsonb_build_object('rate', 0.10),  -- 10%
      0,  -- Base priority
      'replace',  -- Can be overridden by higher priority rules
      false,  -- Not absolute
      NULL  -- System-created
    )
    RETURNING id INTO telesales_rule_id;

    RAISE NOTICE '  ✅ Created: Telesales Base (10%) - Rule ID: %', telesales_rule_id;

    -- =====================================================
    -- Rule 2: Team Lead Threshold Commission
    -- =====================================================
    INSERT INTO commission_rules (
      organization_id,
      name,
      description,
      rule_type,
      applies_to_role,
      active,
      effective_from,
      config,
      priority,
      stacking_behavior,
      is_absolute,
      created_by
    ) VALUES (
      org.id,
      'Team Lead Threshold Commission (£3,500)',
      'Monthly threshold of £3,500 with deficit carryover. Must exceed threshold to earn commission. Migrated from legacy BDM system.',
      'threshold',
      'team_lead',  -- Will apply after role migration (bdm → team_lead)
      true,
      '2020-01-01',
      jsonb_build_object(
        'threshold', COALESCE(org.bdm_threshold_amount, 350000),  -- £3,500 in pence (or org override)
        'rate', COALESCE(org.bdm_commission_rate, 1.0),  -- 100% of excess (or org override)
        'carry_deficit', true,  -- Deficit carries to next month
        'calculation_base', 'remaining_profit'  -- Calculate from remaining profit after telesales commission
      ),
      0,  -- Base priority
      'replace',
      false,
      NULL
    )
    RETURNING id INTO team_lead_rule_id;

    RAISE NOTICE '  ✅ Created: Team Lead Threshold (£%.2f) - Rule ID: %',
      COALESCE(org.bdm_threshold_amount, 350000)::DECIMAL / 100,
      team_lead_rule_id;

    RAISE NOTICE '';
  END LOOP;

  RAISE NOTICE '🎉 Default rules seeded for all organizations!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '  1. Migrate user roles (telesales → sales_rep, bdm → team_lead)';
  RAISE NOTICE '  2. Enable flexible rules: UPDATE organizations SET use_flexible_rules = true WHERE id = ''your-org-id'';';
  RAISE NOTICE '  3. Test calculations with new engine';
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify rules were created:
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '📊 Verification Summary:';
  RAISE NOTICE '';
END $$;

SELECT
  o.name AS organization,
  COUNT(cr.id) AS rules_count,
  json_agg(
    json_build_object(
      'name', cr.name,
      'type', cr.rule_type,
      'role', cr.applies_to_role,
      'active', cr.active
    ) ORDER BY cr.priority DESC
  ) AS rules
FROM organizations o
LEFT JOIN commission_rules cr ON cr.organization_id = o.id
GROUP BY o.id, o.name
ORDER BY o.name;

-- Expected result: Each organization should have 2 rules
-- If you see 0 rules for an org, the seed script didn't run properly
