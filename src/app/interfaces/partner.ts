export enum HostingType {
  MQ = 'MQ',
  DIRECTORY = 'DIRECTORY',
  PRINTER = 'PRINTER',
  S3 = 'S3'
}
export type Status = 'ACTIVE' | 'INACTIVE';

export interface Partner {
  id?: number;
  alias: string;
  queueName: string;
  hostingType: HostingType;
  status: Status;
  application?: string;
  description?: string;
}