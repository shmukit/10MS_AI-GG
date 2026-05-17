
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyNoticeFix() {
    console.log('🚀 Verifying Notice Creation Fix...');

    // 1. Log in as Raihana (Admin)
    console.log('\n🔐 Logging in as raihana@10minuteschool.com...');
    const { data: { session }, error: loginError } = await supabase.auth.signInWithPassword({
        email: 'raihana@10minuteschool.com',
        password: process.env.TEST_USER_PASSWORD || 'NeverStopLearning!'
    });

    if (loginError) {
        console.error('❌ Login failed:', loginError.message);
        return;
    }

    console.log('✅ Logged in successfully.');

    // 2. Attempt to create notice using CORRECT payload (author_id)
    console.log('\n📝 Attempting to create notice with `author_id` field...');

    const noticePayload = {
        title: 'Fix Verification Notice ' + Date.now(),
        content: 'This notice verifies that the author_id field is working correctly.',
        tag: 'Resources',
        priority: 'medium',
        is_published: true,
        author_id: session.user.id, // This is the corrected field
        // batch_id left undefined/null as per global notice
    };

    const { data, error } = await supabase
        .from('notices')
        .insert([noticePayload])
        .select()
        .single();

    if (error) {
        console.error('❌ Notice Creation Failed:', error.message);
        console.error('   Error Code:', error.code);
        console.error('   Hint:', error.hint);
    } else {
        console.log('✅ Notice Created Successfully!');
        console.log('   ID:', data.id);
        console.log('   Title:', data.title);
        console.log('   Author ID:', data.author_id);

        // Cleanup
        await supabase.from('notices').delete().eq('id', data.id);
        console.log('   (Cleaned up test notice)');
    }
}

verifyNoticeFix();
