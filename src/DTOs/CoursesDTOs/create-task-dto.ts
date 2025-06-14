export default interface CreateTaskDTO {
    title: string
    description: string
    type: number
    deadLine: Date
    maxPoints?: number
    materials?: {
        name: string
        file: File
    }[]
}