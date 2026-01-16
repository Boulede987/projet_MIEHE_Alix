import type { PollutionType } from '../../constants/pollution-types/pollution-types.constants';
export { POLLUTION_TYPES } from '../../constants/pollution-types/pollution-types.constants';
export type { PollutionType } from '../../constants/pollution-types/pollution-types.constants';

export class SubmittedPollution {
  id: number = 0
  titre: string = ''
  type_pollution: PollutionType = 'Autre'
  description: string = ''
  date_observation: Date = new Date
  lieu: string = ''
  longitude: number = 0
  latitude: number = 0
  photo_base64?: string | null = null
  userId?: number | null = null
}
