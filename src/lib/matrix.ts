import animals from './json/matrices/characters/animals.json';
import anomalies from './json/matrices/characters/anomalies.json';
import z from 'zod';

const StandardTableSchema = z.object({
	Title: z.string(),
	Roll: z.string(),
	Values: z.record(z.string())
});

export type StandardTableSchema = z.infer<typeof StandardTableSchema>;

const StandardMatrixSchema = StandardTableSchema.array();

export type StandardMatrixSchema = z.infer<typeof StandardMatrixSchema>;

export const standardMatrices: Record<string, StandardMatrixSchema> = {
	animals: StandardMatrixSchema.parse(animals),
	anomalies: StandardMatrixSchema.parse(anomalies)
};
