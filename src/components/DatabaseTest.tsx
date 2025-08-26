import React, { useState, useEffect } from 'react';
import { databaseService } from '../services/database';

export const DatabaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Get Roadmaps
      addTestResult('Testing: Get Roadmaps...');
      const roadmaps = await databaseService.getRoadmaps();
      addTestResult(`✅ Found ${roadmaps.length} roadmaps`);
      
      // Test 2: Get Batches
      addTestResult('Testing: Get Batches...');
      const batches = await databaseService.getBatches();
      addTestResult(`✅ Found ${batches.length} batches`);
      
      // Test 3: Get Students
      addTestResult('Testing: Get Students...');
      const students = await databaseService.getStudents();
      addTestResult(`✅ Found ${students.length} students`);
      
      // Test 4: Get Notices
      addTestResult('Testing: Get Notices...');
      const notices = await databaseService.getNotices();
      addTestResult(`✅ Found ${notices.length} notices`);
      
      // Test 5: Get Roadmap Weeks (if roadmaps exist)
      if (roadmaps.length > 0) {
        addTestResult('Testing: Get Roadmap Weeks...');
        const weeks = await databaseService.getRoadmapWeeks(roadmaps[0].id);
        addTestResult(`✅ Found ${weeks.length} weeks for roadmap: ${roadmaps[0].title}`);
        
        // Test 6: Get Roadmap Tasks (if weeks exist)
        if (weeks.length > 0) {
          addTestResult('Testing: Get Roadmap Tasks...');
          const tasks = await databaseService.getRoadmapTasks(weeks[0].id);
          addTestResult(`✅ Found ${tasks.length} tasks for week: ${weeks[0].title}`);
        }
      }
      
      addTestResult('🎉 All database tests passed successfully!');
      
    } catch (error) {
      addTestResult(`❌ Database test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('Database test error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCRUDOperations = async () => {
    setLoading(true);
    addTestResult('🧪 Testing CRUD Operations...');
    
    try {
      // Test Create Notice
      addTestResult('Creating test notice...');
      const newNotice = await databaseService.createNotice({
        title: 'Test Notice - Database Connection',
        content: 'This is a test notice to verify database operations are working.',
        author_id: 'test-user-id',
        batch_id: 'test-batch-id',
        tag: 'Test',
        priority: 'low',
        scheduled_date: new Date().toISOString().split('T')[0],
        scheduled_time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        is_published: true
      });
      addTestResult(`✅ Created notice: ${newNotice.title}`);
      
      // Test Create Roadmap
      addTestResult('Creating test roadmap...');
      const newRoadmap = await databaseService.createRoadmap({
        title: 'Test Roadmap - Database Test',
        description: 'A test roadmap to verify database operations.',
        total_weeks: 4,
        difficulty_level: 'beginner',
        category: 'Testing',
        is_active: true
      });
      addTestResult(`✅ Created roadmap: ${newRoadmap.title}`);
      
      addTestResult('🎉 CRUD operations test passed!');
      
    } catch (error) {
      addTestResult(`❌ CRUD test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('CRUD test error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Database Connection Test</h1>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {loading ? 'Testing...' : 'Test Database Connection'}
          </button>
          
          <button
            onClick={testCRUDOperations}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
          >
            {loading ? 'Testing...' : 'Test CRUD Operations'}
          </button>
        </div>
        
        <div className="bg-gray-100 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="font-semibold mb-2">Test Results:</h3>
          {testResults.length === 0 ? (
            <p className="text-gray-500">No tests run yet. Click a test button above.</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>• Check browser console for detailed error logs</p>
          <p>• Verify your .env file has correct Supabase credentials</p>
          <p>• Ensure all database tables are created in Supabase</p>
        </div>
      </div>
    </div>
  );
};
