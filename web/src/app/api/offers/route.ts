export async function GET() {
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const url = `${backendUrl}/api/offers`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return Response.json(data);
  } catch (error) {
    console.error('Failed to fetch offers:', error instanceof Error ? error.message : String(error));
    return Response.json({
      offers: [
        {
          id: '1',
          name: 'Growth Plan',
          description: 'Everything you need to launch your business online',
          plan_type: 'pro',
          price: 1499,
          original_price: 2499,
          trial_days: 7,
          features: [
            'Website + Search Engine Optimization',
            'Unlimited Pages Professional Website',
            'Add Your Custom Domain',
            'Free Hosting',
            'Website Maintenance',
          ],
          is_active: true,
        }
      ]
    });
  }
}
