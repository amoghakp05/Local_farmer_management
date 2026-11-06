-- ============================================================================
-- KHETBAZAAR: LOCAL FARMER MARKET INFORMATION SYSTEM
-- Reference Catalog Seed (Static Market Yards & Standard Crops Only)
-- All dummy farmers, mock users, listings, price histories & inquiries removed.
-- Farmers and produce listings are populated strictly through user addition.
-- ============================================================================

-- 1. REFERENCE MARKETS (APMC Mandis & Rythu Bazaars across Karnataka)
INSERT INTO public.markets (id, name, name_kn, name_hi, market_type, district, state, latitude, longitude, operating_hours, contact_phone)
VALUES
  ('m1000000-0000-0000-0000-000000000001', 'Kolar APMC Market Yard', 'ಕೋಲಾರ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ', 'कोलार एपीएमसी मंडी', 'apmc', 'Kolar', 'Karnataka', 13.1367, 78.1292, '05:00 AM - 01:00 PM', '+91 8152 222140'),
  ('m1000000-0000-0000-0000-000000000002', 'Yeshwanthpur APMC Yard, Bengaluru', 'ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ, ಬೆಂಗಳೂರು', 'यशवंतपुर एपीएमसी मंडी, बेंगलुरु', 'apmc', 'Bengaluru Urban', 'Karnataka', 13.0238, 77.5505, '04:00 AM - 02:00 PM', '+91 80 2337 4210'),
  ('m1000000-0000-0000-0000-000000000003', 'Hubli APMC Yard', 'ಹುಬ್ಬಳ್ಳಿ ಎಪಿಎಂಸಿ ಯಾರ್ಡ್', 'हुबली एपीएमसी मंडी', 'apmc', 'Dharwad', 'Karnataka', 15.3647, 75.1240, '05:30 AM - 01:30 PM', '+91 836 2351280'),
  ('m1000000-0000-0000-0000-000000000004', 'Dharwad District Yard', 'ಧಾರವಾಡ ಜಿಲ್ಲಾ ಮಾರುಕಟ್ಟೆ', 'धारवाड़ जिला मंडी', 'apmc', 'Dharwad', 'Karnataka', 15.4589, 75.0078, '06:00 AM - 01:00 PM', '+91 836 2441920'),
  ('m1000000-0000-0000-0000-000000000005', 'Mandya Rythu Bazaar', 'ಮಂಡ್ಯ ರೈತ ಬಜಾರ್', 'मंड्या रायथू बाजार', 'rythu_bazaar', 'Mandya', 'Karnataka', 12.5230, 76.8970, '06:00 AM - 02:00 PM', '+91 8232 224150'),
  ('m1000000-0000-0000-0000-000000000006', 'Belagavi Wholesale Yard', 'ಬೆಳಗಾವಿ ಸಗಟು ತರಕಾರಿ ಮಾರುಕಟ್ಟೆ', 'बेलगावी थोक सब्जी मंडी', 'apmc', 'Belagavi', 'Karnataka', 15.8497, 74.4977, '05:00 AM - 02:00 PM', '+91 831 2420130'),
  ('m1000000-0000-0000-0000-000000000007', 'Kalaburagi Red Gram APMC', 'ಕಲಬುರಗಿ ತೊಗರಿ ಎಪಿಎಂಸಿ', 'कलबुर्गी तुवर एपीएमसी', 'apmc', 'Kalaburagi', 'Karnataka', 17.3297, 76.8343, '06:00 AM - 03:00 PM', '+91 8472 231450'),
  ('m1000000-0000-0000-0000-000000000008', 'Byadgi Chilli APMC Yard', 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ ಮಾರುಕಟ್ಟೆ', 'ब्याडगी मिर्च मंडी', 'apmc', 'Haveri', 'Karnataka', 14.6806, 75.4856, '06:00 AM - 04:00 PM', '+91 8375 228220'),
  ('m1000000-0000-0000-0000-000000000009', 'Gangavathi Paddy Mandi', 'ಗಂಗಾವತಿ ಭತ್ತದ ಮಂಡಿ', 'गंगावती धान मंडी', 'apmc', 'Koppal', 'Karnataka', 15.4332, 76.5317, '07:00 AM - 03:00 PM', '+91 8533 230180'),
  ('m1000000-0000-0000-0000-000000000010', 'Chikkaballapur Flower & Vegetable Yard', 'ಚಿಕ್ಕಬಳ್ಳಾಪುರ ತರಕಾರಿ ಮಾರುಕಟ್ಟೆ', 'ಚಿಕಬಳ್ಳಾಪುರ ಸಬ್ಜಿ ಮಂಡಿ', 'apmc', 'Chikkaballapur', 'Karnataka', 13.4325, 77.7275, '05:00 AM - 01:00 PM', '+91 8156 272440')
ON CONFLICT (id) DO NOTHING;

-- 2. REFERENCE CROPS (Catalog)
INSERT INTO public.crops (id, name_en, name_kn, name_hi, category, season, standard_unit, msp_benchmark_price, shelf_life_days, icon_name)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Country Tomatoes', 'ನಾಟಿ ಟೊಮೆಟೊ', 'देसी टमाटर', 'vegetables', 'all_year', 'kg', 22.00, 4, 'tomato'),
  ('c1000000-0000-0000-0000-000000000002', 'Red Onions', 'ಕೆಂಪು ಈರುಳ್ಳಿ', 'लाल प्याज', 'vegetables', 'rabi', 'kg', 28.00, 20, 'onion'),
  ('c1000000-0000-0000-0000-000000000003', 'Finger Millet (Ragi)', 'ಶುದ್ಧ ರಾಗಿ', 'रागी (मड़ुआ)', 'grains', 'kharif', 'kg', 35.78, 180, 'wheat'),
  ('c1000000-0000-0000-0000-000000000004', 'Byadgi Red Chillies', 'ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ', 'ब्याडगी लाल मिर्च', 'spices', 'kharif', 'kg', 240.00, 120, 'chilli'),
  ('c1000000-0000-0000-0000-000000000005', 'Green Chillies (G4)', 'ಹಸಿರು ಮೆಣಸಿನಕಾಯಿ', 'हरी मिर्च', 'vegetables', 'all_year', 'kg', 38.00, 6, 'chilli'),
  ('c1000000-0000-0000-0000-000000000006', 'Sona Masoori Raw Rice', 'ಸೋನಾ ಮಸೂರಿ ಅಕ್ಕಿ', 'सोना मसूरी चावल', 'grains', 'kharif', 'kg', 48.00, 365, 'wheat'),
  ('c1000000-0000-0000-0000-000000000007', 'Kalaburagi Red Gram (Tur Dal)', 'ತೊಗರಿ ಬೇಳೆ', 'तुवर दाल', 'pulses', 'kharif', 'kg', 82.00, 180, 'pulse'),
  ('c1000000-0000-0000-0000-000000000008', 'Shimla Mirch / Bell Peppers', 'ದಪ್ಪ ಮೆಣಸಿನಕಾಯಿ', 'शिमला मिर्च', 'vegetables', 'all_year', 'kg', 36.00, 7, 'bell_pepper'),
  ('c1000000-0000-0000-0000-000000000009', 'Groundnut / Peanuts', 'ಕಡಲೆಕಾಯಿ', 'मूंगफली', 'oilseeds', 'kharif', 'kg', 64.00, 90, 'peanut'),
  ('c1000000-0000-0000-0000-000000000010', 'Bangalore Blue Grapes', 'ಬೆಂಗಳೂರು ಬ್ಲೂ ದ್ರಾಕ್ಷಿ', 'बैंगलोर ब्लू अंगूर', 'fruits', 'zaid', 'kg', 75.00, 5, 'fruit'),
  ('c1000000-0000-0000-0000-000000000011', 'Fresh Coriander Leaves', 'ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು', 'धनिया पत्ती', 'vegetables', 'all_year', 'kg', 30.00, 2, 'sprout'),
  ('c1000000-0000-0000-0000-000000000012', 'Bengal Gram (Chana)', 'ಕಡಲೆ ಕಾಳು', 'चना', 'pulses', 'rabi', 'kg', 54.00, 180, 'pulse')
ON CONFLICT (id) DO NOTHING;
