-- First, clear existing sample data (maintaining order due to foreign keys)
DELETE FROM vendor_price_history;
DELETE FROM purchase_orders;
DELETE FROM material_vendors;
DELETE FROM materials;
DELETE FROM vendors;

-- Insert unique vendors from the data
INSERT INTO vendors (vendor_code, name, business_partner) VALUES
('1101009109', 'SCOT FORGE', 'Not assigned'),
('1100005675', 'Patriot Forge Corporation', 'Not assigned'),
('1100002397', 'MERIDIAN MANUFACTURING', 'Not assigned'),
('1100002761', 'DUTCHESS METAL SUPPLY CORP', 'Not assigned'),
('1100002488', 'FASTENAL INDUSTRIAL SUPPLIES', 'Not assigned'),
('1100002491', 'STERLING SEAL & SUPPLY INC.', 'Not assigned'),
('1100001964', 'MC MASTER-CARR SUPPLY COMPANY', 'Not assigned'),
('1100000282', 'MIBA INDUSTRIAL BEARINGS U.S. LLC', 'Not assigned'),
('1100001119', 'RINGFEDER CORPORATION', 'Not assigned'),
('1100003070', 'SPIROL INTERNATIONAL CORP', 'Not assigned'),
('1100003101', 'A.L. HYDE COMPANY', 'Not assigned'),
('1100002681', 'SKF USA INC', 'Not assigned'),
('1100003054', 'NATIONAL BRONZE MANUFACTURING CO.', 'Not assigned'),
('1100001380', 'PRECISION CASTPARTS CORP', 'Not assigned'),
('1100002995', 'APPLIED INDUSTRIAL TECHNOLOGIES', 'Not assigned'),
('1100001371', 'WAUKESHA BEARINGS', 'Not assigned'),
('1100005765', 'GRAPHITE METALLIZING CORP', 'Not assigned'),
('1100001103', 'ELLWOOD TEXAS FORGE', 'Not assigned'),
('1100003140', 'CIRCLE SEAL CONTROLS INC', 'Not assigned'),
('1100001960', 'CARPENTER TECHNOLOGY CORP', 'Not assigned'),
('1100002392', 'HYDRO-PAC INC.', 'Not assigned'),
('1100003087', 'JOHN CRANE INC', 'Not assigned'),
('1100003283', 'PARKER HANNIFIN CORP', 'Not assigned'),
('1100001073', 'OMEGA ENGINEERING INC', 'Not assigned'),
('1100002956', 'THERMON MANUFACTURING COMPANY', 'Not assigned'),
('1100003172', 'CONSOLIDATED AEROSPACE MFG LLC', 'Not assigned'),
('1100002680', 'SWAGELOK CO', 'Not assigned'),
('1100005704', 'DAEMAR INC', 'Not assigned'),
('1100002741', 'FLOWSERVE CORPORATION', 'Not assigned'),
('1100002748', 'ROPER PUMP COMPANY', 'Not assigned'),
('1100001095', 'ITT CORPORATION', 'Not assigned'),
('1100003184', 'G.S. PRECISION INC', 'Not assigned'),
('1100002689', 'HENKEL CORPORATION', 'Not assigned'),
('1100001086', 'SANDVIK MATERIALS TECHNOLOGY', 'Not assigned'),
('1100002649', 'ACUITY BRANDS INC', 'Not assigned'),
('1100003293', 'GARLOCK SEALING TECHNOLOGIES', 'Not assigned'),
('1100002984', 'OERLIKON METCO (US) INC', 'Not assigned'),
('1100001402', 'HOERBIGER CORPORATION', 'Not assigned'),
('1100002557', 'ADVANCED THERMAL SCIENCES', 'Not assigned'),
('1100003299', 'R.L. HUDSON & COMPANY', 'Not assigned'),
('1100003023', 'SUPER ALLOY INDUSTRIAL CO LTD', 'Not assigned'),
('1100001342', 'METALCRAFT PRECISION PRODUCTS', 'Not assigned'),
('1100002714', 'EMERSON ELECTRIC CO', 'Not assigned'),
('1100001247', 'WHITFORD CORPORATION', 'Not assigned'),
('1100003064', 'TELEDYNE TECHNOLOGIES INC', 'Not assigned'),
('1100002567', 'GRAINGER', 'Not assigned'),
('1100001392', 'SPIRAX SARCO INC', 'Not assigned'),
('1100003021', 'PRAXAIR INC', 'Not assigned'),
('1100002997', 'MOTION INDUSTRIES INC', 'Not assigned');

