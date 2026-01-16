export const POLLUTION_TYPES = [
  'Plastique',
  'Chimique',
  'Dépôt sauvage',
  'Eau',
  'Air',
  'Autre',
] as const;

export type PollutionType = typeof POLLUTION_TYPES[number];


export class SubmittedPollution 
{
    id: number = 0
    titre: string = ""
    type_pollution : PollutionType = 'Autre'
    description: string = ""
    date_observation: Date = new Date
    lieu: string = ""
    longitude: number = 0
    latitude: number = 0
    // optional fields for upload and ownership
    photo_base64?: string | null = null
    userId?: number | null = null
}
