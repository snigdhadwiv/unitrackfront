import React, { useState } from 'react';
import { api } from '@/services/api';

const AttendancePage = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const markAttendance = async () => {
        setLoading(true);
        setMessage('');

        try {
            // Your attendance data - adjust this to match your API
            const attendanceData = {
                student_id: 123, // Replace with actual student ID
                date: new Date().toISOString().split('T')[0], // Today's date
                status: "present",
                // Add other required fields based on your API
            };

            console.log('Sending data:', attendanceData);

            // USE API SERVICE - it automatically includes CSRF token
            const result = await api.markAttendance(attendanceData);
            
            setMessage('Attendance marked successfully!');
            console.log('Success:', result);
        } catch (error) {
            setMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>
            
            <button
                onClick={markAttendance}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
                {loading ? 'Marking Attendance...' : 'Mark Attendance'}
            </button>

            {message && (
                <div className={`mt-4 p-3 rounded ${
                    message.includes('Success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                </div>
            )}

            <div className="mt-4 text-sm text-gray-600">
                <p>Check browser console for detailed logs</p>
            </div>
        </div>
    );
};

export default AttendancePage;