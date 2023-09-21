import { BadRequestException, Injectable } from '@nestjs/common';
import { Create_Page_Group, Update_Page_Group } from './groups.controller';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}
  async create(createGroup: Create_Page_Group) {
    const findPage = await this.findOneByName(createGroup.title);
    if (findPage) {
      throw new BadRequestException('Grupo já existe');
    }
    return await this.prisma.page_Group.create({
      data: {
        ...createGroup,
        formated_title: createGroup.title
          .toLowerCase()
          .split(' ')
          .join('-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      },
    });
  }

  async findAll() {
    return (
      await this.prisma.page_Group.findMany({
        where: {
          restrict: false,
        },
        include: {
          Page: {
            include: {
              Page_Group: true,
              Page_Role: {
                select: {
                  Rls: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      })
    ).filter((e) => e.restrict === false);
  }

  async findOne(id: string) {
    return await this.prisma.page_Group.findUnique({
      where: { id, restrict: false },
      include: {
        Page: {
          include: {
            Page_Group: true,
            Page_Role: {
              select: {
                Rls: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  async findOneByName(title: string) {
    return await this.prisma.page_Group.findFirst({
      where: { title },
      include: {
        Page: {
          include: {
            Page_Group: true,
            Page_Role: {
              select: {
                Rls: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
  async update(id: string, updateGroupDto: Update_Page_Group) {
    return await this.prisma.page_Group.update({
      where: {
        id,
      },
      data: {
        ...updateGroupDto,
        formated_title: updateGroupDto.title
          .toLowerCase()
          .split(' ')
          .join('-')
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.page_Group.delete({
      where: {
        id,
      },
    });
  }
}