-- Insert materials from the data (using existing schema columns only)
INSERT INTO materials (material_number, basic_material, description, material_group, material_type, size_dimension, company_created, created_by, created_on, changed_by, changed_on) VALUES
('1314217581', '15-5PH PER WI-', 'IMPELLER FORGING', 'IMPELLER FORGING', 'ZRH4', '29.00" DIA', 'Atlas Copco Comptec LLC', 'TBI-HEIJERE', '2025-09-29', 'GAP-ENOVIA', '2025-10-01'),
('1314214314', '15-5PH Per WI-', 'IMPELLER, FORGING', 'IMPELLER,', 'ZRH4', '27.0', 'Atlas Copco Comptec LLC', 'TBI-HEIJERE', '2025-05-23', 'GAP-ENOVIA', '2025-06-03'),
('1314209582', '17-4 PH SS', 'ROTOR SLEEVE', 'ROTOR', 'ZHB3', 'LABY 2.00"ID 2.34"OD W/ SLNG CCW', 'Atlas Copco Comptec LLC', 'TBI-LLAZEUS', '2025-02-03', 'GAP-ENOVIA', '2025-03-19'),
('1314216306', '17-4 PH SS CON', 'ROUND BAR', 'ROUND BAR', 'ZRH4', '2.50 DIA W/ 1-1/4 HOLE CERT REQD', 'Atlas Copco Comptec LLC', 'TBI-DUDDAVI', '2025-08-07', 'TBI-GRUDONN', '2025-08-12'),
('1314217591', '17-4 PH SS CON', 'ROUND BAR', 'ROUND BAR', 'ZRH4', '2.50 DIA W/ 1-1/4 HOLE CERT REQD', 'Atlas Copco Comptec LLC', 'TBI-DUDDAVI', '2025-09-30', 'TBI-GRUDONN', '2025-11-05'),
('1314209864', '17-7 PH SS', 'WASHER, SPRING', 'WASHER,', 'ZRH8', '5/8 DIA 10F112177 MTR 3.1/USA MA', 'INEA', 'INE-SHIABHI', '2025-02-17', 'GAP-ENOVIA', '2025-03-06'),
('1314209869', '17-7 PH SS', 'WASHER, SPRING', 'WASHER,', 'ZRH8', '7/8 DIA 14F150177 MTR 3.1/USA MA', 'INEA', 'INE-SHIABHI', '2025-02-17', 'GAP-ENOVIA', '2025-03-06'),
('1314209881', '17-7 PH SS', 'WASHER, SPRING', 'WASHER,', 'ZRH8', '1-1/8 DIA 18F187177 MTR 3.1/USA', 'INEA', 'INE-SHIABHI', '2025-02-17', 'GAP-ENOVIA', '2025-03-06'),
('1314209873', '17-7 PH SS', 'WASHER, SPRING', 'WASHER,', 'ZRH8', 'FLG 1" SS SOLON MTR 3.1/USA MATE', 'INEA', 'INE-SHIABHI', '2025-02-17', 'GAP-ENOVIA', '2025-03-06'),
('1314209886', '17-7 PH SS', 'WASHER, SPRING', 'WASHER,', 'ZRH8', '1-1/4 DIA MTR 3.1/USA MATERIAL', 'INEA', 'INE-SHIABHI', '2025-02-17', 'GAP-ENOVIA', '2025-03-06'),
('1314217076', '17-7 PH SS', 'CURVED SPRING WASHER', 'CURVED SPRING WASHER', 'ZRH8', '7/8 DIA 14H168177', 'Atlas Copco Comptec LLC', 'TBI-BERJOHN', '2025-08-27', 'GAP-ENOVIA', '2025-09-03'),
('1314217640', '17-7 PH SS', 'CONICAL SPRING WASHER', 'CONICAL SPRING WASHER', 'ZRH8', '7/16-14 SOLON 7H89177', 'Atlas Copco Comptec LLC', 'TBI-MORJACO', '2025-10-01', 'GAP-ENOVIA', '2025-11-03'),
('1314212985', '18-8 SS', 'SCREW, SLOTTED PAN HD', 'SCREW,', 'ZRH8', '6-32 X .44', 'Atlas Copco Comptec LLC', 'TBI-GIGJACK', '2025-04-11', 'ENG-BATCH', '2025-04-12'),
('1314215506', '18-8 SS', 'CROSS RECESS PAN HEAD SCREW', 'CROSS RECESS PAN HEAD SCREW', 'ZRH8', '#2 X 0.25" PAN HEAD PHILLIPS', 'Atlas Copco Comptec LLC', 'TBI-STOMATT', '2025-07-09', 'ENG-BATCH', '2025-07-10'),
('1314209763', '18-8 SS', 'SCREW, BUTTON HEAD', 'SCREW,', 'ZRH8', '1/4"-20 X 0.500" LG HEX DRIVE', 'Atlas Copco Comptec LLC', 'TBI-WILTRIS', '2025-02-13', 'GAP-ENOVIA', '2025-03-06'),
('1314212551', '18-8 SS', 'SEAL, WASHER', 'SEAL,', 'ZRH8', 'M10, SS/SILICONE RUBBER', 'Atlas Copco Comptec LLC', 'TBI-MANDAN', '2025-03-20', 'GAP-ENOVIA', '2025-04-07'),
('1314212906', '18-8 SS', 'SCREW, BUTTON HEAD', 'SCREW,', 'ZRH8', '#12-28 X 0.5" LG', 'Atlas Copco Comptec LLC', 'TBI-WILTRIS', '2025-04-10', 'GAP-ENOVIA', '2025-04-11'),
('1314212554', '18-8 SS', 'SEAL, WASHER', 'SEAL,', 'ZRH8', '#6, SS/SILICONE RUBBER', 'Atlas Copco Comptec LLC', 'TBI-MANDAN', '2025-03-20', 'GAP-ENOVIA', '2025-04-14'),
('1314213001', '304 SS', 'PIPE, SEAMLESS', 'PIPE,', 'ZRH4', '1/2" SCH 80', 'Atlas Copco Comptec LLC', 'TBI-BERJOHN', '2025-04-01', 'GAP-ENOVIA', '2025-04-15'),
('1314212890', '316 SS', 'TUBE, SEAMLESS', 'TUBE,', 'ZRH4', '1/4" OD X .035 WALL', 'Atlas Copco Comptec LLC', 'TBI-MANDAN', '2025-03-25', 'GAP-ENOVIA', '2025-04-10'),
('1314214500', '4140 STEEL', 'SHAFT, FORGING', 'SHAFT,', 'ZRH4', '6.00" DIA X 48" LG', 'Atlas Copco Comptec LLC', 'TBI-HEIJERE', '2025-06-01', 'GAP-ENOVIA', '2025-06-15'),
('1314215100', '4340 STEEL', 'GEAR BLANK', 'GEAR,', 'ZRH4', '12.00" OD X 4.00" THICK', 'Atlas Copco Comptec LLC', 'TBI-DUDDAVI', '2025-06-20', 'GAP-ENOVIA', '2025-07-01'),
('1314213500', 'INCONEL 625', 'PLATE', 'PLATE,', 'ZRH4', '0.500" X 12" X 24"', 'Atlas Copco Comptec LLC', 'TBI-WILTRIS', '2025-04-15', 'GAP-ENOVIA', '2025-05-01'),
('1314214200', 'HASTELLOY C276', 'ROUND BAR', 'ROUND BAR', 'ZRH4', '2.00" DIA', 'Atlas Copco Comptec LLC', 'TBI-STOMATT', '2025-05-10', 'GAP-ENOVIA', '2025-05-25'),
('1314215800', 'TITANIUM GR5', 'FORGING', 'FORGING,', 'ZRH4', '8.00" DIA DISC', 'Atlas Copco Comptec LLC', 'TBI-HEIJERE', '2025-07-15', 'GAP-ENOVIA', '2025-08-01'),
('1314216100', 'BRONZE C93200', 'BEARING', 'BEARING,', 'ZRH8', '4.00" ID X 5.00" OD X 3.00" LG', 'Atlas Copco Comptec LLC', 'TBI-LLAZEUS', '2025-07-25', 'GAP-ENOVIA', '2025-08-10'),
('1314216500', 'BABBITT', 'BEARING SHELL', 'BEARING,', 'ZHB3', 'JOURNAL 6.00" DIA', 'Atlas Copco Comptec LLC', 'TBI-MORJACO', '2025-08-10', 'GAP-ENOVIA', '2025-08-25'),
('1314217000', 'PTFE', 'SEAL RING', 'SEAL,', 'ZRH8', '3.00" ID X 3.50" OD', 'Atlas Copco Comptec LLC', 'TBI-GIGJACK', '2025-08-20', 'GAP-ENOVIA', '2025-09-05'),
('1314217200', 'VITON', 'O-RING', 'SEAL,', 'ZRH8', '-325 AS568', 'Atlas Copco Comptec LLC', 'TBI-BERJOHN', '2025-09-01', 'GAP-ENOVIA', '2025-09-15'),
('1314217400', 'GRAPHITE', 'PACKING RING', 'SEAL,', 'ZRH8', '2.00" ID X 2.50" OD', 'Atlas Copco Comptec LLC', 'TBI-MANDAN', '2025-09-10', 'GAP-ENOVIA', '2025-09-25');

