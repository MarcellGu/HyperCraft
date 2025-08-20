import {NextRequest} from 'next/server';

// Support streaming responses from Zhipu API
async function callZhipuAPI(messages: any[], model = 'glm-4.5') {
    const url = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.ZHIPU_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: model,
            messages: messages,
            temperature: 0.6,
            stream: true  // Enable streaming response
        })
    });

    if (!response.ok) {
        throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }

    return response;
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {messages, model} = body;

        // Call Zhipu API
        const response = await callZhipuAPI(messages, model);

        // Create a ReadableStream to handle streaming response
        const stream = new ReadableStream({
            async start(controller) {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                if (!reader) {
                    controller.close();
                    return;
                }

                try {
                    while (true) {
                        const {done, value} = await reader.read();

                        if (done) {
                            controller.close();
                            break;
                        }

                        // Decode data
                        const chunk = decoder.decode(value, {stream: true});

                        // Push data to stream
                        controller.enqueue(new TextEncoder().encode(chunk));
                    }
                } catch (error) {
                    controller.error(error);
                } finally {
                    reader.releaseLock();
                }
            }
        });

        // Return streaming response
        return new Response(stream, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            },
        });
    } catch (error) {
        console.error('Error:', error);
        return new Response(JSON.stringify({error: 'Internal Server Error'}), {
            status: 500,
            headers: {'Content-Type': 'application/json'}
        });
    }
}
