// lib/compileResume.ts
export async function compileResume(resumeId: number) {
    if (!resumeId) {
        alert('Missing resume ID');
        return;
    }

    try {
        const res = await fetch(`/api/resume/compile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ resumeId }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error('Unexpected error response:', text);
            throw new Error('Resume generation failed.');
        }

        // ✅ Broadcast compile success
        const channel = new BroadcastChannel('resume_compile_channel');
        channel.postMessage({ type: 'compiled', resumeId });

        // (Optional) Show success alert if you want
        // alert('Resume compiled successfully!');
    } catch (error: any) {
        console.error('Error generating resume:', error);
        alert(error.message || 'An unexpected error occurred.');
    }
}
