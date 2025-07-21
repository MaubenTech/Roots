-- Create link_identifiers table (updated structure without is_test column)
CREATE TABLE IF NOT EXISTS link_identifiers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tracking_number INTEGER,
  uuid TEXT UNIQUE NOT NULL,
  is_vip BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key column to rsvps table if it doesn't exist
-- Note: This will be handled by the setup script to check if column exists first

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_link_identifiers_uuid ON link_identifiers(uuid);
CREATE INDEX IF NOT EXISTS idx_link_identifiers_vip ON link_identifiers(is_vip);
CREATE INDEX IF NOT EXISTS idx_link_identifiers_tracking ON link_identifiers(tracking_number);
CREATE INDEX IF NOT EXISTS idx_rsvps_link_identifier ON rsvps(link_identifier_id);

-- Production UUIDs (50 total - first 20 VIP, last 30 Regular)
INSERT OR IGNORE INTO link_identifiers (tracking_number, uuid, is_vip) VALUES
-- VIP identifiers (1-20)
(1, 'fbf0ae67-c05a-482f-b6ea-5aafb45df8fa', 1),
(2, 'ad484522-ea04-4eac-ad12-76580e5cda30', 1),
(3, '7d1e59f9-2f4a-46b6-9988-c75cf2c77e6c', 1),
(4, '5709f3c0-30f0-4164-be35-6e17d3077405', 1),
(5, '474ab054-a68b-4f57-b5f4-994a596124b7', 1),
(6, '1ce71c1d-8366-457a-a8a3-0846ec3c1d33', 1),
(7, 'b64f7b4c-57f4-4cc3-bc09-ed0b8c5d02ef', 1),
(8, '735235bc-b922-4a43-ba82-b2ede1e0e3f3', 1),
(9, '7bb04c9a-41fc-400c-9e05-070b9884659f', 1),
(10, 'f2175845-57b4-496e-befc-5dfc2d80a10e', 1),
(11, 'f71c61b0-d371-4707-9dd9-a19eed79eb72', 1),
(12, '10b99cff-49c2-4fab-889a-b559304d29d2', 1),
(13, '6721b817-b386-4817-8579-1637c82a9a6c', 1),
(14, 'b3a87696-360f-4bea-92b3-270f610cd4a2', 1),
(15, 'adc94b11-c6ae-499c-ae91-3b7821cc6a33', 1),
(16, 'a936478b-9e75-4889-9d55-24a205ba5daf', 1),
(17, '213b50b8-d29a-4378-82b6-d9e1fe0550c8', 1),
(18, 'b7f88087-b069-431b-a1c6-a519bbb14204', 1),
(19, '7c747f93-da6d-413e-a21c-b016e17421b2', 1),
(20, '9cd184f1-dd5b-47ab-9840-31b53fba3ab3', 1),

-- Regular identifiers (21-50)
(21, '3400727d-7363-44d5-8210-011d08582824', 0),
(22, '62c22be9-4682-4962-81dc-568350c5de95', 0),
(23, '5f14538a-f294-4266-b50a-d63b8b047950', 0),
(24, 'fd086636-ff20-4b37-8065-ee1ff851a86d', 0),
(25, 'b5375e88-d239-4984-a933-b7ffe63c72b0', 0),
(26, 'e59bb81b-aac3-4f6a-baae-5735afe9c555', 0),
(27, '8716cd57-09f0-47e4-8e08-948aae321c28', 0),
(28, '9a679d57-23ea-4c7c-944f-d86afcb0ac68', 0),
(29, '273f46ff-8b0a-4ea1-8a25-c0c6cf1f4a00', 0),
(30, 'ffc6def6-07f9-4bbb-aa99-9a73cf3a8b06', 0),
(31, '15d3bedf-fa46-46af-a80d-6455940f11e9', 0),
(32, 'a520f455-91be-4f21-9d02-915677cf3aaa', 0),
(33, '2ba40edb-bd5f-4282-afb6-0b59640d02b2', 0),
(34, 'a8983b38-961a-49bc-ae83-29829edfeba0', 0),
(35, 'ccac2002-9bad-4305-9b22-6d8c1547ecd2', 0),
(36, '44932875-9ff1-497c-9c41-ae3af95bb0ae', 0),
(37, '65a75f69-553e-4fed-b699-802e3f647497', 0),
(38, 'a8bb6f96-7515-4e7d-b18c-48be7f0c0a4d', 0),
(39, '5f26b775-8176-42b2-ba9d-fd82f1aaa8bd', 0),
(40, '5306b1d5-8e83-430f-ad69-442fa06ca310', 0),
(41, '8a56a583-7505-4881-9d5a-4e76ad557b0f', 0),
(42, 'acd5241f-7860-40ad-af7a-75046ab167bb', 0),
(43, '258d934d-d24f-483e-b1d6-b701dcd8b7c7', 0),
(44, '402bec39-4feb-4175-9eb8-0f9968e9c503', 0),
(45, '9a02459e-987a-4863-8bf6-1ca22ecd56b8', 0),
(46, 'aa292d12-ab23-4cc1-a8aa-1feee8b0a563', 0),
(47, '83f12eb8-5ca8-4c33-a73e-2dd725dcfa45', 0),
(48, '8b740e57-ffd3-4511-b091-e823fa115848', 0),
(49, '2197ee0a-547d-4de9-bce4-a4deaa32dbe0', 0),
(50, '112f33ed-1877-4231-a171-bd6197087c8f', 0),

-- Test identifiers (1000+)
(1001, 'test-vip-001-fbf0ae67-c05a-482f-b6ea-5aafb45df8fa', 1),
(1002, 'test-vip-002-ad484522-ea04-4eac-ad12-76580e5cda30', 1),
(1003, 'test-vip-003-7d1e59f9-2f4a-46b6-9988-c75cf2c77e6c', 1),
(1004, 'test-reg-001-e59bb81b-aac3-4f6a-baae-5735afe9c555', 0),
(1005, 'test-reg-002-8716cd57-09f0-47e4-8e08-948aae321c28', 0),
(1006, 'test-reg-003-9a679d57-23ea-4c7c-944f-d86afcb0ac68', 0);
