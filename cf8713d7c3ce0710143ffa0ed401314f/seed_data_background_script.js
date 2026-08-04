/**
 * ============================================================
 *  Quick Commerce Ops Platform — Sample Data Seed Script
 *  Scope: x_2145749_qc
 *
 *  HOW TO RUN:
 *    1. In your ServiceNow instance, navigate to:
 *       System Definition > Scripts - Background
 *    2. Paste the entire contents of this file
 *    3. Click "Run script"
 *    4. Check gs.info() output in the result panel
 *
 *  WHAT IT CREATES:
 *    TABLE 1  - x_2145749_qc_delivery_zone        (4 zones)
 *    TABLE 2  - x_2145749_qc_dark_store            (5 stores)
 *    TABLE 3  - sn_customerservice_case            (12 cases)
 *    TABLE 4  - x_2145749_qc_refund_request        (8 refunds)
 *    TABLE 5  - x_2145749_qc_fraud_flag            (3 fraud flags)
 *    TABLE 6  - x_2145749_qc_equipment             (5 equipment)
 *    TABLE 7  - x_2145749_qc_store_issue           (5 issues)
 *    TABLE 8  - x_2145749_qc_delivery_partner      (4 partners)
 *    TABLE 9  - x_2145749_qc_partner_incident      (6 incidents)
 *    TABLE 10 - x_2145749_qc_pulse_score           (5 snapshots)
 *
 *  DS-0567 (Koramangala) is deliberately the "villain" store:
 *    pulse_score=34, 6 complaints, 4 open incidents, 3 fraud flags,
 *    2 equipment breakdowns, 3 operational issues.
 * ============================================================
 */

