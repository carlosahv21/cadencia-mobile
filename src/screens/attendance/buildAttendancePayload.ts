// Arma el payload de asistencia bulk para POST /attendances/bulk.
// El backend detecta inscrito vs libre (enrollment_type) y descuenta créditos;
// el cliente solo manda class_id + student_id + date + status.

export interface AttendanceEntry {
    id: string;
    status: 'present' | 'absent';
}

export interface AttendanceRecord {
    class_id: number;
    student_id: string;
    date: string;
    status: 'present' | 'absent';
}

export const buildAttendancePayload = (
    classId: number,
    date: string,
    entries: AttendanceEntry[]
): AttendanceRecord[] =>
    entries.map((e) => ({
        class_id: classId,
        student_id: e.id,
        date,
        status: e.status,
    }));

// ── self-check ────────────────────────────────────────────────────────────
// Run: npx tsx src/screens/attendance/buildAttendancePayload.ts
if (require.main === module) {
    const out = buildAttendancePayload(7, '2026-07-11', [
        { id: 'a1', status: 'present' },
        { id: 'b2', status: 'absent' },
    ]);
    console.assert(out.length === 2, 'debe mapear cada alumno');
    console.assert(out[0].class_id === 7 && out[0].student_id === 'a1' && out[0].status === 'present', 'record 0');
    console.assert(out[1].status === 'absent' && out[1].date === '2026-07-11', 'record 1');
    console.assert(buildAttendancePayload(1, 'x', []).length === 0, 'lista vacía → payload vacío');
    console.log('buildAttendancePayload OK');
}
