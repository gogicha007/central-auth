import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';

describe('OrganizationsController', () => {
  let controller: OrganizationsController;

  beforeEach(() => {
    controller = new OrganizationsController({} as OrganizationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
