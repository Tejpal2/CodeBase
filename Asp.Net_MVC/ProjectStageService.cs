using ConstructionManagementSystem_Data.RepositoryInterfaces;
using ConstructionManagementSystem_Domain.EF.Core;
using ConstructionManagementSystem_Domain.ViewModel;
using ConstructionManagementSystem_Utility;
using System;
using System.Collections.Generic;

namespace ConstructionManagementSystem_Service
{
    public class ProjectStageService : IProjectStageService
    {
        private IProjectStageRepository _ProjectStageRepository;

        public ProjectStageService(IProjectStageRepository ProjectStageRepository)
        {
            _ProjectStageRepository = ProjectStageRepository;
        }

        /// <summary>
        /// Get All Project Stage By CompanyId
        /// </summary>
        /// <param name="CompanyId"></param>
        /// <returns></returns>
        public List<ProjectStageListingViewModel> GetAllProjectStageByCompanyId(int CompanyId)
        {
            List<ProjectStageListingViewModel> projectStageListingViewModel = new List<ProjectStageListingViewModel>();
            var listProjectStage = _ProjectStageRepository.GetAllProjectStageByCompanyId(CompanyId);
            if(listProjectStage != null && listProjectStage.Count > 0)
            {
                foreach(var item in listProjectStage)
                {
                    AutoMapper<ProjectStage, ProjectStageListingViewModel> projectStageMapper = new AutoMapper<ProjectStage, ProjectStageListingViewModel>();
                    ProjectStageListingViewModel model = projectStageMapper.Mapper(item);
                    projectStageListingViewModel.Add(model);
                }
            }
            return projectStageListingViewModel;
        }

        /// <summary>
        /// Add Project Stage
        /// </summary>
        /// <param name="model"></param>
        public void AddProjectStage(ProjectStageListingViewModel model)
        {
            AutoMapper<ProjectStageListingViewModel, ProjectStage> projectStageMapper = new AutoMapper<ProjectStageListingViewModel, ProjectStage>();
            ProjectStage projectStage = projectStageMapper.Mapper(model);
            projectStage.CreatedDate = DateTime.Now;
            projectStage.IsActive = true;
            _ProjectStageRepository.InsertProjectStage(projectStage);
        }

        /// <summary>
        /// Delete Project Stage By Id
        /// </summary>
        /// <param name="id"></param>
        public void DeleteProjectStageById(int id)
        {
            var projectStage = _ProjectStageRepository.GetProjectStageById(id);
            _ProjectStageRepository.DeleteProjectStage(projectStage);
        }

        /// <summary>
        /// Edit Project Stage
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ProjectStageListingViewModel EditProjectStage(int id)
        {
            ProjectStage projectStage = _ProjectStageRepository.GetProjectStageById(id);
            AutoMapper<ProjectStage, ProjectStageListingViewModel> projectStageMapper = new AutoMapper<ProjectStage, ProjectStageListingViewModel>();
            ProjectStageListingViewModel model = projectStageMapper.Mapper(projectStage);
            return model;
        }


        #region IDisposable Support
        private bool disposedValue = false; // To detect redundant calls
        protected virtual void Dispose(bool disposing)
        {
            if (!disposedValue)
            {
                if (disposing)
                {
                    _ProjectStageRepository.Dispose();
                }

                disposedValue = true;
            }
        }
        // This code added to correctly implement the disposable pattern.
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
        #endregion
    }
}
