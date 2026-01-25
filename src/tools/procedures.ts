import { getClient } from '../api/client.js';
import {
  ListProcedureTemplatesInput,
  GetProcedureTemplateInput,
} from '../schemas/procedures.js';
import { formatPaginatedResponse } from '../utils/pagination.js';

interface ProcedureTemplate {
  id: number;
  name: string;
  description?: string;
  steps?: Array<{
    id: number;
    order: number;
    title: string;
    description?: string;
    type: string;
  }>;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

interface ListProcedureTemplatesResponse {
  procedureTemplates: ProcedureTemplate[];
  cursor?: string;
}

export async function listProcedureTemplates(input: ListProcedureTemplatesInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ListProcedureTemplatesResponse>('/proceduretemplates', {
    search: input.search,
    cursor: input.cursor,
    limit: input.limit,
  });

  return formatPaginatedResponse(response.procedureTemplates, response.cursor, 'procedureTemplates');
}

export async function getProcedureTemplate(input: GetProcedureTemplateInput): Promise<string> {
  const client = getClient();

  const response = await client.get<ProcedureTemplate>(`/proceduretemplates/${input.id}`);

  return JSON.stringify(response, null, 2);
}
