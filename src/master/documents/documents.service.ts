import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DomcumentsRepository } from './documents.repository';

@Injectable()
export class DocumentsService {
  constructor(private docsRepository: DomcumentsRepository) {}

  async upload(body, tenant_id, files) {
    const filesArr = files.map((file) => {
      ({
        file: file.buffer,
        file_format: file.originalname.split('.').pop(),
        name: `${file.originalname.split('.')[0]}`,
      });
    });
    try {
      const projects = JSON.parse(body).projects;
      const description = JSON.parse(body).description;

      const file = await this.docsRepository.upload(
        files as any,
        tenant_id,
        projects,
        description
      );
      return file;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findFileById(id) {
    const arquivo = await this.docsRepository.findFileById(id);
    if (!arquivo) {
      throw new NotFoundException('Nenhum arquivo encontrado para este ID');
    }

    return arquivo;
  }

  async findManyTenantNotRestricted() {
    return await this.docsRepository.clientProjectFilters();
  }

  async findManyTenantFiles(tenant_id) {
    return await this.docsRepository.getfiles(tenant_id);
  }

  async remove(id) {
    return this.docsRepository.remove(id);
  }
}