-- Insert purchase orders linking materials and vendors
INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45834338', '10', 'US02', 'Comptec', m.id, v.id, 1, 1, 36139.10, 14, '2025-09-29'
FROM materials m, vendors v 
WHERE m.material_number = '1314217581' AND v.vendor_code = '1101009109';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45821142', '10', 'US02', 'Comptec', m.id, v.id, 1, 1, 21820.12, 15, '2025-05-23'
FROM materials m, vendors v 
WHERE m.material_number = '1314214314' AND v.vendor_code = '1100005675';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45814091', '60', 'US02', 'Comptec', m.id, v.id, 1, 1, 850.00, 1, '2025-02-03'
FROM materials m, vendors v 
WHERE m.material_number = '1314209582' AND v.vendor_code = '1100002397';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45827470', '20', 'US02', 'Comptec', m.id, v.id, 1, 1, 2700.00, 36, '2025-08-07'
FROM materials m, vendors v 
WHERE m.material_number = '1314216306' AND v.vendor_code = '1100002761';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45811503', '170', 'US02', 'Comptec', m.id, v.id, 1, 1, 63.68, 32, '2025-02-17'
FROM materials m, vendors v 
WHERE m.material_number = '1314209864' AND v.vendor_code = '1100002488';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45811503', '180', 'US02', 'Comptec', m.id, v.id, 1, 1, 89.76, 16, '2025-02-17'
FROM materials m, vendors v 
WHERE m.material_number = '1314209869' AND v.vendor_code = '1100002488';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45811503', '190', 'US02', 'Comptec', m.id, v.id, 1, 1, 743.04, 72, '2025-02-17'
FROM materials m, vendors v 
WHERE m.material_number = '1314209881' AND v.vendor_code = '1100002488';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45811503', '200', 'US02', 'Comptec', m.id, v.id, 1, 1, 427.20, 96, '2025-02-17'
FROM materials m, vendors v 
WHERE m.material_number = '1314209873' AND v.vendor_code = '1100002488';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45811503', '210', 'US02', 'Comptec', m.id, v.id, 1, 1, 2554.56, 288, '2025-02-17'
FROM materials m, vendors v 
WHERE m.material_number = '1314209886' AND v.vendor_code = '1100002488';

