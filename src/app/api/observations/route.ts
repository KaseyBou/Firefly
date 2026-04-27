import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/libs/prismadb';
import { normalizeName } from '@/app/libs/helperFunctions';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const speciesName = searchParams.get('speciesName');

  console.log(`--- 🔌 API Route Triggered ---`);
  console.log(`Fetching observations for: "${speciesName}"`);

  try {
    const allObservations = await prisma.observation.findMany({
      orderBy: { spottedAt: 'desc' },
    });

    if (speciesName && speciesName !== 'null') {
      const target = normalizeName(speciesName);
      const filtered = allObservations.filter((obs) =>
        normalizeName(obs.speciesName).includes(target),
      );
      console.log(`✅ Matches found: ${filtered.length}`);
      return NextResponse.json(filtered);
    }

    return NextResponse.json(allObservations);
  } catch (error) {
    console.error('❌ API Error:', error);
    return NextResponse.json([], { status: 500 });
  }
}
