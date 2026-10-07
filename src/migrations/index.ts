import * as migration_20260917_224816_phase3_schema from './20260917_224816_phase3_schema';
import * as migration_20260917_233253_public_content_system from './20260917_233253_public_content_system';
import * as migration_20260917_234746_cleanup_treatments_and_youtube from './20260917_234746_cleanup_treatments_and_youtube';
import * as migration_20260918_003214_phase5_client_foundation from './20260918_003214_phase5_client_foundation';
import * as migration_20260918_004426_phase6_appointment_foundation from './20260918_004426_phase6_appointment_foundation';
import * as migration_20260918_005931_phase7_followup_foundation from './20260918_005931_phase7_followup_foundation';
import * as migration_20261002_184742_phase8_consultation_foundation from './20261002_184742_phase8_consultation_foundation';
import * as migration_20261002_191829_phase9_reports_foundation from './20261002_191829_phase9_reports_foundation';
import * as migration_20261002_201213_phase10_email_outbox from './20261002_201213_phase10_email_outbox';
import * as migration_20261002_224057_phase11_public_content_model from './20261002_224057_phase11_public_content_model';
import * as migration_20261003_001500_phase10_inquiries_email_required from './20261003_001500_phase10_inquiries_email_required';
import * as migration_20261006_220000_separate_clinical_strengths_and_why_choose from './20261006_220000_separate_clinical_strengths_and_why_choose';

export const migrations = [
  {
    up: migration_20260917_224816_phase3_schema.up,
    down: migration_20260917_224816_phase3_schema.down,
    name: '20260917_224816_phase3_schema',
  },
  {
    up: migration_20260917_233253_public_content_system.up,
    down: migration_20260917_233253_public_content_system.down,
    name: '20260917_233253_public_content_system',
  },
  {
    up: migration_20260917_234746_cleanup_treatments_and_youtube.up,
    down: migration_20260917_234746_cleanup_treatments_and_youtube.down,
    name: '20260917_234746_cleanup_treatments_and_youtube',
  },
  {
    up: migration_20260918_003214_phase5_client_foundation.up,
    down: migration_20260918_003214_phase5_client_foundation.down,
    name: '20260918_003214_phase5_client_foundation',
  },
  {
    up: migration_20260918_004426_phase6_appointment_foundation.up,
    down: migration_20260918_004426_phase6_appointment_foundation.down,
    name: '20260918_004426_phase6_appointment_foundation',
  },
  {
    up: migration_20260918_005931_phase7_followup_foundation.up,
    down: migration_20260918_005931_phase7_followup_foundation.down,
    name: '20260918_005931_phase7_followup_foundation',
  },
  {
    up: migration_20261002_184742_phase8_consultation_foundation.up,
    down: migration_20261002_184742_phase8_consultation_foundation.down,
    name: '20261002_184742_phase8_consultation_foundation',
  },
  {
    up: migration_20261002_191829_phase9_reports_foundation.up,
    down: migration_20261002_191829_phase9_reports_foundation.down,
    name: '20261002_191829_phase9_reports_foundation',
  },
  {
    up: migration_20261002_201213_phase10_email_outbox.up,
    down: migration_20261002_201213_phase10_email_outbox.down,
    name: '20261002_201213_phase10_email_outbox',
  },
  {
    up: migration_20261002_224057_phase11_public_content_model.up,
    down: migration_20261002_224057_phase11_public_content_model.down,
    name: '20261002_224057_phase11_public_content_model',
  },
  {
    up: migration_20261003_001500_phase10_inquiries_email_required.up,
    down: migration_20261003_001500_phase10_inquiries_email_required.down,
    name: '20261003_001500_phase10_inquiries_email_required'
  },
  {
    up: migration_20261006_220000_separate_clinical_strengths_and_why_choose.up,
    down: migration_20261006_220000_separate_clinical_strengths_and_why_choose.down,
    name: '20261006_220000_separate_clinical_strengths_and_why_choose'
  },
];