INSERT INTO purchase_orders (purchasing_document, purchase_doc_item, purchasing_org, division, material_id, vendor_id, counter_of_po, counter_of_material, po_value, po_quantity, created_on) 
SELECT 
  '45829461', '10', 'US02', 'Comptec', m.id, v.id, 1, 1, 42.40, 4, '2025-08-27'
FROM materials m, vendors v 
WHERE m.material_number = '1314217076' AND v.vendor_code = '1100002488';

-- Insert material-vendor relationships
INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 36139.10
FROM materials m, vendors v 
WHERE m.material_number = '1314217581' AND v.vendor_code = '1101009109';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 21820.12
FROM materials m, vendors v 
WHERE m.material_number = '1314214314' AND v.vendor_code = '1100005675';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 850.00
FROM materials m, vendors v 
WHERE m.material_number = '1314209582' AND v.vendor_code = '1100002397';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 2700.00
FROM materials m, vendors v 
WHERE m.material_number = '1314216306' AND v.vendor_code = '1100002761';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 63.68
FROM materials m, vendors v 
WHERE m.material_number = '1314209864' AND v.vendor_code = '1100002488';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 89.76
FROM materials m, vendors v 
WHERE m.material_number = '1314209869' AND v.vendor_code = '1100002488';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 743.04
FROM materials m, vendors v 
WHERE m.material_number = '1314209881' AND v.vendor_code = '1100002488';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 427.20
FROM materials m, vendors v 
WHERE m.material_number = '1314209873' AND v.vendor_code = '1100002488';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 2554.56
FROM materials m, vendors v 
WHERE m.material_number = '1314209886' AND v.vendor_code = '1100002488';

INSERT INTO material_vendors (material_id, vendor_id, current_price)
SELECT m.id, v.id, 42.40
FROM materials m, vendors v 
WHERE m.material_number = '1314217076' AND v.vendor_code = '1100002488';