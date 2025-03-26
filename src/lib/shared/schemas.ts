import { MAX_NAME_LENGTH } from '$lib/shared/config'
import { z } from 'zod'

export const NameSchema = z
	.string({
		required_error: 'Name is required',
		invalid_type_error: 'Name must be a string',
	})
	.min(1, {
		message: 'Name cannot be empty',
	})
	.max(MAX_NAME_LENGTH, {
		message: `Name must be at most ${MAX_NAME_LENGTH} characters`,
	})

export const ScoreSchema = z
	.number({
		required_error: 'Score is required',
		invalid_type_error: 'Score must be a number',
	})
	.int({
		message: 'Score must be an integer',
	})
	.min(1, {
		message: 'Score must be at least 1',
	})

export const PostRequestSchema = z.object({
	name: NameSchema,
	score: ScoreSchema,
})

export const ScoreEntrySchema = z.object({
	id: z.number().int().min(0),
	name: NameSchema,
	score: ScoreSchema,
	created_at: z.string().refine((value) => !isNaN(Date.parse(value))),
})

export const ScoreListSchema = z.array(ScoreEntrySchema)

export type ScoreList = z.infer<typeof ScoreListSchema>
