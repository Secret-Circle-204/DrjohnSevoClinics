import * as migration_20260917_224816_phase3_schema from './20260917_224816_phase3_schema';
import * as migration_20260917_233253_public_content_system from './20260917_233253_public_content_system';
import * as migration_20260917_234746_cleanup_treatments_and_youtube from './20260917_234746_cleanup_treatments_and_youtube';
import * as migration_20260918_003214_phase5_client_foundation from './20260918_003214_phase5_client_foundation';
import * as migration_20260918_004426_phase6_appointment_foundation from './20260918_004426_phase6_appointment_foundation';
import * as migration_20260918_005931_phase7_followup_foundation from './20260918_005931_phase7_followup_foundation';

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
    name: '20260918_005931_phase7_followup_foundation'
  },
];
