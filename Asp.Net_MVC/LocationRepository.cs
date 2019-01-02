using System;
using System.Collections.Generic;
using System.Linq;
using ConstructionManagementSystem_Data.CommonDbContext;
using ConstructionManagementSystem_Data.RepositoryInterfaces;
using ConstructionManagementSystem_Domain.ViewModel;
using ConstructionManagementSystem_Domain.EF.Core;
using System.Data.Entity;
using System.Web;
using System.Data.SqlClient;
using ConstructionManagementSystem_Utility;

namespace ConstructionManagementSystem_Data.Repository
{
    public class LocationRepository : ILocationRepository
    {
        private readonly ConstructionManagementDbContext _context;
        public LocationRepository(ConstructionManagementDbContext context)
        {
            _context = context;
        }

        /// <summary>
        /// Get Locations
        /// </summary>
        /// <param name="LocatoinId"></param>
        /// <param name="ParentId"></param>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        public List<LocationViewModel> GetLocations(int LocatoinId,int? ParentId, int ProjectId)
        {
            List<LocationViewModel> lstLocationViewModel = new List<LocationViewModel>();

            SqlParameter Id = new SqlParameter(DBModelConstant.prop_ID, LocatoinId);
            SqlParameter ParentParam = new SqlParameter(DBModelConstant.prop_ParentId, ParentId);
            SqlParameter ProjectIdParam = new SqlParameter(DBModelConstant.prop_ProjectIdLocation, ProjectId);
            lstLocationViewModel = _context.Database.SqlQuery<LocationViewModel>(DBConstant.Usp_GetLocations, Id, ParentParam, ProjectIdParam).ToList();

            return lstLocationViewModel;
        }

        /// <summary>
        /// Add Update Location
        /// </summary>
        /// <param name="LocationId"></param>
        /// <param name="LocationName"></param>
        /// <param name="ParentId"></param>
        /// <param name="ProjectId"></param>
        /// <returns></returns>
        public string AddUpdateLocation(string LocationId, string LocationName, int? ParentId, int ProjectId)
        {

            tblMasterLocation MasterLocation = new tblMasterLocation();
            if (!string.IsNullOrEmpty(LocationId))
            {
                int ExistingLocationId = Convert.ToInt32(LocationId);
                MasterLocation = _context.tblMasterLocation.Where(x => x.Id == ExistingLocationId).FirstOrDefault();
                MasterLocation.Name = LocationName;
                _context.Entry(MasterLocation).State = EntityState.Modified;
            }
            else
            {
                MasterLocation.Name = LocationName;
                MasterLocation.ParentId = ParentId;
                MasterLocation.CreatedDate = DateTime.Now;
                MasterLocation.ProjectId = ProjectId;
                _context.tblMasterLocation.Add(MasterLocation);
            }

            _context.SaveChanges();

            return MasterLocation.Id.ToString();
        }

        /// <summary>
        /// Delete Location
        /// </summary>
        /// <param name="LocationId"></param>
        /// <returns></returns>
        public int DeleteLocation(int LocationId)
        {
            var MasterLocation = _context.tblMasterLocation.Where(x => x.Id == LocationId).FirstOrDefault();

            var ChildLocations = _context.tblMasterLocation.Where(x => x.ParentId == MasterLocation.Id).ToList();

            if (ChildLocations.Count() > 0)
            {
                _context.tblMasterLocation.RemoveRange(ChildLocations);
            }

            _context.tblMasterLocation.Remove(MasterLocation);
            _context.SaveChanges();

            return 1;
        }

        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    _context.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);

            GC.SuppressFinalize(this);
        }
    }
}



