const CreateActivityDto = require("../../application/dtos/createActivity");
const UpdateActivityDto = require("../../application/dtos/updateActivity");
const UpdateActivityStatusDto = require("../../application/dtos/updateActivityStatus");
const ActivitySequelizeRepository = require("../persistence/sequelize/activitySequelizeRepository");
const CategorySequelizeRepository = require("../../../categories/infrastructure/persistence/sequelize/categorySequelizeRepository");
const CreateActivityUseCase = require("../../application/use-cases/createActivity");
const ListActivitiesUseCase = require("../../application/use-cases/listActivities");
const ListAdminActivitiesUseCase = require("../../application/use-cases/listAdminActivities");
const GetActivityUseCase = require("../../application/use-cases/getActivity");
const ListOwnerActivitiesUseCase = require("../../application/use-cases/listOwnerActivities");
const UpdateActivityUseCase = require("../../application/use-cases/updateActivity");
const UpdateActivityStatusUseCase = require("../../application/use-cases/updateActivityStatus");
const DeactivateActivityUseCase = require("../../application/use-cases/deactivateActivity");

const activityRepository = new ActivitySequelizeRepository();
const categoryRepository = new CategorySequelizeRepository();
const createActivity = new CreateActivityUseCase(activityRepository, categoryRepository);
const listActivities = new ListActivitiesUseCase(activityRepository);
const listAdminActivities = new ListAdminActivitiesUseCase(activityRepository);
const getActivity = new GetActivityUseCase(activityRepository);
const listOwnerActivities = new ListOwnerActivitiesUseCase(activityRepository);
const updateActivity = new UpdateActivityUseCase(activityRepository, categoryRepository);
const updateActivityStatus = new UpdateActivityStatusUseCase(activityRepository);
const deactivateActivity = new DeactivateActivityUseCase(activityRepository);

class ActivityController {
  async create(req, res) {
    const dto = new CreateActivityDto(req.body);
    const activity = await createActivity.execute(req.user.id, dto);

    res.status(201).json({
      message: "Activity created successfully",
      activity
    });
  }

  async list(req, res) {
    const activities = await listActivities.execute(req.query);

    res.status(200).json({ activities });
  }

  async listAdmin(req, res) {
    const activities = await listAdminActivities.execute();

    res.status(200).json({ activities });
  }

  async getById(req, res) {
    const activity = await getActivity.execute(req.params.id);

    res.status(200).json({ activity });
  }

  async listMine(req, res) {
    const activities = await listOwnerActivities.execute(req.user.id);

    res.status(200).json({ activities });
  }

  async update(req, res) {
    const dto = new UpdateActivityDto(req.body);
    const activity = await updateActivity.execute(req.params.id, req.user.id, dto);

    res.status(200).json({
      message: "Activity updated successfully",
      activity
    });
  }

  async updateStatus(req, res) {
    const dto = new UpdateActivityStatusDto(req.body);
    const activity = await updateActivityStatus.execute(req.params.id, dto.status);

    res.status(200).json({
      message: "Activity status updated successfully",
      activity
    });
  }

  async deactivate(req, res) {
    const activity = await deactivateActivity.execute(req.params.id, req.user);

    res.status(200).json({
      message: "Activity deactivated successfully",
      activity
    });
  }
}

module.exports = new ActivityController();
