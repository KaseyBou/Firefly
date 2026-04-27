'use server';

import prisma from '@/app/libs/prismadb';
import { auth } from '@/auth';
import { revalidatePath, unstable_noStore as noStore } from 'next/cache';
import { observationSchema } from '@/app/libs/schemas';
import {
  normalizeName,
  getStartDate,
  isInsideCT,
} from '../libs/helperFunctions';

export async function createObservation(data: any) {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: 'You must be logged in to post an observation.' };
  }

  const validatedFields = observationSchema.safeParse(data);
  if (!validatedFields.success) {
    return { error: validatedFields.error.issues[0].message };
  }

  const { latitude, longitude } = validatedFields.data;
  if (!isInsideCT(latitude, longitude)) {
    return {
      error: 'Observations are currently restricted to the Connecticut area.',
    };
  }

  try {
    await prisma.observation.create({
      data: {
        speciesName: validatedFields.data.speciesName,
        description: validatedFields.data.description,
        latitude,
        longitude,
        imageUrl: data.imageUrl || '',
        userId: session.user.id,
      },
    });

    // Clear caches for the map and species pages
    revalidatePath('/map');
    revalidatePath('/species');
    return { success: true };
  } catch (error) {
    console.error('Database Error:', error);
    return { error: 'Failed to save observation.' };
  }
}
console.log('🚀 OBSERVATION ACTIONS LOADED');
export async function getObservations(
  speciesName?: string | null,
  timeFilter: string = 'all',
) {
  noStore();

  // LOG 1: Check if the action is even firing
  console.log(`--- 🛰️  Server Action Triggered ---`);
  console.log(`Input Species: "${speciesName}"`);

  try {
    const startDate = getStartDate(timeFilter);

    // Fetch EVERYTHING first to check DB health
    const allObservations = await prisma.observation.findMany({
      include: { user: { select: { username: true } } },
      orderBy: { spottedAt: 'desc' },
    });

    // LOG 2: Check total database count
    console.log(`Total records in DB: ${allObservations.length}`);

    // If we have a time filter, apply it
    let observations = allObservations;
    if (startDate) {
      observations = observations.filter((obs) => obs.spottedAt >= startDate);
    }

    if (speciesName) {
      const target = normalizeName(speciesName);
      const filtered = observations.filter((obs) =>
        normalizeName(obs.speciesName).includes(target),
      );

      // LOG 3: Check matching logic
      console.log(
        `Filtering for: "${target}" | Matches found: ${filtered.length}`,
      );

      return filtered;
    }

    return observations;
  } catch (error) {
    console.error('Fetch Error:', error);
    return [];
  }
}
