using ConstructionManagementSystem_Domain;
using ConstructionManagementSystem_Service;
using ConstructionManagementSystem_Utility;
using System;
using System.Web.Mvc;

namespace ConstructionManagementSystem.Areas.Admin.Controllers
{
    public class ScheduleController : Controller
    {
        private IProjectService _IProjectService;
        private ITaskService _ITaskService;
        private ITaskDependencyService _ITaskDependencyService;
        private ITaskUserService _ITaskUserService;
        public ScheduleController(IProjectService projectService, 
            ITaskService taskService, 
            ITaskDependencyService taskDependencyService,
            ITaskUserService taskUserService)
        {
            _IProjectService = projectService;
            _ITaskService = taskService;
            _ITaskDependencyService = taskDependencyService;
            _ITaskUserService = taskUserService;
        }

        /// <summary>
        /// Schedule home page with tasks
        /// </summary>
        /// <param name="view"></param>
        /// <returns></returns>
        public ActionResult Index(string view)
        {
            try
            {
                int projectId = Convert.ToInt32(Request.QueryString["ProjectID"]);
                return View(_ITaskService.GetTaskModelByProjectID(projectId, view));
            }
            catch(Exception ex)
            {
                Convert.ToString(ex);
                return View();
            }
            
        }

        /// <summary>
        /// Add new task
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult AddNewTask(TaskDTO model)
        {
            try
            {
                int projectId = Convert.ToInt32(Request.QueryString["ProjectID"]);
                _ITaskService.AddNewTask(model, projectId);
                return Json(projectId.ToString(), JsonRequestBehavior.AllowGet);
            }
            catch(Exception ex)
            {
                Convert.ToString(ex);
                return Json(JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Edit task
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult EditTask(int id)
        {
            try
            {
                int projectId = Convert.ToInt32(Request.QueryString["ProjectID"]);
                return View(_ITaskService.EditTask(id, projectId));
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return View();
            }
        }

        /// <summary>
        /// Update task
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost]
        public JsonResult UpdateTask(TaskDTO model)
        {
            try
            {
                int projectId = Convert.ToInt32(Request.QueryString["ProjectID"]);
                _ITaskService.UpdateTaskModel(model, projectId);
                return Json(projectId.ToString(), JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return Json(JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Delete Task
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ActionResult DeleteTask(int id)
        {
            try
            {
                int projectId = Convert.ToInt32(Request.QueryString["ProjectID"]);
                _ITaskService.DeleteTaskById(id);
                return RedirectToAction(DBModelConstant.Schedule_Action, DBModelConstant.Schedule_Controller, new { ProjectID = projectId.ToString() });
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return View();
            }
        }

        /// <summary>
        /// Is User Assigned For Task
        /// </summary>
        /// <param name="projectId"></param>
        /// <param name="userId"></param>
        /// <param name="taskId"></param>
        /// <returns></returns>
        public JsonResult IsUserAssignedForTask(int projectId, int userId, int taskId)
        {
            try
            {
                bool Result = _ITaskService.IsUserAssignedForTask(projectId, userId, taskId);
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return Json(JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Check Project User
        /// </summary>
        /// <param name="projectId"></param>
        /// <returns></returns>
        public JsonResult CheckProjectUser(int projectId)
        {
            try
            {
                bool Result = _ITaskService.CheckProjectUser(projectId);
                return Json(Result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return Json(JsonRequestBehavior.AllowGet);
            }
        }

        /// <summary>
        /// Get Task Details
        /// </summary>
        /// <param name="taskId"></param>
        /// <returns></returns>
        public JsonResult GetTaskDetails(int taskId)
        {
            try
            {
                TaskDTO model = _ITaskService.GetTaskDetails(taskId);
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Convert.ToString(ex);
                return Json(JsonRequestBehavior.AllowGet);
            }
        }
    }
}