export type PollutionType = 'Plastique' | 'Chimique' | 'Dépôt sauvage' | 'Eau' | 'Air' | 'Autre';


export class SubmittedPollution 
{
    id: number = 0
    titre: string = ""
    type_pollution : PollutionType= 'Autre'
    description: string = ""
    date_observation: Date = new Date
    lieu: string = ""
    longitude: number = 0
    latitude: number = 0
    photo_url: string = ""
}
