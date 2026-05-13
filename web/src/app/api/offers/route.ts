export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.scalifyapp.com';
    const response = await fetch(`${backendUrl}/api/offers`);
    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch offers:', error);
    return Response.json({ error: 'Failed to fetch offers' }, { status: 500 });
  }
}