(function seedQCData() {
    'use strict';

    var log = [];

    // ── Helpers ────────────────────────────────────────────────

    function upsert(tableName, queryFields, setFields) {
        var gr = new GlideRecord(tableName);
        for (var qf in queryFields) {
            gr.addQuery(qf, queryFields[qf]);
        }
        gr.query();
        if (!gr.next()) {
            gr.initialize();
        }
        for (var sf in setFields) {
            gr.setValue(sf, setFields[sf]);
        }
        var sysId = gr.save();
        log.push('  [' + tableName + '] saved sys_id=' + sysId + ' (' + JSON.stringify(queryFields) + ')');
        return sysId;
    }

    function getSysId(tableName, queryFields) {
        var gr = new GlideRecord(tableName);
        for (var qf in queryFields) {
            gr.addQuery(qf, queryFields[qf]);
        }
        gr.setLimit(1);
        gr.query();
        if (gr.next()) { return gr.getUniqueValue(); }
        return null;
    }

    function daysAgo(n) {
        var gdt = new GlideDateTime();
        gdt.addDays(-n);
        return gdt.getValue();
    }

    function anyUser() {
        return getSysId('sys_user', { user_name: 'admin' });
    }

    var managerSysId = anyUser();


    // ===========================================================
    //  TABLE 1: Delivery Zone (must come first - stores reference it)
    // ===========================================================
    gs.info('=== Seeding TABLE 1: Delivery Zone ===');

    var zoneBlrSouth = upsert(
        'x_2145749_qc_delivery_zone',
        { zone_code: 'BLR-S' },
        { zone_name: 'Bangalore South', zone_code: 'BLR-S', city: 'Bangalore', active: true }
    );

    var zoneMumbaiWest = upsert(
        'x_2145749_qc_delivery_zone',
        { zone_code: 'MUM-W' },
        { zone_name: 'Mumbai West', zone_code: 'MUM-W', city: 'Mumbai', active: true }
    );

    var zoneDelhiNCR = upsert(
        'x_2145749_qc_delivery_zone',
        { zone_code: 'DEL-N' },
        { zone_name: 'Delhi NCR', zone_code: 'DEL-N', city: 'Delhi', active: true }
    );

    var zoneHydCentral = upsert(
        'x_2145749_qc_delivery_zone',
        { zone_code: 'HYD-C' },
        { zone_name: 'Hyderabad Central', zone_code: 'HYD-C', city: 'Hyderabad', active: true }
    );


    // ===========================================================
    //  TABLE 2: Dark Store
    // ===========================================================
    gs.info('=== Seeding TABLE 2: Dark Store ===');

    var storeDS0567 = upsert(
        'x_2145749_qc_dark_store',
        { store_code: 'DS-0567' },
        {
            store_code: 'DS-0567', store_name: 'Koramangala Dark Store',
            city: 'Bangalore', address: '80 Feet Road, Koramangala, Bangalore - 560034',
            zone: zoneBlrSouth, pulse_score: 34, pulse_score_band: 'critical',
            status: 'active', manager: managerSysId,
            target_delivery_minutes: 10, daily_order_volume: 420
        }
    );

    var storeDS0114 = upsert(
        'x_2145749_qc_dark_store',
        { store_code: 'DS-0114' },
        {
            store_code: 'DS-0114', store_name: 'Andheri Dark Store',
            city: 'Mumbai', address: 'MIDC, Andheri East, Mumbai - 400093',
            zone: zoneMumbaiWest, pulse_score: 78, pulse_score_band: 'watch',
            status: 'active', manager: managerSysId,
            target_delivery_minutes: 10, daily_order_volume: 610
        }
    );

    var storeDS0887 = upsert(
        'x_2145749_qc_dark_store',
        { store_code: 'DS-0887' },
        {
            store_code: 'DS-0887', store_name: 'HSR Layout Dark Store',
            city: 'Bangalore', address: 'Sector 7, HSR Layout, Bangalore - 560102',
            zone: zoneBlrSouth, pulse_score: 65, pulse_score_band: 'watch',
            status: 'active', manager: managerSysId,
            target_delivery_minutes: 10, daily_order_volume: 370
        }
    );

    var storeDS0332 = upsert(
        'x_2145749_qc_dark_store',
        { store_code: 'DS-0332' },
        {
            store_code: 'DS-0332', store_name: 'Sector 62 Dark Store',
            city: 'Delhi', address: 'Sector 62, Noida, Delhi NCR - 201301',
            zone: zoneDelhiNCR, pulse_score: 71, pulse_score_band: 'watch',
            status: 'active', manager: managerSysId,
            target_delivery_minutes: 10, daily_order_volume: 490
        }
    );

    var storeDS0011 = upsert(
        'x_2145749_qc_dark_store',
        { store_code: 'DS-0011' },
        {
            store_code: 'DS-0011', store_name: 'Banjara Hills Dark Store',
            city: 'Hyderabad', address: 'Road No. 12, Banjara Hills, Hyderabad - 500034',
            zone: zoneHydCentral, pulse_score: 83, pulse_score_band: 'healthy',
            status: 'active', manager: managerSysId,
            target_delivery_minutes: 10, daily_order_volume: 530
        }
    );


    // ===========================================================
    //  TABLE 3: CSM Cases (sn_customerservice_case)
    // ===========================================================
    gs.info('=== Seeding TABLE 3: CSM Cases ===');

    function createCase(orderNum, storeId, zoneId, complaintType, priority, state, resolutionType, fraudReview, autoResolved, shortDesc) {
        return upsert(
            'sn_customerservice_case',
            { x_2145749_qc_order_number: orderNum },
            {
                short_description: shortDesc,
                priority: priority, state: state,
                x_2145749_qc_complaint_type: complaintType,
                x_2145749_qc_order_number: orderNum,
                x_2145749_qc_dark_store: storeId,
                x_2145749_qc_zone: zoneId,
                x_2145749_qc_resolution_type: resolutionType,
                x_2145749_qc_auto_resolved: autoResolved,
                x_2145749_qc_fraud_review_required: fraudReview,
                x_2145749_qc_order_value: 0
            }
        );
    }

    // DS-0567 Cases (6) - Villain store
    var case10021 = createCase('ORD-10021', storeDS0567, zoneBlrSouth, 'missing_items', '2', '6', 'full_refund', false, true, '[DS-0567] Missing item - order ORD-10021');
    var case10022 = createCase('ORD-10022', storeDS0567, zoneBlrSouth, 'damaged_items', '2', '2', 'auto_escalated', true, false, '[DS-0567] Damaged product - order ORD-10022');
    var case10023 = createCase('ORD-10023', storeDS0567, zoneBlrSouth, 'late_delivery',  '3', '6', 'full_refund', false, true, '[DS-0567] Late delivery - order ORD-10023');
    var case10024 = createCase('ORD-10024', storeDS0567, zoneBlrSouth, 'wrong_items',    '2', '1', 'pending', true, false, '[DS-0567] Wrong item delivered - order ORD-10024');
    var case10025 = createCase('ORD-10025', storeDS0567, zoneBlrSouth, 'missing_items',  '1', '2', 'auto_escalated', true, false, '[DS-0567] CRITICAL: High-value missing items - order ORD-10025');
    var case10026 = createCase('ORD-10026', storeDS0567, zoneBlrSouth, 'quality_issue',  '1', '1', 'pending', true, false, '[DS-0567] CRITICAL: Food quality complaint - order ORD-10026');

    // Healthy store cases (6)
    var case20011 = createCase('ORD-20011', storeDS0114, zoneMumbaiWest, 'missing_items', '3', '6', 'full_refund', false, true, '[DS-0114] Missing item - order ORD-20011');
    var case20012 = createCase('ORD-20012', storeDS0114, zoneMumbaiWest, 'late_delivery',  '3', '6', 'full_refund', false, true, '[DS-0114] Late delivery - order ORD-20012');
    var case30011 = createCase('ORD-30011', storeDS0887, zoneBlrSouth, 'wrong_items',    '3', '6', 'full_refund', false, false, '[DS-0887] Wrong item - order ORD-30011');
    var case40011 = createCase('ORD-40011', storeDS0332, zoneDelhiNCR,  'late_delivery',  '3', '6', 'full_refund', false, true, '[DS-0332] Late delivery - order ORD-40011');
    var case40012 = createCase('ORD-40012', storeDS0332, zoneDelhiNCR,  'missing_items',  '3', '2', 'pending', false, false, '[DS-0332] Missing item review - order ORD-40012');
    var case50011 = createCase('ORD-50011', storeDS0011, zoneHydCentral, 'damaged_items', '3', '6', 'full_refund', false, true, '[DS-0011] Damaged product - order ORD-50011');


    // ===========================================================
    //  TABLE 4: Refund / Reorder Request
    // ===========================================================
    gs.info('=== Seeding TABLE 4: Refund Requests ===');

    var custSysId = managerSysId;

    function createRefund(orderNum, caseSysId, amountReq, decision, fraudFlagged, riskScore) {
        var amtApproved = (decision === 'auto_approved' || decision === 'manually_approved') ? amountReq : 0;
        return upsert(
            'x_2145749_qc_refund_request',
            { order_number: orderNum },
            {
                order_number: orderNum, case: caseSysId, customer: custSysId,
                request_type: 'refund', decision: decision,
                amount_requested: amountReq, amount_approved: amtApproved,
                fraud_flagged: fraudFlagged, fraud_risk_score: riskScore,
                claim_timestamp: daysAgo(1), order_timestamp: daysAgo(2),
                decision_notes: decision === 'auto_approved'
                    ? 'Auto-approved refund - policy threshold met'
                    : (decision === 'pending' ? 'Awaiting fraud review' : 'Escalated for manual review')
            }
        );
    }

    var refund10021 = createRefund('ORD-10021', case10021,  245, 'auto_approved', false, 12);
    var refund10023 = createRefund('ORD-10023', case10023,  180, 'auto_approved', false,  8);
    var refund10025 = createRefund('ORD-10025', case10025, 1450, 'pending',       false, 65);
    var refund10026 = createRefund('ORD-10026', case10026,  890, 'pending',       false, 81);
    var refund20011 = createRefund('ORD-20011', case20011,  320, 'auto_approved', false,  5);
    var refund30011 = createRefund('ORD-30011', case30011,  150, 'auto_approved', false,  3);
    var refund40011 = createRefund('ORD-40011', case40011,  275, 'auto_approved', false,  7);
    var refund50011 = createRefund('ORD-50011', case50011,  420, 'auto_approved', false,  4);


    // ===========================================================
    //  TABLE 5: Refund Fraud Flag
    // ===========================================================
    gs.info('=== Seeding TABLE 5: Fraud Flags ===');

    upsert(
        'x_2145749_qc_fraud_flag',
        { refund_request: refund10025, rule_name: 'repeat_claim_customer' },
        {
            refund_request: refund10025, rule_name: 'repeat_claim_customer',
            risk_weight: 72,
            details: 'ORD-10024 (DS-0567): Repeat claim same customer - 7 day window. Status: Under Review. Fraud Score: 72.'
        }
    );

    upsert(
        'x_2145749_qc_fraud_flag',
        { refund_request: refund10025, rule_name: 'timestamp_mismatch' },
        {
            refund_request: refund10025, rule_name: 'timestamp_mismatch',
            risk_weight: 58,
            details: 'ORD-10022 (DS-0567): Claim timestamp predates delivery by 43 min. Status: Under Review. Fraud Score: 58.'
        }
    );

    upsert(
        'x_2145749_qc_fraud_flag',
        { refund_request: refund10026, rule_name: 'high_value_new_customer' },
        {
            refund_request: refund10026, rule_name: 'high_value_new_customer',
            risk_weight: 81,
            details: 'ORD-10026 (DS-0567): High-value claim Rs.890 from account < 30 days old. Status: Escalated to Agent. Fraud Score: 81.'
        }
    );


    // ===========================================================
    //  TABLE 6: Dark Store Equipment
    // ===========================================================
    gs.info('=== Seeding TABLE 6: Equipment ===');

    var equip1 = upsert(
        'x_2145749_qc_equipment',
        { asset_tag: 'EQ-DS0567-FRZ-A' },
        { asset_tag: 'EQ-DS0567-FRZ-A', dark_store: storeDS0567, equipment_type: 'freezer', operational_status: 'down', install_date: daysAgo(365) }
    );

    var equip2 = upsert(
        'x_2145749_qc_equipment',
        { asset_tag: 'EQ-DS0567-SCN-B' },
        { asset_tag: 'EQ-DS0567-SCN-B', dark_store: storeDS0567, equipment_type: 'handheld_scanner', operational_status: 'degraded', install_date: daysAgo(180) }
    );

    var equip3 = upsert(
        'x_2145749_qc_equipment',
        { asset_tag: 'EQ-DS0567-CVB-B' },
        { asset_tag: 'EQ-DS0567-CVB-B', dark_store: storeDS0567, equipment_type: 'other', operational_status: 'operational', install_date: daysAgo(90) }
    );

    var equip4 = upsert(
        'x_2145749_qc_equipment',
        { asset_tag: 'EQ-DS0114-FRZ-1' },
        { asset_tag: 'EQ-DS0114-FRZ-1', dark_store: storeDS0114, equipment_type: 'freezer', operational_status: 'operational', install_date: daysAgo(200) }
    );

    var equip5 = upsert(
        'x_2145749_qc_equipment',
        { asset_tag: 'EQ-DS0332-PKS-3' },
        { asset_tag: 'EQ-DS0332-PKS-3', dark_store: storeDS0332, equipment_type: 'packing_station', operational_status: 'operational', install_date: daysAgo(150) }
    );


    // ===========================================================
    //  TABLE 7: Dark Store Operational Issue
    // ===========================================================
    gs.info('=== Seeding TABLE 7: Store Issues ===');

    upsert('x_2145749_qc_store_issue',
        { dark_store: storeDS0567, issue_category: 'inventory_discrepancy', description: '47 SKUs showing stock but physically missing from shelves' },
        {
            dark_store: storeDS0567, issue_category: 'inventory_discrepancy',
            severity: 'high', state: 'open',
            description: '47 SKUs showing stock in system but physically missing from shelves. Root cause: suspected picker mis-location during last restock cycle.',
            affects_pulse_score: true, reported_at: daysAgo(2), quantity_variance: 47
        }
    );

    upsert('x_2145749_qc_store_issue',
        { dark_store: storeDS0567, issue_category: 'equipment_breakdown', equipment: equip1 },
        {
            dark_store: storeDS0567, issue_category: 'equipment_breakdown',
            severity: 'critical', state: 'in_progress',
            description: 'Walk-in freezer (EQ-DS0567-FRZ-A) temperature rising above safe threshold. Current: +4C (target: -18C). Perishable stock at risk. Technician dispatched ETA 2h.',
            equipment: equip1, affects_pulse_score: true, reported_at: daysAgo(1)
        }
    );

    upsert('x_2145749_qc_store_issue',
        { dark_store: storeDS0567, issue_category: 'picker_performance', description: 'Average pick time 340% above SLA for evening shift' },
        {
            dark_store: storeDS0567, issue_category: 'picker_performance',
            severity: 'medium', state: 'open',
            description: 'Average pick time 340% above SLA for evening shift (18:00-22:00). SLA: 90s/item. Actual: ~306s/item. Cause: understaffing + scanner degradation (EQ-DS0567-SCN-B).',
            equipment: equip2, affects_pulse_score: true, reported_at: daysAgo(3)
        }
    );

    upsert('x_2145749_qc_store_issue',
        { dark_store: storeDS0114, issue_category: 'inventory_discrepancy', description: 'Dairy section short-stocked during peak hours' },
        {
            dark_store: storeDS0114, issue_category: 'inventory_discrepancy',
            severity: 'low', state: 'resolved',
            description: 'Dairy section short-stocked during peak hours (12:00-14:00). Resolved by emergency restock from hub warehouse.',
            affects_pulse_score: false, reported_at: daysAgo(5)
        }
    );

    upsert('x_2145749_qc_store_issue',
        { dark_store: storeDS0332, issue_category: 'equipment_breakdown', equipment: equip5 },
        {
            dark_store: storeDS0332, issue_category: 'equipment_breakdown',
            severity: 'medium', state: 'resolved',
            description: 'Barcode scanner intermittent failure during packing. Scanner firmware crash every ~30 min. Resolved: firmware rollback applied.',
            equipment: equip5, affects_pulse_score: false, reported_at: daysAgo(4)
        }
    );


    // ===========================================================
    //  TABLE 8: Delivery Partner
    // ===========================================================
    gs.info('=== Seeding TABLE 8: Delivery Partners ===');

    var partner1001 = upsert('x_2145749_qc_delivery_partner', { partner_name: 'Ravi Kumar' },
        { partner_name: 'Ravi Kumar', status: 'active', home_zone: zoneBlrSouth, vehicle_type: 'bike', phone: '+91-9880001001' });

    var partner1002 = upsert('x_2145749_qc_delivery_partner', { partner_name: 'Suresh Nair' },
        { partner_name: 'Suresh Nair', status: 'active', home_zone: zoneBlrSouth, vehicle_type: 'bike', phone: '+91-9880001002' });

    var partner1003 = upsert('x_2145749_qc_delivery_partner', { partner_name: 'Amit Sharma' },
        { partner_name: 'Amit Sharma', status: 'active', home_zone: zoneMumbaiWest, vehicle_type: 'scooter', phone: '+91-9880001003' });

    var partner1004 = upsert('x_2145749_qc_delivery_partner', { partner_name: 'Priya Reddy' },
        { partner_name: 'Priya Reddy', status: 'active', home_zone: zoneDelhiNCR, vehicle_type: 'scooter', phone: '+91-9880001004' });


    // ===========================================================
    //  TABLE 9: Delivery Partner Incident
    // ===========================================================
    gs.info('=== Seeding TABLE 9: Partner Incidents ===');

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1001, dark_store: storeDS0567, incident_type: 'order_not_ready', description: 'Order not ready for 18 minutes after arrival' },
        {
            partner: partner1001, dark_store: storeDS0567, incident_type: 'order_not_ready',
            severity: 'high', state: 'new',
            description: 'Partner Ravi Kumar (DP-1001) arrived at DS-0567 at scheduled time. Order not ready for 18 minutes. Picker said items still being located.',
            reported_at: daysAgo(1)
        }
    );

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1001, dark_store: storeDS0567, incident_type: 'wrong_items_packed', description: 'Received 3 items but order had 5 - incomplete package' },
        {
            partner: partner1001, dark_store: storeDS0567, incident_type: 'wrong_items_packed',
            severity: 'high', state: 'new',
            description: 'Partner Ravi Kumar (DP-1001) handed incomplete order at DS-0567. Received 3 items but order (ORD-10021) had 5 line items. Missing: 1x Milk 500ml, 1x Bread loaf.',
            order_number: 'ORD-10021', reported_at: daysAgo(2)
        }
    );

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1002, dark_store: storeDS0567, incident_type: 'vehicle_breakdown', description: 'Bike breakdown on Koramangala 5th Block' },
        {
            partner: partner1002, dark_store: storeDS0567, incident_type: 'vehicle_breakdown',
            severity: 'medium', state: 'resolved',
            description: 'Partner Suresh Nair (DP-1002) reported bike breakdown near Koramangala 5th Block. Order delayed ~25 min.',
            resolution_notes: 'Resolved: resumed delivery with backup scooter. Order delivered.',
            reported_at: daysAgo(3)
        }
    );

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1002, dark_store: storeDS0567, incident_type: 'order_not_ready', description: 'Waited 25 minutes, picker still locating items' },
        {
            partner: partner1002, dark_store: storeDS0567, incident_type: 'order_not_ready',
            severity: 'high', state: 'new',
            description: 'Partner Suresh Nair (DP-1002) waited 25 minutes at DS-0567. Picker still locating items. Root cause: inventory discrepancy - items not in expected slot.',
            reported_at: daysAgo(1)
        }
    );

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1003, dark_store: storeDS0114, incident_type: 'vehicle_breakdown', description: 'Flat tyre - replaced, back on route' },
        {
            partner: partner1003, dark_store: storeDS0114, incident_type: 'vehicle_breakdown',
            severity: 'low', state: 'resolved',
            description: 'Partner Amit Sharma (DP-1003) experienced flat tyre near DS-0114. Self-resolved: tyre replaced. Back on route in 15 minutes.',
            resolution_notes: 'Flat tyre replaced. Order delivered on time.',
            reported_at: daysAgo(5)
        }
    );

    upsert('x_2145749_qc_partner_incident',
        { partner: partner1004, dark_store: storeDS0332, incident_type: 'unsafe_store_conditions', description: 'Unsafe road condition reported near delivery zone' },
        {
            partner: partner1004, dark_store: storeDS0332, incident_type: 'unsafe_store_conditions',
            severity: 'medium', state: 'resolved',
            description: 'Partner Priya Reddy (DP-1004) reported waterlogged road near Sector 62 delivery zone creating unsafe riding conditions.',
            resolution_notes: 'Alternate delivery route communicated to all Sector 62 partners.',
            reported_at: daysAgo(4)
        }
    );


    // ===========================================================
    //  TABLE 10: PulseScore Snapshot
    // ===========================================================
    gs.info('=== Seeding TABLE 10: PulseScore Snapshots ===');

    var today = daysAgo(0);

    // DS-0567 - RED (Critical)
    upsert('x_2145749_qc_pulse_score',
        { dark_store: storeDS0567, snapshot_time: today },
        {
            dark_store: storeDS0567, zone: zoneBlrSouth, score: 34, band: 'critical',
            snapshot_time: today, open_complaint_count: 6, open_store_issue_count: 3,
            complaint_volume_score: 15, complaint_severity_score: 12,
            equipment_uptime_score: 40, sla_compliance_score: 35,
            partner_incident_score: 30, refund_fraud_score: 20, inventory_accuracy_score: 45,
            breakdown: '{"complaint_volume":15,"complaint_severity":12,"equipment_uptime":40,"sla_compliance":35,"partner_incidents":30,"refund_fraud":20,"inventory_accuracy":45,"computed_score":34,"color":"Red","fraud_flags":3,"sla_breaches":3,"equipment_breakdowns":2}'
        }
    );

    // DS-0114 - GREEN (Healthy)
    upsert('x_2145749_qc_pulse_score',
        { dark_store: storeDS0114, snapshot_time: today },
        {
            dark_store: storeDS0114, zone: zoneMumbaiWest, score: 78, band: 'watch',
            snapshot_time: today, open_complaint_count: 2, open_store_issue_count: 0,
            complaint_volume_score: 80, complaint_severity_score: 82,
            equipment_uptime_score: 95, sla_compliance_score: 85,
            partner_incident_score: 90, refund_fraud_score: 95, inventory_accuracy_score: 85,
            breakdown: '{"complaint_volume":80,"complaint_severity":82,"equipment_uptime":95,"sla_compliance":85,"partner_incidents":90,"refund_fraud":95,"inventory_accuracy":85,"computed_score":78,"color":"Green","fraud_flags":0,"sla_breaches":0,"equipment_breakdowns":0}'
        }
    );

    // DS-0887 - YELLOW (Watch)
    upsert('x_2145749_qc_pulse_score',
        { dark_store: storeDS0887, snapshot_time: today },
        {
            dark_store: storeDS0887, zone: zoneBlrSouth, score: 65, band: 'watch',
            snapshot_time: today, open_complaint_count: 1, open_store_issue_count: 1,
            complaint_volume_score: 75, complaint_severity_score: 70,
            equipment_uptime_score: 88, sla_compliance_score: 60,
            partner_incident_score: 72, refund_fraud_score: 90, inventory_accuracy_score: 70,
            breakdown: '{"complaint_volume":75,"complaint_severity":70,"equipment_uptime":88,"sla_compliance":60,"partner_incidents":72,"refund_fraud":90,"inventory_accuracy":70,"computed_score":65,"color":"Yellow","fraud_flags":0,"sla_breaches":1,"equipment_breakdowns":0}'
        }
    );

    // DS-0332 - YELLOW (Watch)
    upsert('x_2145749_qc_pulse_score',
        { dark_store: storeDS0332, snapshot_time: today },
        {
            dark_store: storeDS0332, zone: zoneDelhiNCR, score: 71, band: 'watch',
            snapshot_time: today, open_complaint_count: 2, open_store_issue_count: 0,
            complaint_volume_score: 78, complaint_severity_score: 75,
            equipment_uptime_score: 70, sla_compliance_score: 80,
            partner_incident_score: 85, refund_fraud_score: 92, inventory_accuracy_score: 80,
            breakdown: '{"complaint_volume":78,"complaint_severity":75,"equipment_uptime":70,"sla_compliance":80,"partner_incidents":85,"refund_fraud":92,"inventory_accuracy":80,"computed_score":71,"color":"Yellow","fraud_flags":0,"sla_breaches":0,"equipment_breakdowns":1}'
        }
    );

    // DS-0011 - GREEN (Healthy)
    upsert('x_2145749_qc_pulse_score',
        { dark_store: storeDS0011, snapshot_time: today },
        {
            dark_store: storeDS0011, zone: zoneHydCentral, score: 83, band: 'healthy',
            snapshot_time: today, open_complaint_count: 1, open_store_issue_count: 0,
            complaint_volume_score: 88, complaint_severity_score: 85,
            equipment_uptime_score: 98, sla_compliance_score: 90,
            partner_incident_score: 92, refund_fraud_score: 98, inventory_accuracy_score: 90,
            breakdown: '{"complaint_volume":88,"complaint_severity":85,"equipment_uptime":98,"sla_compliance":90,"partner_incidents":92,"refund_fraud":98,"inventory_accuracy":90,"computed_score":83,"color":"Green","fraud_flags":0,"sla_breaches":0,"equipment_breakdowns":0}'
        }
    );


    // ===========================================================
    //  SUMMARY
    // ===========================================================
    gs.info('');
    gs.info('======================================================');
    gs.info('  QC Platform Seed Data - COMPLETE');
    gs.info('======================================================');
    gs.info('  TABLE 1 - Delivery Zone:               4 records');
    gs.info('  TABLE 2 - Dark Store:                   5 records');
    gs.info('  TABLE 3 - CSM Cases:                   12 records');
    gs.info('  TABLE 4 - Refund Requests:              8 records');
    gs.info('  TABLE 5 - Fraud Flags:                  3 records');
    gs.info('  TABLE 6 - Equipment:                    5 records');
    gs.info('  TABLE 7 - Store Issues:                 5 records');
    gs.info('  TABLE 8 - Delivery Partners:            4 records');
    gs.info('  TABLE 9 - Partner Incidents:            6 records');
    gs.info('  TABLE 10 - PulseScore Snapshots:        5 records');
    gs.info('------------------------------------------------------');
    gs.info('  DS-0567 (Koramangala) PulseScore: 34 [CRITICAL/RED]');
    gs.info('    - 6 complaints (2 Critical, 3 High, 1 Medium)');
    gs.info('    - 3 fraud flags (scores: 72, 58, 81)');
    gs.info('    - 2 equipment breakdowns (freezer DOWN, scanner DEGRADED)');
    gs.info('    - 3 operational issues (inventory, freezer, picker perf)');
    gs.info('    - 4 open partner incidents in zone');
    gs.info('======================================================');
    gs.info('');
    gs.info('Detailed log of saved records:');
    for (var i = 0; i < log.length; i++) { gs.info(log[i]); }

}());
