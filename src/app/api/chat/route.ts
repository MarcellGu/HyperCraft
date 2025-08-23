import {NextRequest} from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const messages = body.messages;
    return Response.json({
        response: 'success',
    })
}
